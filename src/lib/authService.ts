import { supabase, GIMNASIO_ID, isSupabaseConfigured } from './supabase';
import type { SocioProfile, WizardDraft, MembresiaSocio } from '../types/socio';

const OFFLINE_SOCIO_KEY = 'titan_socio_offline';
const OFFLINE_WIZARD_DRAFT = 'titan_wizard_draft';

// Demo sample member with active membership for instant testing
export const DEMO_SOCIO: SocioProfile = {
  id: 'SOC-2026-08492',
  user_id: 'user-demo-123',
  gimnasio_id: GIMNASIO_ID,
  tipo_documento: 'DNI',
  numero_documento: '74829103',
  nombres: 'Carlos Andrés',
  apellidos: 'Vargas Mendoza',
  celular: '987654321',
  email: 'carlos.vargas@ejemplo.com',
  fecha_nacimiento: '1996-05-14',
  sexo: 'M',
  distrito: 'Miraflores',
  contacto_emergencia_nombre: 'Lucía Vargas (Hermana)',
  contacto_emergencia_celular: '992123456',
  peso_kg: 76.5,
  talla_cm: 178,
  imc: 24.1,
  porcentaje_grasa: 16.5,
  cintura_cm: 82,
  meta_principal: 'masa_muscular',
  detalle_objetivo: 'Aumentar fuerza en press de banca y sentadillas, mejorar postura en espalda alta.',
  zonas_reforzar: ['pecho', 'espalda', 'piernas'],
  peso_objetivo: 80,
  fecha_objetivo: '2026-12-31',
  nivel: 'intermedio',
  dias_semana: 4,
  minutos_sesion: 60,
  horario_preferido: 'Mañanas (6:30 - 8:00 AM)',
  motivaciones: ['salud', 'estetica', 'deporte'],
  parq_respuestas: {
    problema_corazon: false,
    dolor_pecho: false,
    mareos_desmayo: false,
    problema_oseo_articular: false,
    medicacion_presion: false,
    embarazo_reciente: false,
    otra_razon_medica: false,
  },
  requiere_autorizacion_medica: false,
  consentimiento_datos: true,
  consentimiento_salud: true,
  membresia: {
    id: 'MEM-2026-901',
    plan_nombre: 'Mensual libre',
    plan_tipo: 'dias',
    estado: 'activa',
    fecha_inicio: '2026-10-15',
    fecha_vencimiento: '2026-11-15',
    dias_totales: 30,
    dias_restantes: 18,
    precio_pagado_centimos: 19900,
    sede_nombre: 'Sede Principal'
  }
};

// --- PHONE + OTP 5 DÍGITOS ---

export function generateRandom5DigitOTP(): string {
  // Genera un número aleatorio de 5 dígitos (ej. 48291, 10293, 85934)
  return Math.floor(10000 + Math.random() * 90000).toString();
}

export async function requestPhoneOTP(phone: string): Promise<{
  success: boolean;
  otpCode?: string;
  error?: string;
}> {
  const cleanPhone = phone.replace(/\D/g, '');
  if (!/^9\d{8}$/.test(cleanPhone)) {
    return {
      success: false,
      error: 'Ingresa un número de celular de 9 dígitos válido (comenzando con 9).',
    };
  }

  // Simulación de envío SMS / WhatsApp con código de 5 dígitos
  await new Promise((r) => setTimeout(r, 600));
  const otpCode = generateRandom5DigitOTP();

  return {
    success: true,
    otpCode,
  };
}

