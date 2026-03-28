import React, { useState } from 'react';
import { ACCOUNTS } from '../constants/accounts';

const RegistroContable = ({ onTransactionComplete, targetDate }) => {
    const [description, setDescription] = useState('');
    const [entries, setEntries] = useState([{ account: '', debe: 0, haber: 0 }]);

    const [searchTerms, setSearchTerms] = useState(entries.map(() => ''));

    const updateSearch = (idx, val) => {
        const newSearch = [...searchTerms];
        newSearch[idx] = val;
        setSearchTerms(newSearch);
    };

    const addEntry = () => {
        setEntries([...entries, { account: '', debe: 0, haber: 0 }]);
        setSearchTerms([...searchTerms, '']);
    };
    
    const updateEntry = (index, field, value) => {
        const newEntries = [...entries];
        newEntries[index][field] = value;
        setEntries(newEntries);
    };

    const removeEntry = (idx) => {
        if (entries.length > 1) {
            setEntries(entries.filter((_, i) => i !== idx));
            setSearchTerms(searchTerms.filter((_, i) => i !== idx));
        }
    };

    const totalDebe = entries.reduce((s, e) => s + (parseFloat(e.debe) || 0), 0);
    const totalHaber = entries.reduce((s, e) => s + (parseFloat(e.haber) || 0), 0);
    const isBalanced = Math.abs(totalDebe - totalHaber) < 0.1;

    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

    const handleSubmit = async () => {
        if (!isBalanced) return alert("El asiento no está cuadrado.");
        try {
            const res = await fetch(`${API_BASE_URL}/transaccion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description, entries, date: targetDate })
            });
            if (res.ok) {
                onTransactionComplete();
                setDescription('');
                setEntries([{ account: '', debe: 0, haber: 0 }]);
                setSearchTerms(['']);
                alert("Asiento registrado correctamente.");
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <header className="flex flex-col gap-2">
                <p className="text-[10px] font-bold text-outline uppercase tracking-widest opacity-60">Motor Contable V2.5</p>
                <div className="flex justify-between items-end">
                    <h1 className="text-4xl font-extrabold font-headline tracking-tighter text-on-surface leading-none">
                        Registro <span className="text-primary italic">Asiento</span>
                    </h1>
                    <div className="flex items-center gap-4 bg-surface-container-low dark:bg-slate-800 px-6 py-2 rounded-xl border border-surface-container/50">
                        <span className="text-[10px] font-bold text-outline uppercase">Fecha Transacción:</span>
                        <span className="text-sm font-bold text-primary font-mono">{targetDate}</span>
                    </div>
                </div>
            </header>

            <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-3xl p-10 shadow-xl border border-surface-container transition-all hover:shadow-2xl">
                <div className="mb-10 group">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest mb-3 block opacity-70">Concepto del Asiento</label>
                    <input
                        type="text"
                        placeholder="Ej: Registro de devengo de rentas anticipadas..."
                        className="w-full bg-surface-container-low dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 rounded-2xl p-5 text-xl font-headline font-bold text-on-surface transition-all outline-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-12 px-6 py-3 bg-surface-container/30 dark:bg-slate-800/50 rounded-xl mb-4">
                        <div className="col-span-5 text-[10px] font-bold uppercase tracking-widest text-outline">Cuenta Mayor</div>
                        <div className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-outline text-right">Cargo (Debe)</div>
                        <div className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-outline text-right">Abono (Haber)</div>
                        <div className="col-span-1"></div>
                    </div>

                    {entries.map((entry, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-4 items-start group/row animate-in slide-in-from-left-4 duration-300">
                            <div className="col-span-5 relative">
                                <span className="material-symbols-outlined absolute left-4 top-4 text-primary opacity-40">account_balance</span>
                                <input
                                    type="text"
                                    placeholder="Buscar cuenta..."
                                    className="w-full bg-surface-container-low dark:bg-slate-800 border-2 border-transparent focus:border-primary/30 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-on-surface outline-none transition-all uppercase placeholder:opacity-30"
                                    value={searchTerms[idx]}
                                    onChange={(e) => updateSearch(idx, e.target.value)}
                                    onFocus={(e) => updateEntry(idx, 'showList', true)}
                                />
                                {entries[idx].showList && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest dark:bg-slate-900 border border-surface-container rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto overflow-x-hidden p-2 custom-scrollbar">
                                        {ACCOUNTS.filter(a => 
                                            a.name.toLowerCase().includes(searchTerms[idx].toLowerCase()) || 
                                            a.code.toLowerCase().includes(searchTerms[idx].toLowerCase())
                                        ).map(a => (
                                            <button
                                                key={a.code}
                                                type="button"
                                                className="w-full text-left p-4 hover:bg-primary hover:text-white rounded-xl transition-all flex flex-col gap-1 border-b border-surface-container last:border-0 group/btn"
                                                onClick={() => {
                                                    updateEntry(idx, 'account', a.code);
                                                    updateSearch(idx, `${a.name} (${a.code})`);
                                                    updateEntry(idx, 'showList', false);
                                                }}
                                            >
                                                <div className="flex justify-between items-center w-full">
                                                    <span className="font-extrabold text-sm">{a.name}</span>
                                                    <span className="text-[10px] font-mono opacity-60 group-hover/btn:opacity-100">{a.code}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold">{a.nature}</span>
                                                    <span className="text-[9px] italic opacity-40">{a.area}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {entry.account && !entries[idx].showList && (
                                    <div className="absolute top-1/2 -translate-y-1/2 right-12 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                        <span className="text-[10px] font-black text-primary uppercase">{entry.account}</span>
                                    </div>
                                )}
                            </div>
                            <div className="col-span-3 h-full">
                                <div className="relative h-full flex items-center">
                                    <span className="absolute left-6 text-tertiary font-bold text-lg">$</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full bg-surface-container-low dark:bg-slate-800 border-2 border-transparent focus:border-tertiary/20 rounded-xl pl-10 pr-4 py-4 text-right text-lg font-bold text-tertiary tabular-nums outline-none transition-all"
                                        value={entry.debe}
                                        onChange={(e) => updateEntry(idx, 'debe', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-span-3 h-full">
                                <div className="relative h-full flex items-center">
                                    <span className="absolute left-6 text-error font-bold text-lg">$</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full bg-surface-container-low dark:bg-slate-800 border-2 border-transparent focus:border-error/20 rounded-xl pl-10 pr-4 py-4 text-right text-lg font-bold text-error tabular-nums outline-none transition-all"
                                        value={entry.haber}
                                        onChange={(e) => updateEntry(idx, 'haber', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-span-1 flex justify-center">
                                <button
                                    onClick={() => removeEntry(idx)}
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-outline hover:text-error hover:bg-error/10 transition-all opacity-0 group-hover/row:opacity-100"
                                >
                                    <span className="material-symbols-outlined text-xl">remove_circle</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-between items-center p-6 bg-surface-container-low dark:bg-slate-800 rounded-2xl border border-surface-container/50">
                    <button
                        onClick={addEntry}
                        className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-primary hover:translate-x-1 transition-transform"
                    >
                        <span className="material-symbols-outlined">add_circle</span>
                        Añadir Renglón
                    </button>
                    <div className="flex gap-12 items-center">
                        <div className="text-right">
                            <p className="text-[10px] uppercase font-bold text-outline opacity-60">Cargo Total</p>
                            <p className="text-xl font-extrabold text-tertiary">${totalDebe.toLocaleString()}</p>
                        </div>
                        <div className="text-right border-l border-surface-container/50 pl-12">
                            <p className="text-[10px] uppercase font-bold text-outline opacity-60">Abono Total</p>
                            <p className="text-xl font-extrabold text-error">${totalHaber.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!isBalanced || !description || entries.length < 2}
                    className={`mt-10 w-full py-6 rounded-2xl font-headline font-extrabold text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 ${
                        isBalanced && description && entries.length >= 2
                            ? 'bg-on-background dark:bg-slate-100 text-white dark:text-slate-900 shadow-on-background/10 dark:shadow-white/5 cursor-pointer'
                            : 'bg-surface-container text-outline opacity-40 cursor-not-allowed shadow-none'
                    }`}
                >
                    <span className="material-symbols-outlined">verified</span>
                    <span>Validar y Registrar Asiento</span>
                </button>
            </div>
        </div>
    );
};

export default RegistroContable;
