#  PRODUCT BACKLOG E HISTORIAS DE USUARIO 
**Proyecto Académico:** Casetech (Sistema de Gestión de Casetones) 

---

## MÓDULO 0: AUTENTICACIÓN Y SEGURIDAD

### HU01: Iniciar Sesión
* **Como** Administrador de la plataforma,
* **Quiero** ingresar mis credenciales de acceso en el formulario de login,
* **Para** acceder de manera segura al panel de administración de Casetech.
* **Criterios de Aceptación:**
  * **Caso Exitoso:** *Dado que* el administrador se encuentra en la interfaz de Login, *cuando* ingresa un correo existente y la contraseña correcta en texto plano, *entonces* el sistema le concede acceso al panel principal.
  * **Caso Datos Erróneos:** *Dado que* el usuario ingresa una contraseña incorrecta o un correo no registrado, *cuando* presiona el botón "Ingresar al Panel", *entonces* el sistema bloquea el acceso y muestra el mensaje de error "Credenciales incorrectas".

### HU06: Cerrar Sesión
* **Como** Administrador autenticado,
* **Quiero** dar clic en el botón de cerrar sesión,
* **Para** destruir la sesión activa y evitar que terceros manipulen la información.
* **Criterios de Aceptación:**
  * **Caso Exitoso:** *Dado que* el administrador tiene una sesión activa, *cuando* hace clic en "Cerrar Sesión", *entonces* el sistema limpia los estados temporales y lo redirige automáticamente al formulario de Login.

---

##  MÓDULO 1: GESTIÓN DE PROVEEDORES

### HU02: Registrar Proveedor
* **Como** Administrador de la plataforma,
* **Quiero** registrar un nuevo proveedor con sus datos comerciales,
* **Para** agregarlo a la red de contactos y habilitar compras asociadas.
* **Criterios de Aceptación:**
  * **Caso Exitoso:** *Dado que* el administrador está en el formulario de proveedores, *cuando* digita un NIT único, razón social, contacto, teléfono, correo y dirección válidos, *entonces* el sistema ejecuta internamente el procedimiento `sp_registrar_proveedor` mediante `CALL` y guarda el registro con el estado 'ACTIVO'.
  * **Caso NIT Duplicado:** *Dado que* el NIT ingresado ya pertenece a un proveedor registrado, *cuando* el administrador guarda los datos, *entonces* la base de datos restringe la inserción y el backend retorna un error JSON informando la duplicidad.

### HU03: Consultar Lista de Proveedores
* **Como** Administrador de la plataforma,
* **Quiero** visualizar una tabla con la lista completa de proveedores y poder buscarlos por su nombre, empresa o NIT,
* **Para** auditar rápidamente los datos generales o encontrar un proveedor específico.
* **Criterios de Aceptación:**
  * **Caso Exitoso (Lista):** *Dado que* el administrador ingresa a la sección de proveedores, *cuando* carga la vista, *entonces* el sistema lista los registros en una tabla interactiva en menos de 3 segundos.
  * **Caso Filtro de Búsqueda:** *Dado que* el administrador digita un NIT en la barra de búsqueda, *cuando* el sistema procesa el texto, *entonces* la tabla se actualiza mostrando únicamente las coincidencias exactas.

### HU04: Modificar Información de Proveedor
* **Como** Administrador de la plataforma,
* **Quiero** editar los datos de contacto de un proveedor existente,
* **Para** mantener actualizada la base de datos operativa de la empresa.
* **Criterios de Aceptación:**
  * **Caso Exitoso:** *Dado que* el administrador selecciona un proveedor y edita los campos en el formulario, *cuando* guarda los cambios, *entonces* se invoca el procedimiento `sp_modificar_proveedor` actualizando los datos en PostgreSQL.
  * **Caso Restricción de Llave:** *Dado que* el formulario de edición está abierto, *cuando* el administrador intente alterar el campo del NIT, *entonces* el sistema mantendrá dicho campo bloqueado (Read-Only) para garantizar la integridad referencial.

### HU05: Desactivar Proveedor (Eliminación Lógica)
* **Como** Administrador de la plataforma,
* **Quiero** inactivar a un proveedor del sistema en lugar de borrarlo físicamente,
* **Para** suspender relaciones comerciales sin perder el historial de transacciones anteriores.
* **Criterios de Aceptación:**
  * **Caso Exitoso:** *Dado que* el administrador selecciona un proveedor activo y confirma su desactivación, *cuando* la base de datos procesa el comando `CALL sp_desactivar_proveedor(:id)`, *entonces* el estado del registro cambia a 'INACTIVO' y el frontend lo resalta visualmente.

---

## MÓDULO 2: PEDIDOS Y COMPRAS

### HU07: Registrar Pedido de Producción
* **Como** Administrador de la fábrica,
* **Quiero** crear un nuevo pedido asociando un proveedor y las materias primas requeridas,
* **Para** iniciar y documentar el ciclo de fabricación de casetones de forma organizada.
* **Criterios de Aceptación:**
  * **Caso Exitoso:** *Dado que* el administrador se encuentra en la vista de registro de pedidos, *cuando* selecciona un proveedor activo, detalla las cantidades de materiales y confirma, *entonces* el sistema guarda el registro en la base de datos asignando automáticamente el estado 'Pendiente'.
  * **Caso Validación de Tercero:** *Dado que* un proveedor se encuentra en estado 'INACTIVO', *cuando* el administrador intente crear un pedido para él, *entonces* el sistema no lo incluirá en el listado de opciones de selección.

### HU08: Actualizar Estado de Producción
* **Como** Administrador de la fábrica,
* **Quiero** cambiar secuencialmente el estado del pedido,
* **Para** monitorear con exactitud la etapa operativa del ciclo de vida del producto.
* **Criterios de Aceptación:**
  * **Caso Exitoso:** *Dado que* el administrador abre el detalle de un pedido, *cuando* selecciona un estado de la lista permitida ('Pendiente', 'En producción', 'En proceso de entrega', 'Entregado', 'Cancelado') y actualiza, *entonces* los cambios se guardan y reflejan de inmediato en las consultas.

### HU09: Consultar Historial de Pedidos
* **Como** Administrador de la fábrica,
* **Quiero** acceder a un historial parametrizado por fecha, proveedor o estado,
* **Para** evaluar los tiempos de entrega y auditar las compras hechas por la empresa.
* **Criterios de Aceptación:**
  * **Caso Exitoso:** *Dado que* el administrador ingresa al historial, *cuando* selecciona el filtro "En producción", *entonces* la aplicación filtra y expone exclusivamente las órdenes activas en fabricación.

---

## MÓDULO 3: CONTROL DE INVENTARIOS

### HU10: Registrar Materiales de Fabricación
* **Como** Administrador de la fábrica,
* **Quiero** dar de alta materias primas indicando su unidad de medida y stock mínimo de seguridad,
* **Para** estructurar el catálogo de materiales requeridos en la planta.
* **Criterios de Aceptación:**
  * **Caso Exitoso:** *Dado que* el administrador usa el formulario de insumos, *cuando* ingresa un material (ej. Madera, Unidad: metros lineales, Stock mínimo: 24), *entonces* el sistema guarda el registro de manera persistente en PostgreSQL.

### HU11: Actualizar Cantidades (Descuento Automático por Receta de Casetón)
* **Como** Administrador de la fábrica,
* **Quiero** que el sistema reste de forma automática los insumos del inventario según el tipo de casetón aprobado,
* **Para** mantener las existencias digitales alineadas perfectamente con el stock físico.
* **Criterios de Aceptación:**
  * **Caso Exitoso (Casetón de Lona):** *Dado que* un pedido cambia su estado a 'En producción' para fabricar un Casetón 2M x 2M de Lona, *cuando* el backend procesa la transacción, *entonces* descuenta de la base de datos exactamente 24 metros lineales de madera y 6.9 m² de lona.

### HU12: Visualizar Alertas de Stock Bajo
* **Como** Administrador de la fábrica,
* **Quiero** percibir alertas visuales en la interfaz cuando un material esté al límite del stock mínimo,
* **Para** programar el reabastecimiento con los proveedores antes de desabastecer la línea de producción.
* **Criterios de Aceptación:**
  * **Caso Exitoso:** *Dado que* las existencias de un material caen a un nivel menor o igual a su stock mínimo configurado, *cuando* el administrador entra a la aplicación, *entonces* el sistema destaca el insumo afectado con una alerta de color rojo intenso.

---

## MATRIZ GENERAL DE PRIORIZACIÓN DE BACKLOG

| ID | Historia de Usuario | Clasificación MoSCOW | Valor de Negocio | Esfuerzo Técnico | Destino / Sprint |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **HU01** | Iniciar Sesión (Texto Plano) | **MUST HAVE** | Alto | Bajo | Sprint 1 |
| **HU02** | Registrar Proveedor (`CALL`) | **MUST HAVE** | Alto | Medio | Sprint 1 |
| **HU03** | Consultar Lista de Proveedores | **MUST HAVE** | Alto | Bajo | Sprint 1 |
| **HU07** | Registrar Pedido de Producción | **MUST HAVE** | Alto | Medio | Sprint 2 |
| **HU10** | Registrar Materiales de Fabricación | **MUST HAVE** | Alto | Bajo | Sprint 2 |
| **HU11** | Actualizar Cantidades de Inventario | **MUST HAVE** | Alto | Alto | Sprint 2 |
| **HU04** | Modificar Información de Proveedor | **SHOULD HAVE** | Medio | Medio | Sprint 3 |
| **HU05** | Desactivar Proveedor (Borrado Lógico) | **SHOULD HAVE** | Medio | Bajo | Sprint 3 |
| **HU08** | Actualizar Estado de Producción | **SHOULD HAVE** | Medio | Bajo | Sprint 3 |
| **HU09** | Consultar Historial de Pedidos | **SHOULD HAVE** | Medio | Medio | Sprint 3 |
| **HU06** | Cerrar Sesión | **COULD HAVE** | Bajo | Bajo | Sprint 4 |
| **HU12** | Visualizar Alertas de Stock Bajo | **COULD HAVE** | Bajo | Bajo | Sprint 4 |4