export type TipoDocumento = 'DNI' | 'CE' | 'PASAPORTE';
export type EstadoMembresia = 'activa' | 'por_vencer' | 'vencida' | 'pendiente_pago';
export type MetaPrincipal = 'bajar_peso' | 'masa_muscular' | 'tonificar' | 'resistencia' | 'rehabilitacion' | 'mantenerme';
export type NivelExperiencia = 'principiante' | 'intermedio' | 'avanzado';

export interface SocioProfile {
  id: string;
  user_id: string;
  gimnasio_id: string;
  tipo_documento: TipoDocumento;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  celular: string;
  email: string;
  fecha_nacimiento: string;
  sexo: 'M' | 'F' | 'OTRO';
  distrito: string;
  nombre_apoderado?: string | null;
  contacto_emergencia_nombre: string;
  contacto_emergencia_celular: string;
  // Medidas
  peso_kg: number;
  talla_cm: number;
  imc: number;
  porcentaje_grasa?: number | null;
  cintura_cm?: number | null;
  // Objetivos
  meta_principal: MetaPrincipal;
  detalle_objetivo?: string;
  zonas_reforzar: string[];
  peso_objetivo?: number | null;
  fecha_objetivo?: string | null;
  nivel: NivelExperiencia;
  dias_semana: number;
  minutos_sesion: number;
  horario_preferido: string;
  lesiones_molestias?: string | null;
  motivaciones: string[];
  // Salud y PAR-Q
  parq_respuestas: {
    problema_corazon: boolean;
    dolor_pecho: boolean;
    mareos_desmayo: boolean;
    problema_oseo_articular: boolean;
    medicacion_presion: boolean;
    embarazo_reciente: boolean;
    otra_razon_medica: boolean;
    detalle?: string;
  };
  requiere_autorizacion_medica: boolean;
  consentimiento_datos: boolean;
  consentimiento_salud: boolean;
  // Membresía
  membresia?: MembresiaSocio;
  created_at?: string;
}

export interface MembresiaSocio {
  id: string;
  plan_nombre: string;
  plan_tipo: 'dias' | 'ingresos';
  estado: EstadoMembresia;
  fecha_inicio: string;
  fecha_vencimiento: string;
  dias_totales: number;
  dias_restantes: number;
  ingresos_totales?: number;
  ingresos_restantes?: number;
  precio_pagado_centimos: number;
  sede_nombre: string;
}

export interface WizardDraft {
  // Paso 1
  tipo_documento: TipoDocumento;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  celular: string;
  email: string;
  fecha_nacimiento: string;
  sexo: 'M' | 'F' | 'OTRO';
  distrito: string;
  nombre_apoderado?: string;
  contacto_emergencia_nombre: string;
  contacto_emergencia_celular: string;
  // Paso 2
  peso_kg: string;
  talla_cm: string;
  porcentaje_grasa?: string;
  cintura_cm?: string;
  // Paso 3
  meta_principal: MetaPrincipal;
  detalle_objetivo: string;
  zonas_reforzar: string[];
  peso_objetivo: string;
  fecha_objetivo: string;
  nivel: NivelExperiencia;
  dias_semana: number;
  minutos_sesion: number;
  horario_preferido: string;
  lesiones_molestias: string;
  motivaciones: string[];
  // Paso 4
  parq_problema_corazon: boolean;
  parq_dolor_pecho: boolean;
  parq_mareos_desmayo: boolean;
  parq_problema_oseo_articular: boolean;
  parq_medicacion_presion: boolean;
  parq_embarazo_reciente: boolean;
  parq_otra_razon_medica: boolean;
  parq_detalle: string;
  consentimiento_datos: boolean;
  consentimiento_salud: boolean;
}
