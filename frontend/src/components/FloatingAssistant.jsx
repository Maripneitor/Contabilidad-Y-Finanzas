import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSparklesOutline, IoCloseOutline, IoSend } from 'react-icons/io5';

const QuickChat = ({ onClose, data, externalQuestion }) => {
    const [messages, setMessages] = useState([
        { type: 'ai', text: '¡Hola! Soy el Asistente Nexium. Puedo ayudarle con dudas rápidas sobre su contabilidad o las NIF. ¿En qué puedo apoyarle?' }
    ]);
    const [input, setInput] = useState('');

    React.useEffect(() => {
        if (externalQuestion) {
            setInput(externalQuestion);
        }
    }, [externalQuestion]);

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg = { type: 'user', text: input };
        setMessages([...messages, userMsg]);
        setInput('');

        // Simular respuesta rápida
        setTimeout(() => {
            const lower = input.toLowerCase();
            let response = "Lo siento, no tengo una respuesta específica para eso. Intente preguntar sobre las NIF, su Balance o Ventas.";

            if (lower.includes('nif')) {
                response = "Las NIF (Normas de Información Financiera) definen la estructura contable en México. Puede ver el detalle completo en la pestaña Asistente IA.";
            } else if (lower.includes('balance') || lower.includes('salud') || lower.includes('analizar')) {
                const totalActivo = Object.entries(data?.body || {}).filter(([c]) => c.startsWith('A')).reduce((s, [_, v]) => s + (v.saldo || 0), 0);
                response = `Su balance actual muestra un Activo Total de $${totalActivo.toLocaleString()}. ¿Desea un análisis detallado en la pestaña principal?`;
            } else if (lower.includes('venta') && lower.includes('contado')) {
                response = "Para venta al contado: Cargo a Bancos/Caja, Abono a Ventas y Abono a IVA Trasladado.";
            } else if (lower.includes('cobro') || lower.includes('clientes') || lower.includes('factura')) {
                const clientes = data?.body?.['AC-CL']?.saldo || 0;
                response = clientes > 0 
                    ? `Sí, tiene un saldo pendiente de cobro en Clientes de $${clientes.toLocaleString()}.`
                    : "No tiene saldos pendientes de cobro en la cuenta de Clientes actualmente.";
            }
            
            setMessages(prev => [...prev, { type: 'ai', text: response }]);
        }, 1000);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-10 w-80 bg-white rounded-[2rem] shadow-2xl border border-primary/10 overflow-hidden z-[100]"
        >
            <div className="bg-primary p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                    <IoSparklesOutline className="animate-pulse" />
                    <span className="font-headline font-bold text-sm">Asistente Nexium</span>
                </div>
                <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                    <IoCloseOutline className="text-xl" />
                </button>
            </div>
            <div className="h-64 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-surface-container-lowest">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium ${
                            m.type === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-surface-container-high text-on-surface rounded-tl-none'
                        }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className="px-3 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-surface-container bg-white">
                {['¿Venta contado?', 'NIF A-2', 'Caja Chica', 'Clientes'].map(q => (
                    <button 
                        key={q} 
                        onClick={() => handleSend(q)}
                        className="whitespace-nowrap px-3 py-1 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest rounded-full border border-primary/10 hover:bg-primary hover:text-white transition-all"
                    >
                        {q}
                    </button>
                ))}
            </div>
            <div className="p-3 bg-white border-t border-surface-container">
                <div className="flex items-center gap-2 bg-surface-container-low rounded-xl px-3 py-1">
                    <input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Pregunta rápida..." 
                        className="flex-1 bg-transparent border-none focus:ring-0 text-xs py-2"
                    />
                    <button onClick={handleSend} className="text-primary hover:scale-110 transition-transform">
                        <IoSend />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const FloatingAssistant = ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [customQuestion, setCustomQuestion] = useState('');

    React.useEffect(() => {
        const handleAsk = (e) => {
            setIsOpen(true);
            setCustomQuestion(e.detail);
        };
        window.addEventListener('nexium-ask-ai', handleAsk);
        return () => window.removeEventListener('nexium-ask-ai', handleAsk);
    }, []);

    return (
        <>
            <AnimatePresence>
                {isOpen && <QuickChat 
                    data={data} 
                    onClose={() => { setIsOpen(false); setCustomQuestion(''); }} 
                    externalQuestion={customQuestion}
                />}
            </AnimatePresence>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-10 right-10 w-14 h-14 bg-primary text-white rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-[100] group"
            >
                {isOpen ? <IoCloseOutline className="text-3xl" /> : <IoSparklesOutline className="text-2xl group-hover:rotate-12 transition-transform" />}
            </button>
        </>
    );
};

export default FloatingAssistant;
