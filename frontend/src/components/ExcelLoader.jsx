import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';

const ExcelLoader = ({ onDataLoaded }) => {
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                if (data.length === 0) {
                    throw new Error("El archivo Excel está vacío.");
                }

                setStatus({ type: 'success', message: `¡Leídas ${data.length} filas exitosamente!` });
                onDataLoaded(data);
            } catch (error) {
                setStatus({ type: 'error', message: `Error al leer Excel: ${error.message}` });
            }
        };
        reader.onerror = () => setStatus({ type: 'error', message: 'Error al leer el archivo.' });
        reader.readAsBinaryString(file);
    };

    return (
        <div style={{
            border: '2px dashed #3b82f6',
            padding: '2rem',
            textAlign: 'center',
            borderRadius: '1rem',
            background: 'rgba(59, 130, 246, 0.05)',
            marginBottom: '2rem',
            cursor: 'pointer',
            transition: 'all 0.3s'
        }}>
            <input
                type="file"
                id="excel-input"
                style={{ display: 'none' }}
                onChange={handleFile}
                accept=".xlsx, .xls"
            />
            <label htmlFor="excel-input" style={{ cursor: 'pointer', display: 'block' }}>
                <FileSpreadsheet size={48} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
                <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    Arrastra tu archivo de Excel aquí
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    O haz clic para seleccionar (Soporta .xlsx y .xls)
                </p>
            </label>

            {status.message && (
                <div style={{
                    marginTop: '1.5rem',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    background: status.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: status.type === 'success' ? '#22c55e' : '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem'
                }}>
                    {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {status.message}
                </div>
            )}
        </div>
    );
};

export default ExcelLoader;
