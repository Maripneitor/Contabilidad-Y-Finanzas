import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoCalculatorOutline, IoCashOutline, IoDocumentTextOutline, 
  IoShieldCheckmarkOutline, IoPrintOutline, IoAlertCircleOutline,
  IoTrendingUpOutline, IoTrendingDownOutline
} from 'react-icons/io5';

const Billetes = [1000, 500, 200, 100, 50, 20];
const Monedas = [20, 10, 5, 2, 1, 0.5];

const ArqueoDeCaja = () => {
  const [conteoBilletes, setConteoBilletes] = useState({});
  const [conteoMonedas, setConteoMonedas] = useState({});
  
  const [saldoSistema, setSaldoSistema] = useState(0);
  const [otrosDocumentos, setOtrosDocumentos] = useState(0); 

  const [totalFisico, setTotalFisico] = useState(0);
  const [diferencia, setDiferencia] = useState(0);

  const handleInputChange = (e, denominacion, setFunction, currentState) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0) {
      setFunction({ ...currentState, [denominacion]: value });
    }
  };

  useEffect(() => {
    let sumaBilletes = Billetes.reduce((acc, val) => acc + (val * (conteoBilletes[val] || 0)), 0);
    let sumaMonedas = Monedas.reduce((acc, val) => acc + (val * (conteoMonedas[val] || 0)), 0);
    
    const totalContado = sumaBilletes + sumaMonedas + otrosDocumentos;
    setTotalFisico(totalContado);
    setDiferencia(totalContado - saldoSistema);
  }, [conteoBilletes, conteoMonedas, saldoSistema, otrosDocumentos]);

  const obtenerEstadoArqueo = () => {
    if (saldoSistema === 0 && totalFisico === 0) return { text: "Esperando datos...", color: "text-outline", icon: IoCalculatorOutline };
    if (Math.abs(diferencia) < 0.01) return { text: "CUADRE EXACTO", color: "text-tertiary", icon: IoShieldCheckmarkOutline };
    if (diferencia > 0) return { text: `SOBRANTE: +$${diferencia.toFixed(2)}`, color: "text-amber-500", icon: IoTrendingUpOutline };
    return { text: `FALTANTE: -$${Math.abs(diferencia).toFixed(2)}`, color: "text-error", icon: IoTrendingDownOutline };
  };

  const estado = obtenerEstadoArqueo();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-6xl mx-auto p-4"
    >
      <header className="flex justify-between items-end border-b-2 border-primary/20 pb-6">
        <div>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Control Interno • Nexium</p>
          <h1 className="text-4xl font-black font-headline text-on-surface tracking-tighter">
            Arqueo de <span className="text-primary italic">Caja</span>
          </h1>
          <p className="text-sm text-outline font-medium mt-1">Conciliación de fondo físico vs sistema en tiempo real</p>
        </div>
        <button className="bg-surface-container-high p-4 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-lg hover:shadow-primary/30">
          <IoPrintOutline className="text-xl" />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="space-y-6">
          
          <section className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-xl shadow-black/5 border border-surface-container">
            <h2 className="text-xl font-black font-headline mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <IoCashOutline className="text-xl" />
              </span>
              Efectivo: Billetes
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {Billetes.map(denominacion => (
                <div key={`billete-${denominacion}`} className="flex items-center justify-between group">
                  <label className="text-sm font-bold text-on-surface/70 group-hover:text-primary transition-colors">
                    ${denominacion.toLocaleString()}
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-24 bg-surface-container-low border border-surface-container rounded-xl px-3 py-2 text-right font-black focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    value={conteoBilletes[denominacion] || ''}
                    onChange={(e) => handleInputChange(e, denominacion, setConteoBilletes, conteoBilletes)}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-xl shadow-black/5 border border-surface-container">
            <h2 className="text-xl font-black font-headline mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-tertiary/10 text-tertiary rounded-xl flex items-center justify-center">
                <IoCalculatorOutline className="text-xl" />
              </span>
              Efectivo: Monedas
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {Monedas.map(denominacion => (
                <div key={`moneda-${denominacion}`} className="flex items-center justify-between group">
                  <label className="text-sm font-bold text-on-surface/70 group-hover:text-tertiary transition-colors">
                    ${denominacion}
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-24 bg-surface-container-low border border-surface-container rounded-xl px-3 py-2 text-right font-black focus:outline-none focus:ring-2 focus:ring-tertiary/20 focus:border-tertiary transition-all"
                    value={conteoMonedas[denominacion] || ''}
                    onChange={(e) => handleInputChange(e, denominacion, setConteoMonedas, conteoMonedas)}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </section>

        </div>

        <div className="space-y-6">
          
          <section className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-xl shadow-black/5 border border-surface-container">
            <h2 className="text-xl font-black font-headline mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                <IoDocumentTextOutline className="text-xl" />
              </span>
              Datos del Sistema
            </h2>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-outline">Saldo esperado en sistema ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline font-black">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full bg-surface-container-low border border-surface-container rounded-2xl pl-8 pr-4 py-4 text-2xl font-black text-on-surface focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                    value={saldoSistema || ''}
                    onChange={(e) => setSaldoSistema(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-outline">Otros Documentos (Vales/Vouchers)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full bg-surface-container-low border border-surface-container rounded-2xl px-4 py-3 font-bold text-on-surface focus:outline-none focus:border-blue-500 transition-all"
                  value={otrosDocumentos || ''}
                  onChange={(e) => setOtrosDocumentos(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </section>

          <div className="bg-on-background dark:bg-surface-container-high text-white dark:text-on-surface rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110"></div>
            
            <div className="relative z-10 space-y-8">
              <div>
                <h3 className="text-2xl font-black font-headline mb-6 border-b border-white/10 pb-4">Resumen de Cuadre</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-white/70">
                    <span className="text-xs font-bold uppercase tracking-widest">Total Físico Contado</span>
                    <span className="text-2xl font-black font-mono text-white">${totalFisico.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-white/70">
                    <span className="text-xs font-bold uppercase tracking-widest">Total según Sistema</span>
                    <span className="text-2xl font-black font-mono text-white">${saldoSistema.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div 
                  key={estado.text}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`p-6 rounded-[2rem] bg-white/5 border border-white/10 text-center flex flex-col items-center gap-2`}
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Resultado de la Conciliación</span>
                  <div className={`flex items-center gap-3 text-3xl font-black tracking-tighter ${estado.color}`}>
                    <estado.icon />
                    {estado.text}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default ArqueoDeCaja;
