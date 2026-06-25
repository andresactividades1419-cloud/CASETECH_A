from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.routes import user_routes, provider_routes

app = FastAPI(
    title="Casetech API",
    description="API del módulo de proveedores y autenticación para Casetech",
    version="1.0.0"
)

# Configuración de CORS para permitir conexiones desde el Frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Manejador global para excepciones HTTP
@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail,
            "data": None,
            "error": f"HTTPException: {exc.detail}"
        }
    )

# Manejador global para errores de validación de esquemas (Pydantic)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    errors_detail = []
    for err in exc.errors():
        loc = " -> ".join(str(x) for x in err.get("loc", []))
        msg = err.get("msg", "Error de validación")
        errors_detail.append(f"{loc}: {msg}")
    
    technical_error = "; ".join(errors_detail)
    
    return JSONResponse(
        status_code=400,
        content={
            "success": False,
            "message": "Error de validación en los datos de entrada",
            "data": None,
            "error": technical_error
        }
    )

# Registrar routers
app.include_router(user_routes.router)
app.include_router(provider_routes.router)

@app.get("/")
def read_root():
    return {
        "success": True,
        "message": "Bienvenido a la API de Casetech",
        "data": {
            "version": "1.0.0",
            "sprint": 1,
            "modulos": ["Módulo 0: Autenticación", "Módulo 1: Gestión de Proveedores"]
        },
        "error": None
    }
