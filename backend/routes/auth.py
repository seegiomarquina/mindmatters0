from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from schemas.auth import UserRegisterRequest, UserLoginRequest, TokenResponse, UserResponse
from db.database import get_db
from db.models import User
from services.auth_service import auth_service, get_current_user_required

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(payload: UserRegisterRequest, db: Session = Depends(get_db)):
    return auth_service.register(payload, db)

@router.post("/login", response_model=TokenResponse)
async def login_user(payload: UserLoginRequest, db: Session = Depends(get_db)):
    return auth_service.login(payload, db)

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user_required)):
    return UserResponse.model_validate(current_user)
