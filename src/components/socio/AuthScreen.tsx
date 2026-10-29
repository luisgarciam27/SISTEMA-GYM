import React, { useState } from 'react';
import { 
  Smartphone, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowLeft, 
  RefreshCw,
  ShieldCheck,
  Dumbbell
} from 'lucide-react';
import { 
  requestPhoneOTP, 
  verifyPhoneOTP, 
  DEMO_SOCIO, 
  saveOfflineSocio 
} from '../../lib/authService';

interface AuthScreenProps {
  gymName?: string;
  onLoginSuccess: (user: any, requiresWizard?: boolean) => void;
  onSwitchToLanding?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  gymName = 'Titán Fitness',
  onLoginSuccess,
  onSwitchToLanding,
}) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Solicitar OTP de 5 dígitos
  const handleRequestOTP = async (targetPhone = phone) => {
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await requestPhoneOTP(targetPhone);
      if (!res.success || !res.otpCode) {
        setErrorMessage(res.error || 'No se pudo enviar el código.');
        setLoading(false);
        return;
      }

      setGeneratedOtp(res.otpCode);
      setStep('otp');
      setOtpInput('');
      setNoticeMessage(`Código de 5 dígitos enviado a +51 ${targetPhone}`);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  // Verificar el código de 5 dígitos
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatedOtp) return;

    if (otpInput.trim().length !== 5) {
      setErrorMessage('Ingresa el código completo de 5 dígitos.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await verifyPhoneOTP(phone, otpInput, generatedOtp);
      if (!res.success) {
        setErrorMessage(res.error || 'Código incorrecto.');
        setLoading(false);
        return;
      }

      // Si ya tiene perfil de socio -> al Inicio; si es nuevo -> al Wizard
      onLoginSuccess(res.user, !res.isExistingSocio);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error verificando código.');
      setLoading(false);
    }
  };

  // Acceso rápido para probar como socio existente
  const handleQuickDemoSocio = () => {
    setPhone('987654321');
    handleRequestOTP('987654321');
  };

  // Acceso rápido para probar como socio nuevo
  const handleQuickNewMember = () => {
    const randomNewPhone = `9${Math.floor(10000000 + Math.random() * 89999999)}`;
    setPhone(randomNewPhone);
    handleRequestOTP(randomNewPhone);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#090A0E] text-zinc-900 dark:text-zinc-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 items-center justify-center shadow-xl shadow-orange-500/25">
            <Dumbbell className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-heading text-3xl font-black uppercase text-zinc-950 dark:text-white tracking-tight">
            {gymName} <span className="text-orange-500">Mi Cuenta</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider">
            Ingreso Rápido por Celular (Sin Contraseñas)
          </p>
        </div>

        {/* Main Auth Container */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* PASO 1: NÚMERO DE CELULAR */}
          {step === 'phone' && (
            <form onSubmit={(e) => { e.preventDefault(); handleRequestOTP(); }} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Número de Celular
                </label>
                <div className="flex rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus-within:border-orange-500">
                  <span className="px-3.5 py-2.5 text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex items-center">
                    🇵🇪 +51
                  </span>
                  <input
                    type="tel"
                    maxLength={9}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="987654321"
                    inputMode="tel"
                    autoFocus
                    className="w-full px-3.5 py-2.5 text-sm bg-transparent text-zinc-950 dark:text-white focus:outline-hidden font-mono tracking-wider font-semibold"
                    required
                  />
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Te enviaremos un código temporal de 5 dígitos para validar tu ingreso.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length < 9}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                {loading ? (
                  <span>Enviando código...</span>
                ) : (
                  <>
                    <span>Enviar Código de 5 Dígitos</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* PASO 2: CÓDIGO OTP DE 5 DÍGITOS */}
          {step === 'otp' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Simulated SMS Notification Banner */}
              {generatedOtp && (
                <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-xs space-y-2">
                  <div className="flex items-center justify-between text-orange-600 dark:text-orange-400 font-bold">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Smartphone className="w-4 h-4" />
                      SMS / WhatsApp Entrante
                    </span>
                    <span className="text-[10px] font-mono bg-orange-500/20 px-2 py-0.5 rounded">
                      Ahora
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-orange-500/20 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-zinc-500">Tu código de acceso es:</p>
                      <p className="font-heading text-2xl font-black text-zinc-950 dark:text-white tracking-widest font-mono">
                        {generatedOtp}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpInput(generatedOtp)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-xs"
                    >
                      Autocompletar
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Ingresa el Código de 5 Dígitos
                    </label>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Enviado a +51 {phone}
                    </span>
                  </div>

                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      maxLength={5}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • •"
                      inputMode="numeric"
                      autoFocus
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-center text-xl tracking-[0.5em] font-mono font-black bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-hidden focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpInput.length !== 5}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  {loading ? (
                    <span>Verificando...</span>
                  ) : (
                    <>
                      <span>Validar e Ingresar</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => { setStep('phone'); setErrorMessage(null); }}
                    className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Cambiar número</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRequestOTP(phone)}
                    className="text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reenviar nuevo código</span>
                  </button>
                </div>
              </form>

            </div>
          )}

          {/* Quick Demo Testing Shortcuts */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 block text-center">
              Accesos Rápidos de Prueba (1 Clic)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickDemoSocio}
                className="p-2.5 rounded-xl text-left border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:border-orange-500/40 text-xs group transition-all"
              >
                <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-white group-hover:text-orange-500">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  <span>Socio Activo Demo</span>
                </div>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Cel: 987654321 (Carlos Vargas)</p>
              </button>

              <button
                type="button"
                onClick={handleQuickNewMember}
                className="p-2.5 rounded-xl text-left border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:border-orange-500/40 text-xs group transition-all"
              >
                <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-white group-hover:text-orange-500">
                  <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
                  <span>Nuevo Socio (Ficha)</span>
                </div>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Genera celular y abre Wizard</p>
              </button>
            </div>
          </div>

        </div>

        {/* Back to landing */}
        {onSwitchToLanding && (
          <div className="text-center">
            <button
              onClick={onSwitchToLanding}
              className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium underline underline-offset-4"
            >
              ← Ir a la Landing Pública del Gimnasio
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
