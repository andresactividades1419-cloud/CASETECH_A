from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

# Registrar routers
app.include_router(user_routes.router)
app.include_router(provider_routes.router)

@app.get("/")
def read_root():
    return {
        "success": True,
        "message": "Bienvenido a la API de Casetech",
        "version": "1.0.0"
    }
