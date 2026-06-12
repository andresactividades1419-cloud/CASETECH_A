# MÓDULO DE PROVEEDORES Y AUTENTICACIÓN – PRODUCT BACKLOG Y SPRINT 1
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
* **RF04. Registrar proveedor:** El sistema deberá permitir el registro de nuevos proveedores con sus datos operativos y comerciales.
* **RF05. Consultar proveedores:** El sistema deberá permitir visualizar el listado completo de proveedores en una tabla.
* **RF06. Consultar proveedor específico:** El sistema deberá permitir extraer la información detallada de un único proveedor para su edición.
* **RF07. Modificar proveedor:** El sistema deberá permitir actualizar los datos de un proveedor existente.
* **RF08. Desactivar proveedor (Eliminación lógica):** El sistema no borrará físicamente los registros; en su lugar, cambiará su estado a `INACTIVO` para preservar el historial operativo.

---

## 3. REQUISITOS NO FUNCIONALES

* **RNF01.** La API deberá responder bajo una estructura estándar en formato JSON.
* **RNF02.** La base de datos relacional utilizada será **PostgreSQL**, desplegada e instanciada mediante contenedores **Docker** y administrada/diseñada con **pgAdmin 4**.
* **RNF03.** El backend será desarrollado utilizando el framework **FastAPI** (Python).
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
  * Validar que el formato de correo sea legítimo.
  * Verificar las credenciales contra la base de datos comparándolas en texto plano.
  * Si la credencial es correcta, generar respuesta exitosa con los datos básicos del Administrador y persistir el estado de la sesión.
  * Si falla, retornar un código de estado `401 Unauthorized` con un mensaje claro.

### HU02 - Registrar Proveedor
* **Prioridad:** Alta | **Puntos:** 13
* **Historia:** > **Como** Administrador  
  > **Quiero** registrar nuevos proveedores de materiales  
  > **Para** incorporarlos a la cadena de suministro de la fábrica.
* **Criterios de Aceptación:**
  * Requerir obligatoriamente: NIT, Razón Social y Contacto Completo.
  * Permitir opcionalmente: Teléfono, Correo y Dirección.
  * Validar que el NIT sea único en el sistema; si ya existe, lanzar un error.
  * Asignar el estado `ACTIVO` de forma automatizada por defecto al crear el registro.

### HU03 - Consultar Lista de Proveedores
* **Prioridad:** Alta | **Puntos:** 8
* **Historia:** > **Como** Administrador  
  > **Quiero** visualizar el listado de proveedores en una tabla  
  > **Para** conocer las entidades registradas y auditar sus estados comerciales.
* **Criterios de Aceptación:**
  * Mostrar una grilla con las columnas: NIT, Razón Social, Contacto Completo, Teléfono y Estado.
  * Cargar los datos dinámicamente en un componente de React mediante peticiones asíncronas (`fetch` / `axios`) a la API.

### HU04 - Modificar Información de Proveedor
* **Prioridad:** Media | **Puntos:** 8
* **Historia:** > **Como** Administrador  
  > **Quiero** editar los datos de un proveedor específico  
  > **Para** mantener corregida y al día la base de datos de Casetech.
* **Criterios de Aceptación:**
  * Al pulsar "Editar", precargar un modal o formulario con la información guardada del proveedor usando estados de React.
  * No permitir la alteración del NIT si este actúa como identificador invariable.
  * Validar las modificaciones bajo las mismas reglas de la creación.

### HU05 - Desactivar Proveedor (Eliminación Lógica)
* **Prioridad:** Media | **Puntos:** 5
* **Historia:** > **Como** Administrador  
  > **Quiero** cambiar el estado de un proveedor a Inactivo  
  > **Para** restringir su uso en pedidos sin perder su historial de transacciones.
* **Criterios de Aceptación:**
  * El sistema debe contar con una acción de desactivación en la interfaz de React.
  * Solicitar confirmación en pantalla (ej: SweetAlert o Modal) al usuario antes de proceder.
  * Cambiar el atributo `estado` a `INACTIVO`. El registro no debe desaparecer físicamente de la base de datos.

