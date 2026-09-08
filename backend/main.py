import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse

from core.config import settings
from db.database import init_db

from routes.health import router as health_router
from routes.auth import router as auth_router
from routes.handwriting import router as handwriting_router
from routes.signature import router as signature_router
from routes.typing import router as typing_router
from routes.analyses import router as analyses_router
from routes.report import router as report_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database tables
    init_db()
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs(settings.REPORTS_DIR, exist_ok=True)
    yield
    # Shutdown

app = FastAPI(
    title="MindMatters AI Real Backend Engine",
    description=(
        "Production-oriented real computer-vision & multimodal behavioral analysis engine. "
        "Processes real handwriting uploads, performs 10+ measurable feature extractions, "
        "maintains historical records via SQLAlchemy, and generates downloadable clinical dossiers."
    ),
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for generated reports and visual dossiers
os.makedirs(os.path.join(settings.BASE_DIR, "static"), exist_ok=True)
app.mount("/static", StaticFiles(directory=os.path.join(settings.BASE_DIR, "static")), name="static")

# 1. Mount API v1 Routes (/api/v1/...)
api_v1_router = FastAPI()
api_v1_router.include_router(health_router)
api_v1_router.include_router(auth_router)
api_v1_router.include_router(handwriting_router)
api_v1_router.include_router(signature_router)
api_v1_router.include_router(typing_router)
api_v1_router.include_router(analyses_router)
api_v1_router.include_router(report_router)

app.mount(settings.API_V1_PREFIX, api_v1_router)

# 2. Also include routers directly at root level for seamless frontend & backward compatibility
app.include_router(health_router)
app.include_router(auth_router, prefix="/api/v1")
app.include_router(handwriting_router)
app.include_router(signature_router)
app.include_router(typing_router)
app.include_router(analyses_router, prefix="/api/v1")
app.include_router(report_router)

# 3. Mount Frontend SPA (dist directory) if present
dist_dir = os.path.abspath(os.path.join(settings.BASE_DIR, "..", "dist"))
if not os.path.exists(dist_dir):
    dist_dir = os.path.abspath(os.path.join(settings.BASE_DIR, "dist"))

if os.path.exists(dist_dir):
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(request: Request, full_path: str):
        # Don't intercept API routes or static files
        if full_path.startswith("api/") or full_path.startswith("static/") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            return JSONResponse(status_code=404, content={"detail": "Not found"})
        
        file_path = os.path.join(dist_dir, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": f"Internal server error: {str(exc)}"}
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
