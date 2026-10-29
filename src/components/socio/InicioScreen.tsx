import React from 'react';
import { 
  QrCode, 
  Sparkles, 
  Calendar, 
  Flame, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  Activity, 
  Scale, 
  RefreshCw,
  Bell
} from 'lucide-react';
import type { SocioProfile, EstadoMembresia } from '../../types/socio';

interface InicioScreenProps {
  socio: SocioProfile;
  gymName?: string;
  onOpenQR: () => void;
  onRenewPlan: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const InicioScreen: React.FC<InicioScreenProps> = ({
  socio,
  gymName = 'Titán Fitness',
  onOpenQR,
  onRenewPlan,
  onNavigateToTab,
}) => {
  const membresia = socio.membresia;
  const diasRestantes = membresia?.dias_restantes ?? 18;
  const diasTotales = membresia?.dias_totales ?? 30;
  const porcentajeTiempo = Math.max(0, Math.min(100, Math.round((diasRestantes / diasTotales) * 100)));

  // SVG Radial Progress math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (porcentajeTiempo / 100) * circumference;

  const getStatusBadge = (estado: EstadoMembresia = 'activa') => {
    switch (estado) {
      case 'activa':
        return {
          text: 'Membresía Activa',
          className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        };
      case 'por_vencer':
        return {
          text: 'Por Vencer',
          className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
        };
      case 'vencida':
        return {
          text: 'Vencida',
          className: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
        };
      case 'pendiente_pago':
        return {
          text: 'Pendiente de Pago',
          className: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
        };
    }
  };

  const statusConfig = getStatusBadge(membresia?.estado);

  return (
    <div className="space-y-6 pb-24 max-w-lg mx-auto px-4 pt-4 animate-in fade-in duration-200">
      
      {/* Saludo Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 font-bold">
            {gymName} · Socio
          </span>
          <h1 className="font-heading text-3xl font-black uppercase text-zinc-950 dark:text-white leading-tight">
            ¡Hola, {socio.nombres.split(' ')[0]}!
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Listo para tu entrenamiento de hoy
          </p>
        </div>

        {/* Quick QR icon button */}
        <button
          onClick={onOpenQR}
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform"
          title="Ver código QR para ingresar"
        >
          <QrCode className="w-6 h-6" />
        </button>
      </div>

      {/* Primary Membership Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 text-white p-6 shadow-2xl border border-zinc-800">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/15 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 space-y-6">
          
          <div className="flex items-start justify-between">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${statusConfig.className}`}>
                {statusConfig.text}
              </span>
              <h2 className="font-heading text-2xl font-black uppercase mt-2 tracking-wide text-white">
                {membresia?.plan_nombre || 'Mensual libre'}
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Vence el {membresia?.fecha_vencimiento || '15/11/2026'}
              </p>
            </div>

            {/* Radial Progress Ring */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="text-zinc-800"
                  strokeWidth="6"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="text-orange-500 transition-all duration-1000 ease-out"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-heading text-lg font-black text-white tabular-nums leading-none">
                  {diasRestantes}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono">
                  días
                </span>
              </div>
            </div>
          </div>

          {/* If plan is by visits */}
          {membresia?.plan_tipo === 'ingresos' && (
            <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-300">Ingresos disponibles</span>
              <span className="text-orange-400 font-bold">
                {membresia.ingresos_restantes ?? 8} de {membresia.ingresos_totales ?? 12}
              </span>
            </div>
          )}

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={onOpenQR}
              className="py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>Marcar Ingreso</span>
            </button>

            <button
              onClick={onRenewPlan}
              className="py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 flex items-center justify-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
              <span>Renovar</span>
            </button>
          </div>

        </div>
      </div>

      {/* Metrics & Body Target Snapshot */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
          <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400 font-bold block">
            Peso Actual
          </span>
          <span className="font-heading text-2xl font-black text-zinc-950 dark:text-white tabular-nums">
            {socio.peso_kg}
          </span>
          <span className="text-[10px] text-zinc-400 ml-1">kg</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
          <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400 font-bold block">
            Estatura
          </span>
          <span className="font-heading text-2xl font-black text-zinc-950 dark:text-white tabular-nums">
            {socio.talla_cm}
          </span>
          <span className="text-[10px] text-zinc-400 ml-1">cm</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
          <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400 font-bold block">
            IMC Ref.
          </span>
          <span className="font-heading text-2xl font-black text-emerald-500 tabular-nums">
            {socio.imc}
          </span>
        </div>
      </div>

      {/* Target Focus */}
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Objetivo del Socio</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold">
            {socio.dias_semana} días / sem
          </span>
        </div>

        <div className="space-y-1">
          <p className="font-heading text-lg font-bold uppercase text-zinc-950 dark:text-white">
            {socio.meta_principal.replace('_', ' ')}
          </p>
          {socio.detalle_objetivo && (
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              "{socio.detalle_objetivo}"
            </p>
          )}
        </div>

        {socio.zonas_reforzar && socio.zonas_reforzar.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {socio.zonas_reforzar.map((zona) => (
              <span
                key={zona}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 capitalize"
              >
                {zona}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Quick Access to Upcoming Sections (Fases 2 y 3 preview) */}
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">
          Módulos de Socio
        </span>

        <button
          onClick={() => onNavigateToTab('progreso')}
          className="w-full p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-orange-500/40 text-left flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-zinc-900 dark:text-white">Mi Progreso & Peso</p>
              <p className="text-xs text-zinc-500">Gráfico de evolución y racha de asistencias</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-bold">
            Fase 2
          </span>
        </button>

        <button
          onClick={() => onNavigateToTab('rutina')}
          className="w-full p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-orange-500/40 text-left flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-zinc-900 dark:text-white">Mi Rutina de Entrenamiento</p>
              <p className="text-xs text-zinc-500">Ejercicios, series y checklist del día</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-bold">
            Fase 2
          </span>
        </button>
      </div>

    </div>
  );
};
