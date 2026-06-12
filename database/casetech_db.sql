-- =============================================================================
-- PROYECTO ACADÉMICO ADSO - CASETECH (Sistema de Gestión de Casetones)
-- SCRIPT UNIFICADO DE BASE DE DATOS (POSTGRESQL)
-- =============================================================================

-- 1. CREACIÓN DE TIPOS ENUM PERSONALIZADOS
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rol_enum') THEN
        CREATE TYPE rol_enum AS ENUM ('ADMINISTRADOR');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_enum') THEN
        CREATE TYPE estado_enum AS ENUM ('ACTIVO', 'INACTIVO');
    END IF;
END $$;

-- 2. RECREACIÓN LIMPIA DE TABLAS (Eliminación en cascada)
DROP TABLE IF EXISTS proveedores CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- =============================================================================
-- ESTRUCTURA DE TABLAS (POSTGRESQL)
-- =============================================================================

-- Tabla de Usuarios (Administradores)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol rol_enum DEFAULT 'ADMINISTRADOR',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Proveedores (con borrado lógico y relación al Administrador)
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


-- =============================================================================
-- INSERCIÓN DE DATOS SEMILLA (SEEDERS)
-- =============================================================================

-- Inserción de Administradores (Contraseñas en texto plano)
INSERT INTO usuarios (nombre, correo, password, rol) 
VALUES 
('Luis Pérez (Admin)', 'luis.admin@casetech.com', 'admin123', 'ADMINISTRADOR'),
('María Gómez (Admin)', 'maria.admin@casetech.com', 'password123', 'ADMINISTRADOR');

-- Inserción de Proveedores
INSERT INTO proveedores (nit, razon_social, contacto_completo, telefono, correo, direccion, estado, usuario_id)
VALUES
('901.234.567-1', 'Cemetcol S.A.S.', 'Juan Pérez', '3001234567', 'contacto@cemetcol.com', 'Calle 45 #12-34', 'ACTIVO', 1),
('800.987.654-3', 'Aceros de los Andes Ltda.', 'Marta Gómez', '3159876543', 'ventas@acerosandes.com', 'Carrera 15 #80-20', 'ACTIVO', 1),
('900.111.222-5', 'Plásticos del Caribe', 'Carlos Restrepo', '3201112222', 'carlos.restrepo@empaquescaribe.com', 'Avenida El Libertador #40-50', 'INACTIVO', 2);


-- =============================================================================
-- PROCEDIMIENTOS ALMACENADOS OPERACIONALES (CRUD)
-- =============================================================================

-- Procedimiento: Registrar un Proveedor
CREATE OR REPLACE PROCEDURE sp_registrar_proveedor(
    p_nit VARCHAR(20),
    p_razon_social VARCHAR(100),
    p_contacto_completo VARCHAR(150),
    p_telefono VARCHAR(20),
    p_correo VARCHAR(100),
    p_direccion VARCHAR(150),
    p_estado estado_enum,
    p_usuario_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO proveedores (
        nit, 
        razon_social, 
        contacto_completo, 
        telefono, 
        correo, 
        direccion, 
        estado, 
        usuario_id
    )
    VALUES (
        p_nit, 
        p_razon_social, 
        p_contacto_completo, 
        p_telefono, 
        p_correo, 
        p_direccion, 
        p_estado, 
        p_usuario_id
    );
END;
$$;

-- Procedimiento: Modificar un Proveedor
-- NOTA: De acuerdo con HU04, no se permite la alteración del NIT ya que
-- funciona como identificador invariable del proveedor.
CREATE OR REPLACE PROCEDURE sp_modificar_proveedor(
    p_id INT,
    p_razon_social VARCHAR(100),
    p_contacto_completo VARCHAR(150),
    p_telefono VARCHAR(20),
    p_correo VARCHAR(100),
    p_direccion VARCHAR(150),
    p_estado estado_enum
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE proveedores
    SET razon_social = p_razon_social,
        contacto_completo = p_contacto_completo,
        telefono = p_telefono,
        correo = p_correo,
        direccion = p_direccion,
        estado = p_estado
    WHERE id = p_id;
END;
$$;

-- Procedimiento: Desactivar un Proveedor (Borrado Lógico)
-- Cambia de forma lógica el estado del proveedor a 'INACTIVO'
CREATE OR REPLACE PROCEDURE sp_desactivar_proveedor(
    p_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE proveedores
    SET estado = 'INACTIVO'
    WHERE id = p_id;
END;
$$;


-- =============================================================================
-- FUNCIONES ALMACENADAS ANALÍTICAS (REPORTES)
-- =============================================================================

-- Función: Resumen General de Proveedores
-- En PostgreSQL se prefiere retornar TABLE en lugar de usar procedimientos para conjuntos de datos
CREATE OR REPLACE FUNCTION sp_analitica_resumen_proveedores()
RETURNS TABLE (
    total_proveedores BIGINT,
    activos BIGINT,
    inactivos BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*),
        COALESCE(SUM(CASE WHEN estado = 'ACTIVO' THEN 1 ELSE 0 END), 0)::BIGINT,
        COALESCE(SUM(CASE WHEN estado = 'INACTIVO' THEN 1 ELSE 0 END), 0)::BIGINT
    FROM proveedores;
END;
$$;

-- Función: Proveedores registrados por cada Administrador
CREATE OR REPLACE FUNCTION sp_analitica_proveedores_por_usuario()
RETURNS TABLE (
    usuario_id INT,
    administrador VARCHAR(100),
    correo_administrador VARCHAR(100),
    total_proveedores_registrados BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.nombre,
        u.correo,
        COUNT(p.id)
    FROM usuarios u
    LEFT JOIN proveedores p ON u.id = p.usuario_id
    WHERE u.rol = 'ADMINISTRADOR'
    GROUP BY u.id, u.nombre, u.correo;
END;
$$;

-- Función: Tendencia de Registros Mensuales
CREATE OR REPLACE FUNCTION sp_analitica_tendencia_registros()
RETURNS TABLE (
    anio INT,
    mes INT,
    total_registros BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        EXTRACT(YEAR FROM fecha_registro)::INT AS anio,
        EXTRACT(MONTH FROM fecha_registro)::INT AS mes,
        COUNT(*) AS total_registros
    FROM proveedores
    GROUP BY EXTRACT(YEAR FROM fecha_registro), EXTRACT(MONTH FROM fecha_registro)
    ORDER BY anio DESC, mes DESC;
END;
$$;


-- =============================================================================
-- EJEMPLOS DE USO EN TRABAJO DIARIO (SENTENCIAS SQL COMENTADAS)
-- =============================================================================

-- Para probar el script en pgAdmin 4, puedes ejecutar las siguientes consultas:

-- 1. Listar el estado actual de las tablas
-- SELECT * FROM usuarios;
-- SELECT * FROM proveedores;

-- 2. Probar la creación de un nuevo proveedor usando el Procedimiento Almacenado
-- CALL sp_registrar_proveedor('900.555.666-8', 'Ladrillera del Campo', 'Pedro Gómez', '3105556666', 'pedro.gomez@ladrillera.com', 'Autopista Norte KM 10', 'ACTIVO', 1);

-- 3. Probar la edición de un proveedor existente (ej: Proveedor ID 1)
-- CALL sp_modificar_proveedor(1, 'Cemetcol S.A.S. Modificado', 'Juan Pérez Restrepo', '3009998877', 'nuevo.correo@cemetcol.com', 'Calle 45 #12-34 Oficina 101', 'ACTIVO');

-- 4. Probar la desactivación de un proveedor (borrado lógico de Proveedor ID 2)
-- CALL sp_desactivar_proveedor(2);

-- 5. Probar la función analítica del resumen de proveedores
-- SELECT * FROM sp_analitica_resumen_proveedores();

-- 6. Probar la función de conteo de proveedores por administrador
-- SELECT * FROM sp_analitica_proveedores_por_usuario();

-- 7. Probar la tendencia de registros mensuales de proveedores
-- SELECT * FROM sp_analitica_tendencia_registros();
