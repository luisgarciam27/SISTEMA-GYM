import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Download, Dumbbell, MapPin } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import type { Sede } from '../types/database';

interface NavbarProps {
  gymName?: string;
  ciudad?: string;
  sedes?: Sede[];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onSelectCTA?: () => void;
  onOpenCustomizer?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  gymName = 'Titán Fitness',
  ciudad,
  sedes = [],
  isDarkMode,
  toggleDarkMode,
  onSelectCTA,
  onOpenCustomizer,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isInstallable, install } = usePWAInstall();

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nameParts = gymName.trim().split(' ');
  const firstName = nameParts[0] || 'Titán';
  const lastName = nameParts.slice(1).join(' ') || 'Fitness';

  const locationSubtitle = ciudad 
    ? `${ciudad} · ${sedes.length > 0 ? sedes.map(s => s.nombre).join(' · ') : 'Sede 1 & 2'}`
    : (sedes.length > 0 ? sedes.map(s => s.nombre).join(' · ') : 'Sede 1 · Sede 2');

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-[#090A0E]/90 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar 3-Zone Contract */}
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <a 
              href="#inicio" 
              className="flex items-center gap-2.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform duration-200">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-black tracking-tight leading-none text-zinc-950 dark:text-white uppercase">
                  {firstName} <span className="text-orange-500">{lastName}</span>
                </span>
                <span className="text-[10px] tracking-widest text-zinc-500 dark:text-zinc-400 font-mono uppercase mt-0.5 max-w-[240px] truncate" title={locationSubtitle}>
                  {locationSubtitle}
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            <a
              href="#inicio"
              onClick={(e) => { e.preventDefault(); handleNavClick('#inicio'); }}
              className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors whitespace-nowrap shrink-0"
            >
              Inicio
            </a>
            <a
              href="#planes"
              onClick={(e) => { e.preventDefault(); handleNavClick('#planes'); }}
              className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors whitespace-nowrap shrink-0"
            >
              Planes
            </a>
            <a
              href="#sedes"
              onClick={(e) => { e.preventDefault(); handleNavClick('#sedes'); }}
              className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors whitespace-nowrap shrink-0"
            >
              Sedes
            </a>
            <a
              href="#sedes"
              onClick={(e) => { e.preventDefault(); handleNavClick('#sedes'); }}
              className="text-zinc-500 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span>{sedes.length > 0 ? `${sedes.length} Sedes` : 'Sedes'}</span>
            </a>
          </nav>

          {/* Zone 3: Actions (Theme toggle, PWA install & Primary CTA) */}
          <div className="hidden md:flex items-center gap-3.5 shrink-0">
            {onOpenCustomizer && (
              <button
                onClick={onOpenCustomizer}
                className="px-2.5 py-1.5 text-xs font-mono font-medium rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 transition-colors"
                title="Personalizar datos de cliente para demostración"
              >
                Demo Cliente
              </button>
            )}

            {isInstallable && (
              <button
                onClick={install}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800/90 hover:bg-zinc-200 dark:hover:bg-zinc-700/90 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-colors whitespace-nowrap"
                title="Instalar App"
              >
                <Download className="w-3.5 h-3.5 text-orange-500" />
                <span>Instalar</span>
              </button>
            )}

            {/* Theme Switcher */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all hover:scale-105"
              aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="hidden lg:inline text-xs">Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-zinc-700 shrink-0" />
                  <span className="hidden lg:inline text-xs">Oscuro</span>
                </>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => {
                if (onSelectCTA) onSelectCTA();
                handleNavClick('#planes');
              }}
              className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-lg shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all whitespace-nowrap shrink-0 uppercase tracking-wide cursor-pointer"
            >
              Prueba gratis
            </button>
          </div>

          {/* Mobile Actions: Theme button + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
              aria-label="Alternar modo claro/oscuro"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#090A0E]/95 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col space-y-1">
              <a
                href="#inicio"
                onClick={(e) => { e.preventDefault(); handleNavClick('#inicio'); }}
                className="px-3 py-2 text-base font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg"
              >
                Inicio
              </a>
              <a
                href="#planes"
                onClick={(e) => { e.preventDefault(); handleNavClick('#planes'); }}
                className="px-3 py-2 text-base font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg"
              >
                Planes
              </a>
              <a
                href="#sedes"
                onClick={(e) => { e.preventDefault(); handleNavClick('#sedes'); }}
                className="px-3 py-2 text-base font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg"
              >
                Sedes
              </a>
            </div>

            {onOpenCustomizer && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCustomizer();
                }}
                className="w-full py-2 text-xs font-mono font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 rounded-lg border border-orange-500/30"
              >
                ⚙️ Cambiar Cliente / Sede Demo
              </button>
            )}

            {isInstallable && (
              <button
                onClick={install}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg"
              >
                <Download className="w-4 h-4 text-orange-500" />
                Instalar App
              </button>
            )}

            <button
              onClick={() => {
                if (onSelectCTA) onSelectCTA();
                handleNavClick('#planes');
              }}
              className="w-full px-4 py-3 text-center text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-lg shadow-md uppercase tracking-wider"
            >
              Prueba gratis
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
