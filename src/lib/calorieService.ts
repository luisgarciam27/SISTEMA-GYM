/**
 * Servicio de Cálculo y Registro de Calorías / Macros para Titán Fitness
 * Basado en la fórmula científica Mifflin-St Jeor + METs de actividad física
 */

import { SocioProfile } from '../types/socio';

export type TipoComida = 'desayuno' | 'almuerzo' | 'cena' | 'snack';
export type TipoEntrenamiento = 'pesas' | 'cardio' | 'funcional' | 'hiit';

export interface MealLogEntry {
  id: string;
  nombre: string;
  calorias: number;
  proteina_g: number;
  tipo: TipoComida;
  hora: string;
}

export interface WorkoutSessionBurn {
  id: string;
  tipo: TipoEntrenamiento;
  nombre: string;
  minutos: number;
  calorias_quemadas: number;
  hora: string;
}

export interface PlanNutricionalSocio {
  tasa_metabolica_basal: number; // BMR (Mifflin-St Jeor)
  gasto_total_tdee: number;      // TDEE con factor de actividad
  calorias_objetivo: number;     // Ajustado según meta (déficit, superávit o mantenimiento)
  proteina_objetivo_g: number;   // 1.8g - 2.2g por kg
  carbohidratos_objetivo_g: number;
  grasas_objetivo_g: number;
  explicacion_meta: string;
}

export interface ResumenDiarioCalorias {
  fecha: string;
  plan: PlanNutricionalSocio;
  calorias_consumidas: number;
  proteina_consumida_g: number;
  calorias_quemadas_entrenamiento: number;
  comidas: MealLogEntry[];
  entrenamientos: WorkoutSessionBurn[];
  entreno_marcado_hoy: boolean;
}

// Preajustes rápidos peruanos y fitness para registro en 1 toque
export interface ComidaPreset {
  id: string;
  nombre: string;
  tipo: TipoComida;
  calorias: number;
  proteina_g: number;
  icono?: string;
  descripcion: string;
}

export const PRESETS_COMIDAS_TITAN: ComidaPreset[] = [
  {
    id: 'desayuno_fit',
    nombre: 'Desayuno Proteico (Huevos + Avena)',
    tipo: 'desayuno',
    calorias: 420,
    proteina_g: 28,
    descripcion: '3 huevos revueltos, avena cocida con canela y fruta',
  },
  {
    id: 'almuerzo_pollo_fit',
    nombre: 'Almuerzo Fit (Pechuga + Arroz + Ensalada)',
    tipo: 'almuerzo',
    calorias: 580,
    proteina_g: 45,
    descripcion: 'Pechuga a la plancha (180g), porción de arroz y ensalada fresca',
  },
  {
    id: 'almuerzo_peruano',
    nombre: 'Almuerzo Casero (Lomo / Seco / Guiso + Arroz)',
    tipo: 'almuerzo',
    calorias: 740,
    proteina_g: 36,
    descripcion: 'Plato típico peruano con carne de res o pollo y guarnición',
  },
  {
    id: 'batido_proteina',
    nombre: 'Batido Whey Protein + Plátano',
    tipo: 'snack',
    calorias: 280,
    proteina_g: 27,
    descripcion: '1 scoop de proteína aislada con agua/leche y un plátano',
  },
  {
    id: 'cena_ligera',
    nombre: 'Cena Liviana (Atún / Huevos + Palta)',
    tipo: 'cena',
    calorias: 380,
    proteina_g: 32,
    descripcion: 'Lata de atún en agua con palta o tortilla de verduras',
  },
  {
    id: 'snack_frutos_secos',
    nombre: 'Snack Fruta + Puñado de Almendras',
    tipo: 'snack',
    calorias: 210,
    proteina_g: 7,
    descripcion: 'Manzana verde o plátano con almendras/nueces',
  },
  {
    id: 'cheat_comida_libre',
    nombre: 'Comida Libre / Antojo Moderado',
    tipo: 'almuerzo',
    calorias: 920,
    proteina_g: 32,
    descripcion: 'Hamburguesa artesanal, pasta o porción de pizza',
  },
];

export interface GymStation {
  id: string;
  nombre: string;
  icono: string;
  categoria: 'fuerza' | 'cardio' | 'funcional' | 'combate';
  zona: string; // Zona del gym para agrupar en la lista desplegable
  met: number;
  minutos_default: number;
  quema_aprox_min: number;
  descripcion: string;
  ejemplos: string;
  badge: string;
}

