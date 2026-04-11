import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ title, children }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-black font-headline text-primary uppercase tracking-tighter border-l-4 border-primary pl-4">{title}</h3>
        <div className="text-sm text-on-surface-variant leading-relaxed pl-5 space-y-3">
            {children}
        </div>
    </div>
);

const GuiaAcademica = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-12 pb-20"
        >
            <header className="text-center">
                <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">Fundamentos de Contabilidad - Nexium Education</p>
                <h1 className="text-5xl font-black font-headline tracking-tightest text-on-surface mb-4">
                    Guía de <span className="text-primary italic">Ajustes Contables</span>
                </h1>
                <div className="h-1 w-24 bg-primary mx-auto rounded-full"></div>
            </header>

            <div className="bg-surface-container-lowest p-10 rounded-[3rem] border border-surface-container shadow-2xl space-y-10">
                <Section title="2.1 Tipos de Ajustes y Proceso">
                    <p>
                        <strong>1. El proceso de ajustes contables:</strong> Es el procedimiento que se realiza al final de un periodo contable para actualizar los saldos de las cuentas, asegurando que los ingresos y gastos se registren en el periodo correcto (Principio de Devengación).
                    </p>
                    <p>
                        <strong>2. Tipos de ajustes:</strong> Se dividen principalmente en Diferidos (pagos o cobros por anticipado), Devengados (gastos o ingresos no registrados aún), y Estimaciones (como depreciaciones o cuentas incobrables).
                    </p>
                    <p>
                        <strong>3. Gastos pagados por anticipado:</strong> Activos que representan un beneficio futuro. Al consumirse el beneficio (como la renta o papelería), se convierten en gastos mediante un asiento de ajuste.
                    </p>
                    <p>
                        <strong>4. Ingresos cobrados por anticipado:</strong> Pasivos que representan la obligación de entregar un bien o servicio. A medida que se cumple la obligación, se reconocen como ingresos reales.
                    </p>
                    <p>
                        <strong>5. Balanza ajustada:</strong> Es el documento que muestra los saldos finales de todas las cuentas después de haber aplicado los asientos de ajuste, sirviendo como base directa para los Estados Financieros.
                    </p>
                </Section>

                <Section title="2.2 Elaboración de Estados Financieros">
                    <p>
                        <strong>1. Los estados financieros básicos:</strong> Incluyen el Balance General (Situación Financiera), Estado de Resultados (Desempeño), Variaciones en el Capital y Flujo de Efectivo.
                    </p>
                    <p>
                        <strong>2. El Balance General (Estructura):</strong>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Encabezado:</strong> Nombre de la empresa, nombre del estado y fecha.</li>
                            <li><strong>Cuerpo:</strong> Listado de Activos, Pasivos y Capital debidamente clasificados.</li>
                            <li><strong>Pie:</strong> Firmas de quien elaboró y quien autorizó el reporte.</li>
                        </ul>
                    </p>
                </Section>

                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                    <h4 className="text-xs font-black uppercase text-primary mb-2">Nota Académica</h4>
                    <p className="text-xs italic text-outline">
                        Esta aplicación Nexium ha sido diseñada para automatizar estos procesos, generando el Libro Diario, Libro Mayor, Balanza Ajustada, Estado de Resultados y Balance General con todos los ajustes requeridos por el estándar académico.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default GuiaAcademica;
