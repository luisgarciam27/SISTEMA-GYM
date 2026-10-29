import React from 'react';
import { Activity, Dumbbell, CreditCard, Sparkles, ArrowLeft, Clock } from 'lucide-react';

interface PhasePreviewScreenProps {
  module: 'progreso' | 'rutina' | 'pagos';
  onBack: () => void;
}

export const PhasePreviewScreen: React.FC<PhasePreviewScreenProps> = ({
  module,
  onBack,
}) => {
  const info = {
    progreso: {
      phase: 'Fase 2',
      title: 'Mi Progreso & Métricas',
      desc: 'Visualización de evolución de peso con Recharts, comparación inicial vs actual, porcentaje de grasa, barra de avance hacia la meta y calendario de racha de asistencias de los últimos 30 días.',
      icon: Activity,
      rpc: 'socio_progreso(p_socio) & registrar_medicion(...)',
    },
    rutina: {
      phase: 'Fase 2',
      title: 'Mi Rutina de Entrenamiento',
      desc: 'Rutina activa diseñada por tu entrenador con desglose de ejercicios por día, series, repeticiones, descansos y checklist interactivo por sesión.',
      icon: Dumbbell,
      rpc: 'rutina_socio activa con rutina_ejercicio + ejercicio',
    },
    pagos: {
      phase: 'Fase 3',
      title: 'Renovación & Comprobantes',
      desc: 'Selección de planes, pagos con Yape/Plin/Transferencia, subida de comprobantes a Supabase Storage (bucket privado) y confirmación con recepción.',
      icon: CreditCard,
      rpc: 'vender_membresia(p_socio, p_plan, p_medio, ...) & historial comprobantes',
    },
  }[module];

  const Icon = info.icon;

  return (
    <div className="space-y-6 pb-24 max-w-lg mx-auto px-4 pt-6 animate-in fade-in duration-200">
      
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">
          {info.phase} en preparación
        </span>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 mx-auto flex items-center justify-center text-orange-500 border border-orange-500/20">
          <Icon className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-black uppercase text-zinc-950 dark:text-white">
            {info.title}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
            {info.desc}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-500 dark:text-zinc-400 space-y-1">
          <span className="font-bold text-orange-600 dark:text-orange-400 block uppercase">
            Capa de Integración Supabase:
          </span>
          <span>{info.rpc}</span>
        </div>

        <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-xs text-orange-700 dark:text-orange-300 font-medium flex items-center gap-2 justify-center">
          <Clock className="w-4 h-4 shrink-0" />
          <span>Listo para construirse tras tu confirmación de Fase 1.</span>
        </div>
      </div>

    </div>
  );
};