export const ESTACIONES_TITAN_GYM: GymStation[] = [
  // ZONA CARDIO
  {
    id: 'stairmaster',
    nombre: 'StairMaster / Escaladora Extrema',
    icono: '🪜',
    categoria: 'cardio',
    zona: 'Zona Cardio & Quema Acelerada',
    met: 9.0,
    minutos_default: 25,
    quema_aprox_min: 12.5,
    descripcion: 'Subida continua de escalones con resistencia electromagnética',
    ejemplos: 'Glúteos de acero y quema acelerada de grasa',
    badge: 'Máxima Quema 🔥',
  },
  {
    id: 'trotadora_sprints',
    nombre: 'Trotadora Pro / Cinta con Inclinación',
    icono: '🏃',
    categoria: 'cardio',
    zona: 'Zona Cardio & Quema Acelerada',
    met: 8.5,
    minutos_default: 30,
    quema_aprox_min: 11.5,
    descripcion: 'Inclinación de 8% a 15% o intervalos HIIT en cinta pro',
    ejemplos: 'Cardio oxidativo y capacidad pulmonar',
    badge: 'Cardio Pro',
  },
  {
    id: 'spinning_assault',
    nombre: 'Bicicleta Spinning & Assault AirBike',
    icono: '🚴',
    categoria: 'cardio',
    zona: 'Zona Cardio & Quema Acelerada',
    met: 8.2,
    minutos_default: 30,
    quema_aprox_min: 11.0,
    descripcion: 'Bicicletas de resistencia por aire y sesiones de alta cadencia',
    ejemplos: 'Piernas y quema explosiva',
    badge: 'Resistencia',
  },
  {
    id: 'remo_concept2',
    nombre: 'Remoergómetro / Remo Concept2',
    icono: '🚣',
    categoria: 'cardio',
    zona: 'Zona Cardio & Quema Acelerada',
    met: 8.0,
    minutos_default: 25,
    quema_aprox_min: 10.5,
    descripcion: 'Remo sincronizado de cuerpo completo con resistencia de aire',
    ejemplos: 'Espalda, core, piernas y resistencia',
    badge: 'Full Body',
  },
  {
    id: 'eliptica_pro',
    nombre: 'Máquina Elíptica de Alto Rendimiento',
    icono: '🔄',
    categoria: 'cardio',
    zona: 'Zona Cardio & Quema Acelerada',
    met: 7.0,
    minutos_default: 35,
    quema_aprox_min: 9.5,
    descripcion: 'Movimiento elíptico de bajo impacto articular',
    ejemplos: 'Quema sostenida sin impacto en rodillas',
    badge: 'Bajo Impacto',
  },

  // ZONA LEVANTAMIENTO OLÍMPICO & PESAS LIBRES
  {
    id: 'sentadilla_rack',
    nombre: 'Sentadillas en Rack Olímpico',
    icono: '🏋️‍♂️',
    categoria: 'fuerza',
    zona: 'Zona Levantamiento Olímpico & Pesas',
    met: 6.8,
    minutos_default: 45,
    quema_aprox_min: 9.0,
    descripcion: 'Sentadilla trasera y frontal con barra olímpica de 20kg',
    ejemplos: 'Cuádriceps, glúteos y fuerza de base',
    badge: 'Fuerza Pura',
  },
  {
    id: 'peso_muerto',
    nombre: 'Peso Muerto (Deadlift) con Barra',
    icono: '🏋️‍♂️',
    categoria: 'fuerza',
    zona: 'Zona Levantamiento Olímpico & Pesas',
    met: 7.0,
    minutos_default: 40,
    quema_aprox_min: 9.5,
    descripcion: 'Levantamiento desde plataforma de caucho olímpica',
    ejemplos: 'Cadena posterior, espalda baja y fuerza total',
    badge: 'Alta Demanda',
  },
  {
    id: 'press_banca',
    nombre: 'Press de Banca Plano / Inclinado',
    icono: '🏋️‍♂️',
    categoria: 'fuerza',
    zona: 'Zona Levantamiento Olímpico & Pesas',
    met: 6.0,
    minutos_default: 40,
    quema_aprox_min: 8.0,
    descripcion: 'Press con barra o mancuernas pesadas en banca profesional',
    ejemplos: 'Pectorales, hombros y tríceps',
    badge: 'Potencia Torso',
  },
  {
    id: 'hip_thrust',
    nombre: 'Hip Thrust con Barra & Almohadilla',
    icono: '🏋️‍♀️',
    categoria: 'fuerza',
    zona: 'Zona Levantamiento Olímpico & Pesas',
    met: 6.5,
    minutos_default: 35,
    quema_aprox_min: 8.8,
    descripcion: 'Empuje de cadera con soporte en banco y barra olímpica',
    ejemplos: 'Desarrollo focalizado de glúteos',
    badge: 'Foco Glúteos',
  },
  {
    id: 'mancuernas_libres',
    nombre: 'Zona de Mancuernas Libres (Dumbbells)',
    icono: '💪',
    categoria: 'fuerza',
    zona: 'Zona Levantamiento Olímpico & Pesas',
    met: 5.8,
    minutos_default: 40,
    quema_aprox_min: 7.8,
    descripcion: 'Elevaciones laterales, bicep curls, press y zancadas',
    ejemplos: 'Hipertrofia y equilibrio muscular',
    badge: 'Aislamiento',
  },

  // ZONA MÁQUINAS GUIADAS & POLEAS
  {
    id: 'prensa_piernas',
    nombre: 'Prensa de Piernas Inclinada 45°',
    icono: '⚙️',
    categoria: 'fuerza',
    zona: 'Zona Máquinas Guiadas & Poleas',
    met: 5.8,
    minutos_default: 35,
    quema_aprox_min: 7.8,
    descripcion: 'Empuje con discos pesados en riel inclinado seguro',
    ejemplos: 'Piernas y glúteos sin sobrecarga en la columna',
    badge: 'Seguridad',
  },
  {
    id: 'jalon_polea',
    nombre: 'Jalón al Pecho & Remo en Polea Alta',
    icono: '⚙️',
    categoria: 'fuerza',
    zona: 'Zona Máquinas Guiadas & Poleas',
    met: 5.5,
    minutos_default: 35,
    quema_aprox_min: 7.2,
    descripcion: 'Agarre amplio o neutro en torre de placas de acero',
    ejemplos: 'Dorsales y espalda en V',
    badge: 'Espalda',
  },
  {
    id: 'poleas_crossover',
    nombre: 'Torre de Poleas Cruzadas (Crossover)',
    icono: '⚙️',
    categoria: 'fuerza',
    zona: 'Zona Máquinas Guiadas & Poleas',
    met: 5.5,
    minutos_default: 35,
    quema_aprox_min: 7.2,
    descripcion: 'Cruces de polea, tríceps en cuerda y elevaciones',
    ejemplos: 'Tensión constante en cada repetición',
    badge: 'Tensión Continua',
  },
  {
    id: 'curl_femoral_extension',
    nombre: 'Sillón de Cuádriceps & Curl Femoral',
    icono: '⚙️',
    categoria: 'fuerza',
    zona: 'Zona Máquinas Guiadas & Poleas',
    met: 5.2,
    minutos_default: 30,
    quema_aprox_min: 7.0,
    descripcion: 'Aislamiento de la articulación de la rodilla con selector de placas',
    ejemplos: 'Definición y tono en piernas',
    badge: 'Tono Muscular',
  },

  // ZONA FUNCIONAL, CROSS & COMBATE
  {
    id: 'cuerdas_batalla',
    nombre: 'Cuerdas de Batalla (Battle Ropes)',
    icono: '⚡',
    categoria: 'funcional',
    zona: 'Zona Funcional & Cross Titán',
    met: 8.5,
    minutos_default: 20,
    quema_aprox_min: 11.5,
    descripcion: 'Ondas alternas, slams de potencia y sacudidas continuas',
    ejemplos: 'Hombros, core y demanda cardiovascular máxima',
    badge: 'Explosivo',
  },
  {
    id: 'trineo_sled',
    nombre: 'Trineo de Empuje (Sled Push)',
    icono: '⚡',
    categoria: 'funcional',
    zona: 'Zona Funcional & Cross Titán',
    met: 9.0,
    minutos_default: 25,
    quema_aprox_min: 12.0,
    descripcion: 'Pista de césped sintético con trineo cargado con discos',
    ejemplos: 'Potencia de piernas y quema metabólica acelerada',
    badge: 'Metabólico 🔥',
  },
  {
    id: 'box_saco',
    nombre: 'Saco Pesado de Boxeo & Rounds de Golpeo',
    icono: '🥊',
    categoria: 'combate',
    zona: 'Zona Funcional & Cross Titán',
    met: 8.5,
    minutos_default: 25,
    quema_aprox_min: 11.5,
    descripcion: 'Combinaciones continuas de golpes, juego de piernas y esquivas',
    ejemplos: 'Descompresión de estrés, brazos y cardio',
    badge: 'Combate',
  },
  {
    id: 'core_abdominales',
    nombre: 'Zona de Core, Planchas & Abdominales',
    icono: '🧘',
    categoria: 'fuerza',
    zona: 'Zona Funcional & Cross Titán',
    met: 4.8,
    minutos_default: 20,
    quema_aprox_min: 6.2,
    descripcion: 'Colchonetas, rueda abdominal, elevación de piernas colgado',
    ejemplos: 'Fuerza abdominal y estabilidad lumbar',
    badge: 'Firmeza Core',
  },
];

