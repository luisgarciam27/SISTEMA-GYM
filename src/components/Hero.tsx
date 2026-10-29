import React from 'react';
import { ArrowRight, Flame, ShieldCheck, Clock, Users, Building2 } from 'lucide-react';
import type { Sede } from '../types/database';
import heroGymImage from '../assets/images/titan_hero_gym_1793295527206.jpg';

interface HeroProps {
  gymName?: string;
  ciudad?: string;
  sedes?: Sede[];
  onExplorePlans: () => void;
  onRequestFreeTrial: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  gymName = 'Titán Fitness',
  ciudad,
  sedes = [],
  onExplorePlans,
  onRequestFreeTrial,
}) => {
  // Format dynamic sedes names summary (e.g. "Sede 1 & Sede 2")
  const sedesSummary = sedes.length > 0 
    ? sedes.map(s => s.nombre).join(' · ') 
    : 'Sede 1 · Sede 2';

  const sedesCount = sedes.length || 2;

  return (
    <section id="inicio" className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
      {/* Background ambient lighting */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-orange-500/10 dark:bg-orange-600/15 blur-[140px] pointer-events-none rounded-full" 
      />
      <div 
        aria-hidden="true" 
        className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-red-500/10 dark:bg-red-600/10 blur-[120px] pointer-events-none rounded-full" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
            
            {/* Subtle editorial kicker (Clean typography, no static pill badge) */}
            <div className="flex items-center gap-3 text-xs tracking-wider uppercase font-mono text-orange-600 dark:text-orange-400">
              <span className="font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500" />
                Alto Rendimiento
              </span>
              <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">·</span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {ciudad ? `${ciudad} · ${sedesSummary}` : sedesSummary}
              </span>
            </div>

            {/* Main Headline (Flexible for presentation to any client in the country) */}
            <div className="space-y-4">
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-zinc-950 dark:text-white leading-[1.02]">
                Entrena con los mejores{ciudad ? <span> en <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-red-600">{ciudad}</span></span> : <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-red-600">.</span>}
              </h1>
              <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl font-normal leading-relaxed">
                Potencia tu disciplina en {gymName}. Equipamiento olímpico, zonas de levantamiento y fuerza certificadas, y entrenadores dedicados a superar tus límites.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onRequestFreeTrial}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-xl shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all uppercase tracking-wider cursor-pointer"
              >
                <span>Prueba gratis</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onExplorePlans}
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white bg-white dark:bg-zinc-900/90 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Ver planes
              </button>
            </div>

            {/* Trust Markers */}
            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Sin contratos de permanencia</span>
              </div>
              <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">·</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-900 dark:text-zinc-200">Acceso QR</span>
                <span>Inmediato</span>
              </div>
              <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">·</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-900 dark:text-zinc-200">Yape / Plin / Efectivo</span>
                <span>Aceptados</span>
              </div>
            </div>

          </div>

          {/* Right Column: High-Impact Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800/80 shadow-2xl bg-zinc-100 dark:bg-zinc-900 group">
              <img
                src={heroGymImage}
                alt={`Instalaciones de alto rendimiento ${gymName}`}
                referrerPolicy="no-referrer"
                className="w-full h-[420px] sm:h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent opacity-75" />
              
              {/* Overlay card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl backdrop-blur-md bg-white/90 dark:bg-zinc-900/85 border border-zinc-200/90 dark:border-zinc-700/60 flex items-center justify-between shadow-lg">
                <div className="truncate mr-3">
                  <p className="text-xs font-mono uppercase text-orange-600 dark:text-orange-400 font-bold tracking-wider truncate">
                    {sedesSummary}
                  </p>
                  <p className="text-sm font-bold text-zinc-950 dark:text-white mt-0.5 truncate">
                    Equipamiento Eleiko & Technogym
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block px-2.5 py-1 text-xs font-mono font-bold bg-orange-500/10 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-500/30 rounded">
                    Desde 5:30 AM
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4-KPI Row Strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white/90 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-sm backdrop-blur-sm transition-colors">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="font-heading text-2xl lg:text-3xl font-black text-zinc-950 dark:text-white tabular-nums">
                {sedesCount} {sedesCount === 1 ? 'Sede' : 'Sedes'}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono truncate max-w-[170px]" title={sedesSummary}>
                {sedesSummary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="font-heading text-2xl lg:text-3xl font-black text-zinc-950 dark:text-white tabular-nums">
                +2,400
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">
                Socios activos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="font-heading text-2xl lg:text-3xl font-black text-zinc-950 dark:text-white tabular-nums">
                17 Horas
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">
                Operación continua
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="font-heading text-2xl lg:text-3xl font-black text-zinc-950 dark:text-white tabular-nums">
                100%
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">
                Enfoque en resultados
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
