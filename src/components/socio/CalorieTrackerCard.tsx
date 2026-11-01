import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Trash2, 
  Info, 
  X, 
  Zap, 
  Timer, 
  ChevronDown,
  Layers,
  Dumbbell,
  Sparkles
} from 'lucide-react';
import type { SocioProfile } from '../../types/socio';
import { 
  cargarResumenDiario, 
  registrarSesionEstacionGym,
  eliminarSesionEntrenamiento,
  calcularMetaQuemaGym,
  obtenerEquivalenciaQuema,
  ESTACIONES_TITAN_GYM,
  GymStation,
  ResumenDiarioCalorias
} from '../../lib/calorieService';

interface CalorieTrackerCardProps {
  socio: SocioProfile;
}

export const CalorieTrackerCard: React.FC<CalorieTrackerCardProps> = ({ socio }) => {
  const [resumen, setResumen] = useState<ResumenDiarioCalorias>(() => cargarResumenDiario(socio));
  const [metaGym, setMetaGym] = useState(() => calcularMetaQuemaGym(socio));

  // Modales
  const [showMachineSelectorModal, setShowMachineSelectorModal] = useState(false);
  const [showLiveWorkoutModal, setShowLiveWorkoutModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Estado de Selección de Máquina por Lista Desplegable
  const [selectedStationId, setSelectedStationId] = useState<string>(ESTACIONES_TITAN_GYM[0].id);
  const [isCustomMachine, setIsCustomMachine] = useState(false);
  const [customMachineName, setCustomMachineName] = useState('');
  const [selectedMinutes, setSelectedMinutes] = useState<number>(30);

  // Estado del Cronómetro de Quema en Vivo
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveSeconds, setLiveSeconds] = useState(0);
  const [liveStationId, setLiveStationId] = useState<string>(ESTACIONES_TITAN_GYM[0].id);
  const [liveBurnedCals, setLiveBurnedCals] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Notificaciones Toast
  const [toast, setToast] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    setResumen(cargarResumenDiario(socio));
    setMetaGym(calcularMetaQuemaGym(socio));
  }, [socio]);

  // Estación actual seleccionada para registro rápido
  const currentStation = ESTACIONES_TITAN_GYM.find((s) => s.id === selectedStationId) || ESTACIONES_TITAN_GYM[0];
  const currentLiveStation = ESTACIONES_TITAN_GYM.find((s) => s.id === liveStationId) || ESTACIONES_TITAN_GYM[0];

  // Agrupar máquinas por zona para la lista desplegable
  const zonasUnicas = Array.from(new Set(ESTACIONES_TITAN_GYM.map((s) => s.zona)));

  // Manejador del cronómetro en vivo
  useEffect(() => {
    if (isLiveActive) {
      timerRef.current = setInterval(() => {
        setLiveSeconds((prev) => {
          const nextSec = prev + 1;
          const peso = socio.peso_kg || 72;
          const met = currentLiveStation.met;
          const calsPerSec = (met * peso) / 3600;
          setLiveBurnedCals(Math.round(nextSec * calsPerSec * 10) / 10);
          return nextSec;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLiveActive, currentLiveStation, socio.peso_kg]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const totalQuemado = resumen.calorias_quemadas_entrenamiento || 0;
  const metaDiaria = metaGym.calorias_meta_gym;
  const porcentajeQuema = Math.min(100, Math.round((totalQuemado / metaDiaria) * 100));
  const equivalencias = obtenerEquivalenciaQuema(totalQuemado);

  // Registrar Máquina seleccionada desde lista desplegable
  const handleConfirmMachineSelection = () => {
    let stationToRegister = currentStation;

    if (isCustomMachine && customMachineName.trim()) {
      stationToRegister = {
        ...currentStation,
        id: `custom_${Date.now()}`,
        nombre: customMachineName.trim(),
        icono: '🏋️',
        badge: 'Personalizada'
      };
    }

    const updated = registrarSesionEstacionGym(
      socio,
      resumen,
      stationToRegister,
      selectedMinutes
    );

    setResumen(updated);
    setShowMachineSelectorModal(false);
    setIsCustomMachine(false);
    setCustomMachineName('');

    const cals = Math.round((stationToRegister.met * (socio.peso_kg || 72) * (selectedMinutes / 60)));
    showNotification(`🔥 ¡+${cals} kcal registradas en ${stationToRegister.nombre}!`);
  };

  // Finalizar Sesión en Vivo
  const handleFinishLiveSession = () => {
    if (liveSeconds < 30) {
      showNotification('Entrena al menos 30 segundos para registrar la quema.');
      return;
    }

    const minutosReales = Math.max(1, Math.round(liveSeconds / 60));
    const updated = registrarSesionEstacionGym(
      socio,
      resumen,
      currentLiveStation,
      minutosReales,
      liveBurnedCals
    );

    setResumen(updated);
    setIsLiveActive(false);
    setShowLiveWorkoutModal(false);
    setLiveSeconds(0);
    setLiveBurnedCals(0);
    showNotification(`🏆 ¡Sesión guardada! Quemaste ${Math.round(liveBurnedCals)} kcal en ${minutosReales} min.`);
  };

  // Eliminar sesión
  const handleDeleteWorkout = (id: string) => {
    const updated = eliminarSesionEntrenamiento(socio, resumen, id);
    setResumen(updated);
    showNotification('Sesión eliminada.');
  };

  // Nivel de intensidad alcanzado hoy
  let nivelFuego = { label: 'Iniciando Calentamiento', color: 'text-amber-500', barColor: 'from-amber-500 to-orange-500' };
  if (totalQuemado >= metaDiaria) {
    nivelFuego = { label: '¡Modo Titán Fénix Completado!', color: 'text-orange-500', barColor: 'from-orange-500 via-red-500 to-amber-300' };
  } else if (totalQuemado >= metaDiaria * 0.5) {
    nivelFuego = { label: 'Zona Quema-Grasa Activa', color: 'text-orange-400', barColor: 'from-orange-500 to-red-500' };
  }

  // Quema estimada en vivo para el modal
  const quemaEstimada = Math.round(
    currentStation.met * (socio.peso_kg || 72) * (selectedMinutes / 60)
  );

  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-white to-orange-50/30 dark:from-zinc-900 dark:to-zinc-950 p-5 sm:p-6 border border-orange-500/20 dark:border-zinc-800 shadow-xl space-y-5 overflow-hidden transition-all">
      
      {/* Ambient background glow */}
      <div className="absolute -top-10 -right-10 w-44 h-44 bg-orange-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Toast Feedback */}
      {toast && (
        <div className="absolute top-3 left-4 right-4 z-40 bg-zinc-950 text-white border border-orange-500/80 rounded-2xl px-3.5 py-2.5 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-orange-500 text-white shadow-md shadow-orange-500/30">
              <Flame className="w-4 h-4 animate-pulse" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Quema en Gym Titán
            </span>
          </div>
          <h3 className="font-heading text-xl font-black uppercase text-zinc-950 dark:text-white mt-1">
            Bajar Calorías en Sala
          </h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            Registra la máquina que harás y oxida grasa en tiempo real
          </p>
        </div>

        <button
          onClick={() => setShowInfoModal(true)}
          className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-orange-500/10 text-zinc-500 dark:text-zinc-400 hover:text-orange-500 transition-colors"
          title="¿Cómo funciona la quema en gym?"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Main Burn Odometre */}
      <div className="relative z-10 p-5 rounded-2xl bg-zinc-950 text-white border border-zinc-800 shadow-2xl overflow-hidden">
        
        {/* Glow behind odometre */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-orange-600/20 blur-2xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-3">
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase font-bold text-zinc-400 tracking-wider">
              Calorías Quemadas Hoy
            </span>
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          </div>

          <div className="flex items-baseline justify-center gap-2">
            <span className="font-heading text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-red-500 tabular-nums tracking-tight">
              {totalQuemado}
            </span>
            <div className="text-left font-mono">
              <span className="text-xs text-orange-400 font-bold block">KCAL</span>
              <span className="text-[10px] text-zinc-500">/ {metaDiaria} meta</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
              <span className={nivelFuego.color}>{nivelFuego.label}</span>
              <span className="font-bold text-white">{porcentajeQuema}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden p-0.5">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${nivelFuego.barColor} transition-all duration-700 ease-out shadow-lg shadow-orange-500/50`}
                style={{ width: `${porcentajeQuema}%` }}
              />
            </div>
          </div>

          {/* Tangible Equivalent Showcase */}
          {totalQuemado > 0 ? (
            <div className="w-full mt-2 pt-3 border-t border-zinc-800/80 grid grid-cols-2 gap-2 text-left">
              <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800/60 flex items-center gap-2.5">
                <span className="text-xl">💧</span>
                <div>
                  <span className="text-[10px] text-zinc-400 font-mono block">Grasa Oxidada</span>
                  <span className="text-xs font-bold text-emerald-400 tabular-nums">
                    ~{equivalencias.gramosGrasa} gramos
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800/60 flex items-center gap-2.5">
                <span className="text-xl">{equivalencias.iconoComida}</span>
                <div>
                  <span className="text-[10px] text-zinc-400 font-mono block">Equivale a Quemas</span>
                  <span className="text-xs font-bold text-amber-300 truncate block">
                    {equivalencias.comidaEquivalente}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-zinc-400 font-medium pt-1">
              Despliega la lista abajo para escoger tu máquina o inicia el cronómetro en vivo.
            </p>
          )}

        </div>
      </div>

      {/* Two Interactive Core Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
        
        {/* Acción 1: Escoger Máquina con Lista Desplegable */}
        <button
          onClick={() => setShowMachineSelectorModal(true)}
          className="group relative overflow-hidden p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg shadow-orange-500/25 transition-all text-left cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Dumbbell className="w-4 h-4 text-white" />
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/30 flex items-center gap-1">
              <span>Lista Desplegable</span>
              <ChevronDown className="w-3 h-3" />
            </span>
          </div>
          <h4 className="font-heading text-base font-black uppercase tracking-wide">
            Escoger Máquina a Entrenar
          </h4>
          <p className="text-[11px] text-white/85 mt-0.5">
            Selecciona de la lista por zona: StairMaster, Prensa, Pesas...
          </p>
        </button>

        {/* Acción 2: Cronómetro de Quema en Vivo */}
        <button
          onClick={() => {
            setShowLiveWorkoutModal(true);
            setIsLiveActive(true);
          }}
          className="p-4 rounded-2xl bg-white dark:bg-zinc-850 hover:bg-orange-50/50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 transition-all text-left shadow-sm hover:border-orange-500/40 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="w-8 h-8 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-orange-500 text-orange-500" />
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
              En Vivo
            </span>
          </div>
          <h4 className="font-heading text-base font-black uppercase tracking-wide">
            Iniciar Quema en Vivo
          </h4>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            Cronómetro con odómetro segundo a segundo
          </p>
        </button>

      </div>

      {/* Historial de Máquinas Usadas Hoy */}
      {resumen.entrenamientos.length > 0 && (
        <div className="relative z-10 pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
              Máquinas Realizadas Hoy ({resumen.entrenamientos.length})
            </span>
            <span className="text-xs font-bold text-orange-500 font-mono">
              +{totalQuemado} kcal
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {resumen.entrenamientos.map((sesion) => (
              <div 
                key={sesion.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white block">
                      {sesion.nombre}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {sesion.minutos} min • {sesion.hora}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-orange-600 dark:text-orange-400 font-mono">
                    +{sesion.calorias_quemadas} kcal
                  </span>
                  <button
                    onClick={() => handleDeleteWorkout(sesion.id)}
                    className="p-1 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-500 transition-colors"
                    title="Eliminar sesión"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SELECCIONAR MÁQUINA CON LISTA DESPLEGABLE (DROPDOWN COMPACTO)     */}
      {/* ========================================================================= */}
      {showMachineSelectorModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white p-6 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-orange-500 tracking-wider">
                  Registro Rápido
                </span>
                <h3 className="font-heading text-lg font-black uppercase text-zinc-950 dark:text-white">
                  Escoge la Máquina que Harás
                </h3>
              </div>
              <button
                onClick={() => setShowMachineSelectorModal(false)}
                className="p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. LISTA DESPLEGABLE PRINCIPAL ORGANIZADA POR ZONAS */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <span>Seleccionar de la lista desplegable:</span>
              </label>

              <div className="relative">
                <select
                  value={isCustomMachine ? 'custom' : selectedStationId}
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setIsCustomMachine(true);
                    } else {
                      setIsCustomMachine(false);
                      setSelectedStationId(e.target.value);
                    }
                  }}
                  className="w-full p-3.5 pr-10 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-bold text-sm focus:border-orange-500 focus:outline-none appearance-none cursor-pointer shadow-inner"
                >
                  {zonasUnicas.map((zona) => (
                    <optgroup key={zona} label={zona} className="font-bold text-orange-600 dark:text-orange-400 bg-zinc-50 dark:bg-zinc-950">
                      {ESTACIONES_TITAN_GYM.filter((s) => s.zona === zona).map((estacion) => (
                        <option 
                          key={estacion.id} 
                          value={estacion.id}
                          className="font-medium text-zinc-900 dark:text-white bg-white dark:bg-zinc-900 py-1"
                        >
                          {estacion.icono} {estacion.nombre} (~{estacion.quema_aprox_min} kcal/min)
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  <optgroup label="Otra opción" className="font-bold text-zinc-500 bg-zinc-50 dark:bg-zinc-950">
                    <option value="custom" className="text-zinc-900 dark:text-white bg-white dark:bg-zinc-900">
                      ✍️ Otra máquina / Escribir personalizada
                    </option>
                  </optgroup>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Si eligió escribir máquina propia */}
            {isCustomMachine && (
              <div className="space-y-1 animate-in fade-in">
                <label className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 font-bold">
                  Nombre de la máquina o ejercicio:
                </label>
                <input
                  type="text"
                  placeholder="Ej. Press Militar con mancuernas, Hip Thrust..."
                  value={customMachineName}
                  onChange={(e) => setCustomMachineName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-orange-500/50 text-zinc-900 dark:text-white text-xs font-semibold focus:outline-none"
                />
              </div>
            )}

            {/* Ficha Visual Compacta de la Máquina Seleccionada */}
            <div className="p-3.5 rounded-2xl bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/30 flex items-start gap-3">
              <span className="text-3xl p-2 rounded-xl bg-white dark:bg-zinc-900 shadow-sm shrink-0 border border-orange-500/20">
                {currentStation.icono}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-bold text-sm text-zinc-950 dark:text-white truncate">
                    {isCustomMachine && customMachineName ? customMachineName : currentStation.nombre}
                  </h4>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-orange-500 text-white font-bold shrink-0">
                    {currentStation.badge}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-300 line-clamp-1 mt-0.5">
                  {currentStation.descripcion}
                </p>
                <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-orange-600 dark:text-orange-400 font-bold">
                  <span>⚡ Gasto: ~{currentStation.quema_aprox_min} kcal / min</span>
                  <span>📍 {currentStation.zona.split('&')[0]}</span>
                </div>
              </div>
            </div>

            {/* 2. SELECTOR DE MINUTOS */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">
                  ¿Cuántos minutos entrenarás en esta máquina?
                </span>
                <span className="font-mono font-black text-orange-500 text-sm">
                  {selectedMinutes} min
                </span>
              </div>

              {/* Botones rápidos de minutos */}
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 45, 60].map((min) => (
                  <button
                    key={min}
                    type="button"
                    onClick={() => setSelectedMinutes(min)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      selectedMinutes === min
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                        : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-orange-500/40'
                    }`}
                  >
                    {min} min
                  </button>
                ))}
              </div>

              {/* Slider */}
              <input
                type="range"
                min="5"
                max="90"
                step="5"
                value={selectedMinutes}
                onChange={(e) => setSelectedMinutes(parseInt(e.target.value, 10))}
                className="w-full accent-orange-500 cursor-pointer"
              />

              {/* Cálculo en vivo de quema */}
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 font-mono block">Quema calculada:</span>
                  <span className="font-heading text-xl font-black text-orange-500 tabular-nums">
                    ~{quemaEstimada} kcal
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 font-mono block">Grasa oxidada:</span>
                  <span className="font-mono text-xs font-bold text-emerald-500">
                    ~{Math.round(quemaEstimada / 7.7)} gramos
                  </span>
                </div>
              </div>
            </div>

            {/* Botón de confirmación */}
            <button
              onClick={handleConfirmMachineSelection}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Flame className="w-4 h-4" />
              <span>Registrar Esta Máquina (+{quemaEstimada} kcal)</span>
            </button>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CRONÓMETRO DE QUEMA EN VIVO CON LISTA DESPLEGABLE                  */}
      {/* ========================================================================= */}
      {showLiveWorkoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-zinc-950 text-white border border-orange-500/50 shadow-2xl p-6 space-y-6 relative overflow-hidden">
            
            {/* Ambient flame glow */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-orange-600/25 blur-3xl rounded-full pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="font-mono text-xs uppercase font-bold text-red-400 tracking-wider">
                  Entrenamiento en Vivo
                </span>
              </div>
              <button
                onClick={() => {
                  setIsLiveActive(false);
                  setShowLiveWorkoutModal(false);
                }}
                className="p-1.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lista Desplegable de Máquina en Vivo */}
            <div className="relative z-10 space-y-2">
              <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
                Máquina en uso (cambia cuando pases a otra):
              </label>
              
              <div className="relative">
                <select
                  value={liveStationId}
                  onChange={(e) => setLiveStationId(e.target.value)}
                  className="w-full p-3 pr-10 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-bold text-xs focus:border-orange-500 focus:outline-none appearance-none cursor-pointer"
                >
                  {zonasUnicas.map((zona) => (
                    <optgroup key={zona} label={zona} className="font-bold text-orange-400 bg-zinc-950">
                      {ESTACIONES_TITAN_GYM.filter((s) => s.zona === zona).map((st) => (
                        <option key={st.id} value={st.id} className="text-white bg-zinc-900">
                          {st.icono} {st.nombre} (~{st.quema_aprox_min} kcal/min)
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Display del Cronómetro y Calorías quemadas */}
            <div className="relative z-10 p-6 rounded-3xl bg-zinc-900 border border-zinc-800 text-center space-y-4">
              
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold tracking-widest block">
                  Tiempo en la Máquina
                </span>
                <span className="font-mono text-4xl font-black text-white tracking-widest">
                  {formatTimer(liveSeconds)}
                </span>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 space-y-1">
                <span className="text-[10px] font-mono uppercase text-orange-400 font-bold tracking-wider block">
                  Calorías Quemadas
                </span>
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="font-heading text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 tabular-nums">
                    {Math.round(liveBurnedCals)}
                  </span>
                  <span className="text-xs font-mono font-bold text-orange-400">KCAL</span>
                </div>
                <span className="text-[11px] text-zinc-400 font-mono block">
                  Ritmo: ~{currentLiveStation.quema_aprox_min} kcal / minuto
                </span>
              </div>

            </div>

            {/* Botones de Control */}
            <div className="relative z-10 space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsLiveActive(!isLiveActive)}
                  className={`py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    isLiveActive
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30'
                  }`}
                >
                  {isLiveActive ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pausar</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Reanudar</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsLiveActive(false);
                    setLiveSeconds(0);
                    setLiveBurnedCals(0);
                  }}
                  className="py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-zinc-800"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reiniciar</span>
                </button>
              </div>

              <button
                onClick={handleFinishLiveSession}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Flame className="w-5 h-5" />
                <span>Terminar y Guardar Quema</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EXPLICACIÓN DE CÓMO SE BAJAN CALORÍAS EN EL GYM                   */}
      {/* ========================================================================= */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <h3 className="font-heading text-base font-black uppercase">
                  Quema en Titán Fitness
                </h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
              <p>
                En lugar de registrar comidas, este módulo mide la <strong>energía real que gastas y quemas en el gimnasio</strong> utilizando la fórmula científica de METs (*Metabolic Equivalent of Task*).
              </p>

              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 font-mono text-[11px] space-y-1">
                <span className="font-bold block">Fórmula de Gasto:</span>
                <code>KCAL = MET × Peso ({socio.peso_kg || 72}kg) × (Minutos / 60)</code>
              </div>

              <p>
                <strong>🔥 Efecto EPOC (Afterburn):</strong> Al entrenar con máquinas pesadas o StairMaster, tu cuerpo sigue quemando calorías hasta 14 horas después del entrenamiento mientras repara fibras musculares.
              </p>

              <p className="text-[11px] text-zinc-400">
                Tu meta personalizada hoy es quemar <strong>{metaDiaria} kcal</strong> según tu objetivo de <em>{socio.meta_principal.replace('_', ' ')}</em>.
              </p>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs uppercase"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
