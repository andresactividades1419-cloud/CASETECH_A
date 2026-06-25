from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.schemas.provider_schema import ProviderCreateSchema, ProviderUpdateSchema
from app.controllers import provider_controller

router = APIRouter(
    prefix="/api/proveedores",
    tags=["Proveedores"]
)

@router.get("")
def list_providers(db: Session = Depends(get_db)):
    return provider_controller.get_all_providers(db)

@router.post("")
def register_provider(provider: ProviderCreateSchema, db: Session = Depends(get_db)):
    return provider_controller.create_provider(db, provider)

@router.put("/{id}")
def update_provider(id: int, provider: ProviderUpdateSchema, db: Session = Depends(get_db)):
    return provider_controller.update_provider(db, id, provider)

@router.patch("/{id}/desactivar")
def disable_provider(id: int, db: Session = Depends(get_db)):
    return provider_controller.disable_provider(db, id)
