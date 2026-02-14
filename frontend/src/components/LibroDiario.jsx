import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Calendar, Search } from 'lucide-react';

const LibroDiario = ({ history, onUpdate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingTx, setEditingTx] = useState(null);

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este asiento?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/transaccion/${id}`, { method: 'DELETE' });
            if (res.ok) onUpdate();
        } catch (e) { console.error(e); }
    };

    const filtered = history?.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.date.includes(searchTerm)
    ).reverse();

    return (
        <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <BookOpen size={24} className="text-primary" />
                    <h2 style={{ margin: 0 }}>Libro Diario - Nexium, S.A.S.</h2>
                </div>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por fecha o concepto..."
                        style={{ paddingLeft: '2.5rem', width: '300px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table className="account-table">
                    <thead>
                        <tr>
                            <th style={{ width: '120px' }}>Fecha</th>
                            <th>Concepto / Cuenta</th>
                            <th style={{ textAlign: 'right', width: '150px' }}>Debe (+)</th>
                            <th style={{ textAlign: 'right', width: '150px' }}>Haber (-)</th>
                            <th style={{ width: '80px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered?.map((t) => (
                            <React.Fragment key={t.id}>
                                <tr style={{ background: 'rgba(99, 102, 241, 0.05)' }}>
                                    <td style={{ fontWeight: 'bold' }}>{t.date}</td>
                                    <td style={{ fontWeight: 'bold' }} colSpan="2">{t.description}</td>
                                    <td></td>
                                    <td style={{ textAlign: 'right', display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => handleDelete(t.id)} className="btn-icon text-error"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                                {t.entries.map((e, idx) => (
                                    <tr key={`${t.id}-${idx}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                        <td></td>
                                        <td style={{ paddingLeft: '2rem', fontSize: '0.9rem' }}>{e.account}</td>
                                        <td style={{ textAlign: 'right', color: '#22c55e' }}>{e.debe > 0 ? `$${e.debe.toLocaleString()}` : ''}</td>
                                        <td style={{ textAlign: 'right', color: '#ef4444' }}>{e.haber > 0 ? `$${e.haber.toLocaleString()}` : ''}</td>
                                        <td></td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LibroDiario;
