-- 1. LIMPIEZA DE TABLAS Y TIPOS PREEXISTENTES
DROP TABLE IF EXISTS detalle_pedidos CASCADE;
DROP TABLE IF EXISTS pedidos CASCADE;
DROP TABLE IF EXISTS ajustes_inventario CASCADE;
DROP TABLE IF EXISTS materiales CASCADE;
DROP TABLE IF EXISTS proveedores CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

DROP TYPE IF EXISTS estado_usuario CASCADE;
DROP TYPE IF EXISTS estado_proveedor CASCADE;
DROP TYPE IF EXISTS estado_pedido CASCADE;

-- 2. CREACIÓN DE TIPOS ENUMERADOS
CREATE TYPE estado_usuario AS ENUM ('ACTIVO', 'INACTIVO');
CREATE TYPE estado_proveedor AS ENUM ('ACTIVO', 'INACTIVO');
CREATE TYPE estado_pedido AS ENUM ('Pendiente', 'En producción', 'En proceso de entrega', 'Entregado', 'Cancelado');

-- 3. CREACIÓN DE TABLAS

-- Tabla: Usuarios (Módulo 0: Autenticación y Seguridad)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Almacenamiento temporal en texto plano según restricciones
    rol VARCHAR(30) DEFAULT 'ADMINISTRADOR',
    estado estado_usuario DEFAULT 'ACTIVO',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Proveedores (Módulo 1: Gestión de Proveedores)
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

-- Tabla: Materiales (Módulo 3: Control de Inventarios)
CREATE TABLE materiales (
    id SERIAL PRIMARY KEY,
    nombre_material VARCHAR(100) UNIQUE NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    unidad_medida VARCHAR(20) NOT NULL, -- m lineales, m², unidades, kg, etc.
    cantidad_disponible NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    stock_minimo NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Ajustes de Inventario (Módulo 3: Historial y Ajustes Manuales - HU14)
CREATE TABLE ajustes_inventario (
    id SERIAL PRIMARY KEY,
    material_id INT NOT NULL,
    cantidad_anterior NUMERIC(10, 2) NOT NULL,
    cantidad_nueva NUMERIC(10, 2) NOT NULL,
    tipo_ajuste VARCHAR(30) NOT NULL, -- 'AJUSTE FISICO', 'REGISTRO DE INGRESO'
    observaciones TEXT NOT NULL,      -- Justificación obligatoria en texto plano
    fecha_ajuste TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ajuste_material FOREIGN KEY (material_id) REFERENCES materiales(id) ON DELETE RESTRICT
);

-- Tabla: Pedidos (Módulo 2: Pedidos y Compras)
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    numero_pedido VARCHAR(50) UNIQUE NOT NULL,
    proveedor_id INT NOT NULL,
    tipo_caseton VARCHAR(100) NOT NULL, 
    cantidad_casetones INT NOT NULL CHECK (cantidad_casetones > 0),
    estado_actual estado_pedido DEFAULT 'Pendiente',
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pedido_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE RESTRICT
);

-- Tabla Intermedia: Detalle de Consumo de Materiales por Pedido (RF-07)
CREATE TABLE detalle_pedidos (
    id SERIAL PRIMARY KEY,
    pedido_id INT NOT NULL,
    material_id INT NOT NULL,
    cantidad_solicitada NUMERIC(10, 2) NOT NULL CHECK (cantidad_solicitada > 0),
    CONSTRAINT fk_detalle_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_material FOREIGN KEY (material_id) REFERENCES materiales(id) ON DELETE RESTRICT
);

-- 4. PROCEDIMIENTOS ALMACENADOS (STORED PROCEDURES)

-- SP1: Registrar un nuevo Proveedor (HU02)
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

-- SP2: Modificar información de Proveedor existente (HU04)
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

-- SP3: Desactivar Proveedor [Borrado Lógico] (HU05)
CREATE OR REPLACE PROCEDURE sp_desactivar_proveedor(p_id INT)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE proveedores 
    SET estado = 'INACTIVO' 
    WHERE id = p_id;
END;
$$;

-- SP4: Registrar Pedido de Producción y llenar Detalle de Consumo (RF-07 / HU07)
-- Nota: La lógica del descuento automático se pospone hasta que el estado cambia a 'En producción' (HU11)
CREATE OR REPLACE PROCEDURE sp_registrar_pedido_produccion(
    p_numero_pedido VARCHAR,
    p_proveedor_id INT,
    p_tipo_caseton VARCHAR,
    p_cantidad INT,
    p_observaciones TEXT
)
LANGUAGE plpgsql AS $$
DECLARE
    v_pedido_id INT;
    v_prov_estado estado_proveedor;
    v_mat_madera_id INT;
    v_mat_lona_id INT;
    v_mat_icopor_id INT;
    v_mat_bloque_id INT;
    v_mat_lona_n_id INT;
    v_mat_guadua_id INT;
