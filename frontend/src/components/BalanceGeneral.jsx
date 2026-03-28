import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';

const formatCurrency = (val) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val || 0);

const Row = ({ label, val, color, icon, isNegative }) => (
    <div className="flex justify-between items-center py-3 border-b border-surface-container/50 last:border-0 hover:bg-surface-container/5 transition-colors px-2 rounded-lg group text-left">
        <div className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full ${color}`}></span>
            <span className={`text-sm font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors ${isNegative ? 'italic text-error' : ''}`}>
                {label}
            </span>
        </div>
        <span className={`text-sm font-bold tabular-nums ${isNegative ? 'text-red-500' : 'text-on-surface'}`}>
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

    const getSaldo = (code) => (b[code] ? b[code].saldo : 0);

    const totalActivo = 
        getSaldo('AC-CA') + getSaldo('AC-BA') + getSaldo('AC-IN') +
        getSaldo('AC-CL') + getSaldo('AC-IV') + getSaldo('AC-IP') +
        getSaldo('ANC-ME') + getSaldo('ANC-EC') + 
        getSaldo('ANC-DAM') + getSaldo('ANC-DAC') + // Estas suelen ser negativas en saldo neto
        getSaldo('AD-GI') + getSaldo('AD-PU') + getSaldo('AD-RA');

    const totalPasivo = Math.abs(getSaldo('PC-PR')) + Math.abs(getSaldo('PC-IT')) + 
                        Math.abs(getSaldo('PC-IX')) + Math.abs(getSaldo('PC-AC'));
    
    const totalCapital = Math.abs(getSaldo('C-CS')) + (getSaldo('C-PE') || getSaldo('C-UN') || 0);
    const totalPC = totalPasivo + Math.abs(totalCapital);

    const diff = totalActivo - totalPC;
    const isBalanced = Math.abs(diff) < 0.1;

    const downloadPDF = () => {
        const element = reportRef.current;
        const opt = {
            margin: 0.5,
            filename: `Nexium_Balance_${data.header.date}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="space-y-12 max-w-5xl mx-auto animate-in fade-in zoom-in duration-500">
            {/* Header / Summary Section */}
            <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                <div className="md:col-span-8">
                    <p className="font-inter text-xs uppercase tracking-[0.2em] text-outline mb-2">Estado de Situación Financiera</p>
                    <h1 className="text-5xl font-extrabold font-headline tracking-tighter text-on-surface leading-none">
                        Balance <span className="text-primary italic">General</span>
                    </h1>
                </div>
                <div className="md:col-span-4 flex justify-end">
                    <button
                        onClick={downloadPDF}
                        className="flex items-center gap-3 bg-on-background dark:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold font-headline shadow-lg hover:opacity-90 transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined">download</span>
                        <span>Exportar PDF</span>
                    </button>
                </div>
            </section>

            {/* Balanza Visual Indicator */}
            <div className={`p-8 rounded-2xl border-2 transition-all shadow-sm ${
                isBalanced ? 'bg-tertiary/5 border-tertiary/20' : 'bg-error/5 border-error/20'
            }`}>
                <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                    <div className="flex-1 text-center md:text-left">
                        <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Activo Total</p>
                        <h4 className={`text-3xl font-extrabold font-headline tabular-nums ${isBalanced ? 'text-tertiary' : 'text-on-surface'}`}>
                            {formatCurrency(totalActivo)}
                        </h4>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className={`material-symbols-outlined text-4xl mb-2 ${
                            isBalanced ? 'text-tertiary animate-bounce' : 'text-error animate-pulse'
                        }`}>
                            {isBalanced ? 'check_circle' : 'warning'}
                        </span>
                        <div className="text-[10px] font-bold uppercase tracking-tighter px-4 py-1 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-surface-container">
                            {isBalanced ? 'SISTEMA CUADRADO' : 'DIFERENCIA DETECTADA'}
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-right">
                        <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Pasivo + Capital</p>
                        <h4 className={`text-3xl font-extrabold font-headline tabular-nums ${isBalanced ? 'text-tertiary' : 'text-on-surface'}`}>
                            {formatCurrency(totalPC)}
                        </h4>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div ref={reportRef} className="bg-surface-container-lowest dark:bg-slate-900 rounded-2xl p-12 shadow-sm border border-surface-container transition-colors duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* ACTIVO */}
                    <div className="space-y-8">
                        <h3 className="flex items-center gap-2 text-xs font-extrabold text-on-surface uppercase tracking-[0.2em] mb-6 bg-surface-container-low dark:bg-slate-800 p-3 rounded-lg">
                            <span className="w-2 h-6 bg-tertiary rounded-full"></span>
                            Activo
                        </h3>
                        <div>
                            <h4 className="text-[10px] font-bold text-outline uppercase tracking-widest mb-3 px-2">Circulante</h4>
                            <Row label="Caja" val={getSaldo('AC-CA')} color="bg-tertiary" />
                            <Row label="Bancos" val={getSaldo('AC-BA')} color="bg-tertiary" />
                            <Row label="Inventarios" val={getSaldo('AC-IN')} color="bg-tertiary" />
                            <Row label="Clientes" val={getSaldo('AC-CL')} color="bg-tertiary" />
                            <Row label="IVA Acreditable" val={getSaldo('AC-IV')} color="bg-tertiary" />
                            <Row label="IVA x Acred" val={getSaldo('AC-IP')} color="bg-tertiary" />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-bold text-outline uppercase tracking-widest mb-3 px-2">Fijo (No Circulante)</h4>
                            <Row label="Mobiliario y Eq." val={getSaldo('ANC-ME')} color="bg-primary" />
                            <Row label="Dep. Acum. Mob." val={getSaldo('ANC-DAM')} color="bg-red-400" isNegative={true} />
                            <Row label="Eq. Cómputo" val={getSaldo('ANC-EC')} color="bg-primary" />
                            <Row label="Dep. Acum. Comp." val={getSaldo('ANC-DAC')} color="bg-red-400" isNegative={true} />
                        </div>
                        <div className="pt-4 border-t border-surface-container flex justify-between">
                            <span className="text-sm font-bold uppercase text-tertiary">Total Activo</span>
                            <span className="text-lg font-bold text-tertiary">{formatCurrency(totalActivo)}</span>
                        </div>
                    </div>

                    {/* PASIVO Y CAPITAL */}
                    <div className="space-y-8">
                        <h3 className="flex items-center gap-2 text-xs font-extrabold text-on-surface uppercase tracking-[0.2em] mb-6 bg-surface-container-low dark:bg-slate-800 p-3 rounded-lg">
                            <span className="w-2 h-6 bg-error rounded-full"></span>
                            Pasivo y Capital
                        </h3>
                        <div>
                            <h4 className="text-[10px] font-bold text-outline uppercase tracking-widest mb-3 px-2">Pasivo</h4>
                            <Row label="Proveedores" val={Math.abs(getSaldo('PC-PR'))} color="bg-error" />
                            <Row label="IVA Trasladado" val={Math.abs(getSaldo('PC-IT'))} color="bg-error" />
                            <Row label="IVA por Trasladar" val={Math.abs(getSaldo('PC-IX'))} color="bg-error" />
                            <Row label="Anticipo Clientes" val={Math.abs(getSaldo('PC-AC'))} color="bg-error" />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-bold text-outline uppercase tracking-widest mb-3 px-2">Capital</h4>
                            <Row label="Capital Social" val={Math.abs(getSaldo('C-CS'))} color="bg-primary" />
                            <Row label="Utilidad/Pérdida" val={getSaldo('C-PE') || getSaldo('C-UN')} color="bg-primary" isNegative={getSaldo('C-PE') < 0} />
                        </div>
                        <div className="pt-4 border-t border-surface-container flex justify-between">
                            <span className="text-sm font-bold uppercase text-primary">Total Pasivo + Cap.</span>
                            <span className="text-lg font-bold text-primary">{formatCurrency(totalPC)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BalanceGeneral;