/**
 * Calcula la meta diaria de quema calórica en el gimnasio según el objetivo del socio
 */
export function calcularMetaQuemaGym(socio: SocioProfile): {
  calorias_meta_gym: number;
  nivel: string;
  tiempo_estimado_min: number;
  explicacion: string;
} {
  const meta = socio.meta_principal;
  let calorias = 450;
  let tiempo = 45;
  let nivel = 'Zona Quema-Grasa';
  let explicacion = 'Meta diaria óptima de quema calórica en las instalaciones de Titán.';

  if (meta === 'bajar_peso') {
    calorias = 500;
    tiempo = 50;
    nivel = 'Déficit Oxidativo Intenso';
    explicacion = 'Diseñada para oxidar grasa corporal rápidamente combinando fuerza y cardio.';
  } else if (meta === 'tonificar') {
    calorias = 420;
    tiempo = 45;
    nivel = 'Definición & Tono';
    explicacion = 'Quema acelerada con foco en mantener masa magra y tonificar músculos.';
  } else if (meta === 'masa_muscular') {
    calorias = 380;
    tiempo = 40;
    nivel = 'Estímulo de Hipertrofia';
    explicacion = 'Gasto calórico concentrado en levantamientos pesados para no catabolizar.';
  }

  return {
    calorias_meta_gym: calorias,
    nivel,
    tiempo_estimado_min: tiempo,
    explicacion,
  };
}

