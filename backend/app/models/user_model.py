from sqlalchemy import Column, Integer, String, Enum, DateTime, func
from app.config.database import Base
import enum

class EstadoUsuario(str, enum.Enum):
    ACTIVO = "ACTIVO"
    INACTIVO = "INACTIVO"

class UserModel(Base):
    __tablename__ = "usuarios"
    
    id = Column(Integer, primary_key=True, index=True)
    correo = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    rol = Column(String(30), default="ADMINISTRADOR")
    estado = Column(Enum(EstadoUsuario, name="estado_usuario", create_type=False), default=EstadoUsuario.ACTIVO)
    fecha_registro = Column(DateTime, server_default=func.now())
