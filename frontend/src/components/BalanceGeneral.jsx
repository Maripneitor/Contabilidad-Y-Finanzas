import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import {
    PiggyBank,
    CreditCard,
    Users,
    Scale,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    TrendingDown,
    Activity
} from 'lucide-react';

const formatCurrency = (val) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val || 0);

const Row = ({ label, val, color, icon }) => (
    <div className="balance-row" style={{ borderLeft: `4px solid ${color || '#f1f5f9'}`, padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '0 8px 8px 0', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>{icon}</span>
            <span>{label}</span>
        </div>
        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{formatCurrency(val)}</span>
    </div>
);

const BalanceGeneral = ({ data }) => {
    const reportRef = useRef();

    if (!data) return (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
            <Activity size={48} className="text-muted" style={{ marginBottom: '1rem', animation: 'pulse 2s infinite' }} />
            <p>Calculando la magia de Nexium...</p>
        </div>
    );

    const { header, body, footer } = data;

    const calculateTotalActivo = (b) => {
        return (b['AC-CA'] || 0) + (b['AC-BA'] || 0) + (b['AC-IN'] || 0) +
            (b['AC-CL'] || 0) + (b['AC-IV'] || 0) + (b['AC-IP'] || 0) +
            (b['ANC-ME'] || 0) + (b['ANC-EC'] || 0) +
            (b['AD-GI'] || 0) + (b['AD-PU'] || 0) + (b['AD-RA'] || 0);
    };

    const calculateTotalPasivoCapital = (b) => {
        const pasivo = Math.abs(b['PC-PR'] || 0) + Math.abs(b['PC-IX'] || 0) +
            Math.abs(b['PC-IT'] || 0) + Math.abs(b['PC-AC'] || 0);
        const capital = Math.abs(b['C-CS'] || 0) + Math.abs(b['C-UN'] || 0);
        return pasivo + capital;
    };

    const diff = calculateTotalActivo(body) - calculateTotalPasivoCapital(body);
    const isBalanced = Math.abs(diff) < 0.1;

    // Lógica de la Barra de Progreso Mágica (Visual)
    const totalActivo = calculateTotalActivo(body);
    const totalPC = calculateTotalPasivoCapital(body);
    const maxVal = Math.max(totalActivo, totalPC, 1);
    const pctActivo = (totalActivo / maxVal) * 100;
    const pctPC = (totalPC / maxVal) * 100;

    const downloadPDF = () => {
        const element = reportRef.current;
        const opt = {
            margin: 0.5,
            filename: `Nexium_Balance_Magico_${header.date}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

            {/* --- BALANZA MÁGICA VISUAL --- */}
            <div className="card" style={{ width: '100%', maxWidth: '900px', marginBottom: '2rem', padding: '2rem', background: 'linear-gradient(145deg, var(--bg-card), rgba(99, 102, 241, 0.05))' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <Scale size={24} color={isBalanced ? '#22c55e' : '#ef4444'} />
                    Balance General de Nexium
                </h3>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>ACTIVO TOTAL</p>
                        <h4 style={{ margin: 0, color: '#22c55e' }}>{formatCurrency(totalActivo)}</h4>
                    </div>

                    {/* El Eje de la Balanza */}
                    <div style={{
                        height: '40px',
                        width: '4px',
                        background: isBalanced ? '#22c55e' : '#ef4444',
                        transform: isBalanced ? 'rotate(0deg)' : diff > 0 ? 'rotate(20deg)' : 'rotate(-20deg)',
                        transition: 'transform 0.5s ease',
                        borderRadius: '2px'
                    }} />

                    <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>PASIVO + CAPITAL</p>
                        <h4 style={{ margin: 0, color: '#ef4444' }}>{formatCurrency(totalPC)}</h4>
                    </div>
                </div>

                <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: `${pctActivo}%`, background: '#22c55e', transition: 'width 0.5s ease' }} />
                    <div style={{ width: '2px', background: 'white', zIndex: 10 }} />
                    <div style={{ width: `${pctPC}%`, background: '#ef4444', transition: 'width 0.5s ease' }} />
                </div>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    {isBalanced ? (
                        <div style={{ color: '#22c55e', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.1rem' }}>
                            <CheckCircle size={24} /> El balance se encuentra cuadrado.
                        </div>
                    ) : (
                        <div style={{ color: '#ef4444', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.1rem' }}>
                            <AlertTriangle size={24} /> Existe una diferencia en las cuentas.
                        </div>
                    )}
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Diferencia: {formatCurrency(Math.abs(diff))}
                    </p>
                </div>
            </div>

            <button onClick={downloadPDF} className="btn-primary" style={{ marginBottom: '2rem', height: '50px', padding: '0 2rem', fontSize: '1.1rem' }}>
                Descargar Reporte Balance General (PDF)
            </button>

            <div ref={reportRef} className="balance-sheet-container friendly-mode" style={{ width: '100%', maxWidth: '900px' }}>
                <header className="balance-header" style={{ borderBottom: '2px solid #6366f1', paddingBottom: '1.5rem' }}>
                    <h1 className="company-name" style={{ fontSize: '2rem' }}>{header.company}</h1>
                    <h2 className="report-title" style={{ fontSize: '1.2rem', opacity: 0.8 }}>{header.report}</h2>
                    <div style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        background: '#6366f1',
                        color: 'white',
                        borderRadius: '20px',
                        display: 'inline-block',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                    }}>
                        CORTE AL: {header.date}
                    </div>
                </header>

                <div className="balance-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                    {/* SECCIÓN VERDE: LO QUE TENEMOS */}
                    <div className="balance-section">
                        <h3 className="section-title" style={{ background: '#22c55e', color: 'white', borderRadius: '8px', padding: '10px 15px' }}>
                            ACTIVOS (Bienes y Derechos)
                        </h3>

                        <h4 className="subsection-title">Circulante</h4>
                        <div className="subsection-content">
                            <Row icon="" label="Caja y Efectivo" val={body['AC-CA']} color="#22c55e" />
                            <Row icon="" label="Bancos" val={body['AC-BA']} color="#22c55e" />
                            <Row icon="" label="Inventarios" val={body['AC-IN']} color="#22c55e" />
                            <Row icon="" label="Clientes" val={body['AC-CL']} color="#22c55e" />
                            <Row icon="" label="IVA Acreditable" val={body['AC-IV']} color="#22c55e" />
                            <Row icon="" label="IVA por Acreditar" val={body['AC-IP']} color="#22c55e" />
                        </div>

                        <h4 className="subsection-title">No Circulante</h4>
                        <div className="subsection-content">
                            <Row icon="" label="Mobiliario y Equipo de Oficina" val={body['ANC-ME']} color="#10b981" />
                            <Row icon="" label="Equipo de Cómputo" val={body['ANC-EC']} color="#10b981" />
                        </div>

                        <h4 className="subsection-title">Diferido</h4>
                        <div className="subsection-content">
                            <Row icon="" label="Gastos de Instalación" val={body['AD-GI']} color="#059669" />
                            <Row icon="" label="Papelería y Útiles" val={body['AD-PU']} color="#059669" />
                            <Row icon="" label="Rentas Pagadas por Anticipado" val={body['AD-RA']} color="#059669" />
                        </div>

                        <div className="total-row" style={{ marginTop: '1.5rem', background: 'rgba(34, 197, 94, 0.1)', color: '#047857', padding: '15px' }}>
                            <span>TOTAL ACTIVO:</span>
                            <span>{formatCurrency(totalActivo)}</span>
                        </div>
                    </div>

                    {/* SECCIÓN ROJA/AZUL: DEUDAS Y SOCIOS */}
                    <div className="balance-section">
                        <h3 className="section-title" style={{ background: '#ef4444', color: 'white', borderRadius: '8px', padding: '10px 15px' }}>
                            PASIVO (Deudas y Obligaciones)
                        </h3>

                        <h4 className="subsection-title">Corto Plazo</h4>
                        <div className="subsection-content">
                            <Row icon="" label="Proveedores" val={Math.abs(body['PC-PR'] || 0)} color="#ef4444" />
                            <Row icon="" label="IVA Trasladado" val={Math.abs(body['PC-IT'] || 0)} color="#ef4444" />
                            <Row icon="" label="IVA por Trasladar" val={Math.abs(body['PC-IX'] || 0)} color="#ef4444" />
                            <Row icon="" label="Anticipo de Clientes" val={Math.abs(body['PC-AC'] || 0)} color="#ef4444" />
                        </div>

                        <h3 className="section-title" style={{ background: '#3b82f6', color: 'white', borderRadius: '8px', padding: '10px 15px', marginTop: '2rem' }}>
                            CAPITAL CONTABLE (Socios)
                        </h3>
                        <div className="subsection-content">
                            <Row icon="" label="Capital Social" val={Math.abs(body['C-CS'] || 0)} color="#3b82f6" />
                            <Row icon="" label="Utilidad del Ejercicio" val={Math.abs(body['C-UN'] || 0)} color="#3b82f6" />
                        </div>

                        <div className="total-row" style={{ marginTop: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', color: '#1e40af', padding: '15px' }}>
                            <span>TOTAL PASIVO + CAPITAL:</span>
                            <span>{formatCurrency(totalPC)}</span>
                        </div>
                    </div>
                </div>

                <footer className="balance-footer" style={{ borderTop: '2px dashed rgba(0,0,0,0.1)', marginTop: '3rem', paddingTop: '2rem' }}>
                    <div className="signature-box">
                        <div className="signature-line" style={{ borderColor: '#000', fontWeight: 'bold' }}>Mario Efraín Moguel Hernández</div>
                        <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>Elaboró: Director</div>
                    </div>
                    <div className="signature-box">
                        <div className="signature-line" style={{ borderColor: '#000', fontWeight: 'bold' }}>GONZALEZ ZUÑIGA NURIA</div>
                        <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>Autorizó</div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default BalanceGeneral;
