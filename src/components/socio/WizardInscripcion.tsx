import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, 
  Ruler, 
  Target, 
  HeartPulse, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Info,
  Flame,
  Dumbbell,
  Scale,
  Sparkles
} from 'lucide-react';
import type { WizardDraft, TipoDocumento, MetaPrincipal, NivelExperiencia } from '../../types/socio';
import { 
  saveWizardDraft, 
  getWizardDraft, 
  autoregistroSocio 
} from '../../lib/authService';
import { GIMNASIO_ID } from '../../lib/supabase';

interface WizardInscripcionProps {
  userEmail?: string;
  userPhone?: string;
  userId?: string;
  onCompleted: () => void;
  onCancel?: () => void;
}

const DEFAULT_DRAFT: WizardDraft = {
  tipo_documento: 'DNI',
  numero_documento: '',
  nombres: '',
  apellidos: '',
  celular: '',
  email: '',
  fecha_nacimiento: '2000-01-01',
  sexo: 'M',
  distrito: 'Miraflores',
  nombre_apoderado: '',
  contacto_emergencia_nombre: '',
  contacto_emergencia_celular: '',
  peso_kg: '70',
  talla_cm: '170',
  porcentaje_grasa: '',
  cintura_cm: '',
  meta_principal: 'masa_muscular',
  detalle_objetivo: '',
  zonas_reforzar: ['pecho', 'espalda', 'piernas'],
  peso_objetivo: '',
  fecha_objetivo: '',
  nivel: 'intermedio',
  dias_semana: 4,
  minutos_sesion: 60,
  horario_preferido: 'Mañanas (6:00 - 9:00 AM)',
  lesiones_molestias: '',
  motivaciones: ['salud', 'estetica'],
  parq_problema_corazon: false,
  parq_dolor_pecho: false,
  parq_mareos_desmayo: false,
  parq_problema_oseo_articular: false,
  parq_medicacion_presion: false,
  parq_embarazo_reciente: false,
  parq_otra_razon_medica: false,
  parq_detalle: '',
  consentimiento_datos: false,
  consentimiento_salud: false,
};

const METAS_CONFIG: { id: MetaPrincipal; title: string; desc: string; icon: string }[] = [
  { id: 'bajar_peso', title: 'Bajar de peso', desc: 'Déficit calórico, quema de grasa y aceleración metabólica', icon: '🔥' },
  { id: 'masa_muscular', title: 'Ganar masa muscular', desc: 'Hipertrofia, progresión de cargas y fuerza máxima', icon: '💪' },
  { id: 'tonificar', title: 'Tonificar y definir', desc: 'Recomposición corporal, firmeza y definición muscular', icon: '⚡' },
  { id: 'resistencia', title: 'Resistencia / Cardio', desc: 'Capacidad aeróbica, rendimiento funcional y agilidad', icon: '🏃' },
  { id: 'rehabilitacion', title: 'Rehabilitación y salud', desc: 'Fortalecimiento articular, movilidad y corrección postural', icon: '🩺' },
  { id: 'mantenerme', title: 'Mantenerme activo', desc: 'Hábito diario saludable, desestrés y bienestar integral', icon: '🌱' },
];

const ZONAS_OPCIONES = [
  'Pecho', 'Espalda', 'Hombros', 'Brazos', 'Abdomen', 'Glúteos', 'Piernas', 'Cardio', 'Postura'
];

const MOTIVACIONES_OPCIONES = [
  { id: 'salud', label: 'Salud y energía' },
  { id: 'estetica', label: 'Estética / Físico' },
  { id: 'evento', label: 'Evento próximo' },
  { id: 'deporte', label: 'Rendimiento deportivo' },
  { id: 'estres', label: 'Manejo del estrés' },
];

