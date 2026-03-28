import React, { useState, useEffect } from 'react';
import Dashboard from './views/Dashboard';
import RegistroContable from './components/RegistroContable';
import BalanceGeneral from './components/BalanceGeneral';
import LibroDiario from './components/LibroDiario';
import ExcelLoader from './components/ExcelLoader';
import EstadoResultados from './components/EstadoResultados';
import BalanzaComprobacion from './components/BalanzaComprobacion';
import SelectorHistorico from './components/SelectorHistorico';
import MainLayout from './layout/MainLayout';
import { useNotification, Modal } from './components/UI/Notification';
import { IoWarning } from 'react-icons/io5';

import { ACCOUNTS } from './constants/accounts';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

function App() {
    const { show, NotificationContainer } = useNotification();
    const [view, setView] = useState('dashboard');
    const [balanceData, setBalanceData] = useState(null);
    const [targetDate, setTargetDate] = useState("2026-03-26");
    const [isSeedModalOpen, setIsSeedModalOpen] = useState(false);

    const fetchBalance = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/balance?targetDate=${targetDate}`);
            if (resp.ok) {
                const data = await resp.json();
                setBalanceData(data);
            }
        } catch (e) {
            show("Error de conexión con el motor Nexium", "error");
        }
    };

    const runSeed = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/seed`, { method: 'POST' });
            if (res.ok) {
                show("Sistema Nexium restaurado con datos de clase (19 asientos)", "success");
                setIsSeedModalOpen(false);
                fetchBalance();
            }
        } catch (e) {
            show("Fallo al restaurar base de datos", "error");
        }
    };

    const handleExcelData = async (data) => {
        if (!data || data.length === 0) return;

        // Agrupar filas por Fecha y Descripción para crear asientos compuestos
        const groupings = {};
        
        for (const row of data) {
            const fecha = row["Fecha"] || targetDate;
            const desc = row["Descripción"] || row["Concepto"] || "Importación Masiva Nexium";
            const key = `${fecha}|${desc}`;

            const cuentaCode = row["Cuenta (Código)"] || row["Código"] || row["Cuenta"];
            const accountObj = ACCOUNTS.find(a => cuentaCode?.toString() === a.code);

            if (!accountObj) continue;

            if (!groupings[key]) {
                groupings[key] = { date: fecha, description: desc, entries: [] };
            }

            groupings[key].entries.push({
                account: accountObj.code,
                debe: parseFloat(row["Debe (+)"]) || parseFloat(row["Debe"]) || 0,
                haber: parseFloat(row["Haber (-)"]) || parseFloat(row["Haber"]) || 0
            });
        }

        const transactions = Object.values(groupings);
        
        if (transactions.length === 0) {
            show("No se encontraron cuentas válidas en el archivo.", "error");
            return;
        }

        let successCount = 0;
        for (const trans of transactions) {
            try {
                const res = await fetch(`${API_BASE_URL}/transaccion`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(trans)
                });
                if (res.ok) successCount++;
            } catch (e) { console.error(e); }
        }

        show(`¡Ingesta Nexium completada! ${successCount} asientos generados.`, "success");
        fetchBalance();
        setView('diario');
    };

    const quickAction = async (type) => {
        const monto = prompt(type === 'in' ? "¿Cuánto dinero entró? (Nexium SAS)" : "¿Cuánto dinero gastaste?");
        if (!monto || isNaN(monto)) return;

        const val = parseFloat(monto);
        const description = type === 'in' ? "Venta Directa - Dashboard" : "Gasto Operativo - Dashboard";

        const entries = type === 'in'
            ? [{ account: 'AC-CA', debe: val, haber: 0 }, { account: 'C-UN', debe: 0, haber: val }]
            : [{ account: 'PC-PR', debe: 0, haber: val }, { account: 'AC-BA', debe: 0, haber: val }];

        try {
            const res = await fetch(`${API_BASE_URL}/transaccion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: targetDate, description, entries })
            });

            if (res.ok) {
                fetchBalance();
                show("¡Documento Nexium generado exitosamente!", "success");
            }
        } catch (e) {
            show("Error al registrar acción rápida", "error");
        }
    };

    useEffect(() => {
        fetchBalance();
    }, [targetDate]);

    return (
        <MainLayout setView={setView} activeView={view} onResetData={() => setIsSeedModalOpen(true)}>
            <div className="max-w-[1600px] mx-auto pb-20">
                <div className="mb-12">
                    <SelectorHistorico onDateSelect={setTargetDate} activeDate={targetDate} />
                </div>

                {view === 'dashboard' && <Dashboard onQuickAction={quickAction} data={balanceData} />}
                {view === 'registro' && <RegistroContable onTransactionComplete={fetchBalance} targetDate={targetDate} />}
                {view === 'balance' && <BalanceGeneral data={balanceData} />}
                {view === 'resultados' && <EstadoResultados data={balanceData} />}
                {view === 'balanza' && <BalanzaComprobacion data={balanceData} />}
                {view === 'diario' && <LibroDiario history={balanceData?.history} onUpdate={fetchBalance} />}
                {view === 'excel' && <ExcelLoader onDataLoaded={handleExcelData} />}
            </div>

            <Modal 
                isOpen={isSeedModalOpen} 
                onClose={() => setIsSeedModalOpen(false)} 
                title="Restaurar Base de Datos"
                footer={(
                    <>
                        <button onClick={() => setIsSeedModalOpen(false)} className="px-6 py-3 rounded-2xl font-bold bg-surface-container text-on-surface">Cancelar</button>
                        <button onClick={runSeed} className="px-8 py-3 rounded-2xl font-bold bg-error text-white shadow-lg shadow-error/20">Sí, Restaurar Todo</button>
                    </>
                )}
            >
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
                        <IoWarning size={40} />
                    </div>
                    <p className="text-on-surface font-headline font-bold text-xl">¿Estás completamente seguro?</p>
                    <p className="text-sm text-outline leading-relaxed">
                        Esta acción borrará todas las transacciones actuales e inyectará los <strong>19 asientos contables</strong> definidos en el archivo de clase (2.md).
                    </p>
                </div>
            </Modal>

            <NotificationContainer />
        </MainLayout>
    );
}

export default App;
