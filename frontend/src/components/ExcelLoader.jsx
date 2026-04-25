import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelLoader = ({ onDataLoaded }) => {
    const [status, setStatus] = useState({ type: '', message: '' });
    const [previewData, setPreviewData] = useState([]);

    const [workbook, setWorkbook] = useState(null);
    const [sheetNames, setSheetNames] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState('');

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                setWorkbook(wb);
                setSheetNames(wb.SheetNames);
                setSelectedSheet(wb.SheetNames[0]);
                loadSheetData(wb, wb.SheetNames[0]);
            } catch (error) {
                setStatus({ type: 'error', message: `Error al leer Excel: ${error.message}` });
            }
        };
        reader.onerror = () => setStatus({ type: 'error', message: 'Error al leer el archivo.' });
        reader.readAsBinaryString(file);
    };

    const loadSheetData = (wb, sheetName) => {
        try {
            const ws = wb.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(ws);
            if (data.length === 0) {
                setStatus({ type: 'warning', message: `La hoja "${sheetName}" parece estar vacía.` });
                setPreviewData([]);
                return;
            }
            setStatus({ type: 'success', message: `Hojas leídas procedentes: ${data.length} registros cargados.` });
            setPreviewData(data.slice(0, 10)); // More preview
        } catch (error) {
            setStatus({ type: 'error', message: `Error al cargar hoja: ${error.message}` });
        }
    };

    const handleSheetChange = (e) => {
        const name = e.target.value;
        setSelectedSheet(name);
        loadSheetData(workbook, name);
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <header>
                <p className="font-inter text-[10px] uppercase tracking-[0.2em] text-outline mb-1 font-bold italic opacity-60">Suministro de Información</p>
                <h1 className="text-4xl font-extrabold font-headline tracking-tighter text-on-surface leading-none">
                    Cargador <span className="text-primary italic">Excel</span>
                </h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Dropzone Section */}
                <section className="lg:col-span-4 h-full">
                    <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-[2.5rem] p-10 flex flex-col items-center justify-center border-2 border-dashed border-primary/20 hover:border-primary transition-all group cursor-pointer h-full shadow-sm hover:shadow-2xl">
                        <input
                            type="file"
                            id="excel-input"
                            className="hidden"
                            onChange={handleFile}
                            accept=".xlsx, .xls, .csv"
                        />
                        <label htmlFor="excel-input" className="cursor-pointer flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform text-primary">
                                <span className="material-symbols-outlined text-4xl">upload_file</span>
                            </div>
                            <h3 className="font-headline font-bold text-2xl text-on-background dark:text-white mb-4 tracking-tight">Cargar Matriz de Datos</h3>
                            <p className="text-sm text-outline px-6 mb-10 opacity-70 leading-relaxed font-inter font-medium">Suelte su archivo .xlsx o .csv aquí para iniciar la ingesta masiva al Motor Contable.</p>
                            <span className="bg-on-background dark:bg-slate-100 text-white dark:text-slate-900 px-10 py-4 rounded-2xl font-bold text-sm shadow-xl hover:opacity-90 transition-all active:scale-95">
                                Seleccionar Carpeta
                            </span>
                        </label>
                    </div>
                </section>

                {/* Status & Preview */}
                <section className="lg:col-span-8 flex flex-col gap-8 h-full">
                    <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-surface-container flex-1 flex flex-col h-full min-h-[500px]">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                            <div>
                                <h3 className="font-headline font-bold text-2xl text-on-surface">Inspección de Carga</h3>
                                <p className="text-[10px] font-bold text-outline uppercase tracking-widest opacity-60">Vista previa del Motor Nexium</p>
                            </div>
                            
                            {sheetNames.length > 0 && (
                                <div className="flex items-center gap-3 bg-surface-container p-2 rounded-2xl border border-surface-container-high">
                                    <span className="text-[10px] font-bold text-outline px-2">Hoja activa:</span>
                                    <select 
                                        value={selectedSheet} 
                                        onChange={handleSheetChange}
                                        className="bg-surface-container-low text-on-surface text-xs font-bold py-2 px-4 rounded-xl outline-none focus:ring-2 ring-primary/20 transition-all border-none"
                                    >
                                        {sheetNames.map(name => <option key={name} value={name}>{name}</option>)}
                                    </select>
                                </div>
                            )}

                            {status.message && (
                                <div className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${
                                    status.type === 'success' ? 'bg-tertiary/10 text-tertiary' : status.type === 'warning' ? 'bg-amber-500/10 text-amber-600' : 'bg-error/10 text-error'
                                }`}>
                                    <span className={`w-2 h-2 rounded-full ${status.type === 'success' ? 'bg-tertiary animate-pulse' : 'bg-error'}`}></span>
                                    {status.type === 'success' ? 'Datos Nominales' : status.type === 'warning' ? 'Alerta Lectura' : 'Fallo Crítico'}
                                </div>
                            )}
                        </div>

                        <div className="overflow-x-auto flex-1 rounded-2xl border border-surface-container/50 bg-surface-container-low dark:bg-slate-800/50 block">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-low dark:bg-slate-800">
                                        <th className="px-8 py-4 font-inter text-[10px] uppercase tracking-[0.2em] text-outline font-bold">Registro</th>
                                        <th className="px-8 py-4 font-inter text-[10px] uppercase tracking-[0.2em] text-outline font-bold">Identificador de Cuenta</th>
                                        <th className="px-8 py-4 font-inter text-[10px] uppercase tracking-[0.2em] text-outline font-bold text-right">Monto (Valor)</th>
                                        <th className="px-8 py-4 font-inter text-[10px] uppercase tracking-[0.2em] text-outline font-bold text-center">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {previewData.length > 0 ? (
                                        previewData.map((row, i) => {
                                            const code = row["Cuenta (Código)"] || row.Código || row.Cuenta || Object.values(row)[0];
                                            const val = parseFloat(row["Debe (+)"]) || parseFloat(row.Debe) || parseFloat(row["Haber (-)"]) || parseFloat(row.Haber) || 0;
                                            return (
                                                <tr key={i} className="hover:bg-primary/5 transition-colors border-b border-surface-container/30 last:border-0 group">
                                                    <td className="px-8 py-5">
                                                        <span className="font-mono font-bold text-primary">ID_{(i+1).toString().padStart(3, '0')}</span>
                                                    </td>
                                                    <td className="px-8 py-5 text-on-surface-variant dark:text-slate-300 font-bold uppercase tracking-tight">
                                                        {code?.toString() || '---'}
                                                    </td>
                                                    <td className="px-8 py-5 font-mono font-extrabold text-right text-on-surface-variant tabular-nums">
                                                        ${val.toLocaleString()}
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex justify-center text-outline">
                                                            <span className="material-symbols-outlined text-lg">check_circle</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-32 text-center text-outline italic opacity-50">
                                                <span className="material-symbols-outlined text-4xl block mb-4">folder_open</span>
                                                Aún no se han inyectado archivos a la memoria temporal.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {previewData.length > 0 && (
                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => onDataLoaded(previewData)}
                                    className="bg-primary text-white px-10 py-4 rounded-2xl font-bold font-headline shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center gap-3"
                                >
                                    <span className="material-symbols-outlined">sync_alt</span>
                                    <span>Confirmar Ingesta Masiva</span>
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ExcelLoader;
