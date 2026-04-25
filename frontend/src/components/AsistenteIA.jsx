import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoChatbubbleEllipsesOutline, IoSend, IoAttachOutline, 
  IoSettingsOutline, IoEllipsisVertical, IoSearchOutline,
  IoAddOutline, IoSparklesOutline, IoTrendingUpOutline,
  IoWarningOutline, IoFlashOutline, IoShieldCheckmarkOutline
} from 'react-icons/io5';

const NIF_KNOWLEDGE_BASE = [
    {
        keywords: ['nif a-1', 'estructura', 'que es nif'],
        response: "La NIF A-1 se refiere a la Estructura de las Normas de Información Financiera. Define la jerarquía de las normas: 1. NIF e INIF, 2. ONIF y 3. Boletines del IMCP. Es el pilar del marco contable en México."
    },
    {
        keywords: ['nif a-2', 'postulados', 'basicos'],
        response: "La NIF A-2 establece los 8 Postulados Básicos: 1. Sustancia Económica, 2. Entidad Económica, 3. Negocio en Marcha, 4. Devengación Contable, 5. Asociación de Costos/Gastos con Ingresos, 6. Valuación, 7. Dualidad Económica y 8. Consistencia."
    },
    {
        keywords: ['caja chica', 'fondo fijo', 'crear caja'],
        response: "Para crear el Fondo de Caja Chica: Cargo a 'Fondo Fijo de Caja Chica' (Activo aumenta) y Abono a 'Bancos' (Activo disminuye). Contablemente solo se registra al inicio o al modificar el monto del fondo."
    },
    {
        keywords: ['gastos menores', 'comprobantes', 'reponer caja'],
        response: "Al reponer la Caja Chica: Se cargan los gastos (Agua, Papelería, Taxis, etc.) y el IVA Acreditable, con abono a Bancos o Caja Chica. Esto reconoce el egreso real en el periodo."
    },
    {
        keywords: ['arqueo', 'recuento', 'cuadre'],
        response: "El Arqueo de Caja consiste en el recuento físico de efectivo y comprobantes. El total debe igualar el fondo asignado ($20,000 en el caso de Nexium). Sirve como control interno para evitar faltantes."
    },
    {
        keywords: ['nif b-6', 'balance', 'situacion financiera'],
        response: "La NIF B-6 norma el Balance General. Muestra los recursos (Activos) y fuentes de financiamiento (Pasivo y Capital) a una fecha determinada. Es la 'fotografía' financiera de la empresa."
    },
    {
        keywords: ['venta', 'contado', 'registrar venta'],
        response: "Asiento de Venta al Contado: Cargo a Bancos/Caja (Total con IVA), Abono a Ventas (Subtotal) y Abono a IVA Trasladado (Impuesto cobrado)."
    },
    {
        keywords: ['compra', 'credito', 'proveedor'],
        response: "Asiento de Compra a Crédito: Cargo a Inventarios (Subtotal), Cargo a IVA por Acreditar, y Abono a Proveedores (Total de la deuda)."
    },
    {
        keywords: ['gastos abril', 'pastel', 'usb', 'agua', 'taxis'],
        response: "En abril registramos 5 gastos menores vía Caja Chica: 1. Garrafones de Agua ($232), 2. Pastel de Cumpleaños ($580), 3. Memoria USB ($348), 4. Copias ($116) y 5. Taxis ($174). Todos incluyen IVA y sumaron un total de $1,450."
    },
    {
        keywords: ['hola', 'buenos dias', 'tardes', 'noches'],
        response: "¡Hola! Soy el Asistente Inteligente de Nexium. Estoy aquí para ayudarle con dudas sobre contabilidad, análisis de sus estados financieros o normativas NIF. ¿En qué puedo apoyarle hoy?"
    }
];

