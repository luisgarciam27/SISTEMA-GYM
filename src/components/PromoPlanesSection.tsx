import React from 'react';
import { Sparkles, Check, ArrowRight, Zap, Flame, ShieldCheck } from 'lucide-react';
import type { Sede } from '../types/database';

interface PromoPlanesSectionProps {
  sedes?: Sede[];
  onSelectPromo: (promoName: string) => void;
}

export const PromoPlanesSection: React.FC<PromoPlanesSectionProps> = ({
  sedes = [],
  onSelectPromo,
}) => {
  const sedesNames = sedes.length > 0 
    ? sedes.map(s => s.nombre).join(' & ') 
    : 'Todas nuestras sedes';

  return (
    <section id="promos" className="py-16 bg-white dark:bg-[#090A0E] relative border-t border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Punchy Promo Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-mono font-bold uppercase tracking-widest border border-orange-500/20">
            <Flame className="w-3.5 h-3.5" />
            <span>Promociones por Tiempo Limitado</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-zinc-950 dark:text-white tracking-tight">
            Empieza Hoy al Mejor Precio
          </h2>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Sin listas largas de tarifas ni letras chicas. Elige una de nuestras dos promociones activas y asegura tu cupo.
          </p>
        </div>

        {/* The 2 Marquee Promo Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Promo 1: Pase Prueba 1 Mes */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
            <div className="space-y-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Gancho de Entrada · 30 Días
              </span>

              <div>
                <h3 className="font-heading text-2xl font-black uppercase text-zinc-950 dark:text-white">
                  Pase Prueba 1 Mes
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Ideal para conocer las instalaciones y empezar tu cambio.
                </p>
              </div>

              {/* Price Hook */}
              <div className="py-2 border-y border-zinc-200/80 dark:border-zinc-800">
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-4xl sm:text-5xl font-black text-zinc-950 dark:text-white tabular-nums">
                    S/ 99
                  </span>
                  <span className="text-xs font-mono text-zinc-400 line-through">
                    S/ 180
                  </span>
                </div>
                <span className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold">
                  ⚡ Solo para nuevos socios
                </span>
              </div>

              {/* Checklist */}
              <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 pt-1">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>Acceso ilimitado a {sedesNames}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>Evaluación física y de postura inicial</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>Sin matrícula ni contratos de permanencia</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>Ingreso inmediato con código QR</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-4">
              <button
                onClick={() => onSelectPromo('Pase Prueba 1 Mes (S/ 99)')}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-750 border border-zinc-300 dark:border-zinc-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Reclamar Promo 1 Mes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Promo 2: Pack Trimestral Élite */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-white via-white to-orange-50/30 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 border-2 border-orange-500 flex flex-col justify-between shadow-xl shadow-orange-500/10 lg:-translate-y-2 transition-all">
            
            {/* Top Ribbon */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>Más Solicitado · Matrícula 100% Gratis</span>
            </div>

            <div className="space-y-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Plan Resultados · 90 Días
              </span>

              <div>
                <h3 className="font-heading text-2xl font-black uppercase text-zinc-950 dark:text-white">
                  Pack Trimestral Élite
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  El tiempo necesario para consolidar tu masa muscular y disciplina.
                </p>
              </div>

              {/* Price Hook */}
              <div className="py-2 border-y border-zinc-200/80 dark:border-zinc-800">
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-4xl sm:text-5xl font-black text-zinc-950 dark:text-white tabular-nums">
                    S/ 249
                  </span>
                  <span className="text-xs font-mono text-zinc-400 line-through">
                    S/ 450
                  </span>
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  ✓ Ahorras S/ 201 + Rutina personalizada gratis
                </span>
              </div>

              {/* Checklist */}
              <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 pt-1">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="font-semibold text-zinc-900 dark:text-white">Acceso total a {sedesNames}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="font-semibold text-zinc-900 dark:text-white">Diseño y ajuste mensual de rutina</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>Membresía congelable (hasta 15 días)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>2 pases de cortesía para entrenar con amigos</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-4">
              <button
                onClick={() => onSelectPromo('Pack Trimestral Élite (S/ 249)')}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Asegurar Cupo Trimestral</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
