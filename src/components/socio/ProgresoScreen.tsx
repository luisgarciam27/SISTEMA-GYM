import React, { useState } from 'react';
import { 
  ArrowLeft, 
  TrendingDown, 
  Flame, 
  Scale, 
  Calendar, 
  Target, 
  Award, 
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Plus
} from 'lucide-react';
import type { SocioProfile } from '../../types/socio';
import { calcularPlanNutricional, calcularMetaQuemaGym } from '../../lib/calorieService';

interface ProgresoScreenProps {
  socio: SocioProfile;
  onBack: () => void;
  onOpenQR: () => void;
}

export const ProgresoScreen: React.FC<ProgresoScreenProps> = ({ socio, onBack, onOpenQR }) => {
  const plan = calcularPlanNutricional(socio);
  const [pesoActual, setPesoActual] = useState(socio.peso_kg || 76);
  const [showLogWeightModal, setShowLogWeightModal] = useState(false);
  const [nuevoPesoInput, setNuevoPesoInput] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const metaGym = calcularMetaQuemaGym(socio);
  const metaQuemaDiaria = metaGym.calorias_meta_gym;

  // Historial semanal de quema en máquinas de Titán
  const diasSemana = [
    { dia: 'Lun', quemadas: 430, estacion: '🪜 StairMaster', entreno: true },
    { dia: 'Mar', quemadas: 380, estacion: '🏋️‍♂️ Pesas', entreno: true },
    { dia: 'Mié', quemadas: 0, estacion: 'Descanso', entreno: false },
    { dia: 'Jue', quemadas: 480, estacion: '⚡ Funcional', entreno: true },
    { dia: 'Vie', quemadas: 510, estacion: '🥊 Saco Box', entreno: true },
    { dia: 'Sáb', quemadas: 390, estacion: '🚴 Spinning', entreno: true },
    { dia: 'Hoy', quemadas: 340, estacion: '🪜 Escaladora', entreno: true, hoy: true },
  ];

  const pesoInicial = 80.0;
  const pesoMeta = socio.peso_objetivo || (socio.meta_principal === 'bajar_peso' ? 72.0 : 80.0);
  const diferencia = (pesoActual - pesoInicial).toFixed(1);

  const handleGuardarNuevoPeso = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(nuevoPesoInput);
    if (!isNaN(val) && val > 35 && val < 250) {
      setPesoActual(val);
      setShowLogWeightModal(false);
      setNuevoPesoInput('');
      setToast(`¡Nuevo peso registrado: ${val} kg! Progreso actualizado.`);
      setTimeout(() => setToast(null), 3500);
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-lg mx-auto px-4 pt-4 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 font-bold">
              Evolución & Métricas
            </span>
            <h1 className="font-heading text-2xl font-black uppercase text-zinc-950 dark:text-white">
              Mi Progreso
            </h1>
          </div>
        </div>

        <button
          onClick={() => setShowLogWeightModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Pesarme</span>
        </button>
      </div>

      {/* Hero Card: Peso & Meta */}
      <div className="rounded-3xl bg-zinc-900 text-white border border-zinc-800 p-6 space-y-4 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-44 h-44 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              Peso Actual
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-heading text-4xl font-black tracking-tight text-white tabular-nums">
                {pesoActual}
              </span>
              <span className="text-sm text-zinc-400 font-mono">kg</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              Objetivo
            </span>
            <div className="flex items-baseline justify-end gap-1 mt-0.5">
              <span className="font-heading text-2xl font-bold text-orange-400 tabular-nums">
                {pesoMeta}
              </span>
              <span className="text-xs text-zinc-400 font-mono">kg</span>
            </div>
          </div>
        </div>

        {/* Progress bar towards goal */}
        <div className="relative z-10 space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>Inicio: {pesoInicial} kg</span>
            <span className="text-emerald-400 font-bold">{diferencia} kg de cambio</span>
            <span>Meta: {pesoMeta} kg</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-700"
              style={{ width: '68%' }}
            />
          </div>
        </div>
      </div>

      {/* Weekly Gym Burn Consistency */}
      <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <h3 className="font-heading text-base font-black uppercase text-zinc-900 dark:text-white">
              Quema en Gym Semanal
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
            6 de 7 días con sesión
          </span>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Calorías quemadas en máquinas vs tu meta diaria de <strong className="text-zinc-800 dark:text-zinc-200">{metaQuemaDiaria} kcal</strong>:
        </p>

        {/* SVG Bar Chart */}
        <div className="grid grid-cols-7 gap-2 pt-2 items-end h-32">
          {diasSemana.map((d) => {
            const maxCal = metaQuemaDiaria * 1.25;
            const heightPct = Math.min(100, Math.round((d.quemadas / maxCal) * 100));
            const isTargetMet = d.quemadas >= metaQuemaDiaria * 0.85;

            return (
              <div key={d.dia} className="flex flex-col items-center h-full justify-end group">
                {/* Tooltip on hover */}
                <span className="text-[9px] font-mono font-bold text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 tabular-nums">
                  {d.quemadas}k
                </span>

                <div className="w-full max-w-[28px] bg-zinc-100 dark:bg-zinc-800 rounded-t-lg h-24 flex items-end overflow-hidden p-0.5">
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      d.hoy
                        ? 'bg-gradient-to-t from-orange-600 to-amber-400 shadow-md shadow-orange-500/50'
                        : isTargetMet
                          ? 'bg-gradient-to-t from-orange-500 to-orange-400'
                          : d.quemadas > 0
                            ? 'bg-amber-500/70'
                            : 'bg-zinc-200 dark:bg-zinc-700/50'
                    }`}
                    style={{ height: `${Math.max(8, heightPct)}%` }}
                  />
                </div>

                <div className="flex items-center gap-0.5 mt-2">
                  {d.entreno && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" title="Sesión completada" />}
                  <span className={`text-[10px] font-mono uppercase ${d.hoy ? 'font-bold text-orange-500' : 'text-zinc-400'}`}>
                    {d.dia}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span>Total semana: ~2,530 kcal quemadas</span>
          </div>
          <span className="text-emerald-500 font-bold">~330g grasa eliminada</span>
        </div>
      </div>

      {/* Racha y Asistencias */}
      <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            <h3 className="font-heading text-base font-black uppercase text-zinc-900 dark:text-white">
              Racha de Asistencia
            </h3>
          </div>
          <span className="text-xs font-mono font-black text-orange-500">
            🔥 5 días seguidos
          </span>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Últimas semanas de entrenamiento en sede. Mantén la constancia para ver resultados en tus marcas.
        </p>

        {/* 4-week dot streak matrix */}
        <div className="grid grid-cols-7 gap-1.5 pt-2">
          {Array.from({ length: 28 }).map((_, i) => {
            const hasAttended = i % 7 !== 0 && i % 7 !== 6 && i > 5;
            const isToday = i === 27;
            return (
              <div
                key={i}
                className={`h-6 rounded-md flex items-center justify-center text-[9px] font-mono font-bold transition-all ${
                  isToday
                    ? 'bg-orange-500 text-white ring-2 ring-orange-500/30'
                    : hasAttended
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                }`}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 left-4 right-4 z-50 max-w-sm mx-auto bg-zinc-900 text-white border border-orange-500/80 rounded-2xl p-3.5 shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Modal: Registrar Peso */}
      {showLogWeightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <form onSubmit={handleGuardarNuevoPeso} className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-orange-500" />
              <h3 className="font-heading text-lg font-black uppercase text-zinc-900 dark:text-white">
                Registrar Peso de Hoy
              </h3>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Pésate en ayunas por la mañana para tener mediciones más consistentes.
            </p>

            <div>
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                Nuevo Peso (kg)
              </label>
              <input
                type="number"
                step="0.1"
                required
                autoFocus
                placeholder={`Ej: ${pesoActual}`}
                value={nuevoPesoInput}
                onChange={(e) => setNuevoPesoInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-lg font-mono font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogWeightModal(false)}
                className="py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs uppercase"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="py-3 rounded-xl bg-orange-500 text-white font-bold text-xs uppercase shadow-md shadow-orange-500/20"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
