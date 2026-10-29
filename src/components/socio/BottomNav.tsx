import React from 'react';
import { Home, QrCode, Activity, Dumbbell, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenQR: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  onOpenQR,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#090A0E]/95 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 pb-safe">
      <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between relative">
        
        {/* Tab 1: Inicio */}
        <button
          onClick={() => onTabChange('inicio')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentTab === 'inicio'
              ? 'text-orange-500 font-bold'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Inicio</span>
        </button>

        {/* Tab 2: Progreso (Fase 2) */}
        <button
          onClick={() => onTabChange('progreso')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
            currentTab === 'progreso'
              ? 'text-orange-500 font-bold'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Activity className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Progreso</span>
        </button>

        {/* Tab 3 (Center Raised): QR Pass */}
        <div className="flex-1 flex justify-center -mt-6">
          <button
            onClick={onOpenQR}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-500 to-red-600 text-white shadow-xl shadow-orange-500/35 border-4 border-white dark:border-[#090A0E] flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all group cursor-pointer"
            title="Abrir QR de acceso"
          >
            <QrCode className="w-6 h-6 group-hover:rotate-6 transition-transform" />
          </button>
        </div>

        {/* Tab 4: Rutina (Fase 2) */}
        <button
          onClick={() => onTabChange('rutina')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
            currentTab === 'rutina'
              ? 'text-orange-500 font-bold'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Dumbbell className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Mi Rutina</span>
        </button>

        {/* Tab 5: Perfil */}
        <button
          onClick={() => onTabChange('perfil')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentTab === 'perfil'
              ? 'text-orange-500 font-bold'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Perfil</span>
        </button>

      </div>
    </nav>
  );
};
