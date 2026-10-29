import React from 'react';
import { Camera, Sparkles, Zap, Shield, Trophy } from 'lucide-react';
import actionImage from '../assets/images/gym_training_action_1793306284721.jpg';
import coachImage from '../assets/images/trainer_coaching_client_1793306286089.jpg';
import turfImage from '../assets/images/functional_turf_zone_1793306285638.jpg';

interface VisualShowcaseProps {
  gymName?: string;
}

export const VisualShowcaseSection: React.FC<VisualShowcaseProps> = ({
  gymName = 'Titán Fitness',
}) => {
  return (
    <section className="py-16 bg-zinc-100/60 dark:bg-zinc-950/40 border-t border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Minimalist Visual Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
              <Camera className="w-3.5 h-3.5" />
              <span>Instalaciones Reales</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-black uppercase text-zinc-950 dark:text-white mt-1">
              Espacio y Potencia en Cada Metro
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 font-mono">
            Zonas libres · Pistas funcionales · Plataformas olímpicas
          </p>
        </div>

        {/* 3-Card High-Impact Image Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Action Banner (Large 7-col) */}
          <div className="lg:col-span-7 relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl group min-h-[380px] sm:min-h-[440px]">
            <img
              src={actionImage}
              alt="Atletas entrenando con alta intensidad"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6">
              <span className="px-3 py-1 rounded-lg bg-orange-500 text-white font-mono font-bold text-[11px] uppercase tracking-wider">
                Área de Fuerza & Turf
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase text-white mt-2 leading-tight">
                Entrena sin esperar turno
              </h3>
              <p className="text-xs text-zinc-300 mt-1 max-w-md">
                Múltiples racks olímpicos, barras calibradas y piso de absorción de alto impacto.
              </p>
            </div>
          </div>

          {/* Right Column (5-col with 2 Stacked Images) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            
            {/* Top Image: Coach */}
            <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg group h-52 sm:h-56">
              <img
                src={coachImage}
                alt="Entrenadores certificados en piso"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-mono uppercase font-bold text-orange-400">
                  Asesoría en Piso
                </span>
                <p className="font-heading text-lg font-bold uppercase text-white leading-tight">
                  Entrenadores en todo momento
                </p>
              </div>
            </div>

            {/* Bottom Image: Turf Functional */}
            <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg group h-52 sm:h-56">
              <img
                src={turfImage}
                alt="Zona funcional con césped sintético"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-mono uppercase font-bold text-orange-400">
                  Pistas Funcionales
                </span>
                <p className="font-heading text-lg font-bold uppercase text-white leading-tight">
                  Empuje de trineos & cardio de potencia
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
