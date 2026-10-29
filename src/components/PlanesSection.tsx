import React from 'react';
import { Check, Zap, Sparkles, ArrowRight } from 'lucide-react';
import type { Plan, Sede } from '../types/database';

interface PlanesSectionProps {
  planes: Plan[];
  sedes?: Sede[];
  loading?: boolean;
  onSelectPlan: (plan: Plan) => void;
  selectedPlanId?: string | null;
}

export const PlanesSection: React.FC<PlanesSectionProps> = ({
  planes,
  sedes = [],
  loading = false,
  onSelectPlan,
  selectedPlanId,
}) => {
  const formatPrecio = (centimos: number) => {
    return `S/ ${(centimos / 100).toFixed(2)}`;
  };

  const formatDuracion = (plan: Plan) => {
    if (plan.numero_ingresos && plan.numero_ingresos > 0) {
      return `${plan.numero_ingresos} ingresos`;
    }
    if (plan.duracion_dias) {
      if (plan.duracion_dias === 30) return '30 días';
      if (plan.duracion_dias === 90) return '3 meses (90 días)';
      if (plan.duracion_dias === 365) return '1 año (365 días)';
      return `${plan.duracion_dias} días`;
    }
    return 'Pase libre';
  };

  const isMostPopular = (plan: Plan) => {
    return plan.nombre.toLowerCase().includes('mensual') || plan.nombre.toLowerCase().includes('libre');
  };

  const sedesNames = sedes.length > 0 
    ? sedes.map(s => s.nombre).join(' y ')
    : 'todas nuestras sedes';

  return (
    <section id="planes" className="py-20 bg-zinc-100/70 dark:bg-zinc-950/70 transition-colors duration-200 relative border-t border-zinc-200/80 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-orange-600 dark:text-orange-400">
            <Zap className="w-3.5 h-3.5 text-orange-500" />
            <span>Tarifas Claras · Sin Amarras</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
            Elige tu plan de entrenamiento
          </h2>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Acceso libre a {sedesNames}, equipamiento de primer nivel y entrenadores certificados en piso.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-zinc-200/60 dark:bg-zinc-900 border border-zinc-300/60 dark:border-zinc-800 animate-pulse p-6" />
            ))}
          </div>
        )}

        {/* Planes Grid */}
        {!loading && (
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {planes.map((plan) => {
              const popular = isMostPopular(plan);
              const isSelected = selectedPlanId === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col justify-between rounded-2xl p-6 sm:p-7 transition-all duration-200 ${
                    popular
                      ? 'bg-white dark:bg-gradient-to-b dark:from-zinc-900 dark:via-zinc-900/90 dark:to-zinc-950 border-2 border-orange-500 shadow-xl shadow-orange-500/10 dark:shadow-orange-500/10 lg:-translate-y-2'
                      : 'bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm'
                  }`}
                >
                  {/* Highlight Ribbon for Most Popular */}
                  {popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <Sparkles className="w-3 h-3 text-amber-200" />
                      Más Elegido
                    </div>
                  )}

                  {/* Header info */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold font-heading uppercase text-zinc-950 dark:text-white tracking-wide">
                          {plan.nombre}
                        </h3>
                        <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1">
                          {formatDuracion(plan)}
                        </p>
                      </div>
                    </div>

                    {/* Price Block */}
                    <div className="pt-2 pb-1 border-b border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white font-heading tabular-nums">
                          {formatPrecio(plan.precio_centimos)}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        Pago único en soles · Incluye IGV
                      </span>
                    </div>

                    {/* Description */}
                    {plan.descripcion && (
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed min-h-[36px]">
                        {plan.descripcion}
                      </p>
                    )}

                    {/* Features checklist */}
                    <div className="space-y-2.5 pt-2">
                      <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                        <div className="w-4 h-4 rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>Acceso total a {sedesNames}</span>
                      </div>

                      <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          plan.incluye_rutina 
                            ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400' 
                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'
                        }`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className={plan.incluye_rutina ? 'text-zinc-900 dark:text-white font-semibold' : 'text-zinc-500 dark:text-zinc-400'}>
                          {plan.incluye_rutina ? 'Incluye diseño de rutina' : 'Rutina opcional'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          plan.congelable 
                            ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400' 
                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'
                        }`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className={plan.congelable ? 'text-zinc-900 dark:text-white font-semibold' : 'text-zinc-500 dark:text-zinc-400'}>
                          {plan.congelable ? 'Membresía congelable' : 'No congelable'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                        <div className="w-4 h-4 rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>Ingreso express con código QR</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA button */}
                  <div className="pt-6 mt-4">
                    <button
                      onClick={() => onSelectPlan(plan)}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        popular
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg shadow-orange-500/25'
                          : isSelected
                          ? 'bg-orange-500 text-white'
                          : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-100 border border-zinc-300/80 dark:border-zinc-700'
                      }`}
                    >
                      <span>{isSelected ? 'Plan seleccionado' : 'Quiero este plan'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Corporate & Convenios Note */}
        <div className="mt-12 p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-950 dark:text-white">¿Tu empresa tiene convenio con Titán Fitness?</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Accede a hasta 25% de descuento corporativo presentando tu fotocheck o correo corporativo.</p>
            </div>
          </div>
          <a
            href="#sedes"
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-500 uppercase tracking-wider shrink-0 underline underline-offset-4"
          >
            Consultar convenios
          </a>
        </div>

      </div>
    </section>
  );
};