### HU06 - Cerrar Sesión
* **Prioridad:** Baja | **Puntos:** 3
* **Historia:** > **Como** Administrador autenticado  
  > **Quiero** cerrar mi sesión activa  
  > **Para** evitar accesos no autorizados a la plataforma desde mi equipo.
* **Criterios de Aceptación:**
  * El proceso se ejecutará exclusivamente del lado del cliente (Frontend).
  * Eliminar el token de autenticación o el objeto de usuario almacenado en el `LocalStorage` / `SessionStorage` de React.
  * Redirigir de manera inmediata a la vista de login.

---

## 7. MODELO DE BASE DE DATOS (DDL SCRIPT - POSTGRESQL / PGADMIN)

```sql
-- Crear tipos ENUM si no existen
CREATE TYPE rol_enum AS ENUM ('ADMINISTRADOR');
CREATE TYPE estado_enum AS ENUM ('ACTIVO', 'INACTIVO');

-- Creación de la tabla de usuarios administradores
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol rol_enum DEFAULT 'ADMINISTRADOR',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creación de la tabla de proveedores con borrado lógico y relación al Administrador
CREATE TABLE proveedores (
    id SERIAL PRIMARY KEY,
    nit VARCHAR(20) NOT NULL UNIQUE,
    razon_social VARCHAR(100) NOT NULL,
    contacto_completo VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(100),
    direccion VARCHAR(150),
    estado estado_enum DEFAULT 'ACTIVO',
    usuario_id INT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_proveedores_usuarios 
        FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
```

## 8. TAREAS TÉCNICAS POR HISTORIA

### HU01 - Iniciar Sesión
* **Base de Datos:**
  * Crear la tabla `usuarios` en pgAdmin 4.
  * Insertar un registro semilla (Seeder) con un usuario Administrador y contraseña en texto plano para pruebas iniciales.
* **Backend (FastAPI):**
  * Crear el esquema de validación `LoginSchema` en `user_schema.py` (correo y password).
  * Crear el controlador `login()` en `user_controller.py` que busque al usuario y compare la contraseña en texto plano.
  * Validar en el controlador que el usuario tenga el rol de `ADMINISTRADOR`.
  * Crear la ruta `POST /api/auth/login` en `user_routes.py`.
* **Frontend (React):**
  * Crear la vista de formulario `Login.jsx` con manejo de estados para correo y contraseña.
  * Desarrollar la función de envío que consuma el servicio `authService.js`.
  * Guardar los datos de respuesta exitosa (nombre, rol) en el `localStorage` o `sessionStorage`.
  * Programar alertas en pantalla en caso de credenciales inválidas.

---

### HU02 - Registrar Proveedor
* **Base de Datos:**
  * Crear la tabla `proveedores` en pgAdmin 4 con restricción `UNIQUE` para el campo `nit`.
* **Backend (FastAPI):**
  * Crear el esquema `ProviderCreateSchema` en `provider_schema.py` para validar los datos de entrada obligatorios y opcionales.
  * Crear el modelo de base de datos `Proveedor` en `provider_model.py` usando SQLAlchemy.
  * Desarrollar el controlador `create_provider()` en `provider_controller.py`.
  * Implementar la validación lógica para verificar que el NIT no exista previamente; si existe, retornar HTTP 400.
  * Crear la ruta `POST /api/proveedores` en `provider_routes.py`.
* **Frontend (React):**
  * Crear el componente de formulario o ventana modal `ProviderForm.jsx`.
  * Implementar validaciones en el cliente (campos obligatorios diligenciados, formato de correo válido).
  * Conectar el formulario con el método de creación en `providerService.js`.

---

### HU03 - Consultar Lista de Proveedores
* **Backend (FastAPI):**
  * Desarrollar el controlador `get_all_providers()` en `provider_controller.py` que ejecute la consulta SQL (`SELECT * FROM proveedores`).
  * Crear la ruta `GET /api/proveedores` en `provider_routes.py`.
