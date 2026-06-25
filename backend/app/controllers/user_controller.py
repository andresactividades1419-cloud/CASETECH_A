from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user_model import UserModel
from app.schemas.user_schema import LoginSchema

def login_user(db: Session, credentials: LoginSchema):
    # Buscar el usuario en la base de datos por correo
    user = db.query(UserModel).filter(UserModel.correo == credentials.correo).first()
    
    # Validar si el usuario existe
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas"
        )
    
    # Validar la contraseña en texto plano
    if user.password != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas"
        )
        
    # Validar rol de administrador
    if user.rol != "ADMINISTRADOR":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso restringido: Solo los administradores pueden ingresar"
        )
        
    # Validar que el usuario esté activo
    if user.estado.value != "ACTIVO" if hasattr(user.estado, "value") else user.estado != "ACTIVO":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo, contacte al soporte"
        )
        
    return {
        "success": True,
        "message": "Inicio de sesión exitoso",
        "data": {
            "id": user.id,
            "correo": user.correo,
            "rol": user.rol
        },
        "error": None
    }
