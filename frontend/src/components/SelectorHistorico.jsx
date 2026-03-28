import React from 'react';

const SelectorHistorico = ({ onDateSelect, activeDate }) => {
    const hitos = [
        "2026-01-23", "2026-01-28", "2026-01-31", 
        "2026-02-04", "2026-02-06", "2026-02-10", "2026-02-12", "2026-02-28",
        "2026-03-04", "2026-03-08", "2026-03-10", "2026-03-12", "2026-03-14",
        "2026-03-16", "2026-03-18", "2026-03-20", "2026-03-22", "2026-03-24", "2026-03-26"
    ];

    return (
        <div className="flex items-center gap-3 bg-surface-container-low dark:bg-slate-900 px-6 py-3 rounded-2xl border border-surface-container/50 shadow-sm transition-colors duration-300">
            <span className="text-[10px] font-extrabold text-outline uppercase tracking-[0.2em] mr-4 opacity-70 shrink-0">Lapsos de Verificación:</span>
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar flex-nowrap scroll-smooth">
                {hitos.map(fecha => (
                    <button
                        key={fecha}
                        onClick={() => onDateSelect(fecha)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all active:scale-90 flex items-center gap-2 ${
                            activeDate === fecha 
                            ? 'bg-on-background dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg shadow-black/20 dark:shadow-white/5' 
                            : 'bg-white/50 dark:bg-slate-800 text-on-surface-variant hover:bg-white dark:hover:bg-slate-700'
                        }`}
                    >
                        {activeDate === fecha && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>}
                        {fecha}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SelectorHistorico;
