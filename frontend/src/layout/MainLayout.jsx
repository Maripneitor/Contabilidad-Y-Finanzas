import React, { useState, useEffect } from 'react';
import { 
  IoGridOutline, IoReceiptOutline, IoAnalyticsOutline, 
  IoStatsChartOutline, IoListOutline, IoCloudUploadOutline,
  IoMoon, IoSunny, IoRefreshCircleOutline, IoCalculatorOutline,
  IoMenuOutline, IoCloseOutline
} from 'react-icons/io5';

const NavItem = ({ id, label, icon: Icon, active, onClick, onClose }) => (
  <button
    onClick={() => { onClick(id); onClose && onClose(); }}
    className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
      active 
      ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
      : 'text-outline hover:bg-surface-container-high hover:text-on-surface hover:pl-6'
    }`}
  >
    <Icon className={`text-xl transition-transform group-hover:scale-110 ${active ? 'animate-pulse' : ''}`} />
    <span className={`text-sm font-bold font-headline tracking-tighter ${active ? 'opacity-100' : 'opacity-70'}`}>
      {label}
    </span>
  </button>
);

const MainLayout = ({ children, setView, activeView, onResetData }) => {
  const [isDark, setIsDark] = useState(
    localStorage.theme === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [isDark]);

  const menuItems = [
    { id: 'dashboard', label: 'Salud Operativa', icon: IoGridOutline },
    { id: 'registro', label: 'Nuevo Asiento', icon: IoReceiptOutline },
    { id: 'diario', label: 'Libro Diario', icon: IoListOutline },
    { id: 'balanza', label: 'Balanza Comprobación', icon: IoCalculatorOutline },
    { id: 'resultados', label: 'Estado Resultados', icon: IoAnalyticsOutline },
    { id: 'balance', label: 'Balance General', icon: IoStatsChartOutline },
    { id: 'excel', label: 'Matriz Nexium', icon: IoCloudUploadOutline },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 text-on-background transition-colors duration-500 font-inter flex overflow-hidden">
      {/* Mobile Header Overlay */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface-container-low dark:bg-slate-900 border-b border-surface-container/50 z-[60] flex items-center justify-between px-6 shadow-sm">
        <h2 className="font-headline font-black text-xl italic text-primary">Nexium</h2>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center"
        >
          {isSidebarOpen ? <IoCloseOutline className="text-2xl" /> : <IoMenuOutline className="text-2xl" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
           className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] transition-opacity"
           onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-72 bg-surface-container-low dark:bg-slate-900 border-r border-surface-container transition-transform duration-300 z-[60] lg:translate-x-0 flex flex-col p-6 overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 transform -rotate-12 group-hover:rotate-0 transition-transform">
              <span className="text-white font-black italic text-lg leading-none">N</span>
            </div>
            <h2 className="text-xl font-black font-headline tracking-tighter text-on-surface">Nexium <span className="text-primary italic opacity-70">SAS</span></h2>
          </div>
          <button 
            onClick={() => setIsDark(!isDark)}
            className="w-9 h-9 rounded-full bg-surface-container-high dark:bg-slate-800 flex items-center justify-center text-on-surface hover:scale-110 active:scale-95 transition-all shadow-sm"
          >
            {isDark ? <IoSunny className="text-amber-400" /> : <IoMoon className="text-primary" />}
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 custom-scrollbar overflow-y-auto pr-2">
          <p className="px-5 text-[9px] font-extrabold text-outline uppercase tracking-[0.2em] mb-4 opacity-40">Motor Contable</p>
          {menuItems.map(item => (
            <NavItem 
              key={item.id} 
              {...item} 
              active={activeView === item.id} 
              onClick={setView}
              onClose={() => setIsSidebarOpen(false)}
            />
          ))}
        </nav>

        <div className="pt-6 mt-6 border-t border-surface-container space-y-3 shrink-0">
           <button
             onClick={onResetData}
             className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-error/80 hover:bg-error/10 hover:text-error transition-all group font-headline"
           >
             <IoRefreshCircleOutline className="text-xl group-hover:rotate-180 transition-transform duration-500" />
             <span className="text-[11px] font-extrabold tracking-widest uppercase">Restaurar Clase</span>
           </button>
           <div className="px-5 py-4 rounded-[1.5rem] bg-on-background dark:bg-slate-800 text-white dark:text-slate-100 shadow-xl shadow-black/10">
             <div className="flex justify-between items-center mb-1">
               <p className="text-[8px] font-bold uppercase opacity-50 tracking-widest">Enterprise V3.0</p>
               <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
             </div>
             <p className="text-[10px] font-extrabold font-headline tracking-tight opacity-90 italic">Nexium Accounting Solutions</p>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 flex-1 pt-24 lg:pt-12 p-6 lg:p-10 overflow-x-hidden relative h-screen overflow-y-auto scroll-smooth custom-scrollbar">
        <div className="max-w-6xl mx-auto h-full">
           {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
