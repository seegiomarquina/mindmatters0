from routes.health import router as health_router
from routes.auth import router as auth_router
from routes.handwriting import router as handwriting_router
from routes.signature import router as signature_router
from routes.typing import router as typing_router
from routes.analyses import router as analyses_router
from routes.report import router as report_router

__all__ = [
    "health_router",
    "auth_router",
    "handwriting_router",
    "signature_router",
    "typing_router",
    "analyses_router",
    "report_router"
]
