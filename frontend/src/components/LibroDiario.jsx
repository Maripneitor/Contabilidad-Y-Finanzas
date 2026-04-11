import React, { useState } from 'react';
import { ACCOUNTS } from '../constants/accounts';
import { motion, AnimatePresence } from 'framer-motion';

const LibroDiario = ({ history, onUpdate }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este asiento Nexium?")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/transaccion/${id}`, { method: 'DELETE' });
            if (res.ok) onUpdate();
        } catch (e) { console.error(e); }
    };

    const formatCurrency = (val) => 
        new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val || 0);

    const filtered = history?.filter(t =>
        (t.description?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.date?.includes(searchTerm)) ||
        (t.entries?.some(e => e.account?.toLowerCase().includes(searchTerm.toLowerCase())))
    ).reverse();

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            key={history?.length} // Force re-animation when data length changes
            className="space-y-6 max-w-7xl mx-auto"
        >
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                <motion.div variants={itemVariants}>
                    <p className="font-inter text-[10px] uppercase tracking-[0.2em] text-outline mb-1 font-bold italic opacity-60">Histórico de Movimientos</p>
                    <h1 className="text-4xl font-extrabold font-headline tracking-tighter text-on-surface leading-none">
                        Libro <span className="text-primary italic">Diario</span>
                    </h1>
                </motion.div>
                <motion.div variants={itemVariants} className="relative w-full md:w-80 group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
                    <input
                        type="text"
                        placeholder="Buscar cuenta o concepto..."
                        className="w-full bg-surface-container-lowest border border-surface-container focus:border-primary/50 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium transition-all outline-none text-on-surface shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </motion.div>
            </header>

            <motion.section 
                variants={itemVariants}
                className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-xl border border-surface-container transition-all"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-surface-container-low">
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-outline font-bold">Fecha / ID</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-outline font-bold">Concepto & Cuentas</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-outline font-bold text-right">Cargo (Debe)</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-outline font-bold text-right">Abono (Haber)</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-outline font-bold text-center w-20">Acc.</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container/30">
                            <AnimatePresence mode='popLayout'>
                                {!filtered || filtered.length === 0 ? (
                                    <motion.tr 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        key="empty"
                                    >
                                        <td colSpan="5" className="px-6 py-24 text-center text-outline italic">
                                            <div className="flex flex-col items-center gap-4 opacity-40">
                                                <span className="material-symbols-outlined text-4xl">folder_off</span>
                                                <span>No se encontraron registros contables.</span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ) : (
                                    filtered.map((t) => (
                                        <React.Fragment key={t.id}>
                                            {/* Transaction Header */}
                                            <motion.tr 
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="bg-surface-container-lowest group"
                                            >
                                                <td className="px-6 py-5 align-top border-r border-surface-container/30">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-on-surface">{t.date}</span>
                                                        <span className="text-[10px] text-outline font-mono opacity-60">ID_{(t.id.toString().slice(-4))}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5" colSpan="3">
                                                    <span className="text-base font-extrabold text-on-surface-variant tracking-tight leading-loose">
                                                        {t.description || "Sin concepto registrado"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-center align-top">
                                                    <button
                                                        onClick={() => handleDelete(t.id)}
                                                        className="w-8 h-8 rounded-xl flex items-center justify-center text-outline hover:text-error hover:bg-error/10 transition-all active:scale-90"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">delete</span>
                                                    </button>
                                                </td>
                                            </motion.tr>
                                            {/* Account Entries */}
                                            {t.entries?.map((e, idx) => {
                                                const account = ACCOUNTS.find(a => a.code === e.account);
                                                const name = account ? account.name : e.account || '---';
                                                return (
                                                    <motion.tr 
                                                        layout
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        key={`${t.id}-${idx}`} 
                                                        className="bg-surface-container-lowest hover:bg-primary/5 transition-colors group/row"
                                                    >
                                                        <td className="border-r border-surface-container/30"></td>
                                                        <td className="px-6 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-1 h-3 rounded-full ${e.debe > 0 ? 'bg-tertiary shadow-[0_0_8px_rgba(var(--tertiary),0.4)]' : 'bg-error opacity-40'}`}></div>
                                                                <span className={`text-xs font-bold transition-all ${e.debe > 0 ? 'text-on-surface' : 'text-on-surface-variant/70 pl-8 italic'}`}>
                                                                    {name} <span className="text-[9px] text-outline ml-1 opacity-50">[{e.account}]</span>
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-3 text-right">
                                                            {e.debe > 0 && (
                                                                <span className="text-sm font-bold text-tertiary tabular-nums font-mono">{formatCurrency(e.debe)}</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-3 text-right">
                                                            {e.haber > 0 && (
                                                                <span className="text-sm font-bold text-error tabular-nums font-mono">{formatCurrency(e.haber)}</span>
                                                            )}
                                                        </td>
                                                        <td></td>
                                                    </motion.tr>
                                                );
                                            })}
                                            <tr className="h-6 bg-surface-container-low/20"></tr> {/* Elegant Spacer */}
                                        </React.Fragment>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.section>
        </motion.div>
    );
};

export default LibroDiario;