/**
 * Convierte calorías quemadas a equivalencias reales y tangibles
 */
export function obtenerEquivalenciaQuema(calorias: number) {
  const gramosGrasa = Math.max(0, Math.round(calorias / 7.7));
  let comidaEquivalente = '1 Manzana verde o snack';
  let iconoComida = '🍏';

  if (calorias >= 600) {
    comidaEquivalente = '1 Almuerzo criollo completo';
    iconoComida = '🍛';
  } else if (calorias >= 450) {
    comidaEquivalente = '1 Hamburguesa completa';
    iconoComida = '🍔';
  } else if (calorias >= 300) {
    comidaEquivalente = '2 Rebanadas de pizza o 1 postre';
    iconoComida = '🍕';
  } else if (calorias >= 200) {
    comidaEquivalente = '1 Porción grande de papas fritas';
    iconoComida = '🍟';
  } else if (calorias >= 100) {
    comidaEquivalente = '1 Vaso grande de gaseosa o dulce';
    iconoComida = '🥤';
  }

  const pasosEquivalentes = Math.round(calorias * 22);

  return {
    gramosGrasa,
    comidaEquivalente,
    iconoComida,
    pasosEquivalentes,
  };
}

/**
 * Calcula la edad a partir de la fecha de nacimiento (o 26 por defecto)
 */
function calcularEdad(fechaNacimiento?: string): number {
  if (!fechaNacimiento) return 26;
  try {
    const nacimiento = new Date(fechaNacimiento);
    if (isNaN(nacimiento.getTime())) return 26;
    const diff = Date.now() - nacimiento.getTime();
    const edad = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    return edad > 10 && edad < 100 ? edad : 26;
  } catch {
    return 26;
  }
}

