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
    allow_origins=["*"],  # En producción, se debe limitar al origen específico del cliente
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
            "status": "error",
            "message": exc.detail,
            "data": None
        }
    )

# Manejador global para errores de validación de esquemas (Pydantic)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=400,  # Retornar 400 Bad Request en lugar de 422 para simplificar manejo de cliente
        content={
            "status": "error",
            "message": "Error de validación en los datos de entrada",
            "data": None
        }
    )

# Registrar routers
app.include_router(user_routes.router)
app.include_router(provider_routes.router)

@app.get("/")
def read_root():
    return {
        "status": "success",
        "message": "Bienvenido a la API de Casetech",
        "version": "1.0.0"
    }
