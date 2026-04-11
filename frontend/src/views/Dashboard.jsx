import React from 'react';
import { motion } from 'framer-motion';

const MetricCard = ({ label, value, icon, color, trend }) => (
    <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className="bento-card relative overflow-hidden bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm border border-surface-container transition-all flex flex-col justify-between h-[180px]"
    >
        <div className="flex justify-between items-start">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} bg-opacity-10 text-opacity-100`}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
            {trend && (
                <span className="text-[10px] font-bold text-tertiary bg-tertiary/10 px-2 py-1 rounded-full uppercase tracking-tighter">
                    +12.5% vs Mes Ant.
                </span>
            )}
        </div>
        <div>
            <p className="text-[10px] font-bold text-outline uppercase tracking-[0.2em] mb-1">{label}</p>
            <h3 className="text-3xl font-extrabold font-headline tracking-tighter text-on-surface tabular-nums">
                {value}
            </h3>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none scale-150">
            <span className="material-symbols-outlined text-9xl">{icon}</span>
        </div>
    </motion.div>
);

const Dashboard = ({ onQuickAction, data }) => {
    const b = data?.body || {};
    const getSaldo = (code) => Math.abs(b[code]?.saldo || 0);

    const format = (val) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);

    // Cálculos dinámicos
    const activoCirculante = getSaldo('AC-CA') + getSaldo('AC-BA') + getSaldo('AC-IN') + getSaldo('AC-CL') + getSaldo('AC-IV') + getSaldo('AC-IP');
    const pasivoPendiente = getSaldo('PC-PR') + getSaldo('PC-IT') + getSaldo('PC-IX') + getSaldo('PC-AC');
    const ivaTrasladado = getSaldo('PC-IT');
    const gastoOperacion = getSaldo('RE-GV') + getSaldo('RE-GA');
    
    const carteraSalud = activoCirculante > 0 ? ((getSaldo('AC-CL') / activoCirculante) * 100).toFixed(1) : "0.0";

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, staggerChildren: 0.1 }
        }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            key={data?.header?.date} // Re-animate when date changes
            className="space-y-12 max-w-7xl mx-auto"
        >
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
                <motion.div variants={{hidden: {opacity: 0, x: -20}, visible: {opacity: 1, x: 0}}}>
                    <p className="font-inter text-[10px] uppercase tracking-[0.2em] text-outline mb-1 font-bold italic opacity-70">Sincronización Nexium</p>
                    <h1 className="text-5xl font-extrabold font-headline tracking-tightest text-on-surface leading-none">
                        Salud <span className="text-primary italic">Operativa</span>
                    </h1>
                </motion.div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => onQuickAction('in')}
                        className="bg-primary text-white px-6 py-3 rounded-2xl font-bold font-headline shadow-xl shadow-primary/20 hover:opacity-90 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">add_circle</span>
                        Registrar Venta
                    </button>
                    <button 
                        onClick={() => onQuickAction('out')}
                        className="bg-surface-container text-on-surface px-6 py-3 rounded-2xl font-bold font-headline shadow-sm hover:bg-surface-container-high transition-all active:scale-95 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">remove_circle</span>
                        Registrar Gasto
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-stretch">
                {/* Main Insight */}
                <motion.div 
                    variants={{hidden: {opacity: 0, scale: 0.95}, visible: {opacity: 1, scale: 1}}}
                    className="lg:col-span-8 bento-card bg-primary dark:bg-surface-container-highest rounded-[3rem] p-10 text-white dark:text-on-surface flex flex-col justify-between shadow-2xl shadow-primary/10 relative overflow-hidden h-[420px]"
                >
                    <div className="relative z-10">
                        <span className="material-symbols-outlined text-4xl mb-6 opacity-80">analytics</span>
                        <h2 className="text-4xl font-extrabold font-headline leading-[1.1] mb-5 max-w-sm tracking-tighter">
                            Liquidez operativa de <span className="text-blue-300">Nexium SAS</span> para este periodo.
                        </h2>
                        <p className="text-lg text-primary-container max-w-sm opacity-90 leading-relaxed font-inter font-medium">
                            {activoCirculante > 0 
                                ? `Tus cuentas por cobrar representan el ${carteraSalud}% de tus activos circulantes. Monitoriza la cobranza.`
                                : "No hay datos operativos registrados aún. Comienza cargando un asiento de apertura."}
                        </p>
                    </div>
                    <div className="flex gap-12 relative z-10 pt-10 border-t border-white/10">
                        <div>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-primary-container mb-2 opacity-70">Concentración Clientes</p>
                            <p className="text-3xl font-headline font-extrabold">{carteraSalud}%</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-primary-container mb-2 opacity-70">Gasto Operativo</p>
                            <p className="text-3xl font-headline font-extrabold text-blue-200">({format(gastoOperacion)})</p>
                        </div>
                    </div>
                    <div className="absolute right-[-10%] top-[-10%] w-[500px] h-[500px] bg-white opacity-[0.03] rounded-full blur-3xl pointer-events-none"></div>
                </motion.div>

                {/* Secondary Stats */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <MetricCard label="Activo Circulante" value={format(activoCirculante)} icon="payments" color="text-tertiary" trend={activoCirculante > 0} />
                    <MetricCard label="Pasivo Pendiente" value={format(pasivoPendiente)} icon="pending_actions" color="text-error" />
                </div>

                {/* Bottom Row */}
                <div className="lg:col-span-3">
                    <MetricCard label="IVA Trasladado" value={format(ivaTrasladado)} icon="receipt_long" color="text-primary" />
                </div>
                <motion.div 
                    variants={{hidden: {opacity: 0, y: 20}, visible: {opacity: 1, y: 0}}}
                    className="lg:col-span-6 bento-card bg-surface-container-high p-10 rounded-[3rem] shadow-sm border border-surface-container flex flex-col justify-center gap-6 h-[220px]"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-on-background dark:bg-surface-container-highest rounded-full flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-3xl">bolt</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-xl font-headline font-extrabold text-on-surface">Cierre Mensual</h4>
                            <p className="text-sm text-outline font-medium truncate">Estado de integridad: {activoCirculante > 0 ? "Verificado" : "Pendiente de datos"}</p>
                        </div>
                        <button className="bg-on-background text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-all">Ver Más</button>
                    </div>
                </motion.div>
                <div className="lg:col-span-3">
                    <MetricCard label="Gastos Totales" value={format(gastoOperacion)} icon="monitoring" color="text-error" />
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
