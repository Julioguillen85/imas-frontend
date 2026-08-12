import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Truck, Anchor, ShieldCheck, FileCheck2, Box, Warehouse, Globe2, Scale, ArrowRight, X, ChevronLeft, ChevronRight, ChevronDown, Send, CheckCircle, Plus, Edit2, Trash2, LayoutGrid, Layers, Tv, Eye } from 'lucide-react';
import AdminServiceModal from './AdminServiceModal';
import { API_BASE_URL } from '../config/api';
import { formatPhoneNumber } from '../utils/phoneFormatter';

const ICON_MAP = {
  Warehouse,
  Anchor,
  FileCheck2,
  Box,
  Truck,
  Globe2,
  Scale
};

const VIEW_MODES = [
  { id: 'completa', label: 'Vista Completa', icon: Tv },
  { id: 'tarjetas', label: 'Tarjetas', icon: LayoutGrid },
  { id: 'galeria', label: 'Galería', icon: Layers },
];

const DEFAULT_SERVICES = [
  {
    id: 1,
    category: 'puerto',
    categoryId: 1,
    icon: 'Warehouse',
    color: '#E52E71',
    title: 'Resguardo de Mercancía',
    shortDescription: 'Almacenaje y custodia segura de tu carga en todo momento.',
    fullDescription: 'Contamos con infraestructura y patios estratégicamente ubicados en Manzanillo para el resguardo, almacenaje y custodia de carga general, sobredimensionada y de alto valor con vigilancia las 24 horas del día.',
    video: '/videos/hero2.mp4',
    cardImage: '/images/cards1.png',
  },
  {
    id: 2,
    category: 'transporte',
    categoryId: 2,
    icon: 'Anchor',
    color: '#38bdf8',
    title: 'Flete Marítimo y Terrestre',
    shortDescription: 'Soluciones multimodales para mover tu carga por mar y tierra.',
    fullDescription: 'Coordinación eficiente de transporte terrestre y multimodal. Conectamos el Puerto de Manzanillo con los principales corredores industriales de México y el mundo con monitoreo GPS en tiempo real.',
    video: '/videos/agenciav2.mp4',
    cardImage: '/images/cards2.png',
  },
  {
    id: 3,
    category: 'tramites',
    categoryId: 3,
    icon: 'FileCheck2',
    color: '#34d399',
    title: 'Trámites Aduanales',
    shortDescription: 'Despacho ágil y apegado a la normativa y regulaciones vigentes.',
    fullDescription: 'Despacho aduanal de importación y exportación apegado 100% a la legislación aduanera vigente. Clasificación arancelaria, cumplimiento de Normas Oficiales Mexicanas (NOMs) y regulación no arancelaria.',
    video: '/videos/agenciav3.mp4',
    cardImage: '/images/cards3.png',
  },
  {
    id: 4,
    category: 'puerto',
    categoryId: 1,
    icon: 'Box',
    color: '#f59e0b',
    title: 'Consolidación y Desconsolidación',
    shortDescription: 'Gestión experta de contenedores y resguardo de mercancía.',
    fullDescription: 'Servicios de vaciado y llenado de contenedores (FCL / LCL), desconsolidación de carga de grupaje, emplayado, etiquetado y clasificación previa para la correcta liberación en aduana.',
    video: '/videos/hero3.mp4',
    cardImage: '/images/cards1.png',
  },
  {
    id: 5,
    category: 'puerto',
    categoryId: 1,
    icon: 'Truck',
    color: '#a855f7',
    title: 'Lavado y Sanitización de Contenedores',
    shortDescription: 'Servicio de limpieza especializado de contenedores en puerto.',
    fullDescription: 'Sanitización y acondicionamiento especializado de unidades de transporte y contenedores según exigencias internacionales y requerimientos de salubridad e inspección aduanera.',
    video: '/videos/hero4.mp4',
    cardImage: '/images/cards2.png',
  },
  {
    id: 6,
    category: 'transporte',
    categoryId: 2,
    icon: 'Globe2',
    color: '#06b6d4',
    title: 'Coordinación con Proveedores',
    shortDescription: 'Gestión y comunicación directa con proveedores desde el origen.',
    fullDescription: 'Enlace directo con tus proveedores extranjeros en China, Asia, Europa y América Latina para asegurar la correcta emisión de documentos (BL, Facturas, Certificados de Origen) antes del arribo al puerto.',
    video: '/videos/agenciav1.mp4',
    cardImage: '/images/cards3.png',
  },
  {
    id: 7,
    category: 'tramites',
    categoryId: 3,
    icon: 'Scale',
    color: '#10b981',
    title: 'Asesoría Legal Aduanera',
    shortDescription: 'Respaldo jurídico especializado ante autoridades y comercio exterior.',
    fullDescription: 'Defensa legal, consultoría en Tratados de Libre Comercio e impugnaciones ante autoridades fiscales y aduaneras.',
    video: '/videos/hero1.mp4',
    cardImage: '/images/cards1.png',
  },
];

