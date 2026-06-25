# Contexto del Proyecto: CASETECH
**Sistema de Gestión de Casetones — Proyecto Académico ADSO**

### 👥 Grupo de Trabajo / Desarrolladores
*   **Andrés Fernández**
*   **Oscar Ruiz**
*   **Javier Sepúlveda**
*   **Angélica Arregoces**

---

Este documento explica de manera detallada el trasfondo operativo y técnico del proyecto **Casetech**, un sistema integrado de control de producción, inventarios de materias primas y gestión de proveedores adaptado a las necesidades de una fábrica de casetones. El proyecto se estructura bajo tres preguntas clave que definen su desarrollo: ¿Por qué?, ¿Cómo? y ¿Para qué?.

---

## 1. ¿Por qué? (La Problemática y Justificación)

### El Reto Operativo
Una fábrica de casetones (estructuras temporales para vaciado de losas de concreto) opera bajo una cadena de suministro y producción dinámica que requiere coordinar en tiempo real múltiples flujos operativos:
*   **Gestión de Proveedores:** Registrar, actualizar y auditar a los proveedores de insumos críticos de forma segura. Se requiere evitar la pérdida de integridad referencial histórica cuando un proveedor deja de estar disponible (aplicando borrado lógico).
*   **Automatización de Consumo por Receta:** Cada tipo de casetón (lona, icopor, guadua) tiene una "receta" o consumo de materiales específicos (madera, lona, icopor, bloques, etc.). Calcular y descontar manualmente el stock necesario por cada pedido introduce errores humanos y descuadres de inventario.
*   **Gestión de Stock en Tiempo Real:** Alertar tempranamente si el stock cae por debajo del nivel de seguridad (stock mínimo) para realizar compras a tiempo y evitar paradas de producción.
*   **Auditoría de Ajustes:** Permitir correcciones físicas de stock de forma manual (por pérdidas, mermas o daños), exigiendo siempre una justificación obligatoria para fines de auditoría.

### Justificación de la Arquitectura Seleccionada
Para resolver esta problemática operativa de manera eficiente y ordenada, se definió una arquitectura de **Monolito de Tres Capas** con lógica transaccional centralizada en base de datos:
*   **Centralización de la Lógica en Procedimientos Almacenados:** Las operaciones que alteran el estado o volumen de los datos (POST, PUT, PATCH) se delegan directamente al motor de base de datos **PostgreSQL** mediante sentencias `CALL sp_...`. Esto asegura consistencia atómica y reduce condiciones de carrera en el descuento de inventarios concurrentes.
*   **Gestión de Concurrencia e Integridad:** FastAPI (Python) se conecta a PostgreSQL mediante el ORM SQLAlchemy, permitiendo abrir y cerrar transacciones de forma limpia, aplicando `commit` en caso de éxito o `rollback` inmediato si ocurre una violación de llave única (como NIT duplicado) o falta de inventario.
*   **Arquitectura de 3 Capas Clara (ADSO - SENA):** Se separan estrictamente las responsabilidades en:
    1.  *Config & Models:* Conexión y mapeo de base de datos.
    2.  *Schemas:* Validación sintáctica y de formatos de entrada con Pydantic.
    3.  *Controllers & Routes:* Lógica de negocio mediante la ejecución de transacciones y la exposición de endpoints REST.

---

## 2. ¿Cómo? (La Solución Técnica y Arquitectura)

El sistema Casetech se estructura bajo un diseño modular limpio que divide las responsabilidades en capas lógicas:

```plaintext
CASETECH/
├── backend/                  (Desarrollado con Python y FastAPI)
│   ├── app/
│   │   ├── config/           # Conexión a base de datos y SessionLocal
│   │   ├── models/           # Mapeo ORM SQLAlchemy (usuarios, proveedores)
│   │   ├── schemas/          # Validaciones sintácticas con Pydantic
│   │   ├── controllers/      # Ejecución de sp_... y lógica del negocio
│   │   ├── routes/           # Controladores de rutas y endpoints HTTP
│   │   └── main.py           # Entrada de FastAPI, excepciones y CORS
│   ├── .env                  # Variables de entorno confidenciales
│   ├── requirements.txt      # Dependencias del backend
│   └── test_api.py           # Script de pruebas automatizadas
│
├── database/                 (Base de Datos PostgreSQL relacional)
│   ├── casetech_db.sql       # Creación de tablas, enums, SPs, vistas e índices
│   └── docker-compose.yml    # Orquestación de contenedores locales
│
└── documentacion/            (Especificaciones del proyecto)
    ├── BACKLOG.md            # Planificación y Sprint Backlog
    ├── alcance.md            # Requisitos funcionales y de alcance
    ├── casetech.md           # Resumen descriptivo del proyecto
    ├── explicacion_base_datos.md # Explicación técnica de tablas y SPs
    ├── guia_explicacion_endpoints.md # Guía para sustentación académica
    └── contexto.md           # Contexto técnico y operacional del proyecto
```

### Detalle de las Capas del Monolito
1.  **Capa de Presentación (Routes y Schemas):** Desarrollada con FastAPI. Recibe las solicitudes HTTP en formato JSON. Valida sintácticamente los datos con esquemas Pydantic (como formato de correo mediante expresiones regulares o longitudes de texto) y retorna un JSON unificado con la estructura estándar (`success`, `message`, `data`, `error`).
2.  **Capa de Lógica de Negocio (Controllers):** Coordina los accesos a datos. Verifica la existencia de registros y ejecuta transacciones SQL directas invocando a los procedimientos almacenados mediante sentencias preparadas.
3.  **Capa de Persistencia (Models y Base de Datos):** Mapea las tablas PostgreSQL mediante SQLAlchemy. Centraliza el procesamiento pesado del inventario a través de funciones SQL internas que calculan descuentos y validan existencias a nivel de motor.

---

## 3. ¿Para qué? (Objetivos y Beneficios)

El desarrollo e implementación de Casetech persigue objetivos estratégicos enfocados tanto en la excelencia operativa como en las buenas prácticas de ingeniería de software:

### Objetivos Operativos (Negocio)
*   **Garantizar Cero Pérdidas de Historial:** Impedir la eliminación física de proveedores usando borrado lógico. Esto resguarda la trazabilidad de los pedidos registrados con anterioridad.
*   **Optimizar el Descuento de Stock:** Reducir a cero el error humano en la asignación de materiales. Las recetas de producción se calculan y se descuentan de forma automática en una única transacción de base de datos cuando el pedido pasa a `'En producción'`.
*   **Trazabilidad Absoluta del Inventario:** Registrar detalladamente cualquier movimiento manual de materias primas con autorizaciones justificadas por escrito en la tabla de auditoría `ajustes_inventario`.
*   **Seguridad de Acceso:** Garantizar el acceso exclusivo al personal con rol `'ADMINISTRADOR'` para el registro de proveedores y autenticación segura.

### Objetivos Técnicos (Ingeniería)
*   **Estandarización de la Comunicación:** Ofrecer al cliente (Frontend) un formato de respuesta unificado tanto en flujos exitosos como erróneos, lo que simplifica el desarrollo de la interfaz de usuario en React.
*   **Desacoplamiento de Lógica de Mutación:** Mantener el backend de Python libre de cálculos de recetas pesados. Esto permite delegar estas tareas a PostgreSQL para ganar velocidad y simplicidad en la base del backend.
*   **Documentación Automatizada:** Exponer todos los endpoints a través de Swagger UI de forma interactiva, asegurando que el equipo de frontend tenga especificaciones actualizadas en tiempo real.
