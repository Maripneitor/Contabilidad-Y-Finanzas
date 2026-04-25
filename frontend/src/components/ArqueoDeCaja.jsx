import React from 'react';
import { motion } from 'framer-motion';
import { IoCalculatorOutline, IoPrintOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';

const ArqueoDeCaja = () => {
    const denominations = [
        { value: 1000, type: 'Billetes', count: 11, total: 11000 },
        { value: 500, type: 'Billetes', count: 10, total: 5000 },
        { value: 200, type: 'Billetes', count: 10, total: 2000 },
        { value: 100, type: 'Billetes', count: 5, total: 500 },
        { value: 50, type: 'Billetes', count: 1, total: 50 },
        { value: 20, type: 'Billetes', count: 0, total: 0 },
    ];

    const expenses = [
        { ref: 'Fact. A-001', concept: 'Garrafones de Agua', amount: 232 },
        { ref: 'Fact. P-102', concept: 'Pastel de Cumpleaños', amount: 580 },
        { ref: 'Fact. U-303', concept: 'Memoria USB', amount: 348 },
        { ref: 'Vale C-404', concept: 'Copias e Impresiones', amount: 116 },
        { ref: 'Vale T-505', concept: 'Taxis y Mensajería', amount: 174 },
    ];

    const totalPhysical = 18550;
    const totalExpenses = 1450;
    const totalFund = 20000;

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex justify-between items-end border-b-2 border-primary pb-6">
                <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">Control Interno</p>
                    <h1 className="text-4xl font-black font-headline text-on-surface tracking-tighter">
                        Arqueo de <span className="text-primary italic">Caja Chica</span>
                    </h1>
                    <p className="text-sm text-outline font-medium mt-1">Nexium, S.A.S. | Corte al 17 de Abril, 2026</p>
                </div>
                <button className="bg-surface-container-high p-4 rounded-2xl hover:bg-primary hover:text-white transition-all">
                    <IoPrintOutline className="text-xl" />
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Physical Count */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-black/5 border border-surface-container">
                    <h2 className="text-xl font-black font-headline mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm">A</span>
                        Recuento Físico
                    </h2>
                    <div className="overflow-hidden rounded-2xl border border-surface-container">
                        <table className="w-full text-left">
                            <thead className="bg-surface-container-low">
                                <tr>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-outline">Denominación</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-outline">Cantidad</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-outline text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container">
                                {denominations.map((d, i) => (
                                    <tr key={i} className={d.count > 0 ? "bg-primary/5" : ""}>
                                        <td className="p-4 text-sm font-bold">${d.value.toLocaleString()} <span className="text-[10px] text-outline font-normal">({d.type})</span></td>
                                        <td className="p-4 text-sm font-bold text-center">{d.count}</td>
                                        <td className="p-4 text-sm font-black text-right">${d.total.toLocaleString()}</td>
                                    </tr>
                                ))}
                                <tr className="bg-on-surface text-white">
                                    <td colSpan="2" className="p-4 text-sm font-black uppercase tracking-widest">Total Físico</td>
                                    <td className="p-4 text-lg font-black text-right">${totalPhysical.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Expenses */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-black/5 border border-surface-container">
                    <h2 className="text-xl font-black font-headline mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 bg-tertiary/10 text-tertiary rounded-lg flex items-center justify-center text-sm">B</span>
                        Comprobantes y Gastos
                    </h2>
                    <div className="space-y-3">
                        {expenses.map((e, i) => (
                            <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-surface-container-low border border-surface-container hover:border-tertiary/30 transition-all group">
                                <div>
                                    <p className="text-[9px] font-black text-tertiary uppercase tracking-widest">{e.ref}</p>
                                    <p className="text-sm font-bold text-on-surface">{e.concept}</p>
                                </div>
                                <p className="text-sm font-black text-on-surface">${e.amount.toLocaleString()}</p>
                            </div>
                        ))}
                        <div className="mt-6 p-6 rounded-[2rem] bg-tertiary text-white flex justify-between items-center shadow-lg shadow-tertiary/20">
                            <span className="text-sm font-black uppercase tracking-widest">Total Gastado</span>
                            <span className="text-2xl font-black">${totalExpenses.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary and Signatures */}
            <div className="bg-on-background text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
                    <div className="text-center md:text-left">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-container mb-2 opacity-60">Resumen de Cuadre</p>
                        <h3 className="text-3xl font-black font-headline leading-tight">Fondo Fijo <br/> Conciliado</h3>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs opacity-80">
                            <span>Efectivo en Caja</span>
                            <span>${totalPhysical.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs opacity-80">
                            <span>Comprobantes</span>
                            <span>${totalExpenses.toLocaleString()}</span>
                        </div>
                        <div className="h-px bg-white/10 my-2"></div>
                        <div className="flex justify-between text-lg font-black text-primary-container">
                            <span>Total Fondo</span>
                            <span>${totalFund.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="flex justify-center md:justify-end">
                        <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary">
                            <IoShieldCheckmarkOutline className="text-4xl" />
                        </div>
                    </div>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mt-16 relative z-10 border-t border-white/10 pt-16">
                    <div className="text-center">
                        <div className="h-px bg-white/30 w-64 mx-auto mb-4"></div>
                        <p className="text-xs font-black uppercase tracking-widest">Nuria</p>
                        <p className="text-[10px] opacity-40">Custodio de Caja Chica</p>
                    </div>
                    <div className="text-center">
                        <div className="h-px bg-white/30 w-64 mx-auto mb-4"></div>
                        <p className="text-xs font-black uppercase tracking-widest">Mario Efraín Moguel Hernández</p>
                        <p className="text-[10px] opacity-40">Responsable / Vo.Bo.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArqueoDeCaja;
