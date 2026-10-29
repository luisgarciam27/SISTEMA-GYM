import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, MessageCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { prospectoSchema } from '../types/database';
import { registrarNuevoProspecto } from '../lib/prospectosService';
import type { Sede } from '../types/database';

interface LeadCaptureFormProps {
  sedes?: Sede[];
  selectedPromo?: string;
  onSuccessRegistered?: () => void;
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  sedes = [],
  selectedPromo = 'Pase Prueba 1 Mes (S/ 99)',
  onSuccessRegistered,
}) => {
  const [nombre, setNombre] = useState('');
  const [celular, setCelular] = useState('');
  const [sedePreferida, setSedePreferida] = useState(sedes[0]?.nombre || 'Sede 1');
  const [planInteres, setPlanInteres] = useState(selectedPromo);
  const [honeypot, setHoneypot] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    nombre: string;
    celular: string;
    sede: string;
    plan: string;
  } | null>(null);

  // Sync if parent updates selectedPromo
  React.useEffect(() => {
    if (selectedPromo) {
      setPlanInteres(selectedPromo);
    }
  }, [selectedPromo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Zod validation
    const result = prospectoSchema.safeParse({
      nombre,
      celular,
      honeypot,
      plan_interes: planInteres,
      sede_preferida: sedePreferida,
    });

    if (!result.success) {
      const issue = result.error.issues[0];
      setErrorMsg(issue?.message || 'Por favor verifica los datos ingresados.');
      return;
    }

    setLoading(true);

    try {
      const res = await registrarNuevoProspecto({
        nombre,
        celular,
        plan_interes: planInteres,
        sede_preferida: sedePreferida,
      });

      if (!res.success) {
        setErrorMsg(res.error || 'No se pudo enviar tu solicitud. Intenta por WhatsApp.');
        setLoading(false);
        return;
      }

      setSubmittedData({
        nombre,
        celular,
        sede: sedePreferida,
        plan: planInteres,
      });

      if (onSuccessRegistered) {
        onSuccessRegistered();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppConfirmationUrl = () => {
    if (!submittedData) return '#';
    const sedeObj = sedes.find((s) => s.nombre === submittedData.sede) || sedes[0];
    const phone = (sedeObj?.whatsapp || '51987654321').replace(/\D/g, '');
    const text = encodeURIComponent(
      `¡Hola! Soy ${submittedData.nombre}. Acabo de solicitar la promo "${submittedData.plan}" para la ${submittedData.sede}. Deseo coordinar mi visita gratuita.`
    );
    return `https://wa.me/${phone}?text=${text}`;
  };

  return (
    <section id="contacto" className="py-16 bg-zinc-50 dark:bg-zinc-950/80 border-t border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        
        {/* Container Box */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          {submittedData ? (
            /* Success State */
            <div className="text-center space-y-5 animate-in zoom-in-95 duration-200 py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="font-heading text-2xl font-black uppercase text-zinc-950 dark:text-white">
                  ¡Solicitud Recibida!
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  Hemos reservado tu cupo para <strong>{submittedData.plan}</strong> en la <strong>{submittedData.sede}</strong>.
                </p>
              </div>

              {/* Direct WhatsApp Action to Lock In Date */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 text-left space-y-3">
                <div className="flex items-center gap-2 font-bold">
                  <Sparkles className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>Siguiente paso recomendado:</span>
                </div>
                <p className="leading-relaxed">
                  Confirma tu horario de visita por WhatsApp con el asesor de sede para que te esperen con tu pase listo.
                </p>
                <a
                  href={getWhatsAppConfirmationUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirmar Visita por WhatsApp</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => setSubmittedData(null)}
                className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 underline"
              >
                Enviar otra consulta
              </button>
            </div>
          ) : (
            /* Form Input State */
            <>
              <div className="text-center space-y-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-orange-600 dark:text-orange-400 tracking-wider">
                  Cupos Limitados Hoy
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase text-zinc-950 dark:text-white">
                  Agenda tu Visita Gratis
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Déjanos tus datos y prueba nuestras instalaciones sin costo ni compromiso.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot hidden input */}
                <input
                  type="text"
                  name="honeypot"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Tu Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Valeria Quispe"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-hidden focus:border-orange-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Número de Celular (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    maxLength={9}
                    value={celular}
                    onChange={(e) => setCelular(e.target.value.replace(/\D/g, ''))}
                    placeholder="987654321"
                    inputMode="tel"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-hidden focus:border-orange-500 font-mono"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Sede de Preferencia
                    </label>
                    <select
                      value={sedePreferida}
                      onChange={(e) => setSedePreferida(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                    >
                      {sedes.map((s) => (
                        <option key={s.id} value={s.nombre}>
                          {s.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Plan o Promo
                    </label>
                    <input
                      type="text"
                      value={planInteres}
                      onChange={(e) => setPlanInteres(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Enviando solicitud...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Solicitar Información y Cupo</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Tus datos están protegidos (Ley N° 29733 de Perú).</span>
                </div>
              </form>
            </>
          )}

        </div>

      </div>
    </section>
  );
};