/**
 * Calcula el plan nutricional científico personalizado del socio
 */
export function calcularPlanNutricional(socio: SocioProfile): PlanNutricionalSocio {
  const peso = socio.peso_kg || 72;
  const talla = socio.talla_cm || 172;
  const edad = calcularEdad(socio.fecha_nacimiento);
  const esHombre = socio.sexo !== 'F';

  // Fórmula Mifflin-St Jeor:
  // Hombres: 10 * peso + 6.25 * talla - 5 * edad + 5
  // Mujeres: 10 * peso + 6.25 * talla - 5 * edad - 161
  const bmr = esHombre
    ? Math.round(10 * peso + 6.25 * talla - 5 * edad + 5)
    : Math.round(10 * peso + 6.25 * talla - 5 * edad - 161);

  // Factor de actividad según días de entrenamiento por semana
  let factorActividad = 1.35; // base activa
  const dias = socio.dias_semana || 4;
  if (dias <= 2) factorActividad = 1.25;
  else if (dias <= 4) factorActividad = 1.45;
  else if (dias <= 6) factorActividad = 1.6;
  else factorActividad = 1.75;

  const tdee = Math.round(bmr * factorActividad);

  // Ajuste según el objetivo principal
  let caloriasObjetivo = tdee;
  let proteinaPorKg = 2.0; // estándar fitness en gramos/kg
  let explicacion = 'Mantenimiento de composición corporal actual.';

  switch (socio.meta_principal) {
    case 'bajar_peso':
      // Déficit moderado del 18-20% (sostenible)
      caloriasObjetivo = Math.max(1300, Math.round(tdee * 0.82));
      proteinaPorKg = 2.2; // más alta para preservar músculo en déficit
      explicacion = `Déficit calórico de ~${tdee - caloriasObjetivo} kcal para quemar grasa cuidando tu masa muscular.`;
      break;

    case 'masa_muscular':
      // Superávit limpio del 12-15%
      caloriasObjetivo = Math.round(tdee * 1.14);
      proteinaPorKg = 2.0;
      explicacion = `Superávit controlado de +${caloriasObjetivo - tdee} kcal para maximizar hipertrofia sin acumular grasa excesiva.`;
      break;

    case 'tonificar':
      // Ligero déficit del 10% con alta proteína
      caloriasObjetivo = Math.round(tdee * 0.90);
      proteinaPorKg = 2.1;
      explicacion = 'Recomposición corporal: reducción gradual de grasa corporal con alta ingesta proteica.';
      break;

    case 'resistencia':
      caloriasObjetivo = Math.round(tdee * 1.05);
      proteinaPorKg = 1.8;
      explicacion = 'Soporte energético elevado para resistir sesiones largas y reponer glucógeno.';
      break;

    case 'rehabilitacion':
    case 'mantenerme':
    default:
      caloriasObjetivo = tdee;
      proteinaPorKg = 1.8;
      explicacion = 'Balance calórico de mantenimiento para energía estable y salud general.';
      break;
  }

  // Distribución de macros
  const proteinaObjetivoG = Math.round(peso * proteinaPorKg);
  const caloriasProteina = proteinaObjetivoG * 4;

  // Grasas saludables: ~28% de las calorías totales (9 kcal por gramo)
  const caloriasGrasas = Math.round(caloriasObjetivo * 0.28);
  const grasasObjetivoG = Math.round(caloriasGrasas / 9);

  // Carbohidratos: el resto de calorías (4 kcal por gramo)
  const caloriasCarbs = Math.max(0, caloriasObjetivo - caloriasProteina - caloriasGrasas);
  const carbohidratosObjetivoG = Math.round(caloriasCarbs / 4);

  return {
    tasa_metabolica_basal: bmr,
    gasto_total_tdee: tdee,
    calorias_objetivo: caloriasObjetivo,
    proteina_objetivo_g: proteinaObjetivoG,
    carbohidratos_objetivo_g: carbohidratosObjetivoG,
    grasas_objetivo_g: grasasObjetivoG,
    explicacion_meta: explicacion,
  };
}

/**
 * Calcula calorías quemadas en una sesión de gym según peso, minutos y MET
 */
export function calcularCaloriasEntrenamiento(
  pesoKg: number,
  minutos: number,
  met: number = 5.5
): number {
  // Fórmula MET: Calorías = MET * peso (kg) * (minutos / 60)
  const calorias = met * pesoKg * (minutos / 60);
  return Math.round(calorias);
}

/**
 * Clave de almacenamiento por fecha
 */
function getStorageKey(socioId: string, fecha: string): string {
  return `titan_calories_${socioId}_${fecha}`;
}

export function getFechaHoyISO(): string {
  const hoy = new Date();
  return hoy.toISOString().split('T')[0];
}

/**
 * Carga o inicializa el resumen de calorías del día para un socio
 */
export function cargarResumenDiario(
  socio: SocioProfile,
  fecha: string = getFechaHoyISO()
): ResumenDiarioCalorias {
  const plan = calcularPlanNutricional(socio);
  const key = getStorageKey(socio.id || 'demo_socio', fecha);

  try {
    const dataGuardada = localStorage.getItem(key);
    if (dataGuardada) {
      const parsed = JSON.parse(dataGuardada);
      return {
        ...parsed,
        plan, // siempre actualiza con el plan fresco
      };
    }
  } catch (err) {
    console.warn('Error leyendo calorías guardadas:', err);
  }

  // Inicialización por defecto para hoy
  const inicial: ResumenDiarioCalorias = {
    fecha,
    plan,
    calorias_consumidas: 0,
    proteina_consumida_g: 0,
    calorias_quemadas_entrenamiento: 0,
    comidas: [],
    entrenamientos: [],
    entreno_marcado_hoy: false,
  };

  return inicial;
}

/**
 * Guarda el resumen diario en localStorage
 */
export function guardarResumenDiario(
  socioId: string,
  resumen: ResumenDiarioCalorias
): void {
  try {
    const key = getStorageKey(socioId || 'demo_socio', resumen.fecha);
    localStorage.setItem(key, JSON.stringify(resumen));
  } catch (err) {
    console.error('Error guardando calorías:', err);
  }
}

/**
 * Registra una comida
 */
export function agregarComidaAlResumen(
  socio: SocioProfile,
  resumenActual: ResumenDiarioCalorias,
  nombre: string,
  calorias: number,
  proteinaG: number = 0,
  tipo: TipoComida = 'almuerzo'
): ResumenDiarioCalorias {
  const ahora = new Date();
  const hora = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const nuevaComida: MealLogEntry = {
    id: `meal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    nombre,
    calorias: Math.round(calorias),
    proteina_g: Math.round(proteinaG),
    tipo,
    hora,
  };

  const comidasActualizadas = [nuevaComida, ...resumenActual.comidas];
  const caloriasConsumidas = comidasActualizadas.reduce((acc, c) => acc + c.calorias, 0);
  const proteinaConsumida = comidasActualizadas.reduce((acc, c) => acc + c.proteina_g, 0);

  const nuevoResumen: ResumenDiarioCalorias = {
    ...resumenActual,
    calorias_consumidas: caloriasConsumidas,
    proteina_consumida_g: proteinaConsumida,
    comidas: comidasActualizadas,
  };

  guardarResumenDiario(socio.id, nuevoResumen);
  return nuevoResumen;
}

/**
 * Elimina una comida registrada
 */
export function eliminarComidaDelResumen(
  socio: SocioProfile,
  resumenActual: ResumenDiarioCalorias,
  comidaId: string
): ResumenDiarioCalorias {
  const comidasActualizadas = resumenActual.comidas.filter((c) => c.id !== comidaId);
  const caloriasConsumidas = comidasActualizadas.reduce((acc, c) => acc + c.calorias, 0);
  const proteinaConsumida = comidasActualizadas.reduce((acc, c) => acc + c.proteina_g, 0);

  const nuevoResumen: ResumenDiarioCalorias = {
    ...resumenActual,
    calorias_consumidas: caloriasConsumidas,
    proteina_consumida_g: proteinaConsumida,
    comidas: comidasActualizadas,
  };

  guardarResumenDiario(socio.id, nuevoResumen);
  return nuevoResumen;
}

// Alias para compatibilidad con llamadas existentes
export const PRESETS_ENTRENAMIENTO = [
  { tipo: 'pesas' as TipoEntrenamiento, nombre: 'Pesas & Fuerza', met: 6.5, minutos_default: 45 },
  { tipo: 'cardio' as TipoEntrenamiento, nombre: 'Cardio & StairMaster', met: 8.8, minutos_default: 30 },
  { tipo: 'hiit' as TipoEntrenamiento, nombre: 'HIIT & Saco', met: 8.5, minutos_default: 25 },
  { tipo: 'funcional' as TipoEntrenamiento, nombre: 'Funcional Titán', met: 8.0, minutos_default: 40 },
];

/**
 * Registra o alterna la sesión de entrenamiento del día en Titán
 */
export function registrarEntrenamientoHoy(
  socio: SocioProfile,
  resumenActual: ResumenDiarioCalorias,
  tipo: TipoEntrenamiento = 'pesas',
  minutos?: number
): ResumenDiarioCalorias {
  const preset = PRESETS_ENTRENAMIENTO.find((p) => p.tipo === tipo) || PRESETS_ENTRENAMIENTO[0];
  const duracion = minutos || socio.minutos_sesion || preset.minutos_default;
  const caloriasQuemadas = calcularCaloriasEntrenamiento(socio.peso_kg || 72, duracion, preset.met);

  const ahora = new Date();
  const hora = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const sesion: WorkoutSessionBurn = {
    id: `workout_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    tipo,
    nombre: `Sesión ${preset.nombre}`,
    minutos: duracion,
    calorias_quemadas: caloriasQuemadas,
    hora,
  };

  const entrenamientos = [sesion, ...resumenActual.entrenamientos];
  const totalQuemado = entrenamientos.reduce((acc, w) => acc + w.calorias_quemadas, 0);

  const nuevoResumen: ResumenDiarioCalorias = {
    ...resumenActual,
    entreno_marcado_hoy: true,
    calorias_quemadas_entrenamiento: totalQuemado,
    entrenamientos,
  };

  guardarResumenDiario(socio.id, nuevoResumen);
  return nuevoResumen;
}

/**
 * Registra una sesión en una estación específica del gimnasio
 */
export function registrarSesionEstacionGym(
  socio: SocioProfile,
  resumenActual: ResumenDiarioCalorias,
  estacion: GymStation,
  minutos: number,
  caloriasPersonalizadas?: number
): ResumenDiarioCalorias {
  const duracion = minutos > 0 ? minutos : estacion.minutos_default;
  const caloriasQuemadas = caloriasPersonalizadas !== undefined
    ? Math.round(caloriasPersonalizadas)
    : calcularCaloriasEntrenamiento(socio.peso_kg || 72, duracion, estacion.met);

  const ahora = new Date();
  const hora = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const sesion: WorkoutSessionBurn = {
    id: `workout_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    tipo: (estacion.categoria === 'combate' ? 'hiit' : estacion.categoria) as TipoEntrenamiento,
    nombre: `${estacion.icono} ${estacion.nombre}`,
    minutos: duracion,
    calorias_quemadas: caloriasQuemadas,
    hora,
  };

  const entrenamientos = [sesion, ...resumenActual.entrenamientos];
  const totalQuemado = entrenamientos.reduce((acc, w) => acc + w.calorias_quemadas, 0);

  const nuevoResumen: ResumenDiarioCalorias = {
    ...resumenActual,
    entreno_marcado_hoy: true,
    calorias_quemadas_entrenamiento: totalQuemado,
    entrenamientos,
  };

  guardarResumenDiario(socio.id, nuevoResumen);
  return nuevoResumen;
}

/**
 * Elimina una sesión de entrenamiento registrada
 */
export function eliminarSesionEntrenamiento(
  socio: SocioProfile,
  resumenActual: ResumenDiarioCalorias,
  sesionId: string
): ResumenDiarioCalorias {
  const entrenamientos = resumenActual.entrenamientos.filter((w) => w.id !== sesionId);
  const totalQuemado = entrenamientos.reduce((acc, w) => acc + w.calorias_quemadas, 0);

  const nuevoResumen: ResumenDiarioCalorias = {
    ...resumenActual,
    entreno_marcado_hoy: entrenamientos.length > 0,
    calorias_quemadas_entrenamiento: totalQuemado,
    entrenamientos,
  };

  guardarResumenDiario(socio.id, nuevoResumen);
  return nuevoResumen;
}
