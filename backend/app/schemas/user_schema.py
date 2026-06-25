import re
from pydantic import BaseModel, Field, field_validator

EMAIL_REGEX = re.compile(r"^[\w\.-]+@[\w\.-]+\.\w+$")

class LoginSchema(BaseModel):
    correo: str = Field(..., description="Correo electrónico del usuario")
    password: str = Field(..., description="Contraseña en texto plano")
    
    @field_validator("correo")
    @classmethod
    def validate_correo(cls, v: str) -> str:
        if not EMAIL_REGEX.match(v):
            raise ValueError("Formato de correo electrónico inválido")
        return v
