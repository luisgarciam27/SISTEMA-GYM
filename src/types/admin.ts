export interface Prospecto {
  id: string;
  nombre: string;
  celular: string;
  plan_interes: string;
  sede_preferida: string;
  estado: 'nuevo' | 'contactado' | 'visita_agendada' | 'matriculado';
  created_at: string;
  mensaje?: string;
}

export interface AdminStats {
  socios_activos: number;
  nuevos_prospectos: number;
  ingresos_mes_soles: number;
  aforo_actual_total: number;
  aforo_maximo_total: number;
}
