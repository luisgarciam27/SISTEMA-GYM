import React from 'react';
import { MapPin, Clock, Users, Navigation, MessageCircle, ExternalLink } from 'lucide-react';
import type { Sede } from '../types/database';
import mirafloresImage from '../assets/images/sede_miraflores_1793295527601.jpg';
import sanIsidroImage from '../assets/images/sede_san_isidro_1793295527778.jpg';

interface SedesSectionProps {
  sedes: Sede[];
  loading?: boolean;
}

export const SedesSection: React.FC<SedesSectionProps> = ({
  sedes,
  loading = false,
}) => {
  const getMapsUrl = (direccion: string, nombre: string) => {
    const query = encodeURIComponent(`${nombre}, ${direccion}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const getWhatsAppUrl = (whatsapp: string, nombreSede: string) => {
    const cleanPhone = whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(
      `¡Hola Titán Fitness! Quisiera información sobre la membresía y agendar una visita a la ${nombreSede}.`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  const getSedeImage = (sede: Sede, index: number) => {
    if (sede.imagen_url && sede.imagen_url.startsWith('/src')) {
      return sede.imagen_url;
    }
    return index === 0 ? mirafloresImage : sanIsidroImage;
  };

  return (
    <section id="sedes" className="py-20 bg-zinc-50 dark:bg-zinc-900/40 relative border-t border-zinc-200/80 dark:border-zinc-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-orange-600 dark:text-orange-400">
            <MapPin className="w-3.5 h-3.5 text-orange-500" />
            <span>Ubicaciones Estratégicas</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
            Nuestras Sedes
          </h2>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Espacios amplios, climatizados, con estacionamiento, duchas premium y zonas de levantamiento libre diseñados para tu máximo rendimiento.
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-zinc-200/60 dark:bg-zinc-900 border border-zinc-300/60 dark:border-zinc-800 animate-pulse" />
            ))}
          </div>
        )}

        {/* Cards Grid */}
        {!loading && (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sedes.map((sede, index) => {
              const imageSrc = getSedeImage(sede, index);
              const mapsUrl = getMapsUrl(sede.direccion, sede.nombre);
              const waUrl = getWhatsAppUrl(sede.whatsapp, sede.nombre);

              return (
                <div
                  key={sede.id}
                  className="rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-md flex flex-col group"
                >
                  {/* Photo Container */}
                  <div className="relative h-64 sm:h-72 overflow-hidden bg-zinc-950">
                    <img
                      src={imageSrc}
                      alt={`${sede.nombre} en ${sede.direccion}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

                    {/* Badge top-left */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-lg bg-zinc-950/80 backdrop-blur-md border border-zinc-700/80 text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
                        {sede.distrito || (index === 0 ? 'Miraflores' : 'San Isidro')}
                      </span>
                    </div>

                    {/* Capacity Indicator bottom-right */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-950/80 backdrop-blur-md border border-zinc-700/60 text-xs font-mono text-zinc-300">
                      <Users className="w-3.5 h-3.5 text-orange-400" />
                      <span>Aforo: {sede.aforo_maximo} atletas</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase text-zinc-950 dark:text-white tracking-wide">
                          {sede.nombre}
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-300 flex items-start gap-2 mt-2">
                          <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                          <span>{sede.direccion}</span>
                        </p>
                      </div>

                      {/* Horarios Breakdown */}
                      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 space-y-2.5">
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pb-1 border-b border-zinc-200 dark:border-zinc-800/60">
                          <Clock className="w-3.5 h-3.5 text-orange-500" />
                          <span>Horario de Atención</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-zinc-500 dark:text-zinc-400 block font-medium">Lun - Vie</span>
                            <span className="text-zinc-950 dark:text-white font-mono font-semibold">
                              {sede.horario?.lunes_viernes || '05:30 AM - 11:00 PM'}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-500 dark:text-zinc-400 block font-medium">Sábados</span>
                            <span className="text-zinc-950 dark:text-white font-mono font-semibold">
                              {sede.horario?.sabado || '06:00 AM - 08:00 PM'}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-500 dark:text-zinc-400 block font-medium">Dom / Fer</span>
                            <span className="text-zinc-950 dark:text-white font-mono font-semibold">
                              {sede.horario?.domingo_feriados || '07:00 AM - 02:00 PM'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dual Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 transition-colors"
                      >
                        <Navigation className="w-4 h-4 text-orange-500" />
                        <span>Cómo llegar</span>
                        <ExternalLink className="w-3 h-3 text-zinc-400" />
                      </a>

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-700/20 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp Sede</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