* **Frontend (React):**
  * Crear el componente `ProviderTable.jsx` para renderizar la grilla de datos.
  * Implementar un hook `useEffect` para disparar la petición a `providerService.js` al cargar la vista.
  * Mapear el arreglo de datos recibido de la API en filas de la tabla de Bootstrap.

---

### HU04 - Modificar Información de Proveedor
* **Backend (FastAPI):**
  * Crear el esquema `ProviderUpdateSchema` en `provider_schema.py`.
  * Desarrollar el controlador `update_provider()` en `provider_controller.py` que busque por ID, valide la existencia del registro y actualice los campos en la base de datos.
  * Crear la ruta `PUT /api/proveedores/{id}` en `provider_routes.py`.
* **Frontend (React):**
  * Configurar el botón "Editar" en la tabla para que guarde el objeto del proveedor seleccionado en el estado de React y abra el modal del formulario en modo edición.
  * Bloquear el campo de texto del `NIT` para impedir su edición en caliente.
  * Conectar el evento de guardado con el método de actualización en `providerService.js`.

---

### HU05 - Desactivar Proveedor (Eliminación Lógica)
* **Backend (FastAPI):**
  * Desarrollar el controlador `disable_provider()` en `provider_controller.py` que realice un `UPDATE proveedores SET estado = 'INACTIVO' WHERE id = :id`.
  * Crear la ruta `PATCH /api/proveedores/{id}/desactivar` en `provider_routes.py`.
* **Frontend (React):**
  * Vincular el botón "Eliminar" de la tabla a una función controladora.
  * Integrar una ventana de confirmación (ej: SweetAlert2) para asegurar la acción del usuario.
  * Invocar el servicio correspondiente y refrescar el estado de la tabla tras recibir la respuesta de éxito de la API.

---

### HU06 - Cerrar Sesión
* **Frontend (React):**
  * Crear la función `logout()` dentro de los servicios de autenticación o el contexto de la aplicación.
  * Limpiar por completo el objeto del usuario almacenado en el almacenamiento del navegador (`localStorage.clear()`).
  * Forzar la redirección del enrutador de React (`react-router-dom`) hacia la ruta pública `/login`.
  
## 9. TAREAS TÉCNICAS POR HISTORIA

### HU01 - Iniciar Sesión
* **Base de Datos:**
  * Crear tabla `usuarios` en pgAdmin 4.
  * Configurar restricciones y correo único.
* **Backend:**
  * Crear Schema `LoginSchema` en Pydantic.
  * Crear Model `User` en SQLAlchemy.
  * Crear Controller `login()`.
  * Crear Route `POST /api/auth/login`.
  * Validar correo, estado activo y rol de administrador.
  * Comparar contraseñas en texto plano.
* **Frontend:**
  * Diseñar la vista de formulario `Login.jsx` con manejo de estados para credenciales.
  * Desarrollar la función de envío que consuma el servicio `authService.js`.
  * Guardar datos de sesión exitosa en el `localStorage` / `sessionStorage`.

---

### HU02 - Registrar Proveedor
* **Base de Datos:**
  * Crear tabla `proveedores` en pgAdmin 4.
  * Configurar restricción de NIT único.
* **Backend:**
  * Crear Schema `ProviderCreateSchema`.
  * Crear Model `Proveedor`.
  * Crear Controller `create_provider()`.
  * Crear Route `POST /api/proveedores`.
  * Validar duplicidad de NIT.
* **Frontend:**
  * Diseñar la ventana modal o formulario `ProviderForm.jsx`.
  * Implementar validaciones en el cliente (campos obligatorios y formato de correo).
  * Conectar formulario con el método de creación en `providerService.js`.

---

### HU03 - Consultar Lista de Proveedores
* **Backend:**
  * Crear endpoint listado de proveedores `GET /api/proveedores`.
  * Crear consulta SQL estructurada a través del ORM.
* **Frontend:**
  * Diseñar el componente `ProviderTable.jsx` para renderizar la grilla de datos de Bootstrap.
  * Implementar hook `useEffect` para disparar la petición a `providerService.js` al cargar la vista.

