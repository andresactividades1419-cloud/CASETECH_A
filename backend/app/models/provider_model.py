from sqlalchemy import Column, Integer, String, Enum, DateTime, func
from app.config.database import Base
import enum

class EstadoProveedor(str, enum.Enum):
    ACTIVO = "ACTIVO"
    INACTIVO = "INACTIVO"

class ProviderModel(Base):
    __tablename__ = "proveedores"
    
    id = Column(Integer, primary_key=True, index=True)
    nit = Column(String(20), unique=True, nullable=False, index=True)
    razon_social = Column(String(150), nullable=False)
    nombre_contacto = Column(String(100), nullable=False)
    telefono = Column(String(20), nullable=False)
    correo = Column(String(100), nullable=False)
    direccion = Column(String(200), nullable=False)
    estado = Column(Enum(EstadoProveedor, name="estado_proveedor", create_type=False), default=EstadoProveedor.ACTIVO)
    fecha_registro = Column(DateTime, server_default=func.now())
