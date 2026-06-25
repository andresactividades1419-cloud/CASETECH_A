# MÓDULO DE PROVEEDORES Y AUTENTICACIÓN – PRODUCT BACKLOG Y SPRINT  0 y 1
**Proyecto Académico ADSO - Casetech (Sistema de Gestión de Casetones)**

---

## 1. DESCRIPCIÓN DEL MÓDULO
El módulo de proveedores y autenticación tiene como objetivo controlar el acceso seguro a la plataforma Casetech y administrar la información de las entidades externas que suministran materias primas para la fabricación de casetones. 

En esta primera versión, el sistema contará con un único rol de acceso:
* **ADMINISTRADOR:** Tendrá control total sobre el ingreso al sistema y la gestión (creación, consulta, modificación y desactivación) de los proveedores.

---

## 2. REQUISITOS FUNCIONALES

* **RF01. Iniciar sesión:** El sistema deberá permitir la autenticación del administrador mediante correo electrónico y contraseña.
* **RF02. Validar credenciales:** El sistema deberá verificar la existencia del usuario y la validez de la contraseña antes de conceder acceso.
* **RF03. Cerrar sesión:** El sistema deberá permitir la destrucción de la sesión activa desde el cliente.
* **RF04. Registrar proveedor:** El sistema deberá permitir el registro de nuevos proveedores con sus datos operativos y comerciales convocando el procedimiento almacenado `sp_registrar_proveedor`.
* **RF05. Consultar proveedores:** El sistema deberá permitir visualizar el listado completo de proveedores en una tabla.
* **RF06. Modificar proveedor:** El sistema deberá permitir actualizar los datos de un proveedor existente mediante el procedimiento almacenado `sp_modificar_proveedor`.
* **RF07. Desactivar proveedor (Eliminación lógica):** El sistema no borrará físicamente los registros; en su lugar, cambiará su estado a `INACTIVO` invocando `sp_desactivar_proveedor` para preservar el historial operativo.

---

## 3. REQUISITOS NO FUNCIONALES

* **RNF01.** La API deberá responder bajo una estructura estándar en formato JSON.
* **RNF02.** La base de datos relacional utilizada será **PostgreSQL**, desplegada e instanciada mediante contenedores **Docker** y administrada/diseñada con **pgAdmin 4**.
* **RNF03.** El backend será desarrollado utilizando el framework **FastAPI** (Python) y el ORM **SQLAlchemy**.
* **RNF04.** La documentación interactiva de los endpoints se generará automáticamente con **Swagger UI**.
* **RNF05.** La interfaz de usuario (Frontend) se construirá utilizando la librería **React** con **JavaScript**.
* **RNF06.** La aplicación implementará variables de entorno (`.env`) para resguardar las credenciales confidenciales de la base de datos.

---

## 4. PRODUCT BACKLOG

| ID | Historia de Usuario | Prioridad | Estación (Sprint) | Puntos (Story Points) |
| :--- | :--- | :---: | :---: | :---: |
| **HU01** | Iniciar Sesión | Alta | Sprint 1 | 13 |
| **HU02** | Registrar Proveedor | Alta | Sprint 1 | 13 |
| **HU03** | Consultar Lista de Proveedores | Alta | Sprint 1 | 8 |
| **HU04** | Modificar Información de Proveedor | Media | Sprint 1 | 8 |
| **HU05** | Desactivar Proveedor (Eliminación Lógica) | Media | Sprint 1 | 5 |
| **HU06** | Cerrar Sesión | Baja | Sprint 1 | 3 |

---

## 5. SPRINT BACKLOG - SPRINT 1

* **Objetivo del Sprint:** Implementar la capa de seguridad de acceso para el Administrador y desarrollar el ciclo completo de administración (CRUD) del módulo de proveedores.
* **Total de Puntos de Esfuerzo:** 50 Story Points.

---

## 6. HISTORIAS DE USUARIO (DETALLE)

### HU01 - Iniciar Sesión
* **Prioridad:** Alta | **Puntos:** 13
* **Historia:** > **Como** Administrador  
  > **Quiero** autenticarme con mi correo y contraseña  
  > **Para** acceder de manera segura al panel de gestión de Casetech.
* **Criterios de Aceptación:**
  * Solicitar estrictamente correo y contraseña.
  * Validar que el formato de correo sea legítimo mediante expresiones regulares.
  * Verificar las credenciales contra la base de datos comparándolas en texto plano.
  * Si la credencial es correcta, generar respuesta exitosa con los datos básicos del Administrador.
  * Si falla, retornar un código de estado `401 Unauthorized` con un formato JSON unificado de error.

### HU02 - Registrar Proveedor
* **Prioridad:** Alta | **Puntos:** 13
* **Historia:** > **Como** Administrador  
  > **Quiero** registrar nuevos proveedores de materiales  
  > **Para** incorporarlos a la cadena de suministro de la fábrica.
