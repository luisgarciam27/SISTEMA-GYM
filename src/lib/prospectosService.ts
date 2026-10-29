import { supabase, GIMNASIO_ID } from './supabase';
import type { Prospecto } from '../types/admin';

const PROSPECTOS_STORAGE_KEY = 'titan_prospectos_crm';

const INITIAL_PROSPECTOS: Prospecto[] = [
  {
    id: 'PROSP-101',
    nombre: 'Valeria Quispe',
    celular: '984512390',
    plan_interes: 'Pack Trimestral Élite Promo',
    sede_preferida: 'Sede 1 (Principal)',
    estado: 'nuevo',
    created_at: new Date(Date.now() - 25 * 60000).toISOString(),
    mensaje: 'Quiero información de la promo con rutina incluida.'
  },
  {
    id: 'PROSP-102',
    nombre: 'Diego Rivas',
    celular: '991234876',
    plan_interes: 'Pase Prueba 1 Mes Promo',
    sede_preferida: 'Sede 2',
    estado: 'contactado',
    created_at: new Date(Date.now() - 140 * 60000).toISOString(),
    mensaje: 'Horario nocturno después de las 7pm.'
  },
  {
    id: 'PROSP-103',
    nombre: 'Camila Salazar',
    celular: '976543219',
    plan_interes: 'Pack Trimestral Élite Promo',
    sede_preferida: 'Sede 1 (Principal)',
    estado: 'visita_agendada',
    created_at: new Date(Date.now() - 360 * 60000).toISOString(),
    mensaje: 'Visita agendada para el sábado 10am.'
  }
];

export function getProspectos(): Prospecto[] {
  try {
    const raw = localStorage.getItem(PROSPECTOS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROSPECTOS_STORAGE_KEY, JSON.stringify(INITIAL_PROSPECTOS));
      return INITIAL_PROSPECTOS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_PROSPECTOS;
  }
}

export function saveProspectos(list: Prospecto[]) {
  try {
    localStorage.setItem(PROSPECTOS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {}
}

export async function registrarNuevoProspecto(params: {
  nombre: string;
  celular: string;
  plan_interes: string;
  sede_preferida: string;
}): Promise<{ success: boolean; prospecto: Prospecto; error?: string }> {
  const nuevo: Prospecto = {
    id: `PROSP-${Date.now().toString().slice(-4)}`,
    nombre: params.nombre,
    celular: params.celular,
    plan_interes: params.plan_interes,
    sede_preferida: params.sede_preferida,
    estado: 'nuevo',
    created_at: new Date().toISOString(),
  };

  // Guardar localmente para que el panel de admin lo vea en vivo de inmediato
  const current = getProspectos();
  saveProspectos([nuevo, ...current]);

  // Si Supabase está conectado, invocar la RPC
  if (supabase) {
    try {
      await supabase.rpc('crear_prospecto_publico', {
        p_gimnasio: GIMNASIO_ID,
        p_nombre: params.nombre,
        p_celular: params.celular,
      });
    } catch (err) {
      console.warn('Error en RPC crear_prospecto_publico:', err);
    }
  }

  return { success: true, prospecto: nuevo };
}

export function actualizarEstadoProspecto(id: string, nuevoEstado: Prospecto['estado']) {
  const current = getProspectos();
  const updated = current.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p));
  saveProspectos(updated);
  return updated;
}