export async function verifyPhoneOTP(
  phone: string,
  inputCode: string,
  actualCode: string
): Promise<{
  success: boolean;
  user?: any;
  profile?: SocioProfile | null;
  isExistingSocio: boolean;
  error?: string;
}> {
  if (inputCode.trim() !== actualCode.trim()) {
    return {
      success: false,
      isExistingSocio: false,
      error: 'Código incorrecto. Verifica los 5 dígitos e inténtalo nuevamente.',
    };
  }

  const cleanPhone = phone.replace(/\D/g, '');

  // 1. Revisar si coincide con el demo socio
  if (cleanPhone === DEMO_SOCIO.celular) {
    saveOfflineSocio(DEMO_SOCIO);
    return {
      success: true,
      user: { id: DEMO_SOCIO.user_id, celular: cleanPhone, email: DEMO_SOCIO.email },
      profile: DEMO_SOCIO,
      isExistingSocio: true,
    };
  }

  // 2. Revisar almacenamiento local
  const cached = getOfflineSocio();
  if (cached && cached.celular === cleanPhone) {
    return {
      success: true,
      user: { id: cached.user_id, celular: cleanPhone, email: cached.email },
      profile: cached,
      isExistingSocio: true,
    };
  }

  // 3. Revisar en Supabase si está disponible
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('socio')
        .select('*, membresia(*)')
        .eq('celular', cleanPhone)
        .maybeSingle();

      if (data && !error) {
        const profile: SocioProfile = {
          ...data,
          membresia: data.membresia?.[0] || data.membresia || undefined,
        };
        saveOfflineSocio(profile);
        return {
          success: true,
          user: { id: profile.user_id, celular: cleanPhone, email: profile.email },
          profile,
          isExistingSocio: true,
        };
      }
    } catch (err) {
      console.warn('Error buscando socio por celular en Supabase:', err);
    }
  }

  // Celular nuevo sin perfil -> pasa al Wizard de inscripción
  return {
    success: true,
    user: { id: `user-phone-${cleanPhone}`, celular: cleanPhone, email: '' },
    profile: null,
    isExistingSocio: false,
  };
}

export async function registerWithEmail(email: string, password: string): Promise<{
  success: boolean;
  user?: any;
  error?: string;
}> {
  if (!supabase) {
    await new Promise((r) => setTimeout(r, 600));
    return { success: true, user: { id: `user-${Date.now()}`, email } };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al registrarse' };
  }
}

export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    await new Promise((r) => setTimeout(r, 500));
    return { success: true };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al enviar enlace' };
  }
}

export async function signOutUser(): Promise<void> {
  clearOfflineSocio();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Error en signout:', e);
    }
  }
}

export async function fetchSocioProfile(userId: string): Promise<SocioProfile | null> {
  // Primero revisar en almacenamiento offline local
  const cached = getOfflineSocio();
  if (cached && cached.user_id === userId) {
    return cached;
  }

  if (!supabase) {
    return cached || null;
  }

  try {
    const { data, error } = await supabase
      .from('socio')
      .select('*, membresia(*)')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) {
      return cached || null;
    }

    const profile: SocioProfile = {
      ...data,
      membresia: data.membresia?.[0] || data.membresia || undefined,
    };

    saveOfflineSocio(profile);
    return profile;
  } catch (err) {
    console.warn('Error consultando perfil socio en Supabase:', err);
    return cached || null;
  }
}

