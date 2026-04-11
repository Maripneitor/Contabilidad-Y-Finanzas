import { ACCOUNTS } from '../constants/accounts';
import { motion, AnimatePresence } from 'framer-motion';

const formatCurrency = (val) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val || 0);

const BalanzaComprobacion = ({ data }) => {
    if (!data) return null;
    const b = data.body;
    
    // Convertimos el objeto en array de cuentas y filtramos las que tengan movimientos
    const accounts = Object.keys(b).map(code => ({
        code,
        debe: b[code].debe,
        haber: b[code].haber,
        saldo: b[code].saldo
    })).filter(a => a.debe !== 0 || a.haber !== 0);

    const totals = accounts.reduce((acc, a) => {
        acc.debe += a.debe;
        acc.haber += a.haber;
        acc.saldoDeudor += a.saldo > 0 ? a.saldo : 0;
        acc.saldoAcreedor += a.saldo < 0 ? Math.abs(a.saldo) : 0;
        return acc;
    }, { debe: 0, haber: 0, saldoDeudor: 0, saldoAcreedor: 0 });

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.5, staggerChildren: 0.05 }
        }
    };

    const rowVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            key={data?.header?.date}
            className="space-y-8 max-w-6xl mx-auto"
        >
            <motion.header variants={rowVariants}>
                <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1 opacity-60">Verificación de Integridad Nexium</p>
                <h1 className="text-4xl font-extrabold font-headline tracking-tighter text-on-surface">
                    Balanza de <span className="text-primary italic">Comprobación Ajustada</span>
                </h1>
            </motion.header>

            <motion.div 
                variants={rowVariants}
                className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-2xl border border-surface-container transition-colors duration-300 overflow-hidden"
            >
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-surface-container-low">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-outline border-r border-surface-container/50">Cuenta / Código</th>
                                <th colSpan="2" className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-outline text-center border-r border-surface-container/50">Movimientos (Debe/Haber)</th>
                                <th colSpan="2" className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-outline text-center">Saldos Finales</th>
                            </tr>
                             <tr className="bg-surface-container-low/50 border-b border-surface-container/50">
                                <th className="px-8 py-4 text-[10px] font-extrabold text-on-surface uppercase border-r border-surface-container/50">Concepto Nexium</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-tertiary uppercase text-right">Deudor (+)</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-error uppercase text-right border-r border-surface-container/50">Acreedor (-)</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-tertiary uppercase text-right">Deudor</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-error uppercase text-right">Acreedor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container/30">
                            <AnimatePresence mode='popLayout'>
                                {accounts.map((a) => {
                                    const account = ACCOUNTS.find(acc => acc.code === a.code);
                                    const name = account ? account.name : a.code;
                                    return (
                                        <motion.tr 
                                            key={a.code}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-primary/5 transition-colors group"
                                        >
                                            <td className="px-8 py-5 border-r border-surface-container/30">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-extrabold text-on-surface group-hover:text-primary transition-colors">{name}</span>
                                                    <span className="text-[10px] text-outline font-mono opacity-60">[{a.code}]</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right text-sm font-bold tabular-nums text-on-surface-variant font-mono">
                                                {formatCurrency(a.debe)}
                                            </td>
                                            <td className="px-8 py-5 text-right text-sm font-bold tabular-nums text-on-surface-variant border-r border-surface-container/30 font-mono">
                                                {formatCurrency(a.haber)}
                                            </td>
                                            <td className="px-8 py-5 text-right text-sm font-extrabold tabular-nums text-tertiary bg-tertiary/5 font-mono">
                                                {a.saldo > 0 ? formatCurrency(a.saldo) : '$0.00'}
                                            </td>
                                            <td className="px-8 py-5 text-right text-sm font-extrabold tabular-nums text-error bg-error/5 font-mono">
                                                {a.saldo < 0 ? formatCurrency(Math.abs(a.saldo)) : '$0.00'}
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                        <tfoot>
                            <tr className="bg-surface-container-low font-extrabold shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                                <td className="px-8 py-8 text-xs uppercase tracking-widest text-on-surface border-r border-surface-container/50">Sumas Iguales Nexium</td>
                                <td className="px-8 py-8 text-right text-lg text-on-surface font-mono">
                                    {formatCurrency(totals.debe)}
                                </td>
                                <td className="px-8 py-8 text-right text-lg text-on-surface border-r border-surface-container/50 font-mono">
                                    {formatCurrency(totals.haber)}
                                </td>
                                <td className="px-8 py-8 text-right text-xl text-tertiary font-mono">
                                    {formatCurrency(totals.saldoDeudor)}
                                </td>
                                <td className="px-8 py-8 text-right text-xl text-error font-mono">
                                    {formatCurrency(totals.saldoAcreedor)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </motion.div>

            {/* Verification Alert */}
            <motion.div 
                variants={rowVariants}
                className={`p-8 rounded-[2rem] border-2 flex items-center justify-center gap-6 shadow-xl transition-all ${
                Math.abs(totals.debe - totals.haber) < 0.1 ? 'bg-tertiary text-white border-transparent' : 'bg-error text-white border-transparent pulse'
            }`}>
                <span className="material-symbols-outlined text-4xl">
                    {Math.abs(totals.debe - totals.haber) < 0.1 ? 'verified_user' : 'report_problem'}
                </span>
                <div className="flex flex-col">
                    <p className="text-xs font-black uppercase tracking-[0.2em]">Estatus de Concentración</p>
                    <p className="text-xl font-headline font-bold">
                        {Math.abs(totals.debe - totals.haber) < 0.1 
                            ? 'La balanza cuadra perfectamente - Integridad Nexium 100%' 
                            : 'Error de Diferencia detectable: Los movimientos no coinciden.'}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default BalanzaComprobacion;
