/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PromoPlanesSection } from './components/PromoPlanesSection';
import { VisualShowcaseSection } from './components/VisualShowcaseSection';
import { SedesSection } from './components/SedesSection';
import { LeadCaptureForm } from './components/LeadCaptureForm';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ClientDemoModal } from './components/ClientDemoModal';

// Socio Mi Cuenta Modules
import { AuthScreen } from './components/socio/AuthScreen';
import { WizardInscripcion } from './components/socio/WizardInscripcion';
import { InicioScreen } from './components/socio/InicioScreen';
import { QRScreen } from './components/socio/QRScreen';
import { PerfilScreen } from './components/socio/PerfilScreen';
import { BottomNav } from './components/socio/BottomNav';
import { PhasePreviewScreen } from './components/socio/PhasePreviewScreen';
import { ProgresoScreen } from './components/socio/ProgresoScreen';

// Admin / Business Owner Screen
import { AdminScreen } from './components/admin/AdminScreen';

import { 
  fetchGimnasioPublico, 
  fetchSedes, 
  fetchPlanes, 
  isSupabaseConfigured 
} from './lib/supabase';
import { 
  getOfflineSocio, 
  fetchSocioProfile, 
  signOutUser,
  DEMO_SOCIO,
  saveOfflineSocio
} from './lib/authService';
import type { GimnasioPublico, Sede, Plan } from './types/database';
import type { SocioProfile } from './types/socio';
import { 
  Database, 
  CheckCircle2, 
  Sun, 
  Moon, 
  SlidersHorizontal, 
  User, 
  Crown, 
  Globe, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('titan_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // App Mode: 'landing' (DEFAULT), 'socio', or 'admin'
  const [appMode, setAppMode] = useState<'landing' | 'socio' | 'admin'>('landing');

  // Selected promo for lead capture form
  const [selectedPromo, setSelectedPromo] = useState('Pase Prueba 1 Mes (S/ 99)');

  // Socio App state (pre-cargado con DEMO_SOCIO para prueba inmediata)
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const cached = getOfflineSocio();
    return cached 
      ? { id: cached.user_id, email: cached.email, celular: cached.celular } 
      : { id: DEMO_SOCIO.user_id, email: DEMO_SOCIO.email, celular: DEMO_SOCIO.celular };
  });
  const [socioProfile, setSocioProfile] = useState<SocioProfile | null>(() => getOfflineSocio() || DEMO_SOCIO);
  const [inWizardMode, setInWizardMode] = useState(false);
  const [socioTab, setSocioTab] = useState('inicio');
  const [showQRScreen, setShowQRScreen] = useState(false);

  // Landing & gym state
  const [gimnasio, setGimnasio] = useState<GimnasioPublico | null>(null);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Sync theme
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('titan_theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('titan_theme', 'light');
    }
  }, [isDarkMode]);

  // Load initial gym data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [gimnasioData, sedesData, planesData] = await Promise.all([
          fetchGimnasioPublico(),
          fetchSedes(),
          fetchPlanes(),
        ]);
        setGimnasio(gimnasioData);
        setSedes(sedesData);
        setPlanes(planesData);
      } catch (err) {
        console.error('Error cargando datos del gimnasio:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleSelectPromo = (promoName: string) => {
    setSelectedPromo(promoName);
    const formEl = document.getElementById('contacto');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
    setToastMessage(`Promo seleccionada: "${promoName}". Completa tus datos para asegurar tu cupo.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Auth Handlers
  const handleLoginSuccess = async (user: any, requiresWizard: boolean = false) => {
    setCurrentUser(user);
    if (requiresWizard) {
      setInWizardMode(true);
      setSocioProfile(null);
    } else {
      const profile = await fetchSocioProfile(user.id);
      if (profile) {
        setSocioProfile(profile);
        setInWizardMode(false);
      } else {
        setInWizardMode(true);
      }
    }
    setSocioTab('inicio');
  };

  const handleWizardCompleted = () => {
    const profile = getOfflineSocio() || DEMO_SOCIO;
    setSocioProfile(profile);
    setInWizardMode(false);
    setSocioTab('inicio');
    setToastMessage('¡Inscripción exitosa! Tu membresía y código QR están activos.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSignOut = async () => {
    await signOutUser();
    setCurrentUser(null);
    setSocioProfile(null);
    setInWizardMode(false);
    setSocioTab('inicio');
    setShowQRScreen(false);
  };

  const handleUpdateClient = (newGym: GimnasioPublico, newSedes: Sede[]) => {
    setGimnasio(newGym);
    setSedes(newSedes);
    setToastMessage(`Datos actualizados para: "${newGym.nombre}".`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const gymTitle = gimnasio?.nombre || 'Titán Fitness';

  // --------------------------------------------------------------------------
  // RENDER: PANEL DE ADMINISTRACIÓN / DUEÑO
  // --------------------------------------------------------------------------
  if (appMode === 'admin') {
    return (
      <AdminScreen
        gymName={gymTitle}
        sedes={sedes}
        onSwitchToLanding={() => setAppMode('landing')}
        onSwitchToSocio={() => setAppMode('socio')}
      />
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: PWA SOCIO (MI CUENTA)
  // --------------------------------------------------------------------------
  if (appMode === 'socio') {
    if (!currentUser) {
      return (
        <AuthScreen
          gymName={gymTitle}
          onLoginSuccess={handleLoginSuccess}
          onSwitchToLanding={() => setAppMode('landing')}
        />
      );
    }

    if (inWizardMode) {
      return (
        <WizardInscripcion
          userEmail={currentUser.email}
          userPhone={currentUser.celular}
          userId={currentUser.id}
          onCompleted={handleWizardCompleted}
          onCancel={() => setInWizardMode(false)}
        />
      );
    }

    const currentSocio = socioProfile || DEMO_SOCIO;

    if (showQRScreen) {
      return (
        <QRScreen
          socio={currentSocio}
          gymName={gymTitle}
          onBack={() => setShowQRScreen(false)}
        />
      );
    }

    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#090A0E] text-zinc-900 dark:text-zinc-100 flex flex-col justify-between selection:bg-orange-500 selection:text-white transition-colors duration-200">
        {/* Top App Status Strip */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#090A0E]/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 px-4 py-2.5">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-xs">
                TF
              </div>
              <span className="font-heading text-lg font-black uppercase text-zinc-950 dark:text-white tracking-wide">
                {gymTitle}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
              </button>

              <button
                onClick={() => setAppMode('landing')}
                className="text-[11px] font-mono font-bold px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-850 text-zinc-700 dark:text-zinc-300 hover:text-orange-500 border border-zinc-200 dark:border-zinc-800"
              >
                Landing
              </button>

              <button
                onClick={() => setAppMode('admin')}
                className="text-[11px] font-mono font-bold px-2 py-1 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30"
              >
                Dueño
              </button>
            </div>
          </div>
        </header>

        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-16 left-4 right-4 z-50 max-w-sm mx-auto bg-white dark:bg-zinc-900 border border-orange-500/80 rounded-2xl p-3.5 shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab Content View */}
        <main className="flex-1">
          {socioTab === 'inicio' && (
            <InicioScreen
              socio={currentSocio}
              gymName={gymTitle}
              onOpenQR={() => setShowQRScreen(true)}
              onRenewPlan={() => setSocioTab('pagos')}
              onNavigateToTab={(tab) => setSocioTab(tab)}
            />
          )}

          {socioTab === 'progreso' && (
            <ProgresoScreen
              socio={currentSocio}
              onBack={() => setSocioTab('inicio')}
              onOpenQR={() => setShowQRScreen(true)}
            />
          )}

          {socioTab === 'rutina' && (
            <PhasePreviewScreen
              module="rutina"
              onBack={() => setSocioTab('inicio')}
            />
          )}

          {socioTab === 'pagos' && (
            <PhasePreviewScreen
              module="pagos"
              onBack={() => setSocioTab('inicio')}
            />
          )}

          {socioTab === 'perfil' && (
            <PerfilScreen
              socio={currentSocio}
              gymName={gymTitle}
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              onSignOut={handleSignOut}
              onSwitchToLanding={() => setAppMode('landing')}
            />
          )}
        </main>

        {/* Bottom Nav */}
        <BottomNav
          currentTab={socioTab}
          onTabChange={(tab) => setSocioTab(tab)}
          onOpenQR={() => setShowQRScreen(true)}
        />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: LANDING PÚBLICA (CARA PRINCIPAL POR DEFECTO)
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#090A0E] text-zinc-900 dark:text-zinc-100 flex flex-col selection:bg-orange-500 selection:text-white transition-colors duration-200">
      
      {/* Ecosystem Role Switcher Banner */}
      <div className="sticky top-0 z-50 bg-zinc-950 text-white text-xs py-2 px-4 border-b border-zinc-800 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-zinc-400">
              Demostración del Ecosistema Completo:
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] font-bold">
            <button
              onClick={() => setAppMode('landing')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                true
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>1. Landing Pública</span>
            </button>

            <button
              onClick={() => {
                setAppMode('socio');
                setSocioTab('inicio');
              }}
              className="px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800/80 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-orange-500" />
              <span>2. App Socio (Mi Cuenta)</span>
            </button>

            <button
              onClick={() => setAppMode('admin')}
              className="px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/60 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>3. Dueño / Admin</span>
            </button>
          </div>

        </div>
      </div>

      {/* Sticky Main Landing Navbar */}
      <Navbar
        gymName={gymTitle}
        ciudad={gimnasio?.ciudad}
        sedes={sedes}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onSelectCTA={() => {
          const el = document.getElementById('contacto');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onSwitchToSocio={() => {
          setAppMode('socio');
          setSocioTab('inicio');
        }}
      />

      {/* Floating toast */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 max-w-md bg-white dark:bg-zinc-900 border border-orange-500/80 rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 text-zinc-900 dark:text-white text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
          <p>{toastMessage}</p>
        </div>
      )}

      {/* Main Landing Flow (Menos texto, más imágenes, 2 promos) */}
      <main className="flex-1">
        {/* 1. Hero */}
        <Hero
          gymName={gymTitle}
          ciudad={gimnasio?.ciudad}
          sedes={sedes}
          onExplorePlans={() => {
            const el = document.getElementById('promos');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onRequestFreeTrial={() => {
            const el = document.getElementById('contacto');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 2. Visual Showcase: Menos texto, más imágenes */}
        <VisualShowcaseSection
          gymName={gymTitle}
        />

        {/* 3. Solo 2 Planes en Promoción para Gancho */}
        <PromoPlanesSection
          sedes={sedes}
          onSelectPromo={handleSelectPromo}
        />

        {/* 4. Sedes con fotos, mapa y WhatsApp */}
        <SedesSection
          sedes={sedes}
          loading={loading}
        />

        {/* 5. Formulario de Captura de Prospectos (Conexión directa con Admin CRM) */}
        <LeadCaptureForm
          sedes={sedes}
          selectedPromo={selectedPromo}
          onSuccessRegistered={() => {
            setToastMessage('¡Prospecto guardado! Revisa el "Panel Dueño" para verlo en el CRM en tiempo real.');
          }}
        />
      </main>


      {/* Floating WhatsApp Action */}
      <FloatingWhatsApp
        whatsappNumber={sedes[0]?.whatsapp || '51987654321'}
        gymName={gymTitle}
      />

      {/* Client Demo Personalizer Modal */}
      <ClientDemoModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        gimnasio={gimnasio}
        sedes={sedes}
        onUpdateClient={handleUpdateClient}
      />

      {/* Public Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#090A0E] py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500 dark:text-zinc-400">
          
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <span className="font-heading text-lg font-bold text-zinc-950 dark:text-white tracking-wide uppercase">
              {gymTitle}
            </span>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">|</span>
            <span>{sedes.map(s => s.nombre).join(' & ') || 'Sedes equipadas'}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setAppMode('socio')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 text-white font-bold text-[11px]"
            >
              <User className="w-3.5 h-3.5" />
              <span>Portal Socio</span>
            </button>

            <button
              onClick={() => setAppMode('admin')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-[11px]"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400 dark:text-amber-500" />
              <span>Panel Dueño</span>
            </button>

            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px]">Demo Cliente</span>
            </button>

            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-zinc-700" />}
              <span className="font-mono text-[11px]">{isDarkMode ? 'Oscuro' : 'Claro'}</span>
            </button>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400 dark:text-zinc-500">
          <p>© 2026 {gymTitle} S.A.C. Todos los derechos reservados. Ley de Protección de Datos Personales N° 29733.</p>
          <div className="flex items-center gap-4 font-mono">
            <span>Ecosistema 360° Activo</span>
            <span>·</span>
            <span>Landing · Socio PWA · Admin Dueño</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
