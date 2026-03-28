import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';

const formatCurrency = (val) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val || 0);

const Row = ({ label, val, color, icon, isNegative }) => (
    <div className="flex justify-between items-center py-2.5 border-b border-surface-container/30 last:border-0 hover:bg-surface-container/5 transition-colors px-2 rounded-lg group text-left">
        <div className="flex items-center gap-3">
            <span className={`w-1.5 h-1.5 rounded-full ${color}`}></span>
            <span className={`text-[13px] font-medium text-on-surface-variant group-hover:text-on-surface transition-colors ${isNegative ? 'italic' : ''}`}>
                {label}
            </span>
        </div>
        <span className={`text-[13px] font-bold tabular-nums ${isNegative ? 'text-error' : 'text-on-surface'}`}>
            {isNegative ? `(${formatCurrency(Math.abs(val))})` : formatCurrency(val)}
        </span>
    </div>
);

const BalanceGeneral = ({ data }) => {
    const reportRef = useRef();

    if (!data) return (
        <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-2xl p-16 shadow-sm border border-surface-container text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6 animate-pulse">
                <span className="material-symbols-outlined text-4xl">account_balance</span>
            </div>
            <h3 className="text-xl font-bold font-headline text-on-surface">Calculando Balance General...</h3>
            <p className="text-sm text-outline mt-2 italic">Procesando la magia de Nexium.</p>
        </div>
    );

    const b = data.body;
    const h = data.header;
    const f = data.footer;

    const getSaldo = (code) => (b[code] ? b[code].saldo : 0);

    const totalCirculante = 
        getSaldo('AC-CA') + getSaldo('AC-BA') + getSaldo('AC-IN') +
        getSaldo('AC-CL') + getSaldo('AC-IV') + getSaldo('AC-IP');

    const totalFijo = 
        getSaldo('ANC-ME') + getSaldo('ANC-EC') + 
        getSaldo('ANC-DAM') + getSaldo('ANC-DAC');

    const totalDiferido = 
        getSaldo('AD-GI') + getSaldo('AD-PU') + getSaldo('AD-RA');

    const totalActivo = totalCirculante + totalFijo + totalDiferido;

    const totalPasivo = Math.abs(getSaldo('PC-PR')) + Math.abs(getSaldo('PC-IT')) + 
                        Math.abs(getSaldo('PC-IX')) + Math.abs(getSaldo('PC-AC'));
    
    // El capital social y la pérdida/utilidad se manejan como valores absolutos para la suma de P+C
    const totalCapital = Math.abs(getSaldo('C-CS')) + (getSaldo('C-PE') || getSaldo('C-UN') || 0);
    const totalPC = totalPasivo + totalCapital;

    const diff = totalActivo - totalPC;
    const isBalanced = Math.abs(diff) < 0.1;

    const downloadPDF = () => {
        const element = reportRef.current;
        const opt = {
            margin: [0.5, 0.5],
            filename: `Nexium_Balance_${h.date}.pdf`,
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { scale: 3, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Action Bar */}
            <section className="flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-low p-4 rounded-2xl border border-surface-container shadow-sm">
                <div>
                    <h2 className="text-lg font-bold text-on-surface">Generación de Reporte Oficial</h2>
                    <p className="text-xs text-outline italic">Cumple con la estructura de Encabezado, Cuerpo y Pie.</p>
                </div>
                <button
                    onClick={downloadPDF}
                    className="flex items-center gap-3 bg-primary text-on-primary px-8 py-3 rounded-xl font-bold font-headline shadow-lg hover:brightness-110 transition-all active:scale-95 group"
                >
                    <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">picture_as_pdf</span>
                    <span>Descargar PDF</span>
                </button>
            </section>

            {/* Document Container */}
            <div 
                ref={reportRef} 
                className="bg-white text-slate-900 p-12 shadow-2xl rounded-sm border border-slate-200 min-h-[1056px] flex flex-col justify-between"
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                {/* 1. ENCABEZADO (Header) */}
                <header className="text-center border-b-2 border-slate-900 pb-6 mb-10">
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 mb-1">{h.company}</h1>
                    <h2 className="text-xl font-bold text-slate-700 mb-1">{h.report}</h2>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Al {new Date(h.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    <p className="text-[10px] text-slate-400 mt-2 italic">(Cifras expresadas en Pesos Mexicanos MXN)</p>
                </header>

                {/* 2. CUERPO (Body) */}
                <main className="flex-grow">
                    <div className="grid grid-cols-2 gap-12">
                        {/* COLUMNA ACTIVOS */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-slate-900 border-l-4 border-slate-900 pl-3">Activo</h3>
                                
                                <div className="ml-4 space-y-6">
                                    {/* Circulante */}
                                    <div>
                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Circulante</h4>
                                        <Row label="Caja" val={getSaldo('AC-CA')} color="bg-slate-400" />
                                        <Row label="Bancos" val={getSaldo('AC-BA')} color="bg-slate-400" />
                                        <Row label="Inventarios" val={getSaldo('AC-IN')} color="bg-slate-400" />
                                        <Row label="Clientes" val={getSaldo('AC-CL')} color="bg-slate-400" />
                                        <Row label="IVA Acreditable" val={getSaldo('AC-IV')} color="bg-slate-400" />
                                        <Row label="IVA por Acreditar" val={getSaldo('AC-IP')} color="bg-slate-400" />
                                    </div>

                                    {/* No Circulante / Fijo */}
                                    <div>
                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">No Circulante (Fijo)</h4>
                                        <Row label="Mobiliario y Equipo" val={getSaldo('ANC-ME')} color="bg-slate-400" />
                                        <Row label="Dep. Acum. Mobiliario" val={getSaldo('ANC-DAM')} color="bg-red-400" isNegative={true} />
                                        <Row label="Equipo de Cómputo" val={getSaldo('ANC-EC')} color="bg-slate-400" />
                                        <Row label="Dep. Acum. Cómputo" val={getSaldo('ANC-DAC')} color="bg-red-400" isNegative={true} />
                                    </div>

                                    {/* Diferido */}
                                    <div>
                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Diferido (Otros Activos)</h4>
                                        <Row label="Gastos de Instalación" val={getSaldo('AD-GI')} color="bg-slate-400" />
                                        <Row label="Papelería y Útiles" val={getSaldo('AD-PU')} color="bg-slate-400" />
                                        <Row label="Rentas Pag. Anticipado" val={getSaldo('AD-RA')} color="bg-slate-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t-2 border-slate-900 flex justify-between px-2 bg-slate-50 py-2">
                                <span className="text-sm font-black uppercase text-slate-900">Total Activo</span>
                                <span className="text-sm font-black text-slate-900 underline decoration-double">{formatCurrency(totalActivo)}</span>
                            </div>
                        </div>

                        {/* COLUMNA PASIVO Y CAPITAL */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-slate-900 border-l-4 border-slate-900 pl-3">Pasivo y Capital</h3>
                                <div className="ml-4 space-y-6">
                                    {/* Pasivo Corto Plazo */}
                                    <div>
                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Pasivo a Corto Plazo</h4>
                                        <Row label="Proveedores" val={Math.abs(getSaldo('PC-PR'))} color="bg-slate-400" />
                                        <Row label="IVA Trasladado" val={Math.abs(getSaldo('PC-IT'))} color="bg-slate-400" />
                                        <Row label="IVA por Trasladar" val={Math.abs(getSaldo('PC-IX'))} color="bg-slate-400" />
                                        <Row label="Anticipo de Clientes" val={Math.abs(getSaldo('PC-AC'))} color="bg-slate-400" />
                                    </div>

                                    {/* Capital */}
                                    <div>
                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Capital Contable</h4>
                                        <Row label="Capital Social" val={Math.abs(getSaldo('C-CS'))} color="bg-slate-400" />
                                        <Row label="Pérdida/Utilidad Ejercicio" val={getSaldo('C-PE') || getSaldo('C-UN')} color="bg-slate-400" isNegative={(getSaldo('C-PE') || getSaldo('C-UN')) < 0} />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t-2 border-slate-900 flex justify-between px-2 bg-slate-50 py-2">
                                <span className="text-sm font-black uppercase text-slate-900">Total Pasivo + Capital</span>
                                <span className="text-sm font-black text-slate-900 underline decoration-double">{formatCurrency(totalPC)}</span>
                            </div>

                            <div className={`mt-10 p-4 rounded text-center border-2 ${isBalanced ? 'border-tertiary/20 bg-tertiary/5 text-tertiary' : 'border-error/20 bg-error/5 text-error'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-widest">Estado del Sistema</p>
                                <p className="text-xs font-black">{isBalanced ? "CUADRADO INTERNAMENTE" : "DIFERENCIA DETECTADA"}</p>
                                {!isBalanced && <p className="text-[9px] mt-1">Dif: {formatCurrency(diff)}</p>}
                            </div>
                        </div>
                    </div>
                </main>

                {/* 3. PIE (Footer) */}
                <footer className="mt-20">
                    <div className="grid grid-cols-2 gap-24 px-12">
                        <div className="text-center space-y-2">
                            <div className="border-t border-slate-900 pt-2">
                                <p className="text-xs font-black text-slate-900 uppercase">{f.elaboro}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Elaboró</p>
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="border-t border-slate-900 pt-2">
                                <p className="text-xs font-black text-slate-900 uppercase">{f.autorizo}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Autorizó</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-[8px] text-slate-400 text-center mt-12 uppercase tracking-widest">
                        Nexium Accounting Engine v2.0 - Reporte generado de forma automática
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default BalanceGeneral;

