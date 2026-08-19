import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routes.signature import router as signature_router
from routes.typing import router as typing_router
from routes.handwriting import router as handwriting_router
from routes.report import router as report_router
from schemas.schemas import HealthResponse

app = FastAPI(
    title="MindMatters AI Backend Engine",
    description="Multi-biometric mental state analysis using signature, typing cadence, and handwriting morphology.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(os.path.join(static_dir, "reports"), exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

app.include_router(signature_router)
app.include_router(typing_router)
app.include_router(handwriting_router)
app.include_router(report_router)

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
