from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.schemas.user_schema import LoginSchema
from app.controllers import user_controller

router = APIRouter(
    prefix="/api/auth",
    tags=["Autenticación"]
)

@router.post("/login")
def login(credentials: LoginSchema, db: Session = Depends(get_db)):
    return user_controller.login_user(db, credentials)
