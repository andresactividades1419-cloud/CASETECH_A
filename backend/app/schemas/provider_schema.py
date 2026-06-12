from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum

class EstadoEnum(str, Enum):
    ACTIVO = "ACTIVO"
    INACTIVO = "INACTIVO"

class ProviderCreateSchema(BaseModel):
    nit: str = Field(..., max_length=20, description="NIT o identificación del proveedor")
    razon_social: str = Field(..., max_length=100, description="Nombre o razón social de la empresa")
    contacto_completo: str = Field(..., max_length=150, description="Nombre completo del contacto comercial")
    telefono: Optional[str] = Field(None, max_length=20, description="Teléfono de contacto")
    correo: Optional[str] = Field(None, max_length=100, description="Correo electrónico")
    direccion: Optional[str] = Field(None, max_length=150, description="Dirección física")
    estado: Optional[EstadoEnum] = Field(EstadoEnum.ACTIVO, description="Estado del proveedor")
    usuario_id: int = Field(..., description="ID del administrador que registra al proveedor")

class ProviderUpdateSchema(BaseModel):
    razon_social: str = Field(..., max_length=100, description="Nombre o razón social de la empresa")
    contacto_completo: str = Field(..., max_length=150, description="Nombre completo del contacto comercial")
    telefono: Optional[str] = Field(None, max_length=20, description="Teléfono de contacto")
    correo: Optional[str] = Field(None, max_length=100, description="Correo electrónico")
    direccion: Optional[str] = Field(None, max_length=150, description="Dirección física")
    estado: EstadoEnum = Field(..., description="Estado del proveedor")