---

### HU04 - Modificar Información de Proveedor
* **Backend:**
  * Crear Schema `ProviderUpdateSchema`.
  * Crear endpoint de actualización `PUT /api/proveedores/{id}`.
  * Validar existencia previa del proveedor.
* **Frontend:**
  * Configurar botón "Editar" en la tabla para pasar datos del renglón al estado y abrir el modal.
  * Bloquear el input del NIT para impedir su alteración.
  * Enlazar el evento de guardado con el método de actualización en `providerService.js`.

---

### HU05 - Desactivar Proveedor (Eliminación Lógica)
* **Backend:**
  * Crear endpoint de actualización parcial `PATCH /api/proveedores/{id}/desactivar`.
  * Modificar atributo estado a `INACTIVO`.
* **Frontend:**
  * Vincular el botón "Eliminar" de la grilla a una función controladora.
  * Integrar SweetAlert2 para solicitar confirmación del usuario antes del cambio de estado.

---

### HU06 - Cerrar Sesión
* **Frontend:**
  * Desarrollar función `logout()` en React:
    ```javascript
    function logout() {
      localStorage.removeItem("user");
      sessionStorage.clear();
      window.location.href = "/login";
    }
   
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

* **Config:** Gestiona la conexión y sesiones con la base de datos PostgreSQL en el contenedor Docker.
* **Models:** Representan las tablas de la base de datos estructuradas como clases de Python (SQLAlchemy).
* **Schemas:** Validan estrictamente los datos de entrada y salida mediante tipos definidos (Pydantic).
* **Controllers:** Implementan las reglas y la lógica del negocio pura del sistema Casetech.
* **Routes:** Exponen formalmente los endpoints REST para su consumo externo.

---

## 11. RESPUESTA ESTÁNDAR DE LA API

Todas las rutas deberán responder bajo la siguiente estructura estándar:

### Éxito (JSON)
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": {},
  "error": null
}
```

### Error (JSON)
```json
{
  "success": false,
  "message": "Error",
  "data": null,
  "error": "Descripción del error"
}
```

---

## 12. ENDPOINTS DEL MÓDULO

### Autenticación
* **Iniciar Sesión**
  * **Método:** `POST`
  * **Ruta:** `/api/auth/login`
  * **Request (JSON):**
    ```json
    {
      "correo": "admin@gmail.com",
      "password": "123456"
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
      "direccion": "Calle 45 #12-34"
    }
    ```

* **Modificar Proveedor**
  * **Método:** `PUT`
  * **Ruta:** `/api/proveedores/{id}`

* **Desactivar Proveedor**
  * **Método:** `PATCH`
  * **Ruta:** `/api/proveedores/{id}/desactivar`

---

## 13. DEPENDENCIAS DEL PROYECTO

Instalación de dependencias del backend:
```bash
pip install fastapi uvicorn sqlalchemy pg8000 python-dotenv pydantic
```

---

## 14. VARIABLES DE ENTORNO

Archivo `.env` en la raíz del proyecto backend:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=casetech_db
DB_USER=root
DB_PASSWORD=123456
```

---

## 15. DOCUMENTACIÓN SWAGGER

* **Comando para ejecutar el servidor:**
  ```bash
  uvicorn app.main:app --reload
  ```
* **URLs de acceso:**
  * **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
  * **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 16. ARQUITECTURA FRONTEND

```plaintext
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── Navbar.jsx
│   │   └── ProviderModal.jsx
│   ├── views/
│   │   ├── Login.jsx
│   │   └── PanelProveedores.jsx
│   ├── services/
│   │   ├── authService.js
│   │   └── providerService.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── .env
```

### Patrón Recomendado
Separación por responsabilidades estrictas:
* **Services:** Se encargan del consumo exclusivo de la API (`fetch` / `axios`).
* **Components / Views:** Se encargan de renderizar el DOM virtual de React, manejar los estados internos y controlar los eventos del usuario.
* **App.jsx:** Centraliza el enrutamiento y la protección de accesos.