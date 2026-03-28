# Nexium Contabilidad & Finanzas

Sistema de Contabilidad General para la gestión financiera de **Nexium, S.S.** El software permite llevar un control detallado de transacciones, generar balances generales y visualizar el libro diario de manera automatizada.

## 📋 Requisitos Funcionales

1.  **Registro de Transacciones:**
    *   Ingreso manual de asientos contables con validación de partida doble (Debe = Haber).
    *   Asistente inteligente para registro guiado de operaciones comunes.
    *   Acciones rápidas para entradas de dinero y gastos/compras directas.
2.  **Gestión de Datos:**
    *   Carga masiva de transacciones mediante "Hoja Maestra" en formato Excel.
    *   Modificación y eliminación de asientos contables existentes.
3.  **Reportería y Visualización:**
    *   Generación automática del **Balance General** dinámico.
    *   Visualización del **Libro Diario** con historial completo de movimientos.
    *   Filtro histórico para consultar estados financieros a fechas específicas.
4.  **Catálogo de Cuentas:**
    *   Gestión predefinida de cuentas (Caja, Bancos, Inventarios, IVA, Capital Social, etc.) organizadas por códigos.

## ⚙️ Requisitos No Funcionales

1.  **Usability (Usabilidad):** Interfaz moderna y minimalista con iconos intuitivos (Lucide React) y feedback inmediato sobre el balance de los asientos.
2.  **Responsiveness (Adaptabilidad):** Diseño adaptable para diferentes resoluciones de pantalla.
3.  **Data Integrity (Integridad):** El sistema impide guardar asientos contables que no estén cuadrados, asegurando la consistencia financiera.
4.  **Performance (Rendimiento):** Consultas optimizadas al backend para la generación de reportes en tiempo real.
5.  **Extensibility (Escalabilidad):** Arquitectura basada en componentes (React) y servicios (Express) que permite añadir nuevos reportes o tipos de cuentas fácilmente.

## 🖼️ Contenido de las Vistas

### 1. Asistente (Smart View)
*   **Propósito:** Facilitar el registro para usuarios no expertos.
*   **Contenido:** Formulario guiado que traduce lenguaje natural a movimientos contables técnicos en segundo plano.

### 2. Diario (Manual View)
*   **Propósito:** Registro técnico y detallado del "Libro Mágico".
*   **Contenido:**
    *   Campo de descripción del evento.
    *   Selector de cuenta contable por código/nombre.
    *   Entradas numéricas para "Debe (+)" y "Haber (-)".
    *   Indicador visual de estado de balance (Verde si cuadrado, Rojo si dispar).

### 3. Balance General
*   **Propósito:** Mostrar la salud financiera de la empresa en un momento dado.
*   **Contenido:**
    *   Desglose de **Activos** (Circulantes y No Circulantes).
    *   Desglose de **Pasivos** (Corto Plazo).
    *   Sección de **Capital**.
    *   Verificación automática de la Ecuación Contable (*Activo = Pasivo + Capital*).

### 4. Libro Diario (Ledger)
*   **Propósito:** Historial cronológico de todas las operaciones.
*   **Contenido:** Tabla con Fecha, Descripción, Cuentas afectadas y montos asociados a cada transacción. Permite la edición o borrado de registros.

### 5. Hoja Maestra (Excel Loader)
*   **Propósito:** Importación masiva de datos.
*   **Contenido:** Zona de arrastre de archivos Excel con validación de columnas (Fecha, Descripción, Cuenta, Debe, Haber).

### 6. Selector Histórico
*   **Propósito:** Navegación en el tiempo.
*   **Contenido:** Barra superior con hitos temporales para cambiar el contexto de todo el sistema a una fecha específica.

---
© 2026 Nexium, S.A.S. - Sistema de Gestión Contable Avanzado.
