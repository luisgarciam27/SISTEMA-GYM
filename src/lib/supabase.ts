import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { GimnasioPublico, Sede, Plan, EmpresaConvenioPublica } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const GIMNASIO_ID = import.meta.env.VITE_GIMNASIO_ID || 'titan-lima-01';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Semilla por defecto adaptable a cualquier cliente del país (Sede 1, Sede 2, etc.)
const DEFAULT_GIMNASIO: GimnasioPublico = {
  id: GIMNASIO_ID,
  nombre: 'Titán Fitness',
  eslogan: 'Fuerza, disciplina y alto rendimiento',
  descripcion: 'Gimnasio de alto rendimiento enfocado en musculación, levantamiento olímpico y acondicionamiento integral con tecnología de punta.',
  whatsapp_principal: '51987654321',
  ciudad: ''
};

const DEFAULT_SEDES: Sede[] = [
  {
    id: 'sede-1',
    nombre: 'Sede 1 (Principal)',
    direccion: 'Av. Principal 830',
    whatsapp: '51987654321',
    aforo_maximo: 180,
    distrito: 'Zona Central',
    imagen_url: '/src/assets/images/sede_miraflores_1793295527601.jpg',
    horario: {
      lunes_viernes: '05:30 AM - 11:00 PM',
      sabado: '06:00 AM - 08:00 PM',
      domingo_feriados: '07:00 AM - 02:00 PM'
    }
  },
  {
    id: 'sede-2',
    nombre: 'Sede 2',
    direccion: 'Av. Comercial 450',
    whatsapp: '51987654322',
    aforo_maximo: 150,
    distrito: 'Zona Norte',
    imagen_url: '/src/assets/images/sede_san_isidro_1793295527778.jpg',
    horario: {
      lunes_viernes: '06:00 AM - 11:00 PM',
      sabado: '06:30 AM - 08:00 PM',
      domingo_feriados: '08:00 AM - 02:00 PM'
    }
  }
];

const DEFAULT_PLANES: Plan[] = [
  {
    id: 'plan-12-pases',
    nombre: '12 Pases Flex',
    tipo: 'ingresos',
    duracion_dias: null,
    numero_ingresos: 12,
    precio_centimos: 16000, // S/ 160.00
    incluye_rutina: false,
    congelable: false,
    activo: true,
    descripcion: 'Ideal si viajas o entrenas de manera intermitente. Válido por 60 días en cualquiera de nuestras sedes.'
  },
  {
    id: 'plan-mensual-libre',
    nombre: 'Mensual libre',
    tipo: 'dias',
    duracion_dias: 30,
    numero_ingresos: null,
    precio_centimos: 19900, // S/ 199.00
    incluye_rutina: true,
    congelable: true,
    activo: true,
    descripcion: 'Acceso total e ilimitado a todas nuestras sedes equipadas, evaluación física inicial y diseño de rutina.'
  },
  {
    id: 'plan-trimestral-titan',
    nombre: 'Trimestral Titán',
    tipo: 'dias',
    duracion_dias: 90,
    numero_ingresos: null,
    precio_centimos: 49900, // S/ 499.00
    incluye_rutina: true,
    congelable: true,
    activo: true,
    descripcion: 'El plan perfecto para consolidar hábitos. Hasta 15 días de congelamiento y rutina personalizada.'
  },
  {
    id: 'plan-anual-pro',
    nombre: 'Anual Black Pro',
    tipo: 'dias',
    duracion_dias: 365,
    numero_ingresos: null,
    precio_centimos: 149000, // S/ 1,490.00
    incluye_rutina: true,
    congelable: true,
    activo: true,
    descripcion: 'Máximo ahorro para atletas constantes. Hasta 45 días de congelamiento y 4 pases de invitado por mes.'
  }
];

export async function fetchGimnasioPublico(): Promise<GimnasioPublico> {
  if (!supabase) return DEFAULT_GIMNASIO;

  try {
    let query = supabase.from('gimnasio_publico').select('*');
    if (GIMNASIO_ID) {
      query = query.eq('id', GIMNASIO_ID);
    }
    const { data, error } = await query.maybeSingle();
    if (error || !data) {
      console.warn('Usando datos de respaldo para gimnasio_publico:', error?.message);
      return DEFAULT_GIMNASIO;
    }
    return data as GimnasioPublico;
  } catch (err) {
    console.warn('Error al conectar con vista gimnasio_publico:', err);
    return DEFAULT_GIMNASIO;
  }
}

export async function fetchSedes(): Promise<Sede[]> {
  if (!supabase) return DEFAULT_SEDES;

  try {
    const { data, error } = await supabase.from('sede').select('*');
    if (error || !data || data.length === 0) {
      console.warn('Usando datos de respaldo para sedes:', error?.message);
      return DEFAULT_SEDES;
    }
    // Añadimos imágenes por defecto si no vienen de la BD
    return data.map((item, index) => ({
      ...item,
      imagen_url: item.imagen_url || (index === 0 ? DEFAULT_SEDES[0].imagen_url : DEFAULT_SEDES[1]?.imagen_url)
    })) as Sede[];
  } catch (err) {
    console.warn('Error al conectar con tabla sede:', err);
    return DEFAULT_SEDES;
  }
}

export async function fetchPlanes(): Promise<Plan[]> {
  if (!supabase) return DEFAULT_PLANES;

  try {
    const { data, error } = await supabase
      .from('plan')
      .select('*')
      .eq('activo', true)
      .order('precio_centimos', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Usando datos de respaldo para planes:', error?.message);
      return DEFAULT_PLANES;
    }
    return data as Plan[];
  } catch (err) {
    console.warn('Error al conectar con tabla plan:', err);
    return DEFAULT_PLANES;
  }
}

export async function fetchConvenioPublico(slug: string): Promise<EmpresaConvenioPublica | null> {
  if (!supabase) {
    if (slug === 'bcp' || slug === 'interbank' || slug === 'bbva') {
      return {
        id: `convenio-${slug}`,
        nombre: slug.toUpperCase(),
        slug,
        beneficio_resumen: '25% de descuento en planes Trimestral y Anual + Matrícula 100% exonerada.',
        descuento_porcentaje: 25
      };
    }
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('empresa_convenio_publica')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.warn('Error al consultar empresa_convenio_publica:', error);
      return null;
    }
    return data as EmpresaConvenioPublica;
  } catch (err) {
    console.warn('Error al buscar convenio:', err);
    return null;
  }
}

export async function crearProspectoPublico(params: {
  gimnasioId: string;
  nombre: string;
  celular: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  if (!supabase) {
    // Simulación de éxito cuando aún no hay credenciales activas de Supabase
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true, message: '¡Visita agendada con éxito!' };
  }

  try {
    const { data, error } = await supabase.rpc('crear_prospecto_publico', {
      p_gimnasio: params.gimnasioId,
      p_nombre: params.nombre,
      p_celular: params.celular
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Hubo un error al registrar tu visita. Por favor intenta de nuevo.'
      };
    }

    return { success: true, message: '¡Tu visita gratuita ha sido agendada con éxito!' };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Error de conexión. Intenta de nuevo o contáctanos por WhatsApp.'
    };
  }
}