export const WizardInscripcion: React.FC<WizardInscripcionProps> = ({
  userEmail = '',
  userPhone = '',
  userId,
  onCompleted,
  onCancel,
}) => {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<WizardDraft>(() => {
    const saved = getWizardDraft();
    return saved
      ? {
          ...DEFAULT_DRAFT,
          ...saved,
          email: userEmail || saved.email,
          celular: userPhone || saved.celular,
        }
      : { ...DEFAULT_DRAFT, email: userEmail, celular: userPhone };
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [helpMessage, setHelpMessage] = useState<string | null>(null);
  const [showMedicalWarning, setShowMedicalWarning] = useState(false);

  // Auto-save draft in memory and localStorage
  useEffect(() => {
    saveWizardDraft(draft);
  }, [draft]);

  // Calculate age
  const isMinor = useMemo(() => {
    if (!draft.fecha_nacimiento) return false;
    const birthDate = new Date(draft.fecha_nacimiento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age < 18;
  }, [draft.fecha_nacimiento]);

  // Live IMC Calculation
  const imcInfo = useMemo(() => {
    const p = parseFloat(draft.peso_kg);
    const t = parseFloat(draft.talla_cm);
    if (!p || !t || t <= 0) return null;
    const imc = parseFloat((p / Math.pow(t / 100, 2)).toFixed(1));

    let clasificacion = 'Normal';
    let colorBadge = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';

    if (imc < 18.5) {
      clasificacion = 'Bajo peso';
      colorBadge = 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    } else if (imc >= 18.5 && imc <= 24.9) {
      clasificacion = 'Rango saludable';
      colorBadge = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    } else if (imc >= 25 && imc <= 29.9) {
      clasificacion = 'Sobrepeso referencial';
      colorBadge = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    } else {
      clasificacion = 'Obesidad referencial';
      colorBadge = 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    }

    return { imc, clasificacion, colorBadge };
  }, [draft.peso_kg, draft.talla_cm]);

  const updateDraft = (fields: Partial<WizardDraft>) => {
    setDraft((prev) => ({ ...prev, ...fields }));
    setErrorMessage(null);
  };

  const toggleZona = (zona: string) => {
    const lower = zona.toLowerCase();
    const current = draft.zonas_reforzar;
    if (current.includes(lower)) {
      updateDraft({ zonas_reforzar: current.filter((z) => z !== lower) });
    } else {
      updateDraft({ zonas_reforzar: [...current, lower] });
    }
  };

  const toggleMotivacion = (id: string) => {
    const current = draft.motivaciones;
    if (current.includes(id)) {
      updateDraft({ motivaciones: current.filter((m) => m !== id) });
    } else {
      updateDraft({ motivaciones: [...current, id] });
    }
  };

  // Validation per step
  const validateStep = (currentStep: number): boolean => {
    setErrorMessage(null);
    setHelpMessage(null);

    if (currentStep === 1) {
      if (!draft.numero_documento.trim()) {
        setErrorMessage('Ingresa el número de tu documento de identidad.');
        return false;
      }
      if (draft.tipo_documento === 'DNI' && !/^\d{8}$/.test(draft.numero_documento.trim())) {
        setErrorMessage('El DNI debe tener exactamente 8 dígitos numéricos.');
        return false;
      }
      if (!draft.nombres.trim() || !draft.apellidos.trim()) {
        setErrorMessage('Ingresa tus nombres y apellidos completos.');
        return false;
      }
      if (!draft.celular.trim() || !/^9\d{8}$/.test(draft.celular.trim())) {
        setErrorMessage('Ingresa un número de celular de 9 dígitos válido (iniciando con 9).');
        return false;
      }
      if (!draft.email.trim() || !draft.email.includes('@')) {
        setErrorMessage('Ingresa un correo electrónico válido.');
        return false;
      }
      if (isMinor && !draft.nombre_apoderado?.trim()) {
        setErrorMessage('Al ser menor de 18 años, el nombre de tu apoderado es obligatorio.');
        return false;
      }
      if (!draft.contacto_emergencia_nombre.trim() || !draft.contacto_emergencia_celular.trim()) {
        setErrorMessage('Ingresa el nombre y celular de tu contacto de emergencia.');
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      const p = parseFloat(draft.peso_kg);
      const t = parseFloat(draft.talla_cm);
      if (!p || p < 30 || p > 250) {
        setErrorMessage('Ingresa un peso válido entre 30 y 250 kg.');
        return false;
      }
      if (!t || t < 100 || t > 240) {
        setErrorMessage('Ingresa una talla válida entre 100 y 240 cm.');
        return false;
      }
      return true;
    }

    if (currentStep === 3) {
      if (!draft.meta_principal) {
        setErrorMessage('Selecciona tu meta principal de entrenamiento.');
        return false;
      }
      return true;
    }

    if (currentStep === 4) {
      if (!draft.consentimiento_datos) {
        setErrorMessage('Debes aceptar el consentimiento de tratamiento de datos personales conforme a ley.');
        return false;
      }
      if (!draft.consentimiento_salud) {
        setErrorMessage('Debes aceptar el consentimiento para el tratamiento de tus datos de salud.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setSubmitting(true);
    setErrorMessage(null);
    setHelpMessage(null);

    try {
      const res = await autoregistroSocio(GIMNASIO_ID, draft, userId);

      if (!res.success) {
        setErrorMessage(res.error || 'Error al completar la inscripción.');
        if (res.helpMessage) {
          setHelpMessage(res.helpMessage);
        }
        setSubmitting(false);
        return;
      }

      // Check if requires medical authorization
      if (res.profile?.requiere_autorizacion_medica) {
        setShowMedicalWarning(true);
      } else {
        onCompleted();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error de conexión. Intenta de nuevo.');
      setSubmitting(false);
    }
  };

  // Medical notice dialog
  if (showMedicalWarning) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#090A0E] text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <HeartPulse className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-heading text-2xl font-black uppercase text-zinc-950 dark:text-white">
              ¡Inscripción Registrada!
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Tu entrenador revisará tus respuestas del cuestionario de salud antes de asignarte tu primera rutina personalizada, cuidando tu bienestar en cada ejercicio.
            </p>
          </div>
          <button
            onClick={onCompleted}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-500/25 transition-all"
          >
            Ir a Mi Cuenta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#090A0E] text-zinc-900 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-200">
      
      {/* Top Header & Progress */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-[#090A0E]/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 sm:px-6">
        <div className="max-w-xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-orange-600 dark:text-orange-400 font-bold">
                Paso {step} de 4
              </span>
              <h2 className="font-heading text-xl font-black uppercase text-zinc-950 dark:text-white">
                {step === 1 && '1. Datos Personales'}
                {step === 2 && '2. Tus Medidas'}
                {step === 3 && '3. Tus Objetivos'}
                {step === 4 && '4. Salud y Consentimientos'}
              </h2>
            </div>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                Cerrar
              </button>
            )}
          </div>

          {/* Stepper Progress Bar */}
          <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden flex">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 max-w-xl mx-auto w-full px-4 py-6 sm:px-6">
        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs sm:text-sm space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            {helpMessage && (
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-red-500/20">
                👉 {helpMessage}
              </p>
            )}
          </div>
        )}

        {/* STEP 1: DATOS PERSONALES */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1 space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Tipo Doc.</label>
                <select
                  value={draft.tipo_documento}
                  onChange={(e) => updateDraft({ tipo_documento: e.target.value as TipoDocumento })}
                  className="w-full px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                >
                  <option value="DNI">DNI</option>
                  <option value="CE">C.E.</option>
                  <option value="PASAPORTE">Pasaporte</option>
                </select>
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Número de Documento {draft.tipo_documento === 'DNI' && '(8 dígitos)'}
                </label>
                <input
                  type="text"
                  maxLength={draft.tipo_documento === 'DNI' ? 8 : 15}
                  value={draft.numero_documento}
                  onChange={(e) => updateDraft({ numero_documento: e.target.value.replace(/\D/g, '') })}
                  placeholder={draft.tipo_documento === 'DNI' ? 'Ej. 74829103' : 'Número'}
                  inputMode="numeric"
                  className="w-full px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Nombres</label>
                <input
                  type="text"
                  value={draft.nombres}
                  onChange={(e) => updateDraft({ nombres: e.target.value })}
                  placeholder="Ej. Carlos Andrés"
                  className="w-full px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Apellidos</label>
                <input
                  type="text"
                  value={draft.apellidos}
                  onChange={(e) => updateDraft({ apellidos: e.target.value })}
                  placeholder="Ej. Vargas Mendoza"
                  className="w-full px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Celular (9 dígitos)</label>
                <input
                  type="tel"
                  maxLength={9}
                  value={draft.celular}
                  onChange={(e) => updateDraft({ celular: e.target.value.replace(/\D/g, '') })}
                  placeholder="987654321"
                  inputMode="tel"
                  className="w-full px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-mono"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Correo Electrónico</label>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(e) => updateDraft({ email: e.target.value })}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={draft.fecha_nacimiento}
                  onChange={(e) => updateDraft({ fecha_nacimiento: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Sexo</label>
                <select
                  value={draft.sexo}
                  onChange={(e) => updateDraft({ sexo: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="OTRO">Otro / Prefiero no decir</option>
                </select>
              </div>
            </div>

            {/* Condicional Menor de 18 */}
            {isMinor && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Socio Menor de Edad detectado</span>
                </div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                  Nombre Completo del Apoderado o Tutor Legal *
                </label>
                <input
                  type="text"
                  value={draft.nombre_apoderado || ''}
                  onChange={(e) => updateDraft({ nombre_apoderado: e.target.value })}
                  placeholder="Ej. Roberto Vargas Salas (Padre)"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-amber-500/30 text-zinc-900 dark:text-white"
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Distrito / Ciudad</label>
              <input
                type="text"
                value={draft.distrito}
                onChange={(e) => updateDraft({ distrito: e.target.value })}
                placeholder="Ej. Miraflores, San Isidro, Surco, Cayma, etc."
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
            </div>

            {/* Contacto de Emergencia */}
            <div className="p-4 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Contacto de Emergencia</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={draft.contacto_emergencia_nombre}
                  onChange={(e) => updateDraft({ contacto_emergencia_nombre: e.target.value })}
                  placeholder="Nombre y Parentesco (ej. Madre)"
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-750 text-zinc-900 dark:text-white"
                  required
                />
                <input
                  type="tel"
                  maxLength={9}
                  value={draft.contacto_emergencia_celular}
                  onChange={(e) => updateDraft({ contacto_emergencia_celular: e.target.value.replace(/\D/g, '') })}
                  placeholder="Celular de Emergencia"
                  inputMode="tel"
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-750 text-zinc-900 dark:text-white font-mono"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: TUS MEDIDAS */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                  Peso Actual (kg) *
                </label>
                <div className="flex items-baseline gap-2">
                  <input
                    type="number"
                    step="0.5"
                    value={draft.peso_kg}
                    onChange={(e) => updateDraft({ peso_kg: e.target.value })}
                    className="w-full text-3xl font-black font-heading text-zinc-950 dark:text-white bg-transparent focus:outline-hidden"
                    inputMode="decimal"
                    placeholder="70"
                    required
                  />
                  <span className="text-xs font-mono text-zinc-400">kg</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                  Talla / Estatura (cm) *
                </label>
                <div className="flex items-baseline gap-2">
                  <input
                    type="number"
                    value={draft.talla_cm}
                    onChange={(e) => updateDraft({ talla_cm: e.target.value })}
                    className="w-full text-3xl font-black font-heading text-zinc-950 dark:text-white bg-transparent focus:outline-hidden"
                    inputMode="numeric"
                    placeholder="170"
                    required
                  />
                  <span className="text-xs font-mono text-zinc-400">cm</span>
                </div>
              </div>
            </div>

            {/* Live IMC Meter */}
            {imcInfo && (
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase font-bold text-zinc-500 dark:text-zinc-400">
                    Índice de Masa Corporal (IMC en vivo)
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${imcInfo.colorBadge}`}>
                    {imcInfo.clasificacion}
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-heading text-4xl font-black text-zinc-950 dark:text-white tabular-nums">
                    {imcInfo.imc}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">kg/m²</span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed italic border-t border-zinc-100 dark:border-zinc-800 pt-2">
                  * Nota: El IMC es un indicador referencial que calcula la relación entre peso y talla. No es un diagnóstico médico ni reemplaza la evaluación con tu entrenador.
                </p>
              </div>
            )}

            {/* Opcionales */}
            <div className="p-4 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                Medidas Opcionales (puedes completarlas después con tu entrenador)
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-500 dark:text-zinc-400">% Grasa Corporal (opcional)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={draft.porcentaje_grasa || ''}
                    onChange={(e) => updateDraft({ porcentaje_grasa: e.target.value })}
                    placeholder="Ej. 18.5"
                    inputMode="decimal"
                    className="w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-750 text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-500 dark:text-zinc-400">Cintura en cm (opcional)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={draft.cintura_cm || ''}
                    onChange={(e) => updateDraft({ cintura_cm: e.target.value })}
                    placeholder="Ej. 82"
                    inputMode="decimal"
                    className="w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-750 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: TUS OBJETIVOS */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Meta Principal */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
                Meta Principal *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {METAS_CONFIG.map((meta) => {
                  const isSelected = draft.meta_principal === meta.id;
                  return (
                    <button
                      key={meta.id}
                      type="button"
                      onClick={() => updateDraft({ meta_principal: meta.id })}
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        isSelected
                          ? 'border-2 border-orange-500 bg-orange-500/10 shadow-md shadow-orange-500/10'
                          : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{meta.icon}</span>
                        <div>
                          <p className="font-heading text-lg font-bold uppercase text-zinc-950 dark:text-white leading-tight">
                            {meta.title}
                          </p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                            {meta.desc}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ¿Qué quieres mejorar? */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                ¿Qué quieres mejorar o lograr específicamente?
              </label>
              <textarea
                rows={3}
                value={draft.detalle_objetivo}
                onChange={(e) => updateDraft({ detalle_objetivo: e.target.value })}
                placeholder="Ej. Quiero aumentar fuerza en press militar, mejorar postura por trabajo de oficina y tener más resistencia en fútbol..."
                className="w-full p-3 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white resize-none"
              />
            </div>

            {/* Zonas a reforzar */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Zonas que deseas reforzar (selecciona una o varias)
              </label>
              <div className="flex flex-wrap gap-2">
                {ZONAS_OPCIONES.map((zona) => {
                  const isChecked = draft.zonas_reforzar.includes(zona.toLowerCase());
                  return (
                    <button
                      key={zona}
                      type="button"
                      onClick={() => toggleZona(zona)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isChecked
                          ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                          : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                      }`}
                    >
                      {isChecked ? `✓ ${zona}` : zona}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Parámetros de Rutina */}
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 block">
                Disponibilidad y Nivel
              </span>

              {/* Días por semana */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Días por semana</p>
                  <p className="text-[11px] text-zinc-500">¿Cuántos días planeas entrenar?</p>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => updateDraft({ dias_semana: num })}
                      className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition-all ${
                        draft.dias_semana === num
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minutos por sesión */}
              <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3">
                <div>
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Duración estimada</p>
                  <p className="text-[11px] text-zinc-500">Minutos por sesión de entrenamiento</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {[30, 45, 60, 90].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => updateDraft({ minutos_sesion: mins })}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        draft.minutos_sesion === mins
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Nivel y experiencia */}
              <div className="space-y-1 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Nivel de experiencia</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['principiante', 'intermedio', 'avanzado'] as NivelExperiencia[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => updateDraft({ nivel: lvl })}
                      className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                        draft.nivel === lvl
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Motivación Chips */}
              <div className="space-y-1.5 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  ¿Qué te motiva principalmente?
                </label>
                <div className="flex flex-wrap gap-2">
                  {MOTIVACIONES_OPCIONES.map((m) => {
                    const isChecked = draft.motivaciones.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleMotivacion(m.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                          isChecked
                            ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/40 font-bold'
                            : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SALUD Y CONSENTIMIENTOS */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* PAR-Q Questions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-orange-500" />
                <h3 className="font-heading text-lg font-bold uppercase text-zinc-950 dark:text-white">
                  Cuestionario de Salud (PAR-Q)
                </h3>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Por tu seguridad, responde con total sinceridad. Si respondes "Sí" a alguna, tu entrenador adaptará tu rutina con mayor precaución.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { key: 'parq_problema_corazon', text: '1. ¿Alguna vez un médico le ha dicho que tiene un problema del corazón?' },
                  { key: 'parq_dolor_pecho', text: '2. ¿Siente dolor o presión en el pecho cuando realiza actividad física?' },
                  { key: 'parq_mareos_desmayo', text: '3. ¿Pierde el equilibrio por mareos o alguna vez ha perdido el conocimiento?' },
                  { key: 'parq_problema_oseo_articular', text: '4. ¿Tiene algún problema en los huesos o articulaciones que podría empeorar con el ejercicio?' },
                  { key: 'parq_medicacion_presion', text: '5. ¿Toma medicamentos recetados para la presión arterial o alguna condición cardíaca?' },
                  { key: 'parq_embarazo_reciente', text: '6. ¿Está embarazada o ha dado a luz en los últimos 3 meses?' },
                  { key: 'parq_otra_razon_medica', text: '7. ¿Conoce alguna otra razón médica por la que deba realizar ejercicio con cuidado?' },
                ].map((q) => {
                  const val = (draft as any)[q.key] as boolean;
                  return (
                    <div
                      key={q.key}
                      className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3"
                    >
                      <span className="text-xs text-zinc-800 dark:text-zinc-200 leading-snug">
                        {q.text}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateDraft({ [q.key]: false } as any)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            val === false
                              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                          }`}
                        >
                          No
                        </button>
                        <button
                          type="button"
                          onClick={() => updateDraft({ [q.key]: true } as any)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            val === true
                              ? 'bg-orange-500 text-white shadow-xs'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                          }`}
                        >
                          Sí
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Detalle adicional de salud o antecedentes (opcional)
                </label>
                <textarea
                  rows={2}
                  value={draft.parq_detalle}
                  onChange={(e) => updateDraft({ parq_detalle: e.target.value })}
                  placeholder="Ej. Cirugía de rodilla hace 2 años, asma leve controlada..."
                  className="w-full p-3 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>
            </div>

            {/* Consentimientos Legales Separados y Obligatorios */}
            <div className="p-4 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 block">
                Consentimientos Legales Obligatorios (Ley N° 29733)
              </span>

              {/* Consentimiento 1: Datos Personales */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.consentimiento_datos}
                  onChange={(e) => updateDraft({ consentimiento_datos: e.target.checked })}
                  className="mt-1 w-4 h-4 accent-orange-500 rounded"
                  required
                />
                <span className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  <strong className="text-zinc-900 dark:text-zinc-100">Consentimiento de Datos Personales:</strong> Autorizo libre y expresamente el tratamiento de mis datos personales para la gestión de mi membresía, control de acceso y comunicaciones operativas conforme a la Ley de Protección de Datos Personales del Perú (Ley N° 29733).
                </span>
              </label>

              {/* Consentimiento 2: Datos de Salud */}
              <label className="flex items-start gap-3 cursor-pointer pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <input
                  type="checkbox"
                  checked={draft.consentimiento_salud}
                  onChange={(e) => updateDraft({ consentimiento_salud: e.target.checked })}
                  className="mt-1 w-4 h-4 accent-orange-500 rounded"
                  required
                />
                <span className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  <strong className="text-zinc-900 dark:text-zinc-100">Consentimiento de Datos de Salud:</strong> Autorizo de manera previa e informada el registro de mis respuestas PAR-Q y métricas físicas exclusivamente para que los entrenadores diseñen y adapten mi plan de entrenamiento de forma segura.
                </span>
              </label>
            </div>

            {/* Resumen Previo al Envío */}
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs space-y-2">
              <span className="font-bold text-zinc-900 dark:text-white uppercase font-mono">
                Resumen de Inscripción
              </span>
              <p className="text-zinc-600 dark:text-zinc-300">
                • <strong>Socio:</strong> {draft.nombres} {draft.apellidos} ({draft.tipo_documento}: {draft.numero_documento})
              </p>
              <p className="text-zinc-600 dark:text-zinc-300">
                • <strong>Métricas:</strong> {draft.peso_kg} kg · {draft.talla_cm} cm (IMC {imcInfo?.imc || 'N/A'})
              </p>
              <p className="text-zinc-600 dark:text-zinc-300">
                • <strong>Meta:</strong> {METAS_CONFIG.find(m => m.id === draft.meta_principal)?.title} · {draft.dias_semana} días/sem
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-0 z-30 bg-white/95 dark:bg-[#090A0E]/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 p-4">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 max-w-[200px] flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-md shadow-orange-500/25 transition-all cursor-pointer"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-xl shadow-orange-500/30 disabled:opacity-50 transition-all cursor-pointer"
            >
              {submitting ? (
                <span>Inscribiendo...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Completar Inscripción</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
