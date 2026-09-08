from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Depends
from db.models import User
from schemas.auth import UserRegisterRequest, UserLoginRequest, TokenResponse, UserResponse
from core.security import hash_password, verify_password, create_access_token, oauth2_scheme, decode_access_token
from db.database import get_db

class AuthService:
    def register(self, req: UserRegisterRequest, db: Session) -> UserResponse:
        existing = db.query(User).filter(User.email == req.email.lower()).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists."
            )
            
        hashed_pwd = hash_password(req.password)
        user = User(
            email=req.email.lower(),
            hashed_password=hashed_pwd,
            full_name=req.full_name or "Subject Alpha"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return UserResponse.model_validate(user)

    def login(self, req: UserLoginRequest, db: Session) -> TokenResponse:
        user = db.query(User).filter(User.email == req.email.lower()).first()
        if not user or not verify_password(req.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password."
            )
            
        access_token = create_access_token(subject=user.id)
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user_id=user.id,
            email=user.email,
            full_name=user.full_name
        )

auth_service = AuthService()

def get_current_user_optional(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Optional[User]:
    if not token:
        return None
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        return None
    user = db.query(User).filter(User.id == payload["sub"]).first()
    return user

def get_current_user_required(user: Optional[User] = Depends(get_current_user_optional)) -> User:
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required for this operation."
        )
    return user
