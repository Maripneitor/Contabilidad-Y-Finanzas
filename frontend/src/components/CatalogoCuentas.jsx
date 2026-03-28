import React from 'react';
import { ACCOUNTS } from '../constants/accounts';

const CatalogoCuentas = () => {
    return (
        <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex justify-between items-end border-b border-surface-container pb-6">
                <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">Estructura Contable</p>
                    <h1 className="text-4xl font-black font-headline text-on-surface tracking-tighter">
                        Catálogo de <span className="text-primary italic">Cuentas</span>
                    </h1>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Total de Cuentas</p>
                    <p className="text-2xl font-black text-on-surface">{ACCOUNTS.length}</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ACCOUNTS.map((account) => (
                    <div 
                        key={account.code} 
                        className="bg-surface-container-lowest border border-surface-container p-5 rounded-2xl hover:border-primary/30 hover:shadow-lg transition-all group overflow-hidden relative"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                                {account.code}
                            </span>
                            <span className={`text-[9px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded ${
                                account.nature === 'Deudora' ? 'bg-tertiary/10 text-tertiary' : 'bg-error/10 text-error'
                            }`}>
                                {account.nature}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors mb-1">{account.name}</h3>
                        <p className="text-xs text-outline">{account.type}</p>
                        
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-8xl rotate-12">
                                {account.type.includes('Activo') ? 'payments' : 
                                 account.type.includes('Pasivo') ? 'account_balance_wallet' : 
                                 account.type.includes('Capital') ? 'hub' : 'monitoring'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CatalogoCuentas;
