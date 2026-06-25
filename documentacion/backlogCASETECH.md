#  PRODUCT BACKLOG GENERAL Y PLANIFICACIÓN DE SPRINTS (MÉTODO ÁGIL ADSO)
**Proyecto Académico:** Casetech (Sistema de Gestión de Casetones)  

---

##  DESGLOSE DE SPRINT BACKLOGS (SPRINTS 1 A 4)

### SPRINT 1: Autenticación de Seguridad y Base de Terceros
* **Objetivo del Sprint:** Construir la capa base de control de acceso para el Administrador y habilitar el registro operativo de los proveedores de la fábrica.

* **HU01 - Iniciar Sesión (Must Have - 13 Puntos):**  
  * *Historia:* Como Administrador de la fábrica, quiero ingresar mis credenciales en el login para acceder de manera segura al panel de control.
  * *Criterios de Aceptación:* Validar correo y contraseña en texto plano; restringir accesos anónimos a rutas internas; mostrar alerta ante credenciales incorrectas.
* **HU02 - Registrar Proveedor (`CALL`) (Must Have - 13 Puntos):**  
  * *Historia:* Como Administrador, quiero registrar un proveedor con NIT, Razón Social, Contacto, Teléfono, Correo y Dirección para habilitar transacciones comerciales.
  * *Criterios de Aceptación:* Validar NIT único; invocar el procedimiento `CALL sp_registrar_proveedor`; asignar estado 'ACTIVO' por defecto.
* **HU03 - Consultar Lista de Proveedores (Must Have - 8 Puntos):**  
  * *Historia:* Como Administrador, quiero visualizar el listado de proveedores registrados para auditar sus datos generales.
  * *Criterios de Aceptación:* Listar en una tabla interactiva; tiempo de respuesta menor a 3 segundos; barra de búsqueda filtrada por NIT o Razón Social.
* **HU04 - Modificar Información de Proveedor (Should Have - 8 Puntos):**  
  * *Historia:* Como Administrador, quiero editar los datos de contacto de un proveedor existente para mantener la consistencia de la información.
  * *Criterios de Aceptación:* Actualizar mediante `CALL sp_modificar_proveedor`; bloquear estrictamente la edición del campo NIT (Read-Only) en la interfaz gráfica.
* **HU05 - Desactivar Proveedor [Borrado Lógico] (Should Have - 5 Puntos):**  
  * *Historia:* Como Administrador, quiero cambiar el estado de un proveedor a 'INACTIVO' para suspender transacciones sin eliminar su historial físico.
  * *Criterios de Aceptación:* Invocación del procedimiento almacenado `CALL sp_desactivar_proveedor`; cambiar el estado visual en el frontend a inactivo.
* **HU06 - Cerrar Sesión (Could Have - 3 Puntos):**  
  * *Historia:* Como Administrador autenticado, quiero cerrar mi sesión para proteger la información del sistema.
  * *Criterios de Aceptación:* Eliminación del token o el objeto de usuario guardado en el LocalStorage o SessionStorage directo desde el Frontend.

---

### SPRINT 2: Gestión de Insumos y Automatización de Fórmulas
* **Objetivo del Sprint:** Desarrollar el inventario de materias primas y estructurar las fórmulas de consumo automático de materiales según la tipología del casetón.

* **HU10 - Registrar Materiales de Fabricación (Must Have - 8 Puntos):**  
  * *Historia:* Como Administrador, quiero registrar los materiales base de la planta (Madera, Lona, Grapas, Puntillas, Alambre, Icopor) con su unidad de medida para estructurar el catálogo.
  * *Criterios de Aceptación:* Formulario en React con validación de campos obligatorios; guardar de manera persistente los materiales en la base de datos PostgreSQL.
* **HU11 - Descuento Automático por Tipo de Casetón (Must Have - 13 Puntos):**  
  * *Historia:* Como Administrador, quiero que el sistema reste del stock general las materias primas calculadas según la receta del casetón a producir para automatizar el control.
  * *Criterios de Aceptación:* Al iniciar producción de un "Casetón de Lona", descontar automáticamente 24m de madera y 6.9m² de lona; al iniciar un "Casetón de Icopor", descontar 6m² de icopor, 1 bloque y 7m² de lona negra.
* **HU12 - Alertas Visuales de Stock Bajo (Could Have - 13 Puntos):**  
  * *Historia:* Como Administrador, quiero percibir una notificación visual cuando un insumo caiga por debajo de su stock mínimo configurado para planificar reabastecimientos.
  * *Criterios de Aceptación:* Comparación automática entre `cantidad_disponible` y `stock_minimo`; pintar la fila del material en color rojo dentro del panel general.

---

