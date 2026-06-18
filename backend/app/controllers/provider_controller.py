from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from app.schemas.provider_schema import ProviderCreateSchema, ProviderUpdateSchema

def get_all_providers(db: Session):
    query = text("""
        SELECT id, nit, razon_social, contacto_completo, telefono, correo, direccion, estado, usuario_id, fecha_registro 
        FROM proveedores 
        ORDER BY id ASC
    """)
    result = db.execute(query).mappings().all()
    # Convertir a formato serializable
    providers = [dict(row) for row in result]
    
    return {
        "status": "success",
        "message": "Listado de proveedores obtenido",
        "data": providers
    }

def create_provider(db: Session, provider: ProviderCreateSchema):
    # 1. Verificar si el NIT ya existe (para dar un error limpio antes de llamar al SP)
    check_query = text("SELECT id FROM proveedores WHERE nit = :nit")
    exists = db.execute(check_query, {"nit": provider.nit}).fetchone()
    if exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El NIT ya se encuentra registrado"
        )
    
    # 2. Ejecutar el procedimiento almacenado mediante CALL
    sp_query = text("""
        CALL sp_registrar_proveedor(
            :nit, 
            :razon_social, 
            :contacto_completo, 
            :telefono, 
            :correo, 
            :direccion, 
            :estado, 
            :usuario_id
        )
    """)
    try:
        db.execute(sp_query, {
            "nit": provider.nit,
            "razon_social": provider.razon_social,
            "contacto_completo": provider.contacto_completo,
            "telefono": provider.telefono,
            "correo": provider.correo,
            "direccion": provider.direccion,
            "estado": provider.estado.value if provider.estado else "ACTIVO",
            "usuario_id": provider.usuario_id
        })
        db.commit()
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error de integridad: El NIT o datos ingresados ya existen"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al registrar el proveedor: {str(e)}"
        )
        
    return {
        "status": "success",
        "message": "Proveedor registrado exitosamente",
        "data": None
    }

def update_provider(db: Session, provider_id: int, provider: ProviderUpdateSchema):
    # 1. Verificar si el proveedor existe
    check_query = text("SELECT id FROM proveedores WHERE id = :id")
    exists = db.execute(check_query, {"id": provider_id}).fetchone()
    if not exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proveedor no encontrado"
        )
    
    # 2. Ejecutar el procedimiento almacenado mediante CALL (excluyendo el NIT)
    sp_query = text("""
        CALL sp_modificar_proveedor(
            :id, 
            :razon_social, 
            :contacto_completo, 
            :telefono, 
            :correo, 
            :direccion, 
            :estado
        )
    """)
    try:
        db.execute(sp_query, {
            "id": provider_id,
            "razon_social": provider.razon_social,
            "contacto_completo": provider.contacto_completo,
            "telefono": provider.telefono,
            "correo": provider.correo,
            "direccion": provider.direccion,
            "estado": provider.estado.value
        })
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar el proveedor: {str(e)}"
        )
        
    return {
        "status": "success",
        "message": "Proveedor actualizado exitosamente",
        "data": None
    }

def disable_provider(db: Session, provider_id: int):
    # 1. Verificar si el proveedor existe
    check_query = text("SELECT id FROM proveedores WHERE id = :id")
    exists = db.execute(check_query, {"id": provider_id}).fetchone()
    if not exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proveedor no encontrado"
        )
    
    # 2. Ejecutar el procedimiento de borrado lógico
    sp_query = text("CALL sp_desactivar_proveedor(:id)")
    try:
        db.execute(sp_query, {"id": provider_id})
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al desactivar el proveedor: {str(e)}"
        )
        
    return {
        "status": "success",
        "message": "Proveedor desactivado exitosamente (eliminación lógica)",
        "data": None
    }

# --- CONTROLADORES PARA FUNCIONES ANALÍTICAS ---

def get_resumen_proveedores(db: Session):
    query = text("SELECT * FROM sp_analitica_resumen_proveedores()")
    result = db.execute(query).mappings().first()
    return {
        "status": "success",
        "message": "Resumen analítico obtenido",
        "data": dict(result) if result else {"total_proveedores": 0, "activos": 0, "inactivos": 0}
    }

def get_proveedores_por_usuario(db: Session):
    query = text("SELECT * FROM sp_analitica_proveedores_por_usuario()")
    result = db.execute(query).mappings().all()
    data = [dict(row) for row in result]
    return {
        "status": "success",
        "message": "Actividad de registros por administrador obtenida",
        "data": data
    }

def get_tendencia_registros(db: Session):
    query = text("SELECT * FROM sp_analitica_tendencia_registros()")
    result = db.execute(query).mappings().all()
    data = [dict(row) for row in result]
    return {
        "status": "success",
        "message": "Tendencia de registros mensuales obtenida",
        "data": data
    }
