# README - SPRINT 1 (Casetech Backend)

Este documento detalla la estructura, instalación y guía de pruebas para el backend del **Sprint 1** del proyecto **Casetech**, abarcando el **Módulo 0: Autenticación y Seguridad** y el **Módulo 1: Gestión de Proveedores**.

---

## 1. Mapa Visual de la Estructura del Backend

El proyecto está diseñado bajo una **Arquitectura Monolítica de 3 Capas** alineada con las directrices del SENA:

```plaintext
backend/
  ├── app/
  │    ├── config/
  │    │    └── database.py          # Conexión a PostgreSQL, SessionLocal y Base ORM
  │    ├── models/
  │    │    ├── user_model.py        # Modelo SQLAlchemy para la tabla 'usuarios'
  │    │    └── provider_model.py    # Modelo SQLAlchemy para la tabla 'proveedores'
  │    ├── schemas/
  │    │    ├── user_schema.py       # Esquema Pydantic para Autenticación (LoginSchema)
  │    │    └── provider_schema.py   # Esquemas Pydantic para Proveedores (Create/Update)
  │    ├── controllers/
  │    │    ├── user_controller.py   # Lógica del Login y validación de roles en texto plano
  │    │    └── provider_controller.py # CRUD invocando procedimientos almacenados (sp_...)
  │    ├── routes/
  │    │    ├── user_routes.py       # Rutas asociadas a la autenticación
  │    │    └── provider_routes.py   # Rutas asociadas a proveedores
  │    └── main.py                   # Punto de entrada FastAPI y manejo global de respuestas/excepciones
  ├── .env                           # Credenciales de conexión a PostgreSQL
  └── requirements.txt               # Listado de dependencias necesarias
```

---

## 2. Instrucciones de Configuración en Windows

Siga estos pasos exactos desde la terminal de Windows (PowerShell o CMD) para configurar y ejecutar el backend:

```bash
# 1. Navegar al directorio del backend
cd backend

# 2. Crear el entorno virtual de Python
python -m venv .venv

# 3. Activar el entorno virtual en Windows
# En PowerShell:
.venv\Scripts\Activate.ps1
# En CMD:
.venv\Scripts\activate.bat

# 4. Actualizar pip e instalar dependencias obligatorias
python -m pip install --upgrade pip
pip install -r requirements.txt

# 5. Ejecutar la aplicación en modo desarrollo (Hot-Reload)
uvicorn app.main:app --reload
```

*El backend se levantará en [http://127.0.0.1:8000](http://127.0.0.1:8000).*
*La documentación automática interactiva estará en [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).*

---

## 3. Guía de Pruebas en Formato HTTP (REST Client / Thunder Client)

A continuación, se define el archivo para simular y verificar todos los endpoints usando la extensión **REST Client** de VS Code (creando un archivo con extensión `.http` ej. `pruebas.http`) o en **Thunder Client**:

```http
### VARIABLES DE CONFIGURACIÓN
@hostname = 127.0.0.1
@port = 8000
@host = http://{{hostname}}:{{port}}

#########################################
### MÓDULO 0: AUTENTICACIÓN (LOGIN)   ###
#########################################

# @name LoginExitoso
### 1. POST Login Exitoso (Usuario Administrador Activo Semilla)
POST {{host}}/api/auth/login
Content-Type: application/json

{
  "correo": "luis.admin@casetech.com",
  "password": "admin123"
}

### RESPUESTA ESPERADA (HTTP 200):
# {
#   "success": true,
#   "message": "Inicio de sesión exitoso",
#   "data": {
#     "id": 1,
#     "correo": "luis.admin@casetech.com",
#     "rol": "ADMINISTRADOR"
#   },
#   "error": null
# }


# @name LoginFallido
### 2. POST Login Fallido (Contraseña Incorrecta)
POST {{host}}/api/auth/login
Content-Type: application/json

{
  "correo": "luis.admin@casetech.com",
  "password": "clave_incorrecta"
}

### RESPUESTA ESPERADA (HTTP 401):
# {
#   "success": false,
#   "message": "Credenciales incorrectas",
#   "data": null,
#   "error": "HTTPException: Credenciales incorrectas"
# }


#########################################
### MÓDULO 1: PROVEEDORES             ###
#########################################

# @name ObtenerProveedores
### 3. GET Listar todos los proveedores
GET {{host}}/api/proveedores
Content-Type: application/json

### RESPUESTA ESPERADA (HTTP 200):
# {
#   "success": true,
#   "message": "Listado de proveedores obtenido exitosamente",
#   "data": [
#     {
#       "id": 1,
#       "nit": "890123456-1",
#       "razon_social": "Maderas del Caribe S.A.S.",
#       "contacto_completo": "Carlos Mendoza",
#       "telefono": "3157778899",
#       "correo": "contacto@maderascaribe.com",
#       "direccion": "Zona Industrial Bodega 14",
#       "estado": "ACTIVO",
#       "fecha_registro": "2026-06-25T14:00:00"
#     }
#   ],
#   "error": null
# }


# @name RegistrarProveedor
### 4. POST Registrar Proveedor Exitoso (sp_registrar_proveedor)
POST {{host}}/api/proveedores
Content-Type: application/json

{
  "nit": "900.777.666-5",
  "razon_social": "Metales del Centro S.A.",
  "contacto_completo": "Patricia Gómez",
  "telefono": "3154443322",
  "correo": "contacto@metalescentro.com",
  "direccion": "Avenida 30 #45-12",
  "usuario_id": 1
}

### RESPUESTA ESPERADA (HTTP 200):
# {
#   "success": true,
#   "message": "Proveedor registrado exitosamente",
#   "data": null,
#   "error": null
# }


# @name RegistrarProveedorDuplicado
### 5. POST Registrar Proveedor Duplicado (Error de NIT Duplicado)
POST {{host}}/api/proveedores
Content-Type: application/json

{
  "nit": "900.777.666-5",
  "razon_social": "Metales del Centro S.A.",
  "contacto_completo": "Patricia Gómez",
  "telefono": "3154443322",
  "correo": "contacto@metalescentro.com",
  "direccion": "Avenida 30 #45-12",
  "usuario_id": 1
}

### RESPUESTA ESPERADA (HTTP 400):
# {
#   "success": false,
#   "message": "El NIT ya se encuentra registrado",
#   "data": null,
#   "error": "HTTPException: El NIT ya se encuentra registrado"
# }


# @name ModificarProveedor
### 6. PUT Modificar Proveedor Exitoso (sp_modificar_proveedor)
# Reemplace el ID '{id}' con el ID asignado al proveedor registrado anteriormente.
PUT {{host}}/api/proveedores/3
Content-Type: application/json

{
  "razon_social": "Metales del Centro S.A. Modificada",
  "contacto_completo": "Patricia Gómez Restrepo",
  "telefono": "3159998877",
  "correo": "ventas@metalescentro.com",
  "direccion": "Avenida 30 #45-15"
}

### RESPUESTA ESPERADA (HTTP 200):
# {
#   "success": true,
#   "message": "Proveedor actualizado exitosamente",
#   "data": null,
#   "error": null
# }


# @name DesactivarProveedor
### 7. PATCH Desactivar Proveedor (sp_desactivar_proveedor - eliminación lógica)
# Reemplace el ID '{id}' con el ID asignado al proveedor registrado anteriormente.
PATCH {{host}}/api/proveedores/3/desactivar
Content-Type: application/json

### RESPUESTA ESPERADA (HTTP 200):
# {
#   "success": true,
#   "message": "Proveedor desactivado exitosamente (eliminación lógica)",
#   "data": null,
#   "error": null
# }
```
