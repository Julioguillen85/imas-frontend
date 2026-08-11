import React, { useState, useEffect } from 'react';
import {
  Layers, Video, Sparkles, HeartHandshake, Users, ShieldCheck,
  Plus, Edit2, Trash2, Save, LogOut, ArrowLeft, CheckCircle2,
  AlertCircle, Film, Play, Eye, Box, Warehouse, Anchor,
  FileCheck2, Truck, Globe2, Scale, RefreshCw, LayoutDashboard,
  ExternalLink, ChevronRight, HelpCircle, MessageSquare, Mail,
  Phone, Building2, Clock, CheckCircle, UserCheck, Inbox, Filter, Bot
} from 'lucide-react';
import AdminServiceModal from './AdminServiceModal';
import AdminHeroModal from './AdminHeroModal';
import AdminContentModal from './AdminContentModal';
import { API_BASE_URL } from '../config/api';

const ICON_MAP = {
  Warehouse,
  Anchor,
  FileCheck2,
  Box,
  Truck,
  Globe2,
  Scale,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
};

const DEFAULT_COMPANY_VALUES = [
  { id: 1, title: 'Compromiso', description: 'Atención dedicada y cumplimiento ético en cada etapa de la cadena logística y aduanal.', icon: 'ShieldCheck' },
  { id: 2, title: 'Responsabilidad', description: 'Apego estricto a la legalidad y custodia integral de cada operación comercial.', icon: 'Scale' },
  { id: 3, title: 'Puntualidad', description: 'Optimización de tiempos para asegurar despachos ágiles y entregas oportunas.', icon: 'Sparkles' },
  { id: 4, title: 'Calidad', description: 'Excelencia en el servicio y soluciones a la medida para potenciar a nuestros clientes.', icon: 'HeartHandshake' },
  { id: 5, title: 'Proactividad', description: 'Anticipación constante y resolución estratégica para facilitar el comercio exterior.', icon: 'FileCheck2' },
];

export default function AdminDashboard({ adminToken, adminUser, onLogout, onBackToSite }) {
  const [activeTab, setActiveTab] = useState('leads'); // 'leads' | 'main_services' | 'other_services' | 'about_us' | 'values' | 'hero_videos' | 'service_videos'
  const [services, setServices] = useState([]);
  const [heroVideos, setHeroVideos] = useState([]);
  const [leads, setLeads] = useState([]);
  const [leadFilter, setLeadFilter] = useState('ALL'); // 'ALL' | 'AI_ASSISTANT' | 'LANDING_PAGE' | 'NUEVO'
  const [settings, setSettings] = useState({
    about_p1: 'Somos una Agencia Aduanal que ofrece un servicio integral para tus proyectos de importación y exportación, transformándolos en operaciones exitosas, apegadas a la legalidad, mediante un proceso ágil con atención personalizada.',
    about_p2: 'Ofrecemos asesoría legal especializada que respalda cada operación y gestión ante la autoridad.',
    about_p3: 'Nuestro compromiso es ser un socio comercial estratégico que impulsa el crecimiento de nuestros clientes.',
    mission_title: 'MISIÓN',
    mission_text: 'Brindar asesoría y soluciones integrales en la cadena logística y gestión aduanal, con atención personalizada, siempre apegados a la legalidad. Optimizando tiempos y costos para potenciar el comercio de nuestros clientes.',
    vision_title: 'VISIÓN',
    vision_text: 'Consolidarnos como una agencia aduanal líder, destacando por nuestro compromiso con la legalidad y satisfacción de nuestros clientes.',
    objectives_title: 'VALORES',
    objectives_text: 'Compromiso, Responsabilidad, Puntualidad, Calidad y Proactividad.',
    about_subtitle: 'Transformamos tus operaciones en éxitos de comercio exterior con respaldo 100% estratégico.',
    company_values: JSON.stringify(DEFAULT_COMPANY_VALUES)
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Modales
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [heroModalOpen, setHeroModalOpen] = useState(false);
  const [editingHeroVideo, setEditingHeroVideo] = useState(null);

  // Modal para Valores
  const [valueModalOpen, setValueModalOpen] = useState(false);
  const [editingValue, setEditingValue] = useState(null);
  const [valueFormData, setValueFormData] = useState({ title: '', description: '', icon: 'ShieldCheck' });

  // Carga inicial de datos
  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Cargar servicios
      const resServices = await fetch(`${API_BASE_URL}/api/v1/public/services`);
      if (resServices.ok) {
        const data = await resServices.json();
        setServices(data || []);
      }

      // 2. Cargar videos hero
      const resHero = await fetch(`${API_BASE_URL}/api/v1/public/hero`);
      if (resHero.ok) {
        const dataHero = await resHero.json();
        setHeroVideos(dataHero || []);
      }

      // 3. Cargar settings
      const resSettings = await fetch(`${API_BASE_URL}/api/v1/public/settings`);
      if (resSettings.ok) {
        const dataSettings = await resSettings.json();
        if (dataSettings && Object.keys(dataSettings).length > 0) {
          setSettings(prev => ({ ...prev, ...dataSettings }));
        }
      }

      // 4. Cargar prospectos / leads
      if (adminToken) {
        const resLeads = await fetch(`${API_BASE_URL}/api/v1/admin/leads`, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (resLeads.ok) {
          const dataLeads = await resLeads.json();
          setLeads(dataLeads || []);
        }
      }
    } catch (error) {
      console.error('Error cargando datos del admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLeadStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/leads/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
        showNotification(`Estado actualizado a "${newStatus}"`);
      } else {
        throw new Error('Error al actualizar estado');
      }
    } catch (err) {
      showNotification('No se pudo actualizar el estado del prospecto', true);
    }
  };

  const handleDeleteLead = async (id, name) => {
    if (!window.confirm(`¿Seguro que deseas eliminar el registro del prospecto "${name}"?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/leads/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        setLeads(prev => prev.filter(lead => lead.id !== id));
        showNotification('Prospecto eliminado');
      } else {
        throw new Error('Error al eliminar');
      }
    } catch (err) {
      showNotification('No se pudo eliminar el prospecto', true);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (msg, isError = false) => {
    setStatusMessage({ msg, isError });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Guardar configuración general (Misión, Visión, etc.)
  const handleSaveSettings = async (customSettings = settings) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/settings/batch`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify(customSettings),
      });

      if (!res.ok) throw new Error('Error al guardar configuración');
      showNotification('¡Información de Quiénes Somos guardada exitosamente!');
    } catch (err) {
      showNotification(err.message || 'Error al guardar', true);
    } finally {
      setLoading(false);
    }
  };

  // Manejadores de Servicios
  const handleDeleteService = async (id, title) => {
    if (!window.confirm(`¿Seguro que deseas eliminar el servicio "${title}"?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });
      if (res.ok) {
        showNotification(`Servicio "${title}" eliminado con éxito`);
        loadData();
      } else {
        showNotification('No se pudo eliminar el servicio', true);
      }
    } catch (err) {
      showNotification('Error de conexión', true);
    }
  };

  // Manejadores de Hero Videos
  const handleDeleteHeroVideo = async (id, title) => {
    if (!window.confirm(`¿Seguro que deseas eliminar el video "${title}"?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/hero/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });
      if (res.ok) {
        showNotification(`Video del hero eliminado con éxito`);
        loadData();
      } else {
        showNotification('No se pudo eliminar el video', true);
      }
    } catch (err) {
      showNotification('Error de conexión', true);
    }
  };

  // Parsear valores de la empresa
  let parsedValues = DEFAULT_COMPANY_VALUES;
  try {
    if (settings.company_values) {
      parsedValues = typeof settings.company_values === 'string'
        ? JSON.parse(settings.company_values)
        : settings.company_values;
    }
  } catch (e) {
    parsedValues = DEFAULT_COMPANY_VALUES;
  }

  // Guardar Valores
  const handleSaveValue = (e) => {
    e.preventDefault();
    let updated = [...parsedValues];
    if (editingValue) {
      updated = updated.map(v => v.id === editingValue.id ? { ...v, ...valueFormData } : v);
    } else {
      updated.push({
        id: Date.now(),
        ...valueFormData
      });
    }

    const newSettings = {
      ...settings,
      company_values: JSON.stringify(updated)
    };
    setSettings(newSettings);
    handleSaveSettings(newSettings);
    setValueModalOpen(false);
    setEditingValue(null);
    setValueFormData({ title: '', description: '', icon: 'ShieldCheck' });
  };

  const handleDeleteValue = (valId) => {
    if (!window.confirm('¿Seguro que deseas eliminar este valor corporativo?')) return;
    const updated = parsedValues.filter(v => v.id !== valId);
    const newSettings = {
      ...settings,
      company_values: JSON.stringify(updated)
    };
    setSettings(newSettings);
    handleSaveSettings(newSettings);
  };

  // Filtros de servicios principales vs secundarios seguros
  const safeServices = Array.isArray(services) ? services : [];
  const safeHeroVideos = Array.isArray(heroVideos) ? heroVideos : [];
  const safeValues = Array.isArray(parsedValues) ? parsedValues : DEFAULT_COMPANY_VALUES;

  const mainServices = safeServices.filter(s => s && (s.isMain || s.categoryId === 1 || s.id <= 3));
  const otherServices = safeServices.filter(s => s && !s.isMain && s.id > 3);

  return (
    <div className="min-h-screen bg-[#0d0208] text-slate-100 flex flex-col font-sans selection:bg-imas-pink selection:text-white">
      
      {/* 1. TOP HEADER DEL PANEL ADMIN */}
      <header className="sticky top-0 z-50 bg-slate-950/90 border-b border-rose-500/20 backdrop-blur-xl px-6 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToSite}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs font-bold transition-all shadow-md group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Volver a la Landing</span>
          </button>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-3">
            <img src="/images/logo1.png" alt="IMAS" className="h-8 w-auto object-contain" />
            <span className="font-black text-sm tracking-tight text-white hidden md:inline">
              PANEL DE ADMINISTRACIÓN CENTRAL
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Admin: {adminUser || 'admin'}</span>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 text-xs font-bold transition-all cursor-pointer"
            title="Recargar datos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white px-3.5 py-1.5 rounded-xl border border-rose-500/30 text-xs font-bold transition-all cursor-pointer shadow-lg"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir</span>
          </button>
        </div>
      </header>

      {/* NOTIFICACIÓN FLOTANTE */}
      {statusMessage && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border text-sm font-bold animate-fadeIn ${
          statusMessage.isError
            ? 'bg-rose-950/90 text-rose-200 border-rose-500/50 shadow-rose-950/50'
            : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50 shadow-emerald-950/50'
        }`}>
          {statusMessage.isError ? <AlertCircle className="w-5 h-5 text-rose-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          <span>{statusMessage.msg}</span>
        </div>
      )}

      {/* 2. BODY CON SIDEBAR Y CONTENIDO */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        
        {/* SIDEBAR DE NAVEGACIÓN */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-3xl p-4 sticky top-20 backdrop-blur-xl shadow-xl space-y-1">
            <div className="px-3 py-2 text-[11px] font-black uppercase tracking-wider text-slate-400">
              Gestión de Contenido
            </div>

            {[
              { id: 'leads', label: 'Prospectos / Leads (IA y Web)', icon: Inbox, count: leads.length, isNewBadge: leads.some(l => l.status === 'NUEVO') },
              { id: 'main_services', label: 'Servicios Principales', icon: Layers, count: mainServices.length },
              { id: 'other_services', label: 'Otros Servicios', icon: Box, count: otherServices.length },
              { id: 'about_us', label: 'Quiénes Somos', icon: Users },
              { id: 'values', label: 'Nuestros Valores', icon: HeartHandshake, count: parsedValues.length },
              { id: 'hero_videos', label: 'Videos del Hero', icon: Film, count: heroVideos.length },
              { id: 'service_videos', label: 'Videos de Servicios', icon: Video },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-imas-pink to-rose-600 text-white shadow-lg shadow-imas-pink/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-slate-800/80">
              <button
                onClick={onBackToSite}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-imas-pink" />
                  <span>Ver Sitio Público</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL SEGÚN PESTAÑA */}
        <main className="flex-1 min-w-0">
          
          {/* ========================================================================= */}
          {/* PESTAÑA 0: PROSPECTOS Y LEADS (IA & WEB) */}
          {/* ========================================================================= */}
          {activeTab === 'leads' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* ENCABEZADO Y RESUMEN DE PROSPECTOS */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/60 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-xl">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                    <Inbox className="w-6 h-6 text-imas-pink" />
                    <span>Prospectos y Solicitudes de Cotización</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Registros capturados en tiempo real por el Asistente IA y el Formulario de la Landing
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-slate-900 border border-slate-700/80 px-4 py-2 rounded-2xl flex items-center gap-2 text-xs text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Notificaciones a: <strong className="text-pink-400 font-mono">julioguillen85@gmail.com</strong></span>
                  </div>
                  <button
                    onClick={loadData}
                    className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-2xl border border-slate-700/80 text-xs font-bold transition-all cursor-pointer"
                    title="Actualizar prospectos"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* TARJETAS DE MÉTRICAS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Recibidos</span>
                  <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">{leads.length}</span>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-pink-500/30">
                  <span className="text-[11px] font-bold text-pink-400 uppercase tracking-wider block">Nuevos</span>
                  <span className="text-2xl sm:text-3xl font-black text-pink-400 mt-1 block">
                    {leads.filter(l => l.status === 'NUEVO').length}
                  </span>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-purple-500/30">
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">Desde Asistente IA</span>
                  <span className="text-2xl sm:text-3xl font-black text-purple-300 mt-1 block">
                    {leads.filter(l => l.source === 'AI_ASSISTANT').length}
                  </span>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-emerald-500/30">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Atendidos</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block">
                    {leads.filter(l => l.status === 'ATENDIDO').length}
                  </span>
                </div>
              </div>

              {/* BARRA DE FILTROS */}
              <div className="flex flex-wrap items-center gap-2 bg-slate-950/40 p-3 rounded-2xl border border-slate-800/80">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 px-2">
                  <Filter className="w-3.5 h-3.5" /> Filtrar:
                </span>
                {[
                  { id: 'ALL', label: `Todos (${leads.length})` },
                  { id: 'NUEVO', label: `Nuevos (${leads.filter(l => l.status === 'NUEVO').length})` },
                  { id: 'AI_ASSISTANT', label: `Chatbot IA (${leads.filter(l => l.source === 'AI_ASSISTANT').length})` },
                  { id: 'LANDING_PAGE', label: `Formulario Web (${leads.filter(l => l.source === 'LANDING_PAGE').length})` },
                  { id: 'EN_PROCESO', label: `En Proceso (${leads.filter(l => l.status === 'EN_PROCESO').length})` },
                  { id: 'ATENDIDO', label: `Atendidos (${leads.filter(l => l.status === 'ATENDIDO').length})` },
                ].map(filterBtn => (
                  <button
                    key={filterBtn.id}
                    onClick={() => setLeadFilter(filterBtn.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      leadFilter === filterBtn.id
                        ? 'bg-gradient-to-r from-[#E52E71] to-[#EF4444] text-white shadow-md'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    {filterBtn.label}
                  </button>
                ))}
              </div>

              {/* LISTA DE PROSPECTOS */}
              {(() => {
                const filteredLeads = leads.filter(l => {
                  if (leadFilter === 'ALL') return true;
                  if (leadFilter === 'AI_ASSISTANT') return l.source === 'AI_ASSISTANT';
                  if (leadFilter === 'LANDING_PAGE') return l.source === 'LANDING_PAGE';
                  return l.status === leadFilter;
                });

                if (filteredLeads.length === 0) {
                  return (
                    <div className="bg-slate-950/40 border border-slate-800/80 rounded-3xl p-12 text-center space-y-3">
                      <Inbox className="w-12 h-12 text-slate-600 mx-auto" />
                      <h3 className="text-base font-bold text-slate-300">No hay prospectos en esta categoría</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Los clientes que interactúen con el chatbot o envíen el formulario de cotización aparecerán aquí automáticamente.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {filteredLeads.map(lead => {
                      const isAi = lead.source === 'AI_ASSISTANT';
                      const cleanPhone = lead.phone ? lead.phone.replace(/[^0-9]/g, '') : '';

                      return (
                        <div
                          key={lead.id}
                          className="bg-slate-950/70 border border-slate-800/80 hover:border-slate-700/80 rounded-3xl p-5 sm:p-6 transition-all shadow-xl hover:shadow-2xl space-y-4"
                        >
                          {/* ENCABEZADO DEL LEAD */}
                          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-base shadow-lg ${
                                isAi 
                                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white' 
                                  : 'bg-gradient-to-br from-rose-600 to-amber-600 text-white'
                              }`}>
                                {lead.name ? lead.name.charAt(0).toUpperCase() : 'P'}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-extrabold text-base text-white">{lead.name || 'Prospecto sin nombre'}</h3>
                                  
                                  {/* BADGE DE ORIGEN */}
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
                                    isAi
                                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                  }`}>
                                    {isAi ? <Bot className="w-3 h-3" /> : <Globe2 className="w-3 h-3" />}
                                    <span>{isAi ? 'Chatbot IA IMAS' : 'Formulario Landing'}</span>
                                  </span>
                                </div>
                                
                                {lead.company && (
                                  <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                    <Building2 className="w-3 h-3 text-slate-500" />
                                    <span>{lead.company}</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* SELECTOR DE ESTADO DEL PROSPECTO */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Estado:</span>
                              <select
                                value={lead.status || 'NUEVO'}
                                onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                                className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer transition-colors ${
                                  lead.status === 'NUEVO'
                                    ? 'bg-pink-500/20 text-pink-300 border-pink-500/50 hover:bg-pink-500/30'
                                    : lead.status === 'EN_PROCESO'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30'
                                }`}
                              >
                                <option value="NUEVO" className="bg-slate-900 text-white">🟢 NUEVO</option>
                                <option value="EN_PROCESO" className="bg-slate-900 text-white">🟡 EN PROCESO</option>
                                <option value="ATENDIDO" className="bg-slate-900 text-white">🔵 ATENDIDO</option>
                              </select>
                            </div>
                          </div>

                          {/* DATOS DE CONTACTO Y DETALLE DE LA OPERACIÓN */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Contacto Directo</span>
                              
                              <div className="flex items-center gap-2 text-slate-200">
                                <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                <a href={`mailto:${lead.email}`} className="hover:underline hover:text-pink-400 truncate">
                                  {lead.email}
                                </a>
                              </div>

                              {lead.phone && (
                                <div className="flex items-center gap-2 text-slate-200">
                                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                  <span className="truncate">{lead.phone}</span>
                                  {cleanPhone && (
                                    <a
                                      href={`https://wa.me/${cleanPhone}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="ml-auto bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-lg text-[10px] font-bold hover:bg-emerald-500/30 transition-colors"
                                    >
                                      WhatsApp
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="md:col-span-2 space-y-2 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Requerimiento</span>
                                <span className="text-[11px] font-bold text-[#E52E71] bg-pink-500/10 px-2.5 py-0.5 rounded-full border border-pink-500/20">
                                  {lead.operationType || 'Consulta General'}
                                </span>
                              </div>
                              <p className="text-slate-300 leading-relaxed text-xs whitespace-pre-wrap">
                                {lead.message || 'Sin mensaje adicional proporcionado.'}
                              </p>
                            </div>
                          </div>

                          {/* FOOTER DE LA TARJETA DE PROSPECTO */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60 text-[11px] text-slate-500">
                            <div className="flex items-center gap-4 flex-wrap">
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                                <span>Recibido: {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : 'Reciente'}</span>
                              </span>
                              <span className="text-slate-600 hidden sm:inline">•</span>
                              <span className="text-slate-400">
                                Notificación despachada a: <strong className="text-slate-300 font-mono">{lead.testEmailTarget || 'julioguillen85@gmail.com'}</strong>
                              </span>
                            </div>

                            <button
                              onClick={() => handleDeleteLead(lead.id, lead.name)}
                              className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Eliminar este prospecto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Eliminar</span>
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                );
              })()}

            </div>
          )}

          {/* ========================================================================= */}
          {/* PESTAÑA 1: SERVICIOS PRINCIPALES (PILARES / STACKED) */}
          {/* ========================================================================= */}
          {activeTab === 'main_services' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/60 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-xl">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                    <Layers className="w-6 h-6 text-imas-pink" />
                    <span>Servicios Principales (Pilares Operativos)</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Tarjetas interactivas de gran formato con video asignado para la sección central
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingService({ isMain: true, categoryId: 1 });
                    setServiceModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-imas-pink to-rose-600 hover:from-rose-600 hover:to-imas-pink text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-imas-pink/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Agregar Servicio Principal</span>
                </button>
              </div>

              {mainServices.length === 0 ? (
                <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
                  <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="font-bold">No hay servicios principales registrados aún.</p>
                  <p className="text-xs text-slate-500 mt-1">Agrega uno con el botón superior para mostrarlo en los pilares.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {mainServices.map((service, index) => {
                    const IconComp = ICON_MAP[service.icon] || Warehouse;
                    return (
                      <div
                        key={service.id}
                        className="bg-slate-950/70 border border-slate-800/90 hover:border-imas-pink/40 rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl group"
                      >
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-2xl bg-imas-pink/15 text-imas-pink border border-imas-pink/30 flex items-center justify-center flex-shrink-0">
                            <IconComp className="w-6 h-6" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                                #{index + 1}
                              </span>
                              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-imas-pink/20 text-imas-pink border border-imas-pink/30">
                                Pilar Principal
                              </span>
                              {service.videoUrl && (
                                <span className="text-[10px] font-bold text-sky-400 flex items-center gap-1">
                                  <Video className="w-3 h-3" /> {service.videoUrl}
                                </span>
                              )}
                            </div>

                            <h3 className="text-base sm:text-lg font-black text-white truncate">
                              {service.title}
                            </h3>

                            <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 mt-1">
                              {service.shortDescription || service.fullDescription}
                            </p>
                          </div>
                        </div>

                        {/* VIDEO PREVIEW PEQUEÑO */}
                        {service.videoUrl && (
                          <div className="w-full lg:w-44 h-24 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0 relative">
                            <video
                              src={service.videoUrl}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-slate-950/20" />
                          </div>
                        )}

                        <div className="flex items-center gap-2 flex-shrink-0 w-full lg:w-auto justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                          <button
                            onClick={() => {
                              setEditingService(service);
                              setServiceModalOpen(true);
                            }}
                            className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 border border-amber-500/30 transition-all cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>

                          <button
                            onClick={() => handleDeleteService(service.id, service.title)}
                            className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-rose-500/30 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* PESTAÑA 2: OTROS SERVICIOS (MARQUEE & CATÁLOGO) */}
          {/* ========================================================================= */}
          {activeTab === 'other_services' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/60 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-xl">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                    <Box className="w-6 h-6 text-sky-400" />
                    <span>Otros Servicios (Catálogo / Carrusel)</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Administra los servicios complementarios de puerto, fletes, trámites y almacenaje
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingService({ isMain: false, categoryId: 1 });
                    setServiceModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-blue-600 hover:to-sky-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-sky-500/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Agregar Servicio</span>
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {safeServices.map((service) => {
                  const IconComp = (service && service.icon && ICON_MAP[service.icon]) || Warehouse;
                  return (
                    <div
                      key={service.id}
                      className="bg-slate-950/70 border border-slate-800/90 hover:border-sky-500/40 rounded-3xl p-5 transition-all flex flex-col justify-between shadow-xl"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center justify-center">
                            <IconComp className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                            {service.categoryName || 'General'}
                          </span>
                        </div>

                        <h3 className="text-base font-black text-white mb-1.5">
                          {service.title}
                        </h3>

                        <p className="text-xs text-slate-400 line-clamp-3 mb-4">
                          {service.shortDescription || service.fullDescription}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
                        <span className="text-[11px] text-slate-400 truncate max-w-[130px]">
                          {service.videoUrl ? `🎬 ${service.videoUrl}` : 'Sin video'}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingService(service);
                              setServiceModalOpen(true);
                            }}
                            className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteService(service.id, service.title)}
                            className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-600 text-rose-300 hover:text-white transition-colors cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PESTAÑA 3: QUIÉNES SOMOS (MISIÓN / VISIÓN / OBJETIVOS) */}
          {/* ========================================================================= */}
          {activeTab === 'about_us' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/60 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-xl">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                    <Users className="w-6 h-6 text-amber-400" />
                    <span>Sección Quiénes Somos</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Configura la misión, visión, objetivos estratégicos y textos institucionales
                  </p>
                </div>

                <button
                  onClick={() => handleSaveSettings()}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                {/* 3 PILARES DE ¿QUIÉNES SOMOS? */}
                <div className="space-y-4">
                  <span className="text-xs font-black uppercase text-amber-400 tracking-widest block">
                    🏢 Contenido Oficial: ¿Quiénes Somos?
                  </span>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      1. Servicio Integral (Importación & Exportación)
                    </label>
                    <textarea
                      rows={3}
                      value={settings.about_p1 || ''}
                      onChange={(e) => setSettings({ ...settings, about_p1: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-imas-pink resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      2. Asesoría Legal Especializada
                    </label>
                    <textarea
                      rows={2}
                      value={settings.about_p2 || ''}
                      onChange={(e) => setSettings({ ...settings, about_p2: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-imas-pink resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      3. Socio Comercial Estratégico
                    </label>
                    <textarea
                      rows={2}
                      value={settings.about_p3 || ''}
                      onChange={(e) => setSettings({ ...settings, about_p3: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-imas-pink resize-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                  {/* MISIÓN */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <span className="text-xs font-black uppercase text-imas-pink tracking-widest block">
                      📌 Misión Empresarial
                    </span>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Título</label>
                      <input
                        type="text"
                        value={settings.mission_title || 'MISIÓN'}
                        onChange={(e) => setSettings({ ...settings, mission_title: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-imas-pink"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Descripción</label>
                      <textarea
                        rows={4}
                        value={settings.mission_text || ''}
                        onChange={(e) => setSettings({ ...settings, mission_text: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-imas-pink resize-none"
                      />
                    </div>
                  </div>

                  {/* VISIÓN */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <span className="text-xs font-black uppercase text-sky-400 tracking-widest block">
                      🔭 Visión Estratégica
                    </span>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Título</label>
                      <input
                        type="text"
                        value={settings.vision_title || 'VISIÓN'}
                        onChange={(e) => setSettings({ ...settings, vision_title: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-imas-pink"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Descripción</label>
                      <textarea
                        rows={4}
                        value={settings.vision_text || ''}
                        onChange={(e) => setSettings({ ...settings, vision_text: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-imas-pink resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PESTAÑA 4: VALORES CORPORATIVOS */}
          {/* ========================================================================= */}
          {activeTab === 'values' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/60 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-xl">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                    <HeartHandshake className="w-6 h-6 text-rose-400" />
                    <span>Valores Corporativos</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Edita o añade los pilares éticos y de servicio de IMAS Agencia Aduanal
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingValue(null);
                    setValueFormData({ title: '', description: '', icon: 'ShieldCheck' });
                    setValueModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-rose-500/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Agregar Valor</span>
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {safeValues.map((val) => {
                  const IconComp = (val && val.icon && ICON_MAP[val.icon]) || ShieldCheck;
                  return (
                    <div
                      key={val.id}
                      className="bg-slate-950/70 border border-slate-800/90 hover:border-rose-500/40 rounded-3xl p-5 sm:p-6 transition-all flex flex-col justify-between shadow-xl group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                            <IconComp className="w-6 h-6" />
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingValue(val);
                                setValueFormData({ title: val.title, description: val.description, icon: val.icon || 'ShieldCheck' });
                                setValueModalOpen(true);
                              }}
                              className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 transition-colors cursor-pointer"
                              title="Editar Valor"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteValue(val.id)}
                              className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-600 text-rose-300 hover:text-white transition-colors cursor-pointer"
                              title="Eliminar Valor"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-lg font-black text-white mb-2">
                          {val.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {val.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PESTAÑA 5: VIDEOS DEL HERO */}
          {/* ========================================================================= */}
          {activeTab === 'hero_videos' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/60 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-xl">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                    <Film className="w-6 h-6 text-imas-pink" />
                    <span>Videos del Hero Principal</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Secuencia cinematográfica de videos de portada con títulos, slogans y badges
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingHeroVideo(null);
                    setHeroModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-imas-pink to-rose-600 hover:from-rose-600 hover:to-imas-pink text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-imas-pink/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Agregar Video Hero</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {safeHeroVideos.map((video, idx) => (
                  <div
                    key={video.id || idx}
                    className="bg-slate-950/70 border border-slate-800/90 hover:border-imas-pink/40 rounded-3xl overflow-hidden transition-all shadow-xl flex flex-col justify-between group"
                  >
                    <div className="relative h-48 bg-slate-900 overflow-hidden">
                      <video
                        src={video.videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                      
                      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] font-bold text-white">
                        Orden #{video.displayOrder || idx + 1}
                      </div>

                      {video.badgeText && (
                        <div className="absolute bottom-3 left-3 bg-imas-pink/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider">
                          {video.badgeText}
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                          {video.title}
                        </h3>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {video.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
                        <span className="text-[11px] text-slate-400 font-mono">
                          {video.videoUrl}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingHeroVideo(video);
                              setHeroModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>

                          <button
                            onClick={() => handleDeleteHeroVideo(video.id, video.title)}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PESTAÑA 6: VIDEOS DE SERVICIOS EN CADA SECCIÓN */}
          {/* ========================================================================= */}
          {activeTab === 'service_videos' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/60 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-xl">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                    <Video className="w-6 h-6 text-teal-400" />
                    <span>Videos de Servicios por Sección</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Asigna y previsualiza los videos de demostración para cada servicio y tarjeta
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {safeServices.map((service) => {
                  const videoPath = service.videoUrl || '/videos/agenciav1.mp4';
                  return (
                    <div
                      key={service.id}
                      className="bg-slate-950/70 border border-slate-800/90 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between"
                    >
                      <div className="relative h-36 bg-slate-900">
                        <video
                          src={videoPath}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-3 text-[11px] font-bold text-teal-300">
                          {service.title}
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="text-xs text-slate-400 font-mono truncate">
                          Video: {videoPath}
                        </div>

                        <button
                          onClick={() => {
                            setEditingService(service);
                            setServiceModalOpen(true);
                          }}
                          className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-teal-400" />
                          <span>Cambiar Video de este Servicio</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL SERVICIOS */}
      <AdminServiceModal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        serviceToEdit={editingService}
        token={adminToken}
        onSaveSuccess={() => {
          showNotification('Servicio guardado exitosamente');
          loadData();
        }}
      />

      {/* MODAL HERO VIDEO */}
      <AdminHeroModal
        isOpen={heroModalOpen}
        onClose={() => setHeroModalOpen(false)}
        videoToEdit={editingHeroVideo}
        token={adminToken}
        onSaveSuccess={() => {
          showNotification('Video del Hero guardado exitosamente');
          loadData();
        }}
      />

      {/* MODAL VALORES CORPORATIVOS */}
      {valueModalOpen && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="absolute inset-0 bg-slate-950/80" onClick={() => setValueModalOpen(false)} />

          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-white">
            <h3 className="text-xl font-black text-white mb-4">
              {editingValue ? 'Editar Valor Corporativo' : 'Agregar Nuevo Valor'}
            </h3>

            <form onSubmit={handleSaveValue} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Nombre del Valor *
                </label>
                <input
                  type="text"
                  required
                  value={valueFormData.title}
                  onChange={(e) => setValueFormData({ ...valueFormData, title: e.target.value })}
                  placeholder="Ej. Integridad y Seguridad"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-imas-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Icono *
                </label>
                <select
                  value={valueFormData.icon}
                  onChange={(e) => setValueFormData({ ...valueFormData, icon: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-imas-pink"
                >
                  <option value="ShieldCheck">🛡️ ShieldCheck (Seguridad)</option>
                  <option value="HeartHandshake">🤝 HeartHandshake (Confianza)</option>
                  <option value="Sparkles">✨ Sparkles (Innovación)</option>
                  <option value="Scale">⚖️ Scale (Legalidad / Ética)</option>
                  <option value="Globe2">🌐 Globe2 (Alcance Global)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Descripción del Valor *
                </label>
                <textarea
                  rows={3}
                  required
                  value={valueFormData.description}
                  onChange={(e) => setValueFormData({ ...valueFormData, description: e.target.value })}
                  placeholder="Explica cómo se vive este valor en la empresa..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-imas-pink resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setValueModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-imas-pink to-rose-600 text-white text-xs font-black shadow-lg cursor-pointer"
                >
                  Guardar Valor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
