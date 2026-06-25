import re
from pydantic import BaseModel, Field, field_validator
from enum import Enum

EMAIL_REGEX = re.compile(r"^[\w\.-]+@[\w\.-]+\.\w+$")

class EstadoProveedorEnum(str, Enum):
    ACTIVO = "ACTIVO"
    INACTIVO = "INACTIVO"

class ProviderCreateSchema(BaseModel):
    nit: str = Field(..., min_length=1, max_length=20, description="NIT del proveedor")
    razon_social: str = Field(..., min_length=1, max_length=150, description="Razón social del proveedor")
    contacto_completo: str = Field(..., min_length=1, max_length=100, description="Contacto completo del proveedor")
    telefono: str = Field(..., min_length=1, max_length=20, description="Teléfono del proveedor")
    correo: str = Field(..., min_length=1, max_length=100, description="Correo electrónico del proveedor")
    direccion: str = Field(..., min_length=1, max_length=200, description="Dirección del proveedor")
    usuario_id: int = Field(..., description="ID del usuario que registra el proveedor")

    @field_validator("correo")
    @classmethod
    def validate_correo(cls, v: str) -> str:
        if not EMAIL_REGEX.match(v):
            raise ValueError("Formato de correo electrónico inválido")
        return v

class ProviderUpdateSchema(BaseModel):
    razon_social: str = Field(..., min_length=1, max_length=150, description="Razón social del proveedor")
    contacto_completo: str = Field(..., min_length=1, max_length=100, description="Contacto completo del proveedor")
    telefono: str = Field(..., min_length=1, max_length=20, description="Teléfono del proveedor")
    correo: str = Field(..., min_length=1, max_length=100, description="Correo electrónico del proveedor")
    direccion: str = Field(..., min_length=1, max_length=200, description="Dirección del proveedor")

    @field_validator("correo")
    @classmethod
    def validate_correo(cls, v: str) -> str:
        if not EMAIL_REGEX.match(v):
            raise ValueError("Formato de correo electrónico inválido")
        return v