export default function MarqueeServices({ adminToken }) {
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [activeCategory, setActiveCategory] = useState('todos');
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'tarjetas';
    }
    return 'completa';
  }); // 'completa' | 'tarjetas' | 'galeria'

  useEffect(() => {
    const checkMobileView = () => {
      if (window.innerWidth < 768) {
        setViewMode('tarjetas');
      }
    };
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [isPaused, setIsPaused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showInfoForm, setShowInfoForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', comments: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Cerrar el menú desplegable al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsViewDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Admin Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);

  const fetchServicesFromAPI = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/public/services`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const formatted = data.map((s, idx) => {
            let catStr = 'puerto';
            if (s.categoryId === 2) catStr = 'transporte';
            if (s.categoryId === 3) catStr = 'tramites';

            const videos = ['/videos/hero2.mp4', '/videos/agenciav2.mp4', '/videos/agenciav3.mp4', '/videos/hero3.mp4', '/videos/hero4.mp4', '/videos/agenciav1.mp4', '/videos/hero1.mp4'];
            const colors = ['#E52E71', '#38bdf8', '#34d399', '#f59e0b', '#a855f7', '#06b6d4', '#10b981'];

            return {
              id: s.id,
              category: catStr,
              categoryId: s.categoryId || 1,
              icon: s.icon || 'Warehouse',
              color: colors[idx % colors.length],
              title: s.title,
              shortDescription: s.shortDescription,
              fullDescription: s.fullDescription || s.shortDescription,
              longDescription: s.fullDescription || s.shortDescription,
              video: videos[idx % videos.length],
              cardImage: '/images/cards1.png',
              features: s.features,
            };
          });
          setServices(formatted);
        }
      }
    } catch (err) {
      console.log('Usando servicios locales por defecto');
    }
  };

  useEffect(() => {
    fetchServicesFromAPI();
  }, []);

  const handleDeleteService = async (serviceId, serviceTitle) => {
    if (!window.confirm(`¿Estás seguro de eliminar el servicio "${serviceTitle}"?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });
      if (response.ok) {
        fetchServicesFromAPI();
      } else {
        alert('Error al eliminar el servicio');
      }
    } catch (err) {
      alert('Error de conexión con el servidor');
    }
  };

  const filteredServices = activeCategory === 'todos'
    ? services
    : services.filter((s) => s.category === activeCategory || (activeCategory === 'puerto' && s.categoryId === 1) || (activeCategory === 'transporte' && s.categoryId === 2) || (activeCategory === 'tramites' && s.categoryId === 3));

  const safeIndex = currentHeroIndex % (filteredServices.length || 1);
  const activeService = filteredServices[safeIndex] || filteredServices[0] || DEFAULT_SERVICES[0];
  const IconComponent = ICON_MAP[activeService.icon] || Warehouse;

  const handlePrevHero = () => {
    setCurrentHeroIndex((prev) => (prev === 0 ? filteredServices.length - 1 : prev - 1));
  };

  const handleNextHero = () => {
    setCurrentHeroIndex((prev) => (prev + 1) % (filteredServices.length || 1));
  };

  useEffect(() => {
    if (isPaused || selectedIndex !== null || showInfoForm || isModalOpen) return;
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % (filteredServices.length || 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [filteredServices.length, isPaused, selectedIndex, showInfoForm, isModalOpen]);

  const selectedService = selectedIndex !== null ? services[selectedIndex] : null;
  const SelectedIcon = selectedService ? (ICON_MAP[selectedService.icon] || Warehouse) : Warehouse;

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : services.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < services.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    if (selectedIndex !== null || showInfoForm || isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedIndex, showInfoForm, isModalOpen]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/public/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          operationType: selectedService ? selectedService.title : 'Otros Servicios',
          message: formData.comments,
          source: 'SERVICIOS_FORM'
        })
      });

      if (response.ok) {
        setFormSubmitted(true);
        setTimeout(() => {
          setFormSubmitted(false);
          setShowInfoForm(false);
          setFormData({ name: '', email: '', phone: '', comments: '' });
        }, 2500);
      } else {
        console.error('Error al registrar la solicitud');
      }
    } catch (err) {
      console.error('Error enviando la solicitud:', err);
    }
  };

  return (
    <section className="relative z-10 bg-transparent pt-16 pb-14 border-t border-slate-900/80 overflow-hidden" id="servicios">
      
      {/* TÍTULO Y CABECERA DEL SECTOR SERVICIOS */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-6">
        <span className="inline-flex items-center gap-2 text-imas-pink font-extrabold text-xs uppercase tracking-widest bg-imas-pink/10 px-4 py-1.5 rounded-full border border-imas-pink/20 mb-4">
          <span className="w-2 h-2 rounded-full bg-imas-pink animate-pulse" />
          <span>Soluciones Integrales</span>
        </span>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
          Nuestros Servicios
        </h2>

        <p className="text-slate-300 text-sm sm:text-base md:text-lg mt-4 max-w-2xl mx-auto font-medium leading-relaxed">
          Explora nuestros servicios por categoría con avance automático o interactivo.
        </p>

        {/* BOTÓN DE VISTA INTEGRADO EN EL HEADER DE SERVICIOS */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
              className="px-5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-imas-pink/50 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2.5 shadow-xl backdrop-blur-xl transition-all cursor-pointer group"
            >
              <Eye className="w-4 h-4 text-imas-pink group-hover:scale-110 transition-transform" />
              <span className="text-slate-400 font-bold">Vista:</span>
              <span className="text-white font-black">{VIEW_MODES.find(v => v.id === viewMode)?.label}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isViewDropdownOpen ? 'rotate-180 text-imas-pink' : ''}`} />
            </button>

            {isViewDropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-52 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-2xl py-2 z-50 animate-fadeIn">
                {VIEW_MODES.map((v) => {
                  const ViewIcon = v.icon;
                  const isActive = viewMode === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setViewMode(v.id);
                        setIsViewDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-imas-pink/20 to-rose-500/10 text-imas-pink border-l-4 border-imas-pink'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ViewIcon className={`w-4 h-4 ${isActive ? 'text-imas-pink' : 'text-slate-400'}`} />
                        <span>{v.label}</span>
                      </div>
                      {isActive && <CheckCircle className="w-3.5 h-3.5 text-imas-pink" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* SI EL USUARIO ESTÁ LOGEADO COMO ADMIN: MOSTRAR BOTÓN AGREGAR SERVICIO */}
        {adminToken && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => {
                setServiceToEdit(null);
                setIsModalOpen(true);
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-xl shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer border border-emerald-400/40"
            >
              <Plus className="w-5 h-5" />
              <span>+ Agregar Nuevo Servicio (BD)</span>
            </button>
          </div>
        )}
      </div>

      {/* FILTROS DE CATEGORÍA CENTRADOS */}
      <div className="max-w-4xl mx-auto px-6 mb-8 flex justify-center">
        <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-900/70 p-2 rounded-2xl border border-slate-800/80 backdrop-blur-xl shadow-xl">
          {[
            { id: 'todos', label: 'Todos los Servicios' },
            { id: 'puerto', label: '📦 Almacén & Puerto' },
            { id: 'transporte', label: '🚢 Fletes & Transporte' },
            { id: 'tramites', label: '📄 Trámites & Legales' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setCurrentHeroIndex(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-[#E52E71] to-[#EF4444] text-white shadow-lg shadow-imas-pink/30 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* VISTA 1: VISTA COMPLETA (MINI-HERO CAROUSEL) */}
      {viewMode === 'completa' && (
        <div
          className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative animate-fadeIn"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <button
            onClick={handlePrevHero}
            className="absolute -left-2 sm:left-2 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-900/90 hover:bg-imas-pink text-white border border-slate-700/80 hover:border-white/50 flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-110 cursor-pointer z-30 group backdrop-blur-xl"
            title="Servicio Anterior"
          >
            <ChevronLeft className="w-7 h-7 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={handleNextHero}
            className="absolute -right-2 sm:right-2 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-900/90 hover:bg-imas-pink text-white border border-slate-700/80 hover:border-white/50 flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-110 cursor-pointer z-30 group backdrop-blur-xl"
            title="Siguiente Servicio"
          >
            <ChevronRight className="w-7 h-7 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <div
            key={activeService.id}
            className="relative min-h-[420px] sm:min-h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 flex flex-col justify-between transition-all duration-500 animate-fadeIn"
          >
            <div className="absolute inset-0 z-0 overflow-hidden">
              <video
                key={activeService.id}
                src={activeService.video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover object-center brightness-110 contrast-100 scale-100 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/60 to-slate-950/20 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20 z-10" />
              
              <div
                className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none z-10"
                style={{ background: activeService.color }}
              />
            </div>

            <div className="relative z-20 p-8 sm:p-12 md:p-14 max-w-3xl flex-1 flex flex-col justify-center">
              
              <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xl backdrop-blur-md"
                    style={{
                      background: `${activeService.color}25`,
                      color: activeService.color,
                      borderColor: `${activeService.color}50`
                    }}
                  >
                    <IconComponent className="w-6 h-6" strokeWidth={2.2} />
                  </div>

                  <span
                    className="text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border backdrop-blur-md"
                    style={{
                      color: activeService.color,
                      background: `${activeService.color}20`,
                      borderColor: `${activeService.color}40`
                    }}
                  >
                    Servicio {safeIndex + 1} / {filteredServices.length}
                  </span>
                </div>

                {/* BOTONES DE EDICIÓN Y ELIMINACIÓN PARA ADMIN */}
                {adminToken && (
                  <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700/80 shadow-2xl backdrop-blur-md">
                    <button
                      onClick={() => {
                        setServiceToEdit(activeService);
                        setIsModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-amber-500/40"
                      title="Editar Servicio"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => handleDeleteService(activeService.id, activeService.title)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-rose-500/40"
                      title="Eliminar Servicio"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                )}
              </div>

              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
                {activeService.title}
              </h3>

              <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-normal mb-8 max-w-2xl">
                {activeService.fullDescription || activeService.shortDescription}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    const globalIdx = services.findIndex(s => s.id === activeService.id);
                    setSelectedIndex(globalIdx >= 0 ? globalIdx : 0);
                    setShowInfoForm(true);
                  }}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#E52E71] to-[#EF4444] hover:from-[#C2185B] hover:to-[#DC2626] text-white font-extrabold text-sm sm:text-base transition-all shadow-xl shadow-imas-pink/30 flex items-center gap-2 hover:scale-105 cursor-pointer"
                >
                  <span>Solicitar Información</span>
                  <Send className="w-4.5 h-4.5" />
                </button>

                <button
                  onClick={() => {
                    const globalIdx = services.findIndex(s => s.id === activeService.id);
                    setSelectedIndex(globalIdx >= 0 ? globalIdx : 0);
                  }}
                  className="px-7 py-3.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm sm:text-base backdrop-blur-md transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
                >
                  <span>Ver detalles completos</span>
                  <ArrowRight className="w-4.5 h-4.5 text-imas-pink" />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* VISTA 2: EN TARJETAS (GRID RESPONSIVO) */}
      {viewMode === 'tarjetas' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {filteredServices.map((service) => {
            const IconComp = ICON_MAP[service.icon] || Warehouse;
            const globalIdx = services.findIndex(s => s.id === service.id);
            return (
              <div
                key={service.id}
                className="relative rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800/80 hover:border-imas-pink/50 transition-all duration-300 hover:-translate-y-1.5 shadow-2xl flex flex-col justify-between group"
              >
                <div className="relative h-52 overflow-hidden bg-slate-950">
                  <video
                    src={service.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  
                  <div
                    className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center border shadow-md backdrop-blur-md"
                    style={{
                      background: `${service.color}25`,
                      color: service.color,
                      borderColor: `${service.color}50`
                    }}
                  >
                    <IconComp className="w-5 h-5" strokeWidth={2.2} />
                  </div>

                  {adminToken && (
                    <div className="absolute top-4 right-4 flex gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-700 backdrop-blur-md">
                      <button
                        onClick={() => { setServiceToEdit(service); setIsModalOpen(true); }}
                        className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                        title="Editar Servicio"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id, service.title)}
                        className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors"
                        title="Eliminar Servicio"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white mb-2 group-hover:text-imas-pink transition-colors leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal mb-5 line-clamp-3">
                      {service.shortDescription || service.fullDescription}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-slate-800/80">
                    <button
                      onClick={() => {
                        setSelectedIndex(globalIdx >= 0 ? globalIdx : 0);
                        setShowInfoForm(true);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#E52E71] to-[#EF4444] hover:from-[#C2185B] hover:to-[#DC2626] text-white font-extrabold text-xs transition-all shadow-lg shadow-imas-pink/20 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Solicitar</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setSelectedIndex(globalIdx >= 0 ? globalIdx : 0)}
                      className="py-2.5 px-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center justify-center cursor-pointer border border-slate-700/80"
                      title="Ver detalles completos"
                    >
                      <ArrowRight className="w-4 h-4 text-imas-pink" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VISTA 3: GALERÍA (AUTO SCROLL CONTINUO DE TARJETAS SIN SCROLLBAR) */}
      {viewMode === 'galeria' && (
        <div className="w-full overflow-hidden relative py-4 animate-fadeIn">
          {/* Sombras suaves en bordes lateral para efecto infinito visual */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-950 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-950 to-transparent z-20 pointer-events-none" />

          <div className="flex gap-6 animate-marquee w-max py-2 hover:[animation-play-state:paused]">
            {[...filteredServices, ...filteredServices, ...filteredServices].map((service, index) => {
              const IconComp = ICON_MAP[service.icon] || Warehouse;
              const globalIdx = services.findIndex(s => s.id === service.id);
              return (
                <div
                  key={`${service.id}-${index}`}
                  className="w-[290px] sm:w-[340px] flex-shrink-0 rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800/80 hover:border-imas-pink/50 transition-all duration-300 hover:-translate-y-1.5 shadow-2xl flex flex-col justify-between group"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <video
                      src={service.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                    
                    <div
                      className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center border shadow-md backdrop-blur-md"
                      style={{
                        background: `${service.color}25`,
                        color: service.color,
                        borderColor: `${service.color}50`
                      }}
                    >
                      <IconComp className="w-5 h-5" strokeWidth={2.2} />
                    </div>

                    {adminToken && (
                      <div className="absolute top-4 right-4 flex gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-700 backdrop-blur-md">
                        <button
                          onClick={() => { setServiceToEdit(service); setIsModalOpen(true); }}
                          className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                          title="Editar Servicio"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id, service.title)}
                          className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors"
                          title="Eliminar Servicio"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white mb-2 group-hover:text-imas-pink transition-colors leading-tight">
                        {service.title}
                      </h3>
                      <p className="text-slate-300 text-xs leading-relaxed font-normal mb-5 line-clamp-3">
                        {service.shortDescription || service.fullDescription}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-slate-800/80">
                      <button
                        onClick={() => {
                          setSelectedIndex(globalIdx >= 0 ? globalIdx : 0);
                          setShowInfoForm(true);
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#E52E71] to-[#EF4444] hover:from-[#C2185B] hover:to-[#DC2626] text-white font-extrabold text-xs transition-all shadow-lg shadow-imas-pink/20 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Solicitar</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setSelectedIndex(globalIdx >= 0 ? globalIdx : 0)}
                        className="py-2.5 px-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center justify-center cursor-pointer border border-slate-700/80"
                        title="Ver detalles completos"
                      >
                        <ArrowRight className="w-4 h-4 text-imas-pink" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL DETALLADO DE SERVICIO */}
      {selectedService && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-2xl animate-fadeIn">
          <div
            className="absolute inset-0 bg-slate-950/90"
            onClick={() => setSelectedIndex(null)}
          />

          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-imas-pink hover:bg-rose-600 text-white border border-white/30 flex items-center justify-center transition-all shadow-2xl hover:scale-110 cursor-pointer z-30 group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-imas-pink hover:bg-rose-600 text-white border border-white/30 flex items-center justify-center transition-all shadow-2xl hover:scale-110 cursor-pointer z-30 group"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <div className="relative w-full max-w-xl bg-imas-pink border border-rose-400/50 rounded-3xl overflow-hidden shadow-2xl shadow-imas-pink/40 p-6 sm:p-8 z-10">
            <div className="absolute top-5 left-6 bg-white/20 border border-white/30 text-xs font-black text-white px-3 py-1 rounded-full">
              {selectedIndex + 1} / {services.length}
            </div>

            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-imas-pink flex items-center justify-center transition-colors shadow-lg z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-6 mt-6 border border-white/30 bg-slate-950">
              <img
                src={selectedService.cardImage || '/images/cards1.png'}
                alt={selectedService.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/30 bg-white/20 text-white">
                <SelectedIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-white/90">
                Servicio Especializado IMAS
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
              {selectedService.title}
            </h3>

            <p className="text-white/95 text-sm sm:text-base leading-relaxed mb-6 font-semibold">
              {selectedService.fullDescription || selectedService.shortDescription}
            </p>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/30">
              <button
                onClick={() => setSelectedIndex(null)}
                className="px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-extrabold transition-colors cursor-pointer"
              >
                Cerrar
              </button>

              <button
                onClick={() => setShowInfoForm(true)}
                className="px-6 py-2.5 rounded-xl bg-white text-imas-pink hover:bg-slate-100 text-sm font-black transition-colors shadow-xl flex items-center gap-2 cursor-pointer"
              >
                <span>Solicitar Información</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* FORMULARIO DE SOLICITAR INFORMACIÓN */}
      {showInfoForm && createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-2xl animate-fadeIn">
          <div
            className="absolute inset-0 bg-slate-950/90"
            onClick={() => setShowInfoForm(false)}
          />

          <div className="relative w-full max-w-lg bg-imas-pink border border-rose-400/50 rounded-3xl overflow-hidden shadow-2xl shadow-imas-pink/40 p-6 sm:p-8 z-10">
            <button
              onClick={() => setShowInfoForm(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-imas-pink flex items-center justify-center transition-colors shadow-lg z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {formSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-white/20 text-white rounded-full flex items-center justify-center mx-auto mb-4 border border-white/40 shadow-lg">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">¡Solicitud Enviada!</h3>
                <p className="text-white/95 text-sm max-w-sm mx-auto leading-relaxed font-semibold">
                  Gracias por tu interés en <strong className="text-white underline">{selectedService?.title}</strong>. Un ejecutivo de IMAS se pondrá en contacto contigo en breve.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <span className="text-xs font-black uppercase tracking-widest text-white/90 block mb-1">
                    Solicitud Directa
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Solicitar Información
                  </h3>
                  {selectedService && (
                    <p className="text-white/95 text-xs sm:text-sm mt-1 font-semibold">
                      Servicio: <strong className="text-white underline">{selectedService.title}</strong>
                    </p>
                  )}
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-white uppercase tracking-wider mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej. Juan Pérez"
                      className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/60 focus:outline-none focus:bg-white/30 focus:border-white transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-white uppercase tracking-wider mb-1">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="correo@empresa.com"
                        className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/60 focus:outline-none focus:bg-white/30 focus:border-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-white uppercase tracking-wider mb-1">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })}
                        placeholder="+52 (314) 000 0000"
                        className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/60 focus:outline-none focus:bg-white/30 focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-white uppercase tracking-wider mb-1">
                      Comentarios o Dudas
                    </label>
                    <textarea
                      rows={3}
                      value={formData.comments}
                      onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                      placeholder="Indica el tipo de mercancía o cualquier duda..."
                      className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/60 focus:outline-none focus:bg-white/30 focus:border-white transition-colors resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/30">
                    <button
                      type="button"
                      onClick={() => setShowInfoForm(false)}
                      className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-extrabold transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-white text-imas-pink hover:bg-slate-100 text-sm font-black transition-colors shadow-xl flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Enviar Solicitud</span>
                    </button>
                  </div>
                </form>
              </>
            )}

          </div>
        </div>,
        document.body
      )}

      {/* MODAL CREAR / EDITAR SERVICIO (ADMIN) */}
      <AdminServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceToEdit={serviceToEdit}
        token={adminToken}
        onSaveSuccess={() => {
          fetchServicesFromAPI();
        }}
      />

    </section>
  );
}
