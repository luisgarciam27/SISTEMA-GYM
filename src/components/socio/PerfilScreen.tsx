import React, { useState } from 'react';
import { 
  User, 
  Sun, 
  Moon, 
  LogOut, 
  Lock, 
  ShieldCheck, 
  Download, 
  ExternalLink,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Heart
} from 'lucide-react';
import type { SocioProfile } from '../../types/socio';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PerfilScreenProps {
  socio: SocioProfile;
  gymName?: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onSignOut: () => void;
  onSwitchToLanding: () => void;
}

export const PerfilScreen: React.FC<PerfilScreenProps> = ({
  socio,
  gymName = 'Titán Fitness',
  isDarkMode,
  toggleDarkMode,
  onSignOut,
  onSwitchToLanding,
}) => {
  const { isInstallable, install } = usePWAInstall();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState<string | null>(null);

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordNotice('Se ha enviado un enlace de confirmación a tu correo para cambiar tu clave.');
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordNotice(null);
    }, 3000);
  };

  return (
    <div className="space-y-6 pb-24 max-w-lg mx-auto px-4 pt-4 animate-in fade-in duration-200">
      
      {/* Profile Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 mx-auto flex items-center justify-center text-white shadow-xl shadow-orange-500/25">
          <span className="font-heading text-3xl font-black">
            {socio.nombres.charAt(0)}{socio.apellidos.charAt(0)}
          </span>
        </div>
        <div>
          <h1 className="font-heading text-2xl font-black uppercase text-zinc-950 dark:text-white">
            {socio.nombres} {socio.apellidos}
          </h1>
          <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
            {socio.tipo_documento}: {socio.numero_documento} · ID: {socio.id}
          </p>
        </div>
      </div>

      {/* Member Details */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 block font-mono">
          Datos Registrados
        </span>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800/80">
            <span className="text-zinc-500 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>Correo</span>
            </span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{socio.email}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800/80">
            <span className="text-zinc-500 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>Celular</span>
            </span>
            <span className="font-mono text-zinc-900 dark:text-zinc-100">{socio.celular}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800/80">
            <span className="text-zinc-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Distrito / Ciudad</span>
            </span>
            <span className="text-zinc-900 dark:text-zinc-100">{socio.distrito || 'No especificado'}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800/80">
            <span className="text-zinc-500 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" />
              <span>Contacto Emergencia</span>
            </span>
            <span className="text-zinc-900 dark:text-zinc-100 text-right">
              {socio.contacto_emergencia_nombre} ({socio.contacto_emergencia_celular})
            </span>
          </div>
        </div>
      </div>

      {/* Preferences & App Settings */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm divide-y divide-zinc-100 dark:divide-zinc-800">
        
        {/* Theme Switcher */}
        <button
          onClick={toggleDarkMode}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900 dark:text-white">Tema de la Aplicación</p>
              <p className="text-[11px] text-zinc-500">{isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">
            Cambiar
          </span>
        </button>

        {/* Change password */}
        <button
          onClick={() => setShowPasswordModal(true)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900 dark:text-white">Seguridad de la Cuenta</p>
              <p className="text-[11px] text-zinc-500">Actualizar contraseña</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        </button>

        {/* PWA Install Button if available */}
        {isInstallable && (
          <button
            onClick={install}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-white">Instalar App en tu Celular</p>
                <p className="text-[11px] text-zinc-500">Acceso instantáneo desde tu pantalla de inicio</p>
              </div>
            </div>
            <span className="text-xs font-bold text-orange-500">Instalar</span>
          </button>
        )}

        {/* Switch to public landing */}
        <button
          onClick={onSwitchToLanding}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
              <ExternalLink className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900 dark:text-white">Landing Pública del Gimnasio</p>
              <p className="text-[11px] text-zinc-500">Ver planes y sedes abiertas al público</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        </button>

      </div>

      {/* Logout Button */}
      <button
        onClick={onSignOut}
        className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Cerrar Sesión</span>
      </button>

      {/* Password Reset Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 shadow-2xl">
            <h3 className="font-heading text-xl font-bold uppercase text-zinc-950 dark:text-white">
              Cambiar Contraseña
            </h3>
            {passwordNotice ? (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed font-medium">
                {passwordNotice}
              </p>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Enviaremos un correo a <strong>{socio.email}</strong> con instrucciones seguras para actualizar tu clave.
                </p>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-3 py-2 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-orange-500 hover:bg-orange-600"
                  >
                    Enviar Enlace
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