BEGIN
    -- Validar si el proveedor existe y está ACTIVO (HU07)
    SELECT estado INTO v_prov_estado FROM proveedores WHERE id = p_proveedor_id;
    IF v_prov_estado IS NULL OR v_prov_estado = 'INACTIVO' THEN
        RAISE EXCEPTION 'Operación Cancelada: El proveedor asociado está inactivo o no existe.';
    END IF;

    -- Insertar la cabecera del pedido en estado Inicial 'Pendiente'
    INSERT INTO pedidos (numero_pedido, proveedor_id, tipo_caseton, cantidad_casetones, estado_actual, observaciones)
    VALUES (p_numero_pedido, p_proveedor_id, p_tipo_caseton, p_cantidad, 'Pendiente', p_observaciones)
    RETURNING id INTO v_pedido_id;

    -- Obtener IDs de materiales requeridos para registrar las recetas
    SELECT id INTO v_mat_madera_id FROM materiales WHERE nombre_material = 'Madera';
    SELECT id INTO v_mat_lona_id FROM materiales WHERE nombre_material = 'Lona';
    SELECT id INTO v_mat_icopor_id FROM materiales WHERE nombre_material = 'Icopor';
    SELECT id INTO v_mat_bloque_id FROM materiales WHERE nombre_material = 'Bloque';
    SELECT id INTO v_mat_lona_n_id FROM materiales WHERE nombre_material = 'Lona Negra';
    SELECT id INTO v_mat_guadua_id FROM materiales WHERE nombre_material = 'Guadua';

    -- LÓGICA DE REGISTRO EN LA TABLA DETALLE DE PEDIDOS SEGÚN LA RECETA DEL CASETON
    IF p_tipo_caseton = 'Caseton de Lona' THEN
        INSERT INTO detalle_pedidos (pedido_id, material_id, cantidad_solicitada) VALUES 
        (v_pedido_id, v_mat_madera_id, 24.00 * p_cantidad),
        (v_pedido_id, v_mat_lona_id, 6.90 * p_cantidad);
        
    ELSIF p_tipo_caseton = 'Caseton de Icopor' THEN
        INSERT INTO detalle_pedidos (pedido_id, material_id, cantidad_solicitada) VALUES 
        (v_pedido_id, v_mat_icopor_id, 6.00 * p_cantidad),
        (v_pedido_id, v_mat_bloque_id, 1.00 * p_cantidad),
        (v_pedido_id, v_mat_lona_n_id, 7.00 * p_cantidad);
        
    ELSIF p_tipo_caseton = 'Caseton de Guadua' THEN
        INSERT INTO detalle_pedidos (pedido_id, material_id, cantidad_solicitada) VALUES 
        (v_pedido_id, v_mat_madera_id, 24.00 * p_cantidad),
        (v_pedido_id, v_mat_guadua_id, 20.00 * p_cantidad);
    END IF;
END;
$$;

-- SP5: Actualizar Estado del Pedido y aplicar Descuento Automático de Stock (HU08 y HU11)
-- El descuento del stock de materiales se realiza SOLAMENTE al transicionar a 'En producción'
CREATE OR REPLACE PROCEDURE sp_actualizar_estado_pedido(
    p_pedido_id INT,
    p_nuevo_estado estado_pedido
)
LANGUAGE plpgsql AS $$
DECLARE
    v_estado_anterior estado_pedido;
    v_det RECORD;
BEGIN
    -- Obtener estado actual
    SELECT estado_actual INTO v_estado_anterior FROM pedidos WHERE id = p_pedido_id;
    IF v_estado_anterior IS NULL THEN
        RAISE EXCEPTION 'Operación Cancelada: El pedido no existe.';
    END IF;

    -- Si transiciona a 'En producción' por primera vez, descontar inventario
    IF p_nuevo_estado = 'En producción' AND v_estado_anterior <> 'En producción' THEN
        
        -- 1. Validar disponibilidad de stock suficiente para todos los materiales involucrados
        FOR v_det IN (
            SELECT dp.material_id, dp.cantidad_solicitada, m.nombre_material, m.cantidad_disponible 
            FROM detalle_pedidos dp 
            JOIN materiales m ON dp.material_id = m.id 
            WHERE dp.pedido_id = p_pedido_id
        ) LOOP
            IF v_det.cantidad_disponible < v_det.cantidad_solicitada THEN
                RAISE EXCEPTION 'Stock insuficiente del material % (Disponible: %, Solicitado: %)', 
                                v_det.nombre_material, v_det.cantidad_disponible, v_det.cantidad_solicitada;
            END IF;
        END LOOP;

        -- 2. Proceder con el descuento de stock de materiales
        FOR v_det IN (
            SELECT material_id, cantidad_solicitada FROM detalle_pedidos WHERE pedido_id = p_pedido_id
        ) LOOP
            UPDATE materiales 
            SET cantidad_disponible = cantidad_disponible - v_det.cantidad_solicitada,
                ultima_actualizacion = CURRENT_TIMESTAMP
            WHERE id = v_det.material_id;
        END LOOP;
    END IF;

    -- Actualizar el estado del pedido
    UPDATE pedidos 
    SET estado_actual = p_nuevo_estado 
    WHERE id = p_pedido_id;
