# DOCUMENTO DE ESPECIFICACIÓN DE REQUISITOS 
**Proyecto Académico:** Casetech (Sistema de Gestión de Casetones)  

---

## 1. INTRODUCCIÓN
* **Objetivo del sistema:** Centralizar y optimizar la gestión operativa de la fábrica de casetones, sustituyendo los procesos manuales e informales basados en hojas de cálculo y documentos de texto.
* **Alcance:** El sistema abarcará de manera integral el control de autenticación de seguridad, la administración de la red de proveedores, la trazabilidad del ciclo de vida de los pedidos y el monitoreo del stock de materias primas básicas (madera, lona, icopor, guadua) según las tipologías de casetón fabricadas por la empresa.

---

## 2. ACTORES DEL SISTEMA
* [cite_start]**Administrador:** Usuario de nivel operativo y gerencial que cuenta con privilegios totales para registrar, modificar, consultar y aplicar el borrado lógico de información en todos los módulos del sistema[cite: 32, 188, 189].

---

## 3. REQUISITOS FUNCIONALES (RF)
*Estructura reglamentaria: El sistema deberá + verbo medible + objeto + condición.* 

### Módulo 0: Autenticación y Seguridad
* **RF-01:** El sistema deberá validar el ingreso de los usuarios administradores mediante un formulario de inicio de sesión que solicite el correo electrónico y la contraseña en texto plano[cite: 88, 176].
* **RF-02:** El sistema deberá restringir el acceso a los módulos internos de proveedores, pedidos e inventarios a aquellos usuarios que no cuenten con una sesión activa y válida en la plataforma.

### Módulo 1: Gestión de Proveedores
* **RF-03:** El sistema deberá registrar nuevos proveedores almacenando de forma obligatoria el NIT, razón social, contacto completo, teléfono, correo electrónico y dirección, asignando el estado 'ACTIVO' de forma automática por defecto.
* **RF-04:** El sistema deberá consultar la lista completa de proveedores registrados y permitir búsquedas filtradas por los campos de nombre, razón social o identificación (NIT).
* **RF-05:** El sistema deberá actualizar la información de contacto de un proveedor existente (razón social, contacto, teléfono, correo y dirección) a través de su identificador ID, bloqueando de forma estricta la alteración del campo NIT para mantener la consistencia de los datos.
* **RF-06:** El sistema deberá aplicar un borrado lógico a los proveedores seleccionados, modificando su estado a 'INACTIVO' mediante un procedimiento almacenado para preservar el histórico transaccional de compras.

###  Módulo 2: Pedidos y Compras
* **RF-07:** El sistema deberá registrar nuevos pedidos de producción vinculando de manera obligatoria un proveedor activo, los materiales solicitados, la cantidad exacta y observaciones del requerimiento.
* **RF-08:** El sistema deberá actualizar el estado de producción de cada pedido de manera secuencial utilizando únicamente los estados: 'Pendiente', 'En producción', 'En proceso de entrega', 'Entregado' o 'Cancelado'.
* **RF-09:** El sistema deberá generar un historial completo de pedidos que permita realizar consultas y filtrados dinámicos por fecha de creación, proveedor asociado o estado actual del proceso.

###  Módulo 3: Control de Inventarios
* **RF-10:** El sistema deberá registrar los materiales base de la fábrica (madera por metros lineales, lona por metros cuadrados, grapas y puntillas por unidades, alambre e icopor) clasificándolos por categorías y definiendo un stock mínimo de seguridad[cite: 176].
* **RF-11:** El sistema deberá actualizar la cantidad disponible de materiales en el inventario general cuando se procese un nuevo pedido de producción o se realice un ajuste por conteo físico.
* **RF-12:** El sistema deberá notificar alertas visuales en el panel principal de la interfaz cuando la cantidad de un material sea igual o inferior al stock mínimo configurado.

---

## 4. REQUISITOS NO FUNCIONALES (RNF)
*Estructura reglamentaria: El sistema deberá ser + característica medible (Calidad, Seguridad, Rendimiento).*

* **RNF-01 (Arquitectura de Software):** El sistema deberá ser desarrollado bajo una arquitectura monolítica estructurada en 3 capas, separando la interfaz de presentación (React), la lógica del servicio (FastAPI) y la persistencia de datos.
* **RNF-02 (Rendimiento de Datos):** El sistema deberá procesar las operaciones operacionales del CRUD y las consultas de reportes analíticos en un tiempo menor a 3 segundos utilizando llamados de tipo `CALL` hacia procedimientos almacenados.
* **RNF-03 (Compatibilidad):** La aplicación web deberá ser compatible y visualizarse correctamente en los navegadores Google Chrome y Microsoft Edge.
* **RNF-04 (Diseño Adaptable/Usabilidad):** La interfaz gráfica deberá ser responsiva, adaptándose automáticamente a las resoluciones de dispositivos móviles y computadores de escritorio
* **RNF-05 (Persistencia Relacional):** El sistema deberá almacenar la información de forma persistente y estructurada haciendo uso del motor de base de datos **PostgreSQL**

---

## 5. RESTRICCIONES
* **Base de datos:** Todas las restricciones de unicidad (como el NIT o correo único) y la lógica operativa de inserción deben ser controladas de manera nativa por PostgreSQL mediante *Constraints* y *Stored Procedures*.
* **Seguridad temporal:** Con fines de agilidad en la etapa de desarrollo actual, la validación de accesos se realizará mediante comparación de cadenas en texto plano, omitiendo temporalmente el uso de algoritmos de cifrado de contraseñas.