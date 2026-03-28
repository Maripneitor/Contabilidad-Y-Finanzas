# Nexium SAS - Documentación del Proyecto Contable

## 1. Descripción de la Aplicación
Nexium SAS es una plataforma contable moderna desarrollada para la gestión automatizada de transacciones y la generación de estados financieros en tiempo real. La aplicación permite el registro de asientos contables por partida doble (cargos y abonos), manteniendo el equilibrio patrimonial de forma estricta.

## 2. Transacciones Contables Implementadas
La aplicación viene pre-configurada con los asientos requeridos por la actividad de aprendizaje, accesibles mediante la función **"Restaurar Clase"**:

1.  **Asiento de Apertura**: Registro inicial de activos (Caja, Bancos, Inventarios, etc.) contra el Capital Social.
2.  **Compra en Efectivo**: Adquisición de mercancías con salida directa de bancos/caja inclusive IVA acreditable.
3.  **Compra a Crédito**: Compra delegada a proveedores con registro de IVA por acreditar.
4.  **Compra Combinada (Mixta)**: Transacción que involucra un pago parcial al contado y el saldo a crédito.
5.  **Anticipo de Clientes**: Registro del pasivo por obligaciones futuras con clientes.
6.  **Compra de Papelería**: Registro en el activo diferido (Otros Activos) para su posterior amortización.
7.  **Rentas Pagadas por Anticipado**: Registro del derecho de uso de inmuebles pagado por adelantado.

## 3. Catálogo de Cuentas
El sistema incluye un catálogo estructurado en:
*   **Activo**: Circulante, No Circulante (Fijo) y Diferido (Otros Activos).
*   **Pasivo**: Corto Plazo e IVA por trasladar.
*   **Capital**: Capital Social y Resultados (Utilidad/Pérdida).
*   **Resultados**: Ingresos y Egresos operativos.

## 4. Estado de Situación Financiera (Balance General)
El reporte generado cumple con el formato oficial (NIF):
*   **Encabezado**: Nombre de la empresa, título del reporte y fecha de corte.
*   **Cuerpo**: Clasificación tripartita de activos, pasivos y capital contable.
*   **Pie**: Espacio para firmas de quien "Elaboró" (Mario Efraín) y quien "Autorizó" (Nuria Gonzalez).

## 5. Instrucciones para Evidencia (PDF)
1.  Inicie la aplicación y haga clic en **"Restaurar Clase"** para cargar los 19 asientos predefinidos.
2.  Navegue al **"Libro Diario"** para visualizar los registros de cada transacción (se pueden tomar capturas desde aquí).
3.  Navegue al **"Balance General"**.
4.  Haga clic en el botón superior **"Exportar PDF"**. El sistema generará automáticamente un documento con la estructura profesional requerida.

---
**Desarrollado por**: Antigravity AI
**Proyecto**: Contabilidad y Finanzas - Nexium SAS