END;
$$;

-- SP6: Ajustar Inventario de Forma Manual con Auditoría y Observaciones (HU14)
CREATE OR REPLACE PROCEDURE sp_ajustar_inventario_manual(
    p_material_id INT,
    p_nueva_cantidad NUMERIC,
    p_observaciones TEXT
)
LANGUAGE plpgsql AS $$
DECLARE
    v_cant_anterior NUMERIC;
BEGIN
    -- Validar que las observaciones no sean vacías
    IF p_observaciones IS NULL OR TRIM(p_observaciones) = '' THEN
        RAISE EXCEPTION 'Operación Cancelada: El campo de observaciones y justificación es obligatorio.';
    END IF;

    -- Obtener cantidad anterior
    SELECT cantidad_disponible INTO v_cant_anterior FROM materiales WHERE id = p_material_id;
    IF v_cant_anterior IS NULL THEN
        RAISE EXCEPTION 'Operación Cancelada: El material no existe.';
    END IF;

    -- Actualizar cantidad disponible del material
    UPDATE materiales 
    SET cantidad_disponible = p_nueva_cantidad,
        ultima_actualizacion = CURRENT_TIMESTAMP
    WHERE id = p_material_id;

    -- Insertar en la tabla de auditoría para trazabilidad histórica
    INSERT INTO ajustes_inventario (material_id, cantidad_anterior, cantidad_nueva, tipo_ajuste, observaciones)
    VALUES (p_material_id, v_cant_anterior, p_nueva_cantidad, 'AJUSTE FISICO', p_observaciones);
END;
$$;

-- 5. CREACIÓN DE ÍNDICES PARA DESEMPEÑO Y CONSULTAS RÁPIDAS (RNF-02)
CREATE INDEX idx_proveedores_razon_social ON proveedores (razon_social);
CREATE INDEX idx_proveedores_estado ON proveedores (estado);

CREATE INDEX idx_pedidos_proveedor_id ON pedidos (proveedor_id);
CREATE INDEX idx_pedidos_estado_actual ON pedidos (estado_actual);
CREATE INDEX idx_pedidos_fecha_creacion ON pedidos (fecha_creacion);

CREATE INDEX idx_detalle_pedidos_pedido ON detalle_pedidos (pedido_id);
CREATE INDEX idx_detalle_pedidos_material ON detalle_pedidos (material_id);

-- 6. VISTAS AUXILIARES

-- Vista para control visual de alertas de Stock Bajo (HU12)
CREATE OR REPLACE VIEW vista_alertas_stock AS 
SELECT id, 
       nombre_material, 
       cantidad_disponible, 
       stock_minimo, 
       (cantidad_disponible <= stock_minimo) AS requiere_reabastecimiento
FROM materiales;

-- 7. INSERCIÓN DE DATOS DE PRUEBA Y CONFIGURACIÓN INICIAL

-- Insertar Administrador por Defecto (HU01)
INSERT INTO usuarios (correo, password, rol, estado) 
VALUES ('luis.admin@casetech.com', 'admin123', 'ADMINISTRADOR', 'ACTIVO');

-- Insertar Insumos Base de Producción con Stock de Seguridad (HU10)
INSERT INTO materiales (nombre_material, categoria, unidad_medida, cantidad_disponible, stock_minimo) VALUES
('Madera', 'Estructuras', 'm lineales', 500.00, 48.00),
('Lona', 'Cubiertas', 'm²', 200.00, 20.00),
('Icopor', 'Aislantes', 'm²', 150.00, 15.00),
('Bloque', 'Estructuras', 'unidades', 50.00, 5.00),
('Lona Negra', 'Cubiertas', 'm²', 300.00, 30.00),
('Guadua', 'Estructuras', 'm lineales', 400.00, 40.00),
('Grapas', 'Fijaciones', 'unidades', 5000.00, 1000.00),
('Puntillas', 'Fijaciones', 'unidades', 3000.00, 500.00);

-- Insertar Proveedores Iniciales (HU02)
INSERT INTO proveedores (nit, razon_social, nombre_contacto, telefono, correo, direccion, estado) VALUES
('890123456-1', 'Maderas del Caribe S.A.S.', 'Carlos Mendoza', '3157778899', 'contacto@maderascaribe.com', 'Zona Industrial Bodega 14', 'ACTIVO'),
('900987654-2', 'Suministros Textiles Bogotá', 'Elena Gómez', '3004445566', 'ventas@sumitextiles.com', 'Calle 45 # 22-10', 'ACTIVO');