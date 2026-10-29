import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  UserPlus, 
  MessageCircle, 
  Phone, 
  Clock, 
  Search, 
  Check, 
  ShieldCheck, 
  RefreshCw, 
  Building2, 
  Activity,
  SlidersHorizontal,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import type { Prospecto } from '../../types/admin';
import type { SocioProfile } from '../../types/socio';
import type { Sede } from '../../types/database';
import { getProspectos, actualizarEstadoProspecto } from '../../lib/prospectosService';
import { DEMO_SOCIO } from '../../lib/authService';

interface AdminScreenProps {
  gymName?: string;
  sedes?: Sede[];
  onSwitchToLanding: () => void;
  onSwitchToSocio: () => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({
  gymName = 'Titán Fitness',
  sedes = [],
  onSwitchToLanding,
  onSwitchToSocio,
}) => {
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [activeTab, setActiveTab] = useState<'prospectos' | 'socios' | 'aforo'>('prospectos');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Initial members in the gym demo database
  const [sociosList, setSociosList] = useState<SocioProfile[]>([
    DEMO_SOCIO,
    {
      ...DEMO_SOCIO,
      id: 'SOC-2026-08501',
      user_id: 'user-demo-456',
      numero_documento: '48392019',
      nombres: 'María Elena',
      apellidos: 'Rojas Castro',
      celular: '993456781',
      email: 'maria.rojas@gmail.com',
      membresia: {
        id: 'MEM-2026-902',
        plan_nombre: 'Pack Trimestral Élite Promo',
        plan_tipo: 'dias',
        estado: 'activa',
        fecha_inicio: '2026-10-01',
        fecha_vencimiento: '2026-12-30',
        dias_totales: 90,
        dias_restantes: 62,
        precio_pagado_centimos: 24900,
        sede_nombre: 'Sede 1 (Principal)'
      }
    },
    {
      ...DEMO_SOCIO,
      id: 'SOC-2026-08502',
      user_id: 'user-demo-789',
      numero_documento: '71938472',
      nombres: 'Renzo Javier',
      apellidos: 'Flores Palacios',
      celular: '981234900',
      email: 'renzo.flores@outlook.com',
      membresia: {
        id: 'MEM-2026-903',
        plan_nombre: 'Pase Prueba 1 Mes',
        plan_tipo: 'dias',
        estado: 'por_vencer',
        fecha_inicio: '2026-10-02',
        fecha_vencimiento: '2026-11-01',
        dias_totales: 30,
        dias_restantes: 3,
        precio_pagado_centimos: 9900,
        sede_nombre: 'Sede 2'
      }
    }
  ]);

  // Load prospectos on mount
  useEffect(() => {
    setProspectos(getProspectos());
  }, []);

  const handleUpdateStatus = (id: string, newStatus: Prospecto['estado']) => {
    const updated = actualizarEstadoProspecto(id, newStatus);
    setProspectos(updated);
    setActionNotice(`Estado de prospecto actualizado a "${newStatus}".`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleRenewMember = (socioId: string) => {
    setSociosList((prev) =>
      prev.map((s) => {
        if (s.id === socioId && s.membresia) {
          return {
            ...s,
            membresia: {
              ...s.membresia,
              estado: 'activa',
              dias_restantes: s.membresia.dias_restantes + 30,
              dias_totales: s.membresia.dias_totales + 30,
            },
          };
        }
        return s;
      })
    );
    setActionNotice('Membresía renovada por 30 días adicionales con éxito.');
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleRegisterAccess = (socioName: string) => {
    setActionNotice(`✓ Ingreso registrado para ${socioName} en torniquete.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Convert prospect to member
  const handleConvertToMember = (prospecto: Prospecto) => {
    const newSocio: SocioProfile = {
      ...DEMO_SOCIO,
      id: `SOC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      user_id: `user-${Date.now()}`,
      numero_documento: `${Math.floor(10000000 + Math.random() * 89999999)}`,
      nombres: prospecto.nombre.split(' ')[0] || prospecto.nombre,
      apellidos: prospecto.nombre.split(' ').slice(1).join(' ') || 'Nuevo',
      celular: prospecto.celular,
      email: `${prospecto.nombre.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      membresia: {
        id: `MEM-${Date.now()}`,
        plan_nombre: prospecto.plan_interes || 'Pase Prueba 1 Mes',
        plan_tipo: 'dias',
        estado: 'activa',
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_vencimiento: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        dias_totales: 30,
        dias_restantes: 30,
        precio_pagado_centimos: 9900,
        sede_nombre: prospecto.sede_preferida || 'Sede 1'
      }
    };

    setSociosList([newSocio, ...sociosList]);
    handleUpdateStatus(prospecto.id, 'matriculado');
    setActionNotice(`¡${prospecto.nombre} ha sido matriculado como socio activo!`);
  };

  const filteredSocios = sociosList.filter(
    (s) =>
      s.nombres.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.apellidos.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.numero_documento.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#08090C] text-zinc-900 dark:text-zinc-100 pb-16 transition-colors">
      
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#090A0E]/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-950 font-black">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-xl font-black uppercase text-zinc-950 dark:text-white">
                  Panel del Dueño / Administración
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                  En Vivo
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                {gymName} · Control Total de Socios, Ventas y Prospectos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onSwitchToLanding}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5"
            >
              <span>Ver Landing Pública</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onSwitchToSocio}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 flex items-center gap-1.5 shadow-sm"
            >
              <span>Entrar como Socio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Notice */}
      {actionNotice && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-md bg-zinc-900 text-white border border-orange-500/80 rounded-2xl p-3.5 shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main Admin Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-zinc-500 dark:text-zinc-400">
                Socios Activos
              </span>
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="font-heading text-3xl font-black text-zinc-950 dark:text-white tabular-nums">
              {sociosList.filter(s => s.membresia?.estado === 'activa').length + 246}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              ↑ +14 nuevos este mes
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-zinc-500 dark:text-zinc-400">
                Prospectos de Landing
              </span>
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                <UserPlus className="w-4 h-4" />
              </div>
            </div>
            <p className="font-heading text-3xl font-black text-zinc-950 dark:text-white tabular-nums">
              {prospectos.length}
            </p>
            <p className="text-[11px] text-orange-600 dark:text-orange-400 font-medium">
              {prospectos.filter(p => p.estado === 'nuevo').length} pendientes de contacto
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-zinc-500 dark:text-zinc-400">
                Ingresos Estimados
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="font-heading text-3xl font-black text-zinc-950 dark:text-white tabular-nums">
              S/ 24,890
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
              Promedio ticket S/ 140
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-zinc-500 dark:text-zinc-400">
                Aforo en Sedes
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <p className="font-heading text-3xl font-black text-zinc-950 dark:text-white tabular-nums">
              70 / 330
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
              21% de capacidad ocupada
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <button
            onClick={() => setActiveTab('prospectos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'prospectos'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Prospectos de la Landing ({prospectos.length})
          </button>

          <button
            onClick={() => setActiveTab('socios')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'socios'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Gestión de Socios ({sociosList.length})
          </button>
        </div>

        {/* TAB 1: PROSPECTOS (CRM EN VIVO) */}
        {activeTab === 'prospectos' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-xl font-black uppercase text-zinc-950 dark:text-white">
                  Bandeja de Contactos Recibidos
                </h3>
                <p className="text-xs text-zinc-500">
                  Personas que solicitaron promociones o información en la landing page pública.
                </p>
              </div>
              <button
                onClick={() => setProspectos(getProspectos())}
                className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Actualizar lista"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 dark:bg-zinc-950/60 text-zinc-500 font-mono uppercase border-b border-zinc-200 dark:border-zinc-800">
                    <tr>
                      <th className="p-4">Prospecto</th>
                      <th className="p-4">Celular</th>
                      <th className="p-4">Plan Solicitado</th>
                      <th className="p-4">Sede</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4 text-right">Acción Rápida</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {prospectos.map((p) => {
                      const waLink = `https://wa.me/51${p.celular}?text=${encodeURIComponent(
                        `Hola ${p.nombre}, te saludamos de ${gymName}. Vimos tu solicitud para la ${p.plan_interes} en la ${p.sede_preferida}. ¿Te gustaría que te reservemos tu pase para hoy o mañana?`
                      )}`;

                      return (
                        <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-850/50 transition-colors">
                          <td className="p-4 font-bold text-zinc-900 dark:text-white">
                            <div>{p.nombre}</div>
                            <span className="text-[10px] text-zinc-400 font-mono font-normal">
                              ID: {p.id}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-medium">
                            <span className="text-zinc-800 dark:text-zinc-200">{p.celular}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-orange-600 dark:text-orange-400">
                              {p.plan_interes}
                            </span>
                          </td>
                          <td className="p-4 text-zinc-600 dark:text-zinc-400">
                            {p.sede_preferida}
                          </td>
                          <td className="p-4">
                            <select
                              value={p.estado}
                              onChange={(e) => handleUpdateStatus(p.id, e.target.value as any)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                            >
                              <option value="nuevo">🔴 Nuevo</option>
                              <option value="contactado">🟡 Contactado</option>
                              <option value="visita_agendada">🔵 Visita Agendada</option>
                              <option value="matriculado">🟢 Matriculado</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shadow-xs"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>

                              {p.estado !== 'matriculado' && (
                                <button
                                  onClick={() => handleConvertToMember(p)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white"
                                  title="Matricular como socio con membresía activa"
                                >
                                  Matricular
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SOCIOS REGISTRADOS */}
        {activeTab === 'socios' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading text-xl font-black uppercase text-zinc-950 dark:text-white">
                  Padrón de Socios Activos
                </h3>
                <p className="text-xs text-zinc-500">
                  Control de estado de membresías, vencimientos y acceso.
                </p>
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por DNI o Nombre..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSocios.map((socio) => (
                <div
                  key={socio.id}
                  className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-heading text-lg font-black uppercase text-zinc-950 dark:text-white">
                          {socio.nombres} {socio.apellidos}
                        </h4>
                        <p className="text-xs font-mono text-zinc-500">
                          {socio.tipo_documento}: {socio.numero_documento}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        {socio.membresia?.estado || 'Activa'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-xs space-y-1">
                      <p className="font-bold text-zinc-800 dark:text-zinc-200">
                        {socio.membresia?.plan_nombre}
                      </p>
                      <div className="flex items-center justify-between text-zinc-500 text-[11px] font-mono">
                        <span>Días restantes:</span>
                        <span className="font-bold text-orange-500">
                          {socio.membresia?.dias_restantes} días
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                      onClick={() => handleRegisterAccess(`${socio.nombres}`)}
                      className="py-2 px-3 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 transition-colors"
                    >
                      Validar Ingreso
                    </button>
                    <button
                      onClick={() => handleRenewMember(socio.id)}
                      className="py-2 px-3 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-colors"
                    >
                      Renovar +30d
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
