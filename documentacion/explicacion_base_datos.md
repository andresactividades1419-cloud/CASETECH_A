# Documentación y Estructura de la Base de Datos - CASETECH

Este documento contiene la explicación técnica detallada de la base de datos del proyecto **CASETECH**, desarrollada sobre el motor **PostgreSQL**. A continuación se detalla la estructura del esquema relacional completo, incluyendo tipos personalizados, tablas, campos, relaciones, procedimientos almacenados, índices y vistas.

---

## 1. Tipos de Datos Personalizados (Enums)

Para restringir y estandarizar los valores permitidos en ciertas columnas clave de auditoría y ciclo de vida, se definieron los siguientes tipos enumerados (`ENUM`):

*   **`estado_usuario`**: Define el estado de ingreso del usuario administrador.
    *   *Valores:* `'ACTIVO'`, `'INACTIVO'`
*   **`estado_proveedor`**: Controla la disponibilidad del proveedor.
    *   *Valores:* `'ACTIVO'`, `'INACTIVO'`
*   **`estado_pedido`**: Define el ciclo de vida por el cual transita un pedido de casetones.
    *   *Valores:* `'Pendiente'`, `'En producción'`, `'En proceso de entrega'`, `'Entregado'`, `'Cancelado'`

---

## 2. Estructura de Tablas

### Tabla: `usuarios`
Almacena las credenciales de acceso para el personal administrativo de Casetech.

| Campo | Tipo de Dato | Restricciones | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | *Auto-incremental* | Identificador único del usuario. |
| `correo` | `VARCHAR(100)` | `NOT NULL`, `UNIQUE` | *Ninguno* | Correo electrónico único de acceso. |
| `password` | `VARCHAR(255)` | `NOT NULL` | *Ninguno* | Contraseña de acceso (almacenada temporalmente en texto plano). |
| `rol` | `VARCHAR(30)` | `NOT NULL` | `'ADMINISTRADOR'` | Rol asignado en el sistema. |
| `estado` | `estado_usuario` | `NOT NULL` | `'ACTIVO'` | Estado de la cuenta. |
| `fecha_registro` | `TIMESTAMP` | `NOT NULL` | `CURRENT_TIMESTAMP` | Fecha de creación del registro. |

---

### Tabla: `proveedores`
Catálogo de entidades externas que suministran las materias primas para la fabricación.

| Campo | Tipo de Dato | Restricciones | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | *Auto-incremental* | Identificador único del proveedor. |
| `nit` | `VARCHAR(20)` | `NOT NULL`, `UNIQUE` | *Ninguno* | Identificador tributario de la empresa (invariable). |
| `razon_social` | `VARCHAR(150)` | `NOT NULL` | *Ninguno* | Nombre legal o comercial de la empresa. |
| `nombre_contacto` | `VARCHAR(100)` | `NOT NULL` | *Ninguno* | Nombre del contacto comercial (mapeado en la API como `contacto_completo`). |
| `telefono` | `VARCHAR(20)` | `NOT NULL` | *Ninguno* | Teléfono principal de contacto. |
| `correo` | `VARCHAR(100)` | `NOT NULL` | *Ninguno* | Correo electrónico de comunicación comercial. |
| `direccion` | `VARCHAR(200)` | `NOT NULL` | *Ninguno* | Dirección física de la empresa. |
| `estado` | `estado_proveedor` | `NOT NULL` | `'ACTIVO'` | Estado de habilitación (usado para borrado lógico). |
| `fecha_registro` | `TIMESTAMP` | `NOT NULL` | `CURRENT_TIMESTAMP` | Fecha de creación de la relación comercial. |

---

### Tabla: `materiales`
Inventario base de materias primas e insumos para la fabricación.

| Campo | Tipo de Dato | Restricciones | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | *Auto-incremental* | Identificador único del insumo. |
| `nombre_material` | `VARCHAR(100)` | `NOT NULL`, `UNIQUE` | *Ninguno* | Nombre único del material (ej: 'Madera', 'Lona'). |
| `categoria` | `VARCHAR(50)` | `NOT NULL` | *Ninguno* | Categoría del material (ej: 'Estructuras', 'Cubiertas'). |
| `unidad_medida` | `VARCHAR(20)` | `NOT NULL` | *Ninguno* | Unidad de medida (ej: 'm lineales', 'm²', 'unidades'). |
| `cantidad_disponible` | `NUMERIC(10,2)` | `NOT NULL` | `0.00` | Stock físico actual en bodega. |
| `stock_minimo` | `NUMERIC(10,2)` | `NOT NULL` | `0.00` | Nivel mínimo de alerta de stock bajo. |
| `ultima_actualizacion` | `TIMESTAMP` | `NOT NULL` | `CURRENT_TIMESTAMP` | Última fecha en que se mutó la cantidad disponible. |

---

### Tabla: `ajustes_inventario`
Auditoría histórica de movimientos e incrementos/decrementos manuales aplicados al stock.

| Campo | Tipo de Dato | Restricciones | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | *Auto-incremental* | Identificador único del ajuste. |
| `material_id` | `INT` | `NOT NULL`, `FOREIGN KEY` | *Ninguno* | Relaciona con `materiales(id)` (ON DELETE RESTRICT). |
| `cantidad_anterior` | `NUMERIC(10,2)` | `NOT NULL` | *Ninguno* | Stock que existía antes de aplicar la modificación. |
| `cantidad_nueva` | `NUMERIC(10,2)` | `NOT NULL` | *Ninguno* | Stock final asignado al insumo. |
| `tipo_ajuste` | `VARCHAR(30)` | `NOT NULL` | *Ninguno* | Justificación conceptual ('AJUSTE FISICO', 'REGISTRO DE INGRESO'). |
| `observaciones` | `TEXT` | `NOT NULL` | *Ninguno* | Explicación descriptiva y obligatoria del ajuste. |
| `fecha_ajuste` | `TIMESTAMP` | `NOT NULL` | `CURRENT_TIMESTAMP` | Marca temporal en la que se aplicó el cambio. |

---

### Tabla: `pedidos`
Encabezado de las órdenes de producción de casetones solicitados a la fábrica.

| Campo | Tipo de Dato | Restricciones | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | *Auto-incremental* | Identificador único del pedido. |
| `numero_pedido` | `VARCHAR(50)` | `NOT NULL`, `UNIQUE` | *Ninguno* | Código alfanumérico visible de la orden. |
| `proveedor_id` | `INT` | `NOT NULL`, `FOREIGN KEY` | *Ninguno* | Relaciona con `proveedores(id)` (ON DELETE RESTRICT). |
| `tipo_caseton` | `VARCHAR(100)` | `NOT NULL` | *Ninguno* | Tipo de casetón solicitado (lona, icopor, guadua). |
| `cantidad_casetones` | `INT` | `NOT NULL`, `CHECK (> 0)` | *Ninguno* | Volumen total de casetones a producir. |
| `estado_actual` | `estado_pedido` | `NOT NULL` | `'Pendiente'` | Estado del ciclo del pedido. |
| `observaciones` | `TEXT` | *Opcional* | *Null* | Anotaciones opcionales asociadas a la orden. |
| `fecha_creacion` | `TIMESTAMP` | `NOT NULL` | `CURRENT_TIMESTAMP` | Fecha de creación del pedido. |

---

### Tabla: `detalle_pedidos`
Tabla intermedia que define los insumos consumidos por receta según la orden de producción.

| Campo | Tipo de Dato | Restricciones | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | *Auto-incremental* | Identificador único del detalle. |
| `pedido_id` | `INT` | `NOT NULL`, `FOREIGN KEY` | *Ninguno* | Relaciona con `pedidos(id)` (ON DELETE CASCADE). |
| `material_id` | `INT` | `NOT NULL`, `FOREIGN KEY` | *Ninguno* | Relaciona con `materiales(id)` (ON DELETE RESTRICT). |
| `cantidad_solicitada` | `NUMERIC(10,2)` | `NOT NULL`, `CHECK (> 0)` | *Ninguno* | Cantidad de insumo reservada para la orden. |

---

## 3. Procedimientos Almacenados (Stored Procedures)

Las transacciones operativas del sistema se centralizan en la base de datos mediante sentencias `CALL`:

### A. `sp_registrar_proveedor`
*   **Parámetros:** `p_nit`, `p_razon_social`, `p_contacto`, `p_telefono`, `p_correo`, `p_direccion`
*   **Acción:** Inserta una fila en `proveedores` en estado `'ACTIVO'`.

### B. `sp_modificar_proveedor`
*   **Parámetros:** `p_id`, `p_razon_social`, `p_contacto`, `p_telefono`, `p_correo`, `p_direccion`
*   **Acción:** Actualiza los atributos del proveedor por ID. Excluye el campo `nit` para garantizar su inmutabilidad.

### C. `sp_desactivar_proveedor`
*   **Parámetros:** `p_id`
*   **Acción:** Aplica un borrado lógico cambiando el estado de habilitación del proveedor a `'INACTIVO'`.

### D. `sp_registrar_pedido_produccion`
*   **Parámetros:** `p_numero_pedido`, `p_proveedor_id`, `p_tipo_caseton`, `p_cantidad`, `p_observaciones`
*   **Acción:**
    1. Valida que el proveedor asociado exista y se encuentre `'ACTIVO'`.
    2. Registra el encabezado del pedido en estado `'Pendiente'`.
    3. Calcula y llena el consumo detallado en `detalle_pedidos` según las recetas de producción:
        *   **Casetón de Lona:** 24 m lineales de Madera + 6.90 m² de Lona por unidad.
        *   **Casetón de Icopor:** 6 m² de Icopor + 1 unidad de Bloque + 7 m² de Lona Negra por unidad.
        *   **Casetón de Guadua:** 24 m lineales de Madera + 20 m lineales de Guadua por unidad.

### E. `sp_actualizar_estado_pedido`
*   **Parámetros:** `p_pedido_id`, `p_nuevo_estado`
*   **Acción:**
    1. Verifica la existencia del pedido.
    2. Si transiciona al estado `'En producción'` por primera vez, valida la disponibilidad suficiente en `materiales` para cubrir los insumos registrados en `detalle_pedidos`. Si no hay suficiente stock, aborta la transacción (`RAISE EXCEPTION`).
    3. Si cuenta con stock suficiente, descuenta las cantidades del inventario en `materiales` y cambia el estado a `'En producción'`.

### F. `sp_ajustar_inventario_manual`
*   **Parámetros:** `p_material_id`, `p_nueva_cantidad`, `p_observaciones`
*   **Acción:**
    1. Valida que el campo `observaciones` no esté vacío.
    2. Obtiene y almacena el stock actual del material.
    3. Sobrescribe la cantidad en bodega con `p_nueva_cantidad`.
    4. Inserta un registro en `ajustes_inventario` con tipo `'AJUSTE FISICO'` para fines de auditoría.

---

## 4. Índices para Optimización del Desempeño

Se crearon índices sobre columnas consultadas con frecuencia o con alta cardinalidad en cláusulas de búsqueda y ordenación:

*   **`idx_proveedores_razon_social`**: Optimiza las búsquedas textuales de proveedores por su nombre comercial.
*   **`idx_proveedores_estado`**: Acelera la filtración de proveedores operativos (`ACTIVO`).
*   **`idx_pedidos_proveedor_id`**: Optimiza las consultas asociadas que relacionan órdenes de producción con sus proveedores.
*   **`idx_pedidos_estado_actual`**: Agiliza la búsqueda y segmentación del tablero Kanban por fases del pedido.
*   **`idx_pedidos_fecha_creacion`**: Acelera las consultas ordenadas cronológicamente para reportes de producción.
*   **`idx_detalle_pedidos_pedido`** e **`idx_detalle_pedidos_material`**: Optimizan los cruces de uniones (`JOIN`) en la liquidación de recetas.

---

## 5. Vistas Auxiliares

### Vista: `vista_alertas_stock`
Esta vista calcula dinámicamente si el stock físico de un insumo ha caído por debajo del margen de seguridad definido.
*   **Definición:**
    ```sql
    SELECT id, 
           nombre_material, 
           cantidad_disponible, 
           stock_minimo, 
           (cantidad_disponible <= stock_minimo) AS requiere_reabastecimiento
    FROM materiales;
    ```
*   **Uso principal:** Notificar visualmente en el panel del administrador qué materiales requieren de reabastecimiento inmediato.
