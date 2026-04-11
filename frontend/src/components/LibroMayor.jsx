import React from 'react';
import { ACCOUNTS } from '../constants/accounts';
import { motion } from 'framer-motion';

const formatCurrency = (val) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val || 0);

const TAccount = ({ accountCode, entries }) => {
    const account = ACCOUNTS.find(a => a.code === accountCode);
    const name = account ? account.name : accountCode;

    const debeEntries = entries.filter(e => e.debe > 0);
    const haberEntries = entries.filter(e => e.haber > 0);

    const totalDebe = debeEntries.reduce((acc, e) => acc + e.debe, 0);
    const totalHaber = haberEntries.reduce((acc, e) => acc + e.haber, 0);
    const saldo = totalDebe - totalHaber;

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-container-lowest p-6 rounded-[2rem] border border-surface-container shadow-sm hover:shadow-md transition-all h-full"
        >
            <div className="text-center mb-4 border-b-2 border-primary pb-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-on-surface">{name}</h3>
                <p className="text-[10px] text-outline font-mono">[{accountCode}]</p>
            </div>

            <div className="grid grid-cols-2 gap-0 relative">
                {/* Vertical Divider */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-surface-container-high"></div>

                {/* Left Side (Debe) */}
                <div className="pr-4 space-y-1">
                    {debeEntries.map((e, i) => (
                        <div key={i} className="flex justify-between text-[11px] font-mono text-tertiary">
                            <span>{formatCurrency(e.debe)}</span>
                        </div>
                    ))}
                    {debeEntries.length === 0 && <div className="h-4"></div>}
                </div>

                {/* Right Side (Haber) */}
                <div className="pl-4 space-y-1">
                    {haberEntries.map((e, i) => (
                        <div key={i} className="flex justify-end text-[11px] font-mono text-error">
                            <span>{formatCurrency(e.haber)}</span>
                        </div>
                    ))}
                    {haberEntries.length === 0 && <div className="h-4"></div>}
                </div>
            </div>

            {/* Totals Row */}
            <div className="grid grid-cols-2 border-t-2 border-on-surface mt-4 pt-2">
                <div className="pr-4 text-right text-[11px] font-black text-on-surface">
                    {formatCurrency(totalDebe)}
                </div>
                <div className="pl-4 text-right text-[11px] font-black text-on-surface">
                    {formatCurrency(totalHaber)}
                </div>
            </div>

            {/* Final Balance */}
            <div className="mt-2 pt-2 border-t border-surface-container-high">
                <div className={`text-center text-sm font-black font-headline ${saldo >= 0 ? 'text-tertiary' : 'text-error'}`}>
                    {saldo >= 0 ? `S. Deudor: ${formatCurrency(saldo)}` : `S. Acreedor: ${formatCurrency(Math.abs(saldo))}`}
                </div>
            </div>
        </motion.div>
    );
};

const LibroMayor = ({ history }) => {
    if (!history) return null;

    // Agrupar entradas por cuenta
    const accountMap = {};
    history.forEach(t => {
        t.entries.forEach(e => {
            if (!accountMap[e.account]) {
                accountMap[e.account] = [];
            }
            accountMap[e.account].push(e);
        });
    });

    const sortedAccounts = Object.keys(accountMap).sort();

    return (
        <div className="space-y-12">
            <header>
                 <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1 opacity-60">Esquemas de Mayor - Nexium Intelligence</p>
                <h1 className="text-4xl font-extrabold font-headline tracking-tighter text-on-surface leading-none">
                    Libro <span className="text-primary italic">Mayor</span>
                </h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedAccounts.map(code => (
                    <TAccount key={code} accountCode={code} entries={accountMap[code]} />
                ))}
            </div>
        </div>
    );
};

export default LibroMayor;
