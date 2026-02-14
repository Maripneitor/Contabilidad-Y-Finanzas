import React from 'react';

const SelectorHistorico = ({ onDateSelect, activeDate }) => {
    // Fechas clave extraídas de tus archivos
    const hitos = ["2026-01-23", "2026-01-28", "2026-01-31", "2026-02-04", "2026-02-06"];

    return (
        <div style={{
            display: 'flex',
            gap: '0.75rem',
            padding: '1rem',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '1rem',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap'
        }}>
            <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Ver Balance al:</span>
            {hitos.map(fecha => (
                <button
                    key={fecha}
                    onClick={() => onDateSelect(fecha)}
                    style={{
                        px: '0.75rem',
                        py: '0.25rem',
                        fontSize: '0.75rem',
                        borderRadius: '999px',
                        background: activeDate === fecha ? 'var(--primary)' : 'rgba(99, 102, 241, 0.1)',
                        color: activeDate === fecha ? 'white' : 'var(--primary)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontWeight: activeDate === fecha ? 'bold' : 'normal'
                    }}
                >
                    {fecha}
                </button>
            ))}
        </div>
    );
};

export default SelectorHistorico;
