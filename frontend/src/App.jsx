import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Receipt,
    BookOpen,
    FileUp,
    Scale,
    Calendar,
    PlusCircle,
    MinusCircle
} from 'lucide-react';
import BalanceGeneral from './components/BalanceGeneral';
import RegistroContable from './components/RegistroContable';
import ExcelLoader from './components/ExcelLoader';
import LibroDiario from './components/LibroDiario';
import SelectorHistorico from './components/SelectorHistorico';

const ACCOUNTS = [
    { code: 'AC-CA', name: 'Monedas y Billetes (Caja)', icon: '' },
    { code: 'AC-BA', name: 'Dinero que tenemos en el Banco', icon: '' },
    { code: 'AC-IN', name: 'Productos para vender', icon: '' },
    { code: 'AC-CL', name: 'Dinero que nos deben los clientes', icon: '' },
    { code: 'AC-IV', name: 'IVA Acreditable', icon: '' },
    { code: 'AC-IP', name: 'IVA por Acreditar', icon: '' },
    { code: 'ANC-ME', name: 'Muebles de Madera', icon: '' },
    { code: 'ANC-EC', name: 'Computadoras de Oficina', icon: '' },
    { code: 'AD-GI', name: 'Gastos de Instalación', icon: '' },
    { code: 'AD-PU', name: 'Papelería y Útiles', icon: '' },
    { code: 'AD-RA', name: 'Rentas Pagadas', icon: '' },
    { code: 'PC-PR', name: 'Dinero que le debemos a la gente', icon: '' },
    { code: 'PC-IT', name: 'IVA de lo que cobramos', icon: '' },
    { code: 'PC-IX', name: 'IVA que cobraremos pronto', icon: '' },
    { code: 'PC-AC', name: 'Apartado de Clientes', icon: '' },
    { code: 'C-CS', name: 'Lo que pusieron los dueños', icon: '' },
    { code: 'C-UN', name: 'Nuestras ganancias por vender', icon: '' },
];

function App() {
    const [view, setView] = useState('smart');
    const [balanceData, setBalanceData] = useState(null);
    const [targetDate, setTargetDate] = useState("2026-02-06"); // Por defecto la última fecha de tus hitos

    // Manual Form States
    const [descripcion, setDescripcion] = useState('');
    const [entries, setEntries] = useState([]);
    const [currentAccount, setCurrentAccount] = useState(ACCOUNTS[0].code);
    const [currentDebe, setCurrentDebe] = useState(0);
    const [currentHaber, setCurrentHaber] = useState(0);

    const fetchBalance = async () => {
        try {
            const resp = await fetch(`http://localhost:5000/api/balance?targetDate=${targetDate}`);
            if (resp.ok) {
                const data = await resp.json();
                setBalanceData(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleExcelData = async (data) => {
        if (!data || data.length === 0) return;

        // Estructura exacta "Hoja Maestra": Fecha, Descripción, Cuenta (Código), Debe (+), Haber (-)
        for (const row of data) {
            try {
                // Buscamos las columnas específicas
                const cuentaCode = row["Cuenta (Código)"] || row["Código"] || row["Cuenta"];
                const accountObj = ACCOUNTS.find(a => cuentaCode?.toString() === a.code);

                if (!accountObj) continue;

                await fetch('http://localhost:5000/api/transaccion', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        date: row["Fecha"] || targetDate,
                        description: row["Descripción"] || row["Concepto"] || "Carga desde Hoja Maestra",
                        entries: [{
                            account: accountObj.code,
                            debe: parseFloat(row["Debe (+)"]) || parseFloat(row["Debe"]) || 0,
                            haber: parseFloat(row["Haber (-)"]) || parseFloat(row["Haber"]) || 0
                        }]
                    })
                });
            } catch (e) { console.error(e); }
        }
        alert("¡Hoja Maestra procesada con éxito!");
        fetchBalance();
        setView('balance');
    };

    const quickAction = async (type) => {
        const monto = prompt(type === 'in' ? "¿Cuánto dinero entró?" : "¿Cuánto dinero gastaste?");
        if (!monto || isNaN(monto)) return;

        const val = parseFloat(monto);
        const description = type === 'in' ? "¡Entró dinero rápido!" : "¡Gasto rápido!";

        const entries = type === 'in'
            ? [{ account: 'AC-CA', debe: val, haber: 0 }, { account: 'C-CS', debe: 0, haber: val }]
            : [{ account: 'PC-PR', debe: 0, haber: val }, { account: 'AC-BA', debe: 0, haber: val }];

        try {
            await fetch('http://localhost:5000/api/transaccion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: targetDate, description, entries })
            });
            fetchBalance();
            alert("¡Acción rápida registrada!");
        } catch (e) { console.error(e); }
    };

    const addEntry = () => {
        if (currentDebe === 0 && currentHaber === 0) return;
        setEntries([...entries, { account: currentAccount, debe: currentDebe, haber: currentHaber }]);
        setCurrentDebe(0);
        setCurrentHaber(0);
    };

    const diff = entries.reduce((acc, e) => acc + e.debe - e.haber, 0);
    const isBalancedManual = Math.abs(diff) < 0.01;

    const handleSubmitManual = async (e) => {
        e.preventDefault();
        if (entries.length === 0 || !isBalancedManual) return;

        try {
            const res = await fetch('http://localhost:5000/api/transaccion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: targetDate,
                    description: descripcion || "Asiento Manual",
                    entries: entries
                })
            });
            if (res.ok) {
                alert('¡Asiento guardado!');
                setDescripcion('');
                setEntries([]);
                fetchBalance();
            }
        } catch (error) { alert('Error al conectar con Nexium.'); }
    };

    useEffect(() => {
        fetchBalance();
    }, [view, targetDate]);

    return (
        <div className="container">
            <header style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '1.5rem', background: 'var(--bg-card)', borderRadius: '1rem', borderBottom: '4px solid #6366f1' }}>
                <h1 style={{ marginBottom: '0.25rem', color: '#6366f1', fontSize: '2.5rem' }}>Nexium, S.A.S.</h1>
                <p style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>Sistema de Contabilidad General</p>
            </header>

            {/* --- SELECTOR HISTÓRICO --- */}
            <SelectorHistorico onDateSelect={setTargetDate} activeDate={targetDate} />

            {/* --- BOTONES DE ACCIÓN RÁPIDA --- */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => quickAction('in')} style={{ background: '#22c55e', color: 'white', flex: 1, height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem' }}>
                    <PlusCircle size={24} /> Entró dinero
                </button>
                <button onClick={() => quickAction('out')} style={{ background: '#ef4444', color: 'white', flex: 1, height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem' }}>
                    <MinusCircle size={24} /> Compra/Gasto
                </button>
            </div>

            <nav style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button onClick={() => setView('smart')} style={{ background: view === 'smart' ? '#22c55e' : 'var(--bg-card)', flex: 1 }}>
                    <Receipt size={18} /> Asistente
                </button>
                <button onClick={() => setView('manual')} style={{ background: view === 'manual' ? '#6366f1' : 'var(--bg-card)', flex: 1 }}>
                    <BookOpen size={18} /> Diario
                </button>
                <button onClick={() => setView('balance')} style={{ background: view === 'balance' ? '#8b5cf6' : 'var(--bg-card)', flex: 1 }}>
                    <Scale size={18} /> Balance General
                </button>
            </nav>

            {view === 'smart' && <RegistroContable onTransactionComplete={fetchBalance} targetDate={targetDate} />}
            {view === 'ledger' && <LibroDiario history={balanceData?.history} onUpdate={fetchBalance} />}
            {view === 'excel' && (
                <div className="card">
                    <h2>Cargar Hoja Maestra de Excel</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Asegúrate de que tu Excel tenga las columnas: Fecha, Descripción, Cuenta (Código), Debe (+), Haber (-)</p>
                    <ExcelLoader onDataLoaded={handleExcelData} />
                </div>
            )}

            {view === 'manual' && (
                <div className="card">
                    <h2>Escribir en el Libro Mágico</h2>
                    <form onSubmit={handleSubmitManual}>
                        <div className="form-group">
                            <label>¿Qué pasó hoy?</label>
                            <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej: Compramos dulces para vender..." required />
                        </div>
                        <div style={{ border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '1rem', background: 'rgba(0,0,0,0.1)' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', marginBottom: '1rem' }}>
                                <div style={{ flex: 2 }}><label>Cuenta Contable</label>
                                    <select value={currentAccount} onChange={(e) => setCurrentAccount(e.target.value)}>
                                        {ACCOUNTS.map(a => <option key={a.code} value={a.code}>{a.name}</option>)}
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}><label>Entró (+)</label><input type="number" value={currentDebe} onChange={(e) => setCurrentDebe(parseFloat(e.target.value) || 0)} /></div>
                                <div style={{ flex: 1 }}><label>Salió (-)</label><input type="number" value={currentHaber} onChange={(e) => setCurrentHaber(parseFloat(e.target.value) || 0)} /></div>
                                <button type="button" onClick={addEntry} style={{ padding: '1rem', borderRadius: '10px' }}>➕</button>
                            </div>
                            <table className="account-table">
                                <thead><tr><th>Cajita</th><th>Entró</th><th>Salió</th></tr></thead>
                                <tbody>
                                    {entries.map((e, i) => (
                                        <tr key={i}>
                                            <td>{e.account}</td>
                                            <td style={{ color: '#22c55e' }}>{e.debe > 0 ? `+$${e.debe}` : ''}</td>
                                            <td style={{ color: '#ef4444' }}>{e.haber > 0 ? `-$${e.haber}` : ''}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div style={{
                            marginTop: '1.5rem',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            background: isBalancedManual ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: isBalancedManual ? '#22c55e' : '#ef4444',
                            fontWeight: 'bold',
                            textAlign: 'center'
                        }}>
                            {isBalancedManual
                                ? "Balance cuadrado correctamente"
                                : `Diferencia en el asiento: $${Math.abs(diff)}`}
                        </div>

                        <button
                            type="submit"
                            disabled={!isBalancedManual || entries.length === 0}
                            style={{
                                width: '100%',
                                marginTop: '1rem',
                                background: isBalancedManual ? '#6366f1' : '#475569',
                                height: '50px',
                                fontSize: '1.1rem',
                                cursor: isBalancedManual ? 'pointer' : 'not-allowed',
                                opacity: isBalancedManual ? 1 : 0.7
                            }}
                        >
                            Guardar mi Asiento
                        </button>
                    </form>
                </div>
            )}

            {view === 'balance' && <BalanceGeneral data={balanceData} />}
        </div>
    );
}

export default App;
