import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Sun, ShieldCheck, ArrowLeft, WifiOff, Smartphone, QrCode } from 'lucide-react';
import type { SocioProfile } from '../../types/socio';

interface QRScreenProps {
  socio: SocioProfile;
  gymName?: string;
  onBack: () => void;
}

export const QRScreen: React.FC<QRScreenProps> = ({
  socio,
  gymName = 'Titán Fitness',
  onBack,
}) => {
  const [maxBrightnessActive, setMaxBrightnessActive] = useState(false);

  const qrPayload = JSON.stringify({
    socio_id: socio.id,
    dni: socio.numero_documento,
    gym: socio.gimnasio_id,
    t: Date.now(),
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col justify-between p-4 sm:p-6 ${
      maxBrightnessActive 
        ? 'bg-white text-zinc-950' 
        : 'bg-zinc-50 dark:bg-[#090A0E] text-zinc-900 dark:text-zinc-100'
    }`}>
      
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-md mx-auto w-full">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Inicio</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-orange-600 dark:text-orange-400">
          <QrCode className="w-4 h-4" />
          <span>Acceso Torniquete</span>
        </div>
      </div>

      {/* Main QR Card */}
      <div className="max-w-md mx-auto w-full my-auto space-y-6">
        
        {/* Card Container */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">
              {gymName} Pass
            </span>
            <h2 className="font-heading text-2xl font-black uppercase text-zinc-950 dark:text-white">
              {socio.nombres} {socio.apellidos}
            </h2>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              {socio.tipo_documento}: {socio.numero_documento} · ID: {socio.id}
            </p>
          </div>

          {/* QR Code Container with High-Contrast White Background */}
          <div className="inline-block p-5 bg-white rounded-3xl shadow-inner border border-zinc-200 mx-auto">
            <QRCodeSVG
              value={qrPayload}
              size={220}
              level="H"
              includeMargin={false}
              className="mx-auto"
            />
          </div>

          {/* Membership status badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>Membresía Activa · Acceso Autorizado</span>
          </div>

          {/* Offline notice */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
            <WifiOff className="w-3.5 h-3.5 text-emerald-500" />
            <span>Funciona sin conexión a internet</span>
          </div>

        </div>

        {/* Turnstile / Scanner helper tips */}
        <div className="bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-orange-500 shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold text-zinc-900 dark:text-white">
                Sugerencia de lectura
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Coloca tu pantalla a 10 cm del lector óptico del torniquete.
              </p>
            </div>
          </div>

          <button
            onClick={() => setMaxBrightnessActive(!maxBrightnessActive)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
              maxBrightnessActive
                ? 'bg-amber-400 text-zinc-950 shadow-md'
                : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
            }`}
            title="Activar fondo de alto contraste"
          >
            <Sun className="w-3.5 h-3.5" />
            <span>{maxBrightnessActive ? 'Brillo Alto' : 'Brillo normal'}</span>
          </button>
        </div>

      </div>

      {/* Footer action */}
      <div className="max-w-md mx-auto w-full pt-4">
        <button
          onClick={onBack}
          className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-colors shadow-sm"
        >
          Volver a Mi Cuenta
        </button>
      </div>

    </div>
  );
};
