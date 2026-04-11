import React, { useState } from 'react';
import { motion } from 'framer-motion';

const formatCurrency = (val) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val || 0);

const EstadoResultados = ({ data }) => {
    const [invFinalManual, setInvFinalManual] = useState(0);

    if (!data) return null;

    const b = data.body;
    const getSaldo = (code) => (b[code] ? b[code].saldo : 0);

    // Ingresos (Ventas) suelen tener saldo acreedor (negativo en nuestro sistema d-h)
    const ventasTotales = Math.abs(getSaldo('RI-VE'));
    const devVenta = Math.abs(getSaldo('RE-DV'));
    const rebVenta = Math.abs(getSaldo('RE-RV'));
    const ventasNetas = ventasTotales - devVenta - rebVenta;

    // Costo de Ventas
    const invInicial = Math.abs(getSaldo('AC-IN'));
    const compras = Math.abs(getSaldo('RE-CO'));
    const gastosCompra = Math.abs(getSaldo('RE-GC'));
    const comprasTotales = compras + gastosCompra;
    const devCompra = Math.abs(getSaldo('RI-DC'));
    const rebCompra = Math.abs(getSaldo('RI-RC'));
    const comprasNetas = comprasTotales - devCompra - rebCompra;
    const mercanciasDisponibles = invInicial + comprasNetas;
    
    // Inventario final (Usa el manual o estima 10% si es 0)
    const invFinal = invFinalManual || (mercanciasDisponibles * 0.1); 
    const costoVentas = mercanciasDisponibles - invFinal;

    const utilidadBruta = ventasNetas - costoVentas;

    // Gastos Operación
    const gastosVenta = Math.abs(getSaldo('RE-GV'));
    const gastosAdmin = Math.abs(getSaldo('RE-GA'));
    const totalGastosOp = gastosVenta + gastosAdmin;

    const utilidadNeta = utilidadBruta - totalGastosOp;

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.98 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.5, staggerChildren: 0.05 }
        }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            key={data?.header?.date}
            className="space-y-8 max-w-4xl mx-auto"
        >
            <motion.header variants={sectionVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2">
                <div>
                    <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1 opacity-60">Reporte de Desempeño Nexium</p>
                    <h1 className="text-4xl font-extrabold font-headline tracking-tighter text-on-surface">
                        Estado de <span className="text-primary italic">Resultados</span>
                    </h1>
                </div>
                <div className="bg-surface-container-low p-4 rounded-2xl border border-surface-container shadow-sm flex items-center gap-4">
                    <span className="text-[10px] font-bold text-outline uppercase">Inv. Final Manual:</span>
                    <input 
                        type="number" 
                        value={invFinalManual} 
                        onChange={(e) => setInvFinalManual(parseFloat(e.target.value) || 0)}
                        className="bg-surface-container-low dark:bg-slate-800 border-none rounded-lg px-3 py-1 text-xs font-bold w-24 outline-none focus:ring-1 ring-primary transition-all"
                        placeholder="Estimado..."
                    />
                </div>
            </motion.header>

            <motion.div 
                variants={sectionVariants}
                className={`bg-surface-container-lowest rounded-[2.5rem] p-12 shadow-2xl border border-surface-container transition-colors duration-300 relative overflow-hidden`}
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                
                <div className="text-center mb-12 border-b border-surface-container/50 pb-8 relative z-10">
                    <h2 className="text-3xl font-extrabold font-headline text-on-surface tracking-tighter">NEXIUM, S.A.S.</h2>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mt-2">Ejercicio Contable Vigente</p>
                </div>

                <div className="space-y-6 relative z-10">
                    {/* Ventas section */}
                    <div className="grid grid-cols-2 items-center py-2 border-b border-surface-container/30">
                        <span className="text-sm font-bold text-on-surface-variant">Ventas Totales</span>
                        <motion.span 
                            key={ventasTotales}
                            initial={{ scale: 1.1, color: '#3b82f6' }}
                            animate={{ scale: 1, color: 'inherit' }}
                            className="text-sm font-extrabold text-right tabular-nums"
                        >
                            {formatCurrency(ventasTotales)}
                        </motion.span>
                    </div>
                    
                    <div className="flex flex-col gap-2 pl-6 border-l-2 border-surface-container">
                        <div className="flex justify-between text-[11px] text-error font-medium">
                            <span>Devoluciones s/ Ventas</span>
                            <span>({formatCurrency(devVenta)})</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-error font-medium">
                            <span>Rebajas s/ Ventas</span>
                            <span>({formatCurrency(rebVenta)})</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center py-4 bg-tertiary/5 px-6 rounded-2xl font-extrabold text-tertiary border border-tertiary/10 shadow-inner">
                        <span className="uppercase text-[10px] tracking-widest">Ventas Netas</span>
                        <span className="text-lg">{formatCurrency(ventasNetas)}</span>
                    </div>

                    <div className="h-4"></div>

                    {/* Costo de Ventas section */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs font-bold px-2">
                            <span className="text-outline">Inventario Inicial</span>
                            <span>{formatCurrency(invInicial)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold px-2">
                            <span className="text-outline">Compras Netas</span>
                            <span>{formatCurrency(comprasNetas)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-extrabold px-6 py-3 bg-error/5 rounded-xl text-error border border-error/5">
                            <span className="uppercase text-[10px] tracking-widest">(-) Inventario Final</span>
                            <span>{formatCurrency(invFinal)}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center py-4 bg-surface-container-low px-6 rounded-2xl font-extrabold text-on-surface border border-surface-container-high">
                        <span className="uppercase text-[10px] tracking-widest text-outline">Costo de Ventas</span>
                        <span className="text-lg">{formatCurrency(costoVentas)}</span>
                    </div>

                    <div className="h-8"></div>

                    {/* Resultados Operativos */}
                    <div className={`p-8 rounded-[2rem] border-2 transition-all ${utilidadNeta >= 0 ? 'bg-primary/5 border-primary/20' : 'bg-error/5 border-error/20'}`}>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold opacity-70">
                                <span>Utilidad / Pérdida Bruta</span>
                                <span>{formatCurrency(utilidadBruta)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-error/80">
                                <span>Gastos de Administración y Venta</span>
                                <span>({formatCurrency(totalGastosOp)})</span>
                            </div>
                            <div className="pt-6 border-t border-surface-container-high flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest font-extrabold text-outline mb-1">Resultado Neto</span>
                                    <motion.span 
                                        key={utilidadNeta}
                                        initial={{ y: 5, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className={`text-4xl font-extrabold font-headline tracking-tightest ${utilidadNeta >= 0 ? 'text-primary' : 'text-error'}`}
                                    >
                                        {formatCurrency(utilidadNeta)}
                                    </motion.span>
                                </div>
                                <motion.div 
                                    key={utilidadNeta >= 0 ? 'up' : 'down'}
                                    initial={{ scale: 0.8, rotate: -15 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center ${utilidadNeta >= 0 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-error text-white shadow-lg shadow-error/20'}`}
                                >
                                    <span className="material-symbols-outlined text-3xl">
                                        {utilidadNeta >= 0 ? 'trending_up' : 'trending_down'}
                                    </span>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-12 border-t border-surface-container/50 grid grid-cols-2 gap-12 text-center relative z-10">
                    <div className="group">
                        <div className="w-32 h-0.5 bg-outline mx-auto mb-4 opacity-30 group-hover:opacity-100 transition-opacity"></div>
                        <p className="text-xs font-black text-on-surface uppercase">{data.footer?.elaboro}</p>
                        <p className="text-[9px] font-extrabold uppercase tracking-widest text-outline">Elaboró</p>
                    </div>
                    <div className="group">
                        <div className="w-32 h-0.5 bg-outline mx-auto mb-4 opacity-30 group-hover:opacity-100 transition-opacity"></div>
                        <p className="text-xs font-black text-on-surface uppercase">{data.footer?.autorizo}</p>
                        <p className="text-[9px] font-extrabold uppercase tracking-widest text-outline">Autorizó</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default EstadoResultados;