* **Criterios de Aceptación:**
  * Requerir obligatoriamente: NIT, Razón Social, Contacto Completo (nombre_contacto), Teléfono, Correo y Dirección.
  * El JSON de entrada acepta `usuario_id` por compatibilidad con el frontend.
  * Validar que el NIT sea único; si ya existe, capturar `IntegrityError` y retornar un error limpio.
  * Asignar el estado `ACTIVO` automáticamente por defecto mediante el procedimiento almacenado.

### HU03 - Consultar Lista de Proveedores
* **Prioridad:** Alta | **Puntos:** 8
* **Historia:** > **Como** Administrador  
  > **Quiero** visualizar el listado de proveedores en una tabla  
  > **Para** conocer las entidades registradas y auditar sus estados comerciales.
* **Criterios de Aceptación:**
  * Mostrar una grilla con los datos: NIT, Razón Social, Contacto Completo, Teléfono, Correo, Dirección y Estado.
  * Obtener los datos usando SQLAlchemy ORM.

### HU04 - Modificar Información de Proveedor
* **Prioridad:** Media | **Puntos:** 8
* **Historia:** > **Como** Administrador  
  > **Quiero** editar los datos de un proveedor específico  
  > **Para** mantener corregida y al día la base de datos de Casetech.
* **Criterios de Aceptación:**
  * Al pulsar "Editar", precargar el modal o formulario.
  * No permitir la alteración del NIT (bloqueado en la interfaz y excluido de la invocación del procedimiento almacenado).
  * Invocar el procedimiento almacenado `sp_modificar_proveedor`.

### HU05 - Desactivar Proveedor (Eliminación Lógica)
* **Prioridad:** Media | **Puntos:** 5
* **Historia:** > **Como** Administrador  
  > **Quiero** cambiar el estado de un proveedor a Inactivo  
  > **Para** restringir su uso en pedidos sin perder su historial de transacciones.
* **Criterios de Aceptación:**
  * Invocar el procedimiento almacenado `sp_desactivar_proveedor` para cambiar el estado a `INACTIVO`.
  * El registro no debe desaparecer físicamente de la base de datos.

### HU06 - Cerrar Sesión
* **Prioridad:** Baja | **Puntos:** 3
* **Historia:** > **Como** Administrador autenticado  
  > **Quiero** cerrar mi sesión activa  
  > **Para** evitar accesos no autorizados a la plataforma.
* **Criterios de Aceptación:**
  * El proceso se ejecuta en el cliente (Frontend) limpiando el `localStorage` o `sessionStorage`.

---

## 7. MODELO DE BASE DE DATOS (DDL SCRIPT - POSTGRESQL / PGADMIN)

```sql
-- Crear tipos ENUM si no existen
CREATE TYPE estado_usuario AS ENUM ('ACTIVO', 'INACTIVO');
CREATE TYPE estado_proveedor AS ENUM ('ACTIVO', 'INACTIVO');

-- Creación de la tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Temporal en texto plano
    rol VARCHAR(30) DEFAULT 'ADMINISTRADOR',
    estado estado_usuario DEFAULT 'ACTIVO',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creación de la tabla de proveedores
CREATE TABLE proveedores (
    id SERIAL PRIMARY KEY,
    nit VARCHAR(20) UNIQUE NOT NULL,
    razon_social VARCHAR(150) NOT NULL,
    nombre_contacto VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    estado estado_proveedor DEFAULT 'ACTIVO',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Procedimientos Almacenados
CREATE OR REPLACE PROCEDURE sp_registrar_proveedor(
    p_nit VARCHAR,
    p_razon_social VARCHAR,
    p_contacto VARCHAR,
    p_telefono VARCHAR,
    p_correo VARCHAR,
    p_direccion VARCHAR
)
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO proveedores (nit, razon_social, nombre_contacto, telefono, correo, direccion, estado)
    VALUES (p_nit, p_razon_social, p_contacto, p_telefono, p_correo, p_direccion, 'ACTIVO');
END;
$$;

CREATE OR REPLACE PROCEDURE sp_modificar_proveedor(
    p_id INT,
    p_razon_social VARCHAR,
    p_contacto VARCHAR,
    p_telefono VARCHAR,
    p_correo VARCHAR,
    p_direccion VARCHAR
)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE proveedores 
    SET razon_social = p_razon_social,
        nombre_contacto = p_contacto,
        telefono = p_telefono,
        correo = p_correo,
        direccion = p_direccion
    WHERE id = p_id;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_desactivar_proveedor(p_id INT)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE proveedores 
    SET estado = 'INACTIVO' 
    WHERE id = p_id;
END;
$$;
```

---

## 8. TAREAS TÉCNICAS POR HISTORIA

### HU01 - Iniciar Sesión
* **Backend:**
  * Crear Schema `LoginSchema` en Pydantic.
  * Crear Model `UserModel` en SQLAlchemy.
  * Crear Controller `login_user()`.
  * Crear Route `POST /api/auth/login`.
  * Validar correo mediante expresión regular y verificar rol de administrador y estado activo.

### HU02 - Registrar Proveedor
* **Backend:**
  * Crear Schema `ProviderCreateSchema`.
  * Crear Model `ProviderModel`.
  * Crear Controller `create_provider()` que ejecute `sp_registrar_proveedor` mediante transacciones SQL.
  * Capturar `IntegrityError` en caso de NIT duplicado y retornar respuesta estándar de error.
  * Crear Route `POST /api/proveedores`.

### HU03 - Consultar Lista de Proveedores
* **Backend:**
  * Crear endpoint listado de proveedores `GET /api/proveedores`.
  * Crear consulta ORM ordenada por ID de forma ascendente.

### HU04 - Modificar Información de Proveedor
* **Backend:**
  * Crear Schema `ProviderUpdateSchema` (sin campos NIT ni Estado).
  * Crear endpoint de actualización `PUT /api/proveedores/{id}`.
  * Invocar `sp_modificar_proveedor` en transacción SQL.

### HU05 - Desactivar Proveedor (Eliminación Lógica)
* **Backend:**
  * Crear endpoint `PATCH /api/proveedores/{id}/desactivar`.
  * Invocar `sp_desactivar_proveedor` en transacción SQL.

---

## 9. ARQUITECTURA BACKEND FASTAPI

```plaintext
backend/
├── app/
│   ├── config/
│   │   └── database.py
│   ├── models/
│   │   ├── user_model.py
│   │   └── provider_model.py
│   ├── schemas/
│   │   ├── user_schema.py
│   │   └── provider_schema.py
│   ├── controllers/
│   │   ├── user_controller.py
│   │   └── provider_controller.py
│   ├── routes/
│   │   ├── user_routes.py
│   │   └── provider_routes.py
│   └── main.py
├── .env
└── requirements.txt
```

---

## 10. RESPONSABILIDAD DE CADA CAPA

* **Config:** Gestiona la conexión y sesiones con la base de datos PostgreSQL.
* **Models:** Representan las tablas de la base de datos mapeadas con SQLAlchemy.
* **Schemas:** Validan los datos de entrada y salida mediante Pydantic.
* **Controllers:** Ejecutan la lógica del negocio centralizada en consultas ORM y llamadas a procedimientos almacenados en transacciones.
* **Routes:** Exponen formalmente los endpoints REST.

---

## 11. RESPUESTA ESTÁNDAR DE LA API

### Éxito (JSON)
```json
{
  "success": true,
  "message": "Mensaje en español",
  "data": {},
  "error": null
}
```

### Error (JSON)
```json
{
  "success": false,
  "message": "Mensaje de error",
  "data": null,
  "error": "Detalle técnico"
}
```

---

## 12. ENDPOINTS DEL SPRINT 1

### Autenticación
* **Iniciar Sesión**
  * **Método:** `POST`
  * **Ruta:** `/api/auth/login`
  * **Request (JSON):**
    ```json
    {
      "correo": "luis.admin@casetech.com",
      "password": "admin123"
    }
    ```

### Proveedores
* **Obtener Proveedores**
  * **Método:** `GET`
  * **Ruta:** `/api/proveedores`

* **Registrar Proveedor**
  * **Método:** `POST`
  * **Ruta:** `/api/proveedores`
  * **Request (JSON):**
    ```json
    {
      "nit": "901234567-1",
      "razon_social": "Cemetcol S.A.S.",
      "contacto_completo": "Juan Pérez",
      "telefono": "3001234567",
      "correo": "contacto@cemetcol.com",
      "direccion": "Calle 45 #12-34",
      "usuario_id": 1
    }
    ```

* **Modificar Proveedor**
  * **Método:** `PUT`
  * **Ruta:** `/api/proveedores/{id}`
  * **Request (JSON):**
    ```json
    {
      "razon_social": "Cemetcol S.A.S. Renovada",
      "contacto_completo": "Juan Pérez Restrepo",
      "telefono": "3009876543",
      "correo": "gerencia@cemetcol.com",
      "direccion": "Calle 45 #12-36"
    }
    ```

* **Desactivar Proveedor**
  * **Método:** `PATCH`
  * **Ruta:** `/api/proveedores/{id}/desactivar`

---

## 13. DEPENDENCIAS DEL PROYECTO

```bash
pip install fastapi uvicorn sqlalchemy pg8000 python-dotenv pydantic
```

---

## 14. VARIABLES DE ENTORNO

Archivo `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=casetech_db
DB_USER=postgres
DB_PASSWORD=123456
```

---

## 15. DOCUMENTACIÓN SWAGGER

* **Ejecutar el servidor:**
  ```bash
  uvicorn app.main:app --reload
  ```
* **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)