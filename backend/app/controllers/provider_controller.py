from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from app.models.provider_model import ProviderModel
from app.schemas.provider_schema import ProviderCreateSchema, ProviderUpdateSchema

def get_all_providers(db: Session):
    try:
        providers = db.query(ProviderModel).order_by(ProviderModel.id.asc()).all()
        data = [
            {
                "id": p.id,
                "nit": p.nit,
                "razon_social": p.razon_social,
                "contacto_completo": p.nombre_contacto,
                "telefono": p.telefono,
                "correo": p.correo,
                "direccion": p.direccion,
                "estado": p.estado.value if hasattr(p.estado, "value") else p.estado,
                "fecha_registro": p.fecha_registro.isoformat() if p.fecha_registro else None
            }
            for p in providers
        ]
        return {
            "success": True,
            "message": "Listado de proveedores obtenido exitosamente",
            "data": data,
            "error": None
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al consultar proveedores: {str(e)}"
        )

def create_provider(db: Session, provider: ProviderCreateSchema):
    # El SP: sp_registrar_proveedor(p_nit, p_razon_social, p_contacto, p_telefono, p_correo, p_direccion)
    sp_query = text("""
        CALL sp_registrar_proveedor(
            :nit, 
            :razon_social, 
            :contacto, 
            :telefono, 
            :correo, 
            :direccion
        )
    """)
    try:
        db.execute(sp_query, {
            "nit": provider.nit,
            "razon_social": provider.razon_social,
            "contacto": provider.contacto_completo,
            "telefono": provider.telefono,
            "correo": provider.correo,
            "direccion": provider.direccion
        })
        db.commit()
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El NIT ya se encuentra registrado"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al registrar el proveedor: {str(e)}"
        )
        
    return {
        "success": True,
        "message": "Proveedor registrado exitosamente",
        "data": None,
        "error": None
    }

def update_provider(db: Session, provider_id: int, provider: ProviderUpdateSchema):
    # 1. Verificar si el proveedor existe
    exists = db.query(ProviderModel).filter(ProviderModel.id == provider_id).first()
    if not exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proveedor no encontrado"
        )
    
    # 2. Ejecutar el procedimiento almacenado (NIT está bloqueado y no se modifica)
    sp_query = text("""
        CALL sp_modificar_proveedor(
            :id, 
            :razon_social, 
            :contacto, 
            :telefono, 
            :correo, 
            :direccion
        )
    """)
    try:
        db.execute(sp_query, {
            "id": provider_id,
            "razon_social": provider.razon_social,
            "contacto": provider.contacto_completo,
            "telefono": provider.telefono,
            "correo": provider.correo,
            "direccion": provider.direccion
        })
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar el proveedor: {str(e)}"
        )
        
    return {
        "success": True,
        "message": "Proveedor actualizado exitosamente",
        "data": None,
        "error": None
    }

def disable_provider(db: Session, provider_id: int):
    # 1. Verificar si el proveedor existe
    exists = db.query(ProviderModel).filter(ProviderModel.id == provider_id).first()
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
        "success": True,
        "message": "Proveedor desactivado exitosamente (eliminación lógica)",
        "data": None,
        "error": None
    }