### SPRINT 3: Transaccionalidad de Pedidos y Ciclo de Producción
* **Objetivo del Sprint:** Desplegar el flujo operativo principal que vincula a los proveedores con las órdenes de fabricación y compras de casetones.

* **HU07 - Registrar Pedido de Producción (Must Have - 13 Puntos):**  
  * *Historia:* Como Administrador, quiero crear un nuevo pedido asociando un proveedor activo y los materiales necesarios para iniciar su flujo en planta.
  * *Criterios de Aceptación:* Bloquear la selección de proveedores en estado 'INACTIVO'; registrar el pedido en PostgreSQL con estado inicial 'Pendiente'.
* **HU08 - Actualizar Estado Secuencial del Pedido (Should Have - 8 Puntos):**  
  * *Historia:* Como Administrador, quiero transicionar el estado de un pedido para reflejar en tiempo real la etapa en la que se encuentra la fabricación.
  * *Criterios de Aceptación:* Permitir únicamente los estados secuenciales permitidos: 'Pendiente', 'En producción', 'En proceso de entrega', 'Entregado' o 'Cancelado'.
* **HU09 - Consultar Historial y Filtros de Pedidos (Should Have - 5 Puntos):**  
  * *Historia:* Como Administrador, quiero acceder a un registro histórico de pedidos filtrado por fecha, proveedor o estado para realizar auditorías internas.
  * *Criterios de Aceptación:* Tabla transaccional con filtros dinámicos; carga de información rápida en formato JSON desde los endpoints de FastAPI.

---

### SPRINT 4: Experiencia de Usuario, Reportes y Look & Feel
* **Objetivo del Sprint:** Refinar la interfaz visual del sistema, ajustar componentes interactivos en React y generar consultas rápidas para la toma de decisiones.

* **HU13 - Panel de Control (Dashboard) Inicial (Should Have - 8 Puntos):**  
  * *Historia:* Como Administrador, quiero ver un resumen gráfico con el total de pedidos pendientes y los proveedores activos para tener un panorama rápido al iniciar sesión.
  * *Criterios de Aceptación:* Vista principal responsiva; tarjetas informativas con contadores dinámicos consultados al backend.
* **HU14 - Ajustes de Stock Manual (Could Have - 5 Puntos):**  
  * *Historia:* Como Administrador, quiero realizar ajustes manuales en las cantidades de inventario para de esa forma corregir discrepancias halladas en conteos físicos.
  * *Criterios de Aceptación:* Formulario de ajuste justificado con un campo de observaciones obligatorias en texto plano.
* **HU15 - Interfaz Responsiva (Look and Feel) (Could Have - 3 Puntos):**  
  * *Historia:* Como Administrador, quiero que los formularios y tablas se adapten visualmente a computadores y pantallas móviles para operar desde cualquier dispositivo.
  * *Criterios de Aceptación:* Estilos CSS unificados; navegación lateral colapsable en dispositivos móviles sin romper layouts de las tablas.

---

##  MATRIZ GENERAL DE PRIORIZACIÓN DE BACKLOG

| ID | Historia de Usuario | Clasificación MoSCOW | Valor de Negocio | Esfuerzo Técnico | Destino / Sprint |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **HU01** | Iniciar Sesión (Texto Plano) | **MUST HAVE** | Alto | Bajo | Sprint 1 |
| **HU02** | Registrar Proveedor (`CALL`) | **MUST HAVE** | Alto | Medio | Sprint 1 |
| **HU03** | Consultar Lista de Proveedores | **MUST HAVE** | Alto | Bajo | Sprint 1 |
| **HU07** | Registrar Pedido de Producción | **MUST HAVE** | Alto | Medio | Sprint 3 |
| **HU10** | Registrar Materiales de Fabricación | **MUST HAVE** | Alto | Bajo | Sprint 2 |
| **HU11** | Actualizar Cantidades de Inventario | **MUST HAVE** | Alto | Alto | Sprint 2 |
| **HU04** | Modificar Información de Proveedor | **SHOULD HAVE** | Medio | Medio | Sprint 1 |
| **HU05** | Desactivar Proveedor (Borrado Lógico) | **SHOULD HAVE** | Medio | Bajo | Sprint 1 |
| **HU08** | Actualizar Estado de Producción | **SHOULD HAVE** | Medio | Bajo | Sprint 3 |
| **HU09** | Consultar Historial de Pedidos | **SHOULD HAVE** | Medio | Medio | Sprint 3 |
| **HU06** | Cerrar Sesión | **COULD HAVE** | Bajo | Bajo | Sprint 1 |
| **HU12** | Visualizar Alertas de Stock Bajo | **COULD HAVE** | Bajo | Bajo | Sprint 2 |