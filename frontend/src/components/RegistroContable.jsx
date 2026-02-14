import React, { useState } from 'react';
import { Receipt, AlertCircle, CheckCircle2 } from 'lucide-react';

const RegistroContable = ({ onTransactionComplete, targetDate }) => {
    const [tipoAsiento, setTipoAsiento] = useState('1');
    const [monto, setMonto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });

    const tipos = [
        { id: '1', nombre: 'Apertura Nexium', desc: 'Sugerencia: Usa el Libro Diario para saldos iniciales complejos.' },
        { id: '2', nombre: 'Compra en Efectivo', desc: 'Inventarios + IVA vs Bancos' },
        { id: '3', nombre: 'Compra a Crédito', desc: 'Inventarios + IVA por Acred. vs Prov.' },
        { id: '4', nombre: 'Compra Combinada (50/50)', desc: 'Mitad efectivo, mitad crédito' },
        { id: '5', nombre: 'Venta con Anticipo', desc: 'Entrada a Bancos + Clientes vs Venta + IVA' },
        { id: '6', nombre: 'Compra de Papelería', desc: 'Cargo a AD-PU vs Bancos' },
        { id: '7', nombre: 'Pago Rentas Anticipadas', desc: 'Cargo a AD-RA vs Bancos' },
        { id: '8', nombre: 'Gastos de Instalación', desc: 'Cargo a AD-GI vs Bancos' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!monto && tipoAsiento !== '1') return;

        let entries = [];
        const val = parseFloat(monto);
        const iva = val * 0.16;
        const total = val + iva;

        switch (tipoAsiento) {
            case '2': // Compra Efectivo
                entries = [
                    { account: 'AC-IN', debe: val, haber: 0 },
                    { account: 'AC-IV', debe: iva, haber: 0 },
                    { account: 'AC-BA', debe: 0, haber: total }
                ];
                break;
            case '3': // Compra Crédito
                entries = [
                    { account: 'AC-IN', debe: val, haber: 0 },
                    { account: 'AC-IP', debe: iva, haber: 0 },
                    { account: 'PC-PR', debe: 0, haber: total }
                ];
                break;
            case '4': // Compra Mixta
                entries = [
                    { account: 'AC-IN', debe: val, haber: 0 },
                    { account: 'AC-IV', debe: iva / 2, haber: 0 },
                    { account: 'AC-IP', debe: iva / 2, haber: 0 },
                    { account: 'AC-BA', debe: 0, haber: total / 2 },
                    { account: 'PC-PR', debe: 0, haber: total / 2 }
                ];
                break;
            case '5': // Venta con Anticipo
                // Basado en el ejemplo de 06/02/2026
                const subtotalVenta = val / 1.16;
                const ivaTotal = val - subtotalVenta;
                entries = [
                    { account: 'AC-BA', debe: total * 0.20, haber: 0 },
                    { account: 'AC-CL', debe: total * 0.80, haber: 0 },
                    { account: 'C-UN', debe: 0, haber: subtotalVenta }, // Usamos C-UN como cuenta puente de ingresos en esta práctica
                    { account: 'PC-IT', debe: 0, haber: ivaTotal * 0.20 },
                    { account: 'PC-IX', debe: 0, haber: ivaTotal * 0.80 }
                ];
                break;
            case '6': // Papelería
                entries = [
                    { account: 'AD-PU', debe: val, haber: 0 },
                    { account: 'AC-BA', debe: 0, haber: val }
                ];
                break;
            case '7': // Rentas
                entries = [
                    { account: 'AD-RA', debe: val, haber: 0 },
                    { account: 'AC-BA', debe: 0, haber: val }
                ];
                break;
            case '8': // Instalación
                entries = [
                    { account: 'AD-GI', debe: val, haber: 0 },
                    { account: 'AC-BA', debe: 0, haber: val }
                ];
                break;
        }

        try {
            const res = await fetch('http://localhost:5000/api/transaccion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: targetDate,
                    description: descripcion || tipos.find(t => t.id === tipoAsiento).nombre,
                    entries
                })
            });

            if (res.ok) {
                setStatus({ type: 'success', message: '¡Asiento Nexium grabado exitosamente!' });
                setMonto('');
                setDescripcion('');
                if (onTransactionComplete) onTransactionComplete();
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Error de conexión con el motor Docker.' });
        }
    };

    return (
        <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <Receipt className="text-success" />
                <h2 style={{ margin: 0 }}>Motor Contable V2 - Nexium</h2>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>¿Qué operación quieres automatizar?</label>
                    <select
                        value={tipoAsiento}
                        onChange={(e) => setTipoAsiento(e.target.value)}
                        style={{ borderLeft: '4px solid #22c55e' }}
                    >
                        {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label>Monto de la Factura (Subtotal o Total según contexto):</label>
                    <input
                        type="number"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                        placeholder="Monto sin signos..."
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Nota del Asiento:</label>
                    <input
                        type="text"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Ej. Factura 456 de Mobiliario..."
                    />
                </div>

                <button type="submit" style={{ width: '100%', background: '#22c55e', marginTop: '1rem', fontWeight: 'bold' }}>
                    Sincronizar con Balance General
                </button>

                {status.message && (
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        background: status.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: status.type === 'success' ? '#22c55e' : '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '0.875rem'
                    }}>
                        {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        {status.message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default RegistroContable;
