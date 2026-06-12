from pydantic import BaseModel, Field

class LoginSchema(BaseModel):
    correo: str = Field(..., description="Correo electrónico del usuario")
    password: str = Field(..., description="Contraseña en texto plano")
