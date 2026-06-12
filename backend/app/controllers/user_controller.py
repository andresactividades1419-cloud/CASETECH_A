from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException, status
from app.schemas.user_schema import LoginSchema

def login_user(db: Session, credentials: LoginSchema):
    # Query plano parametrizado para buscar el usuario por correo
    query = text("SELECT id, nombre, correo, password, rol FROM usuarios WHERE correo = :correo")
    result = db.execute(query, {"correo": credentials.correo}).fetchone()
    
    # Validar si el usuario existe
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas"
        )
    
    user_id, nombre, correo, password, rol = result
    
    # Validar la contraseña (en texto plano por requerimiento actual)
    if password != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas"
        )
    
    # Validar que sea un administrador
    if rol != "ADMINISTRADOR":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso restringido: Solo los administradores pueden ingresar"
        )
    
    # Retornar estructura de respuesta estándar
    return {
        "success": True,
        "message": "Inicio de sesión exitoso",
        "data": {
            "id": user_id,
            "nombre": nombre,
            "correo": correo,
            "rol": rol
        },
        "error": None
    }