export async function autoregistroSocio(
  gimnasioId: string,
  draft: WizardDraft,
  userId?: string
): Promise<{ success: boolean; profile?: SocioProfile; error?: string; helpMessage?: string }> {
  const requiresMedical = 
    draft.parq_problema_corazon ||
    draft.parq_dolor_pecho ||
    draft.parq_mareos_desmayo ||
    draft.parq_problema_oseo_articular ||
    draft.parq_medicacion_presion ||
    draft.parq_embarazo_reciente ||
    draft.parq_otra_razon_medica;

  const peso = parseFloat(draft.peso_kg) || 70;
  const talla = parseFloat(draft.talla_cm) || 170;
  const imc = parseFloat((peso / Math.pow(talla / 100, 2)).toFixed(1));

  const payload = {
    user_id: userId || `user-${Date.now()}`,
    gimnasio_id: gimnasioId || GIMNASIO_ID,
    tipo_documento: draft.tipo_documento,
    numero_documento: draft.numero_documento,
    nombres: draft.nombres,
    apellidos: draft.apellidos,
    celular: draft.celular,
    email: draft.email,
    fecha_nacimiento: draft.fecha_nacimiento,
    sexo: draft.sexo,
    distrito: draft.distrito,
    nombre_apoderado: draft.nombre_apoderado || null,
    contacto_emergencia_nombre: draft.contacto_emergencia_nombre,
    contacto_emergencia_celular: draft.contacto_emergencia_celular,
    peso_kg: peso,
    talla_cm: talla,
    imc,
    porcentaje_grasa: draft.porcentaje_grasa ? parseFloat(draft.porcentaje_grasa) : null,
    cintura_cm: draft.cintura_cm ? parseFloat(draft.cintura_cm) : null,
    meta_principal: draft.meta_principal,
    detalle_objetivo: draft.detalle_objetivo,
    zonas_reforzar: draft.zonas_reforzar,
    peso_objetivo: draft.peso_objetivo ? parseFloat(draft.peso_objetivo) : null,
    fecha_objetivo: draft.fecha_objetivo || null,
    nivel: draft.nivel,
    dias_semana: draft.dias_semana,
    minutos_sesion: draft.minutos_sesion,
    horario_preferido: draft.horario_preferido,
    lesiones_molestias: draft.lesiones_molestias || null,
    motivaciones: draft.motivaciones,
    parq_respuestas: {
      problema_corazon: draft.parq_problema_corazon,
      dolor_pecho: draft.parq_dolor_pecho,
      mareos_desmayo: draft.parq_mareos_desmayo,
      problema_oseo_articular: draft.parq_problema_oseo_articular,
      medicacion_presion: draft.parq_medicacion_presion,
      embarazo_reciente: draft.parq_embarazo_reciente,
      otra_razon_medica: draft.parq_otra_razon_medica,
      detalle: draft.parq_detalle,
    },
    requiere_autorizacion_medica: requiresMedical,
    consentimiento_datos: draft.consentimiento_datos,
    consentimiento_salud: draft.consentimiento_salud,
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('autoregistro_socio', {
        p_gimnasio: gimnasioId || GIMNASIO_ID,
        p_datos: payload,
      });

      if (error) {
        const errorLower = error.message.toLowerCase();
        if (
          errorLower.includes('documento ya registrado') || 
          errorLower.includes('ya registrado') ||
          errorLower.includes('unique_violation')
        ) {
          return {
            success: false,
            error: 'Documento ya registrado',
            helpMessage: 'Pide a recepción que vincule tu cuenta con tu celular.',
          };
        }
        return { success: false, error: error.message };
      }
    } catch (err: any) {
      console.warn('Error en llamada a autoregistro_socio RPC:', err);
    }
  }

  // Generar perfil de socio completado
  const newProfile: SocioProfile = {
    id: `SOC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
    ...payload,
    membresia: {
      id: `MEM-${Date.now()}`,
      plan_nombre: 'Membresía Bienvenida (Prueba)',
      plan_tipo: 'dias',
      estado: 'activa',
      fecha_inicio: new Date().toISOString().split('T')[0],
      fecha_vencimiento: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      dias_totales: 15,
      dias_restantes: 15,
      precio_pagado_centimos: 0,
      sede_nombre: 'Sede Principal'
    }
  };

  saveOfflineSocio(newProfile);
  clearWizardDraft();

  return { success: true, profile: newProfile };
}

// Helpers offline
export function saveOfflineSocio(profile: SocioProfile) {
  try {
    localStorage.setItem(OFFLINE_SOCIO_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Error guardando socio offline:', e);
  }
}

export function getOfflineSocio(): SocioProfile | null {
  try {
    const raw = localStorage.getItem(OFFLINE_SOCIO_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function clearOfflineSocio() {
  try {
    localStorage.removeItem(OFFLINE_SOCIO_KEY);
  } catch (e) {}
}

export function saveWizardDraft(draft: WizardDraft) {
  try {
    localStorage.setItem(OFFLINE_WIZARD_DRAFT, JSON.stringify(draft));
  } catch (e) {}
}

export function getWizardDraft(): WizardDraft | null {
  try {
    const raw = localStorage.getItem(OFFLINE_WIZARD_DRAFT);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function clearWizardDraft() {
  try {
    localStorage.removeItem(OFFLINE_WIZARD_DRAFT);
  } catch (e) {}
}
