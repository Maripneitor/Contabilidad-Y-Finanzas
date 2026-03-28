import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IoCheckmarkCircle, IoAlertCircle, IoClose, IoWarning } from 'react-icons/io5';

const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const colors = {
        success: 'bg-emerald-500 text-white',
        error: 'bg-rose-500 text-white',
        warning: 'bg-amber-500 text-white',
    };

    const icons = {
        success: <IoCheckmarkCircle className="text-xl" />,
        error: <IoAlertCircle className="text-xl" />,
        warning: <IoWarning className="text-xl" />,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl ${colors[type] || 'bg-slate-800 text-white'} min-w-[320px]`}
        >
            <div className="flex-shrink-0">{icons[type]}</div>
            <div className="flex-1">
                <p className="text-sm font-bold font-headline leading-tight italic">{message}</p>
            </div>
            <button onClick={onClose} className="hover:opacity-70 transition-opacity">
                <IoClose className="text-xl" />
            </button>
        </motion.div>
    );
};

export const useNotification = () => {
    const [notifications, setNotifications] = useState([]);

    const show = (message, type = 'success') => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, message, type }]);
    };

    const remove = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const NotificationContainer = () => (
        <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-4">
            <AnimatePresence>
                {notifications.map((n) => (
                    <Notification 
                        key={n.id} 
                        {...n} 
                        onClose={() => remove(n.id)} 
                    />
                ))}
            </AnimatePresence>
        </div>
    );

    return { show, NotificationContainer };
};

/* --- Custom Modal Component --- */
export const Modal = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 sm:p-12 overflow-hidden">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            ></motion.div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative bg-surface-container-lowest dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-surface-container overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="px-10 pt-10 pb-6 flex justify-between items-center bg-surface-container-low dark:bg-slate-800/50">
                    <h3 className="text-2xl font-extrabold font-headline tracking-tighter text-on-surface uppercase">
                        {title}
                    </h3>
                    <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors">
                        <IoClose size={24} />
                    </button>
                </div>
                <div className="px-10 py-8 overflow-y-auto">
                    {children}
                </div>
                {footer && (
                    <div className="px-10 pb-10 pt-4 flex justify-end gap-4">
                        {footer}
                    </div>
                )}
            </motion.div>
        </div>
    );
};