const AsistenteIA = ({ data, initialQuestion }) => {
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('nexium_chat_history');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Migración: Eliminar personalizaciones antiguas de la historia guardada
            return parsed.map(m => {
                if (m.type === 'ai' && /juan/i.test(m.text)) {
                    return { 
                        ...m, 
                        text: m.text
                            .replace(/juan/gi, 'Usuario')
                            .replace(/hola usuario/gi, 'Bienvenido')
                            .replace(/tu balance/gi, 'su balance')
                            .replace(/tu situación/gi, 'su situación')
                    };
                }
                return m;
            });
        }
        return [
            { 
                id: 1, 
                type: 'ai', 
                text: 'Bienvenido al Asistente Financiero Nexium. ¿En qué puedo ayudarle hoy? Puedo analizar sus balances o explicarle cualquier normativa NIF.',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ];
    });

    useEffect(() => {
        localStorage.setItem('nexium_chat_history', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        if (initialQuestion) {
            setInputText(initialQuestion);
            // Opcionalmente auto-enviar
        }
    }, [initialQuestion]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = (textOverride) => {
        // Asegurarse de que textOverride sea una cadena, no un objeto de evento
        const messageText = typeof textOverride === 'string' ? textOverride : inputText;
        if (!messageText || !messageText.trim()) return;

        const userMsg = {
            id: Date.now(),
            type: 'user',
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // Simular respuesta de IA
        setTimeout(() => {
            const responseText = generateResponse(messageText);
            const aiMsg = {
                id: Date.now() + 1,
                type: 'ai',
                text: responseText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const generateResponse = (text) => {
        const lowerText = text.toLowerCase();
        
        // Buscar en base de conocimientos NIF
        const match = NIF_KNOWLEDGE_BASE.find(item => 
            item.keywords.some(k => lowerText.includes(k))
        );

        if (match) return match.response;

        if (lowerText.includes('analizar') || lowerText.includes('salud') || lowerText.includes('resumen')) {
            if (!data || !data.body) return "No tengo datos suficientes para analizar su balance ahora mismo. Prueba restaurando la base de datos.";
            
            const totalActivo = Object.entries(data.body)
                .filter(([code]) => code.startsWith('AC') || code.startsWith('ANC') || code.startsWith('AD'))
                .reduce((sum, [_, vals]) => sum + (vals.saldo || 0), 0);
            
            const totalPasivo = Object.entries(data.body)
                .filter(([code]) => code.startsWith('PC') || code.startsWith('PLP'))
                .reduce((sum, [_, vals]) => sum + (Math.abs(vals.saldo) || 0), 0);

            return `He analizado su situación actual: Su Activo Total es de $${totalActivo.toLocaleString()} y su Pasivo Total de $${totalPasivo.toLocaleString()}. El Capital Contable refleja una salud financiera ${totalActivo > totalPasivo ? 'positiva' : 'a revisar'}.`;
        }

        if (lowerText.includes('cobro') || lowerText.includes('clientes') || lowerText.includes('factura')) {
            const clientes = data?.body?.['AC-CL']?.saldo || 0;
            return clientes > 0 
                ? `Actualmente tiene un saldo pendiente de cobro en Clientes de $${clientes.toLocaleString()}. Esto representa facturas por cobrar de su operación.`
                : "No hay saldos pendientes de cobro en la cuenta de Clientes en este momento.";
        }

        if (lowerText.includes('venta') && lowerText.includes('contado')) {
            return "Para registrar una venta al contado: Cargo a Bancos/Caja (activo aumenta), Abono a Ventas (ingreso aumenta) y Abono a IVA Trasladado (pasivo aumenta).";
        }

        return "Lo siento, aún estoy aprendiendo sobre ese tema específico. ¿Podrías preguntarme sobre las NIF (A-1, A-2, B-6) o sobre su balance general?";
    };

    const clearHistory = () => {
        const initial = [
            { 
                id: 1, 
                type: 'ai', 
                text: 'Bienvenido al Asistente Financiero Nexium. ¿En qué puedo ayudarle hoy?',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ];
        setMessages(initial);
        localStorage.setItem('nexium_chat_history', JSON.stringify(initial));
    };

    return (
        <div className="flex h-[calc(100vh-180px)] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5 border border-surface-container-high">
            {/* Sidebar Historial */}
            <aside className="w-80 bg-surface-container-low/50 border-r border-surface-container flex flex-col hidden lg:flex">
                <div className="p-8">
                    <h2 className="font-headline font-black text-xl text-primary mb-6 flex items-center gap-3">
                        <IoChatbubbleEllipsesOutline className="text-2xl" />
                        Historial
                    </h2>
                    <div className="relative group">
                        <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Buscar consultas..." 
                            className="w-full bg-white border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/10 shadow-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar">
                    {messages.length <= 1 ? (
                        <div className="py-12 px-6 text-center">
                            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-4 text-outline opacity-40">
                                <IoChatbubbleEllipsesOutline className="text-2xl" />
                            </div>
                            <p className="text-xs font-bold text-outline uppercase tracking-widest opacity-40">No hay consultas recientes</p>
                        </div>
                    ) : (
                        <div className="p-4 rounded-[1.5rem] bg-white shadow-xl shadow-primary/5 border border-primary/10">
                             <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Hoy</p>
                             <h3 className="text-sm font-bold font-headline text-on-surface">Consulta Actual</h3>
                        </div>
                    )}
                </div>

                <div className="p-8 space-y-3">
                    <button 
                        onClick={clearHistory}
                        className="w-full bg-primary text-white py-4 rounded-2xl font-bold font-headline shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-3"
                    >
                        <IoAddOutline className="text-xl" />
                        Nueva Consulta
                    </button>
                    <button 
                        onClick={clearHistory}
                        className="w-full bg-surface-container-high text-outline py-3 rounded-2xl font-bold font-headline hover:bg-error/10 hover:text-error transition-all flex items-center justify-center gap-3 text-[11px] uppercase tracking-widest"
                    >
                        Limpiar Historial
                    </button>
                </div>
            </aside>

            {/* Chat Area */}
            <main className="flex-1 flex flex-col bg-white relative">
                {/* Header */}
                <header className="px-10 py-6 border-b border-surface-container flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary relative">
                            <IoSparklesOutline className="text-2xl animate-pulse" />
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-tertiary border-2 border-white rounded-full"></span>
                        </div>
                        <div>
                            <h2 className="font-headline font-black text-lg text-on-surface leading-tight">Nexium AI Assistant</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black uppercase tracking-widest text-tertiary">Especialista en NIF</span>
                                <span className="w-1 h-1 rounded-full bg-outline opacity-30"></span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-outline">v2.4.0</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-xl hover:bg-surface-container-high flex items-center justify-center text-outline transition-colors"><IoSettingsOutline /></button>
                        <button className="w-10 h-10 rounded-xl hover:bg-surface-container-high flex items-center justify-center text-outline transition-colors"><IoEllipsisVertical /></button>
                    </div>
                </header>

                {/* Messages */}
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar scroll-smooth"
                >
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div 
                                key={msg.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex gap-5 max-w-[85%] ${msg.type === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                            >
                                <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md ${
                                    msg.type === 'ai' ? 'bg-primary text-white' : 'bg-surface-container-highest text-on-surface'
                                }`}>
                                    {msg.type === 'ai' ? <IoSparklesOutline /> : <span className="text-[10px] font-black italic">ME</span>}
                                </div>
                                <div className="space-y-2">
                                    <div className={`p-6 rounded-[2rem] shadow-sm leading-relaxed text-sm font-medium ${
                                        msg.type === 'ai' 
                                        ? 'bg-surface-container-low text-on-surface rounded-tl-none border border-primary/5' 
                                        : 'bg-primary text-white rounded-tr-none shadow-primary/20'
                                    }`}>
                                        {msg.text}
                                    </div>
                                    {msg.type === 'ai' && msg.id === 1 && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {[
                                                "¿Cómo registro una venta?",
                                                "Postulados Básicos NIF A-2",
                                                "¿Cómo se crea la Caja Chica?",
                                                "¿Qué es un Arqueo de Caja?",
                                                "¿Tengo facturas pendientes?",
                                                "Analizar mi salud financiera"
                                            ].map(btn => (
                                                <button 
                                                    key={btn}
                                                    onClick={() => handleSend(btn)}
                                                    className="px-4 py-2 bg-white border border-outline-variant text-primary text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-primary hover:text-white transition-all shadow-sm"
                                                >
                                                    {btn}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <p className={`text-[9px] font-black uppercase tracking-widest opacity-40 ${msg.type === 'user' ? 'text-right' : ''}`}>
                                        {msg.time}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-5"
                        >
                            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center">
                                <IoSparklesOutline className="animate-spin" />
                            </div>
                            <div className="bg-surface-container-low p-6 rounded-[2rem] rounded-tl-none border border-primary/5 flex gap-1.5">
                                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-10 pt-4 bg-gradient-to-t from-white via-white to-transparent">
                    <div className="max-w-4xl mx-auto relative group">
                        <div className="bg-surface-container-low p-3 rounded-[2rem] flex items-end gap-3 border-2 border-transparent focus-within:border-primary/20 focus-within:bg-white transition-all duration-500 shadow-lg shadow-primary/5">
                            <button className="p-4 text-outline hover:text-primary hover:bg-primary/5 rounded-2xl transition-all">
                                <IoAttachOutline className="text-xl" />
                            </button>
                            <textarea 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                                placeholder="Haz una pregunta sobre las NIF (ej. NIF A-2)..."
                                className="flex-1 bg-transparent border-none focus:ring-0 py-4 text-sm font-medium resize-none max-h-32 min-h-[56px] placeholder:text-outline-variant"
                                rows="1"
                            />
                            <button 
                                onClick={handleSend}
                                className="p-4 bg-primary text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center"
                            >
                                <IoSend className="text-xl" />
                            </button>
                        </div>
                        
                        <div className="flex justify-between items-center px-6 mt-4">
                            <p className="text-[9px] text-outline font-black uppercase tracking-widest flex items-center gap-2">
                                <IoWarningOutline className="text-sm" />
                                Verifica información crítica
                            </p>
                            <div className="flex gap-6">
                                <span className="text-[9px] text-primary font-black uppercase tracking-widest flex items-center gap-2">
                                    <IoFlashOutline className="text-sm" />
                                    Bypass UNACH Active
                                </span>
                                <span className="text-[9px] text-tertiary font-black uppercase tracking-widest flex items-center gap-2">
                                    <IoShieldCheckmarkOutline className="text-sm" />
                                    Secure Data Environment
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AsistenteIA;
