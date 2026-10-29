import React, { useState } from 'react';
import { X, Building2, MapPin, Sparkles, RotateCcw } from 'lucide-react';
import type { GimnasioPublico, Sede } from '../types/database';

interface ClientDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  gimnasio: GimnasioPublico | null;
  sedes: Sede[];
  onUpdateClient: (newGym: GimnasioPublico, newSedes: Sede[]) => void;
}

interface Preset {
  label: string;
  gymName: string;
  ciudad: string;
  sede1: string;
  sede2: string;
  dir1: string;
  dir2: string;
}

const PRESETS: Preset[] = [
  {
    label: 'Genérico Nacional (Sede 1 & Sede 2)',
    gymName: 'Titán Fitness',
    ciudad: '',
    sede1: 'Sede 1 (Principal)',
    sede2: 'Sede 2 (Norte)',
    dir1: 'Av. Principal 830',
    dir2: 'Av. Comercial 450'
  },
  {
    label: 'Lima (Miraflores & San Isidro)',
    gymName: 'Titán Fitness',
    ciudad: 'Lima',
    sede1: 'Sede Miraflores',
    sede2: 'Sede San Isidro',
    dir1: 'Av. José Pardo 830, Miraflores',
    dir2: 'Av. Conquistadores 450, San Isidro'
  },
  {
    label: 'Arequipa (Cayma & Yanahuara)',
    gymName: 'Volcán Fitness',
    ciudad: 'Arequipa',
    sede1: 'Sede Cayma',
    sede2: 'Sede Yanahuara',
    dir1: 'Av. Ejército 720, Cayma',
    dir2: 'Av. Bolognesi 310, Yanahuara'
  },
  {
    label: 'Trujillo (El Golf & Centro)',
    gymName: 'Imperio Gym',
    ciudad: 'Trujillo',
    sede1: 'Sede El Golf',
    sede2: 'Sede Centro Histórico',
    dir1: 'Av. El Golf 540',
    dir2: 'Jr. Pizarro 615'
  }
];

export const ClientDemoModal: React.FC<ClientDemoModalProps> = ({
  isOpen,
  onClose,
  gimnasio,
  sedes,
  onUpdateClient,
}) => {
  const [gymName, setGymName] = useState(gimnasio?.nombre || 'Titán Fitness');
  const [ciudad, setCiudad] = useState(gimnasio?.ciudad || '');
  const [sede1Name, setSede1Name] = useState(sedes[0]?.nombre || 'Sede 1');
  const [sede1Dir, setSede1Dir] = useState(sedes[0]?.direccion || 'Av. Principal 830');
  const [sede2Name, setSede2Name] = useState(sedes[1]?.nombre || 'Sede 2');
  const [sede2Dir, setSede2Dir] = useState(sedes[1]?.direccion || 'Av. Comercial 450');

  if (!isOpen) return null;

  const handleApplyPreset = (preset: Preset) => {
    setGymName(preset.gymName);
    setCiudad(preset.ciudad);
    setSede1Name(preset.sede1);
    setSede1Dir(preset.dir1);
    setSede2Name(preset.sede2);
    setSede2Dir(preset.dir2);

    applyChanges(preset.gymName, preset.ciudad, preset.sede1, preset.dir1, preset.sede2, preset.dir2);
  };

  const applyChanges = (
    name = gymName,
    city = ciudad,
    s1Name = sede1Name,
    s1Dir = sede1Dir,
    s2Name = sede2Name,
    s2Dir = sede2Dir
  ) => {
    const updatedGym: GimnasioPublico = {
      ...(gimnasio || {
        id: 'titan-demo',
        eslogan: 'Fuerza, disciplina y alto rendimiento',
        whatsapp_principal: '51987654321',
      }),
      nombre: name,
      ciudad: city,
    };

    const updatedSedes: Sede[] = [
      {
        ...(sedes[0] || {
          id: 'sede-1',
          whatsapp: '51987654321',
          aforo_maximo: 180,
          distrito: 'Zona Central',
          horario: {
            lunes_viernes: '05:30 AM - 11:00 PM',
            sabado: '06:00 AM - 08:00 PM',
            domingo_feriados: '07:00 AM - 02:00 PM'
          }
        }),
        nombre: s1Name,
        direccion: s1Dir,
        distrito: s1Name,
      },
      {
        ...(sedes[1] || {
          id: 'sede-2',
          whatsapp: '51987654322',
          aforo_maximo: 150,
          distrito: 'Zona 2',
          horario: {
            lunes_viernes: '06:00 AM - 11:00 PM',
            sabado: '06:30 AM - 08:00 PM',
            domingo_feriados: '08:00 AM - 02:00 PM'
          }
        }),
        nombre: s2Name,
        direccion: s2Dir,
        distrito: s2Name,
      }
    ];

    onUpdateClient(updatedGym, updatedSedes);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyChanges();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-7 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center text-orange-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold uppercase text-zinc-950 dark:text-white">
                Personalizar Demostración
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Presenta esta landing a gimnasios de cualquier ciudad del país
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">
            Plantillas Rápidas
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="text-left p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-orange-500/50 bg-zinc-50 dark:bg-zinc-950 hover:bg-orange-500/5 transition-all text-xs group"
              >
                <p className="font-bold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors">
                  {p.label}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                  {p.gymName} {p.ciudad ? `· ${p.ciudad}` : ''}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Nombre del Gimnasio
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                placeholder="Ej. Titán Fitness, Iron Gym, etc."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-hidden focus:border-orange-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Ciudad / Región (Opcional, dejar vacío para no especificar)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                placeholder="Ej. Lima, Arequipa, Trujillo o dejar vacío"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-hidden focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Nombre Sede 1
              </label>
              <input
                type="text"
                value={sede1Name}
                onChange={(e) => setSede1Name(e.target.value)}
                placeholder="Ej. Sede 1, Sede Principal"
                className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-hidden focus:border-orange-500"
                required
              />
              <input
                type="text"
                value={sede1Dir}
                onChange={(e) => setSede1Dir(e.target.value)}
                placeholder="Dirección Sede 1"
                className="w-full px-3 py-1.5 rounded-lg text-[11px] bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 mt-1"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Nombre Sede 2
              </label>
              <input
                type="text"
                value={sede2Name}
                onChange={(e) => setSede2Name(e.target.value)}
                placeholder="Ej. Sede 2, Sede Norte"
                className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-hidden focus:border-orange-500"
                required
              />
              <input
                type="text"
                value={sede2Dir}
                onChange={(e) => setSede2Dir(e.target.value)}
                placeholder="Dirección Sede 2"
                className="w-full px-3 py-1.5 rounded-lg text-[11px] bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 mt-1"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => handleApplyPreset(PRESETS[0])}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Genérico</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-md shadow-orange-500/25"
            >
              Aplicar Cambios
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
