import { z } from 'zod';

export interface HorarioSede {
  lunes_viernes?: string;
  sabado?: string;
  domingo_feriados?: string;
  [key: string]: string | undefined;
}

export interface GimnasioPublico {
  id: string;
  nombre: string;
  eslogan?: string;
  descripcion?: string;
  whatsapp_principal?: string;
  ciudad?: string;
  logo_url?: string;
}

export interface Sede {
  id: string;
  nombre: string;
  direccion: string;
  whatsapp: string;
  aforo_maximo: number;
  horario: HorarioSede;
  imagen_url?: string;
  distrito?: string;
}

export interface Plan {
  id: string;
  nombre: string;
  tipo: 'dias' | 'ingresos' | 'suscripcion';
  duracion_dias: number | null;
  numero_ingresos: number | null;
  precio_centimos: number;
  incluye_rutina: boolean;
  congelable: boolean;
  activo: boolean;
  descripcion?: string;
}

export interface EmpresaConvenioPublica {
  id: string;
  nombre: string;
  slug: string;
  beneficio_resumen?: string;
  descuento_porcentaje?: number;
}

// Zod Schema for Lead Capture
export const prospectoSchema = z.object({
  nombre: z
    .string()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    .max(80, { message: 'El nombre no debe superar los 80 caracteres' })
    .trim(),
  celular: z
    .string()
    .regex(/^9\d{8}$/, { message: 'Ingresa un celular válido de Perú (9 dígitos comenzando con 9)' }),
  plan_interes: z.string().optional(),
  sede_preferida: z.string().optional(),
  honeypot: z.string().max(0, { message: 'Spam detected' }).optional(),
});

export type ProspectoFormData = z.infer<typeof prospectoSchema>;
