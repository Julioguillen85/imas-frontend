import React, { useState, useEffect } from 'react';
import {
  Bot, ArrowRight, ShieldCheck, Zap, Scale, TrendingUp,
  FileCheck2, Anchor, Truck, Sparkles, Check, ChevronRight,
  MapPin, Mail, Phone, MessageSquareCode, X, Send, Globe2, Lock, LogOut, ShieldAlert, Menu
} from 'lucide-react';
import VideoHero from './components/VideoHero';
import MarqueeServices from './components/MarqueeServices';
import StackedServices from './components/StackedServices';
import FixedFeatures from './components/FixedFeatures';
import SecurityGrid from './components/SecurityGrid';
import Footer from './components/Footer';
import LogisticsCanvas from './components/LogisticsCanvas';
import AdminLoginModal from './components/AdminLoginModal';
import AdminDashboard from './components/AdminDashboard';
import AiChatAssistant from './components/AiChatAssistant';
import ContactQuoteModal from './components/ContactQuoteModal';

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Path Routing State (para gestionar /admin de forma limpia)
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  // Admin Auth & View State
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken') || null);
  const [adminUser, setAdminUser] = useState(() => localStorage.getItem('adminUser') || null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminToken(null);
    setAdminUser(null);
    navigateTo('/');
  };

  const handleLoginSuccess = (token) => {
    setAdminToken(token);
    const user = localStorage.getItem('adminUser') || 'admin';
    setAdminUser(user);
    navigateTo('/admin');
  };

  const isAdminRoute = currentPath === '/admin' || currentPath.startsWith('/admin');

  // =========================================================================
  // 1. RUTA EXCLUSIVA: /admin
  // =========================================================================
  if (isAdminRoute) {
    // Si ya está autenticado, mostramos el Admin Dashboard
    if (adminToken) {
      return (
        <AdminDashboard
          adminToken={adminToken}
          adminUser={adminUser}
          onLogout={handleLogout}
          onBackToSite={() => navigateTo('/')}
        />
      );
    }

    // Si NO está autenticado, mostramos la pantalla de login dedicada de /admin
    return (
      <div className="min-h-screen bg-[#0d0208] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-imas-pink selection:text-white">
        <div className="fixed inset-0 bg-gradient-to-br from-[#E52E71]/20 via-[#2d0716]/90 to-[#14030a] pointer-events-none z-0" />
        <LogisticsCanvas />
        <AdminLoginModal
          isOpen={true}
          onClose={() => navigateTo('/')}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  // =========================================================================
  // 2. RUTA PÚBLICA (LANDING PAGE COMERCIAL)
  // =========================================================================
  return (
    <div className="bg-[#090206] text-slate-100 font-sans antialiased min-h-screen selection:bg-imas-pink selection:text-white relative">

      {/* AMBIENTE NEGRO / ROSA OBSCURO ELEGANTE DE FONDO */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#E52E71]/10 via-[#12020a]/95 to-[#050103] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-imas-pink/8 via-transparent to-transparent pointer-events-none z-0 blur-3xl" />

      {/* LIENZO INTERACTIVO DE RED NEURONAL LOGÍSTICA CON RATÓN */}
      <LogisticsCanvas />

      {/* BARRA SUPERIOR DE ESTADO ADMIN (SOLO VISIBLE SI YA TIENE SESIÓN INICIADA) */}
      {adminToken && (
        <div className="bg-gradient-to-r from-amber-500 via-rose-600 to-imas-pink py-2 px-6 text-white text-xs font-black flex items-center justify-between shadow-lg sticky top-0 z-[60]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>MODO ADMINISTRADOR ACTIVO — Usuario: <strong>{adminUser}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('/admin')}
              className="bg-slate-950/70 hover:bg-slate-950 px-3.5 py-1 rounded-full text-white text-[11px] font-bold transition-all cursor-pointer border border-white/40 shadow-sm"
            >
              ⚙️ Abrir Panel Admin
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-slate-950/40 hover:bg-slate-950 px-3 py-1 rounded-full text-white text-[11px] transition-all cursor-pointer border border-white/30"
            >
              <LogOut className="w-3 h-3" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. HEADER — Rosa flamenco con transparencia al bajar */}
      <header
        className={`sticky ${adminToken ? 'top-8' : 'top-0'} z-50 transition-all duration-300 w-full overflow-hidden`}
        style={{
          background: scrolled
            ? 'rgba(229,46,113,0.85)'
            : 'rgba(229,46,113,1)',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          boxShadow: scrolled
            ? '0 4px 30px rgba(229,46,113,0.25)'
            : '0 4px 20px rgba(229,46,113,0.35)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.12)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* LOGO OFICIAL */}
          <a href="#inicio" className="flex items-center group flex-shrink-0">
            <img
              src="/images/logo1.png"
              alt="IMAS Agencia Aduanal"
              className="h-8 sm:h-12 w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
            />
          </a>

          {/* NAVEGACIÓN DESKTOP */}
          <nav className="hidden lg:flex items-center gap-1.5 font-bold text-slate-950 text-sm bg-slate-950/15 p-1.5 rounded-full border border-white/20 shadow-inner backdrop-blur-md">
            {[
              { name: 'Inicio', href: '#inicio' },
              { name: 'Nosotros', href: '#nosotros' },
              { name: 'Objetivos', href: '#objetivos' },
              { name: 'Servicios', href: '#servicios' },
              { name: 'Contacto', href: '#contacto' },
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="relative px-4.5 py-2 rounded-full text-slate-950 hover:text-white font-extrabold transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 group overflow-hidden"
              >
                <span className="relative z-10">{item.name}</span>
                <span className="absolute inset-0 bg-slate-950 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full z-0 shadow-lg shadow-black/30" />
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#E52E71] group-hover:w-3/5 transition-all duration-300 z-10 rounded-full" />
              </a>
            ))}
          </nav>

          {/* ACCIONES HEADER */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Botón Cotizar Rápido */}
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="bg-white hover:bg-slate-100 text-[#E52E71] text-xs sm:text-sm font-extrabold px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-full transition-all shadow-md flex items-center gap-1 cursor-pointer"
            >
              <span>Cotizar</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>

            {/* Botón IA */}
            <button
              onClick={() => setChatOpen(true)}
              className="bg-slate-950 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full transition-all shadow-lg shadow-black/30 flex items-center gap-1.5 group cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-imas-pink group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Chatea con IA</span>
              <span className="sm:hidden">IA</span>
            </button>

            {/* REDES SOCIALES DESKTOP */}
            <div className="hidden xl:flex items-center gap-2 bg-slate-950/20 backdrop-blur-md pl-3.5 pr-1.5 py-1.5 rounded-full border border-white/20 shadow-inner">
              <span className="text-xs font-extrabold text-slate-950 uppercase tracking-wider">
                Contáctanos:
              </span>
              <div className="flex items-center gap-1.5">
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-slate-950 text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                <a
                  href="https://wa.me/523141053428?text=Hola%20IMAS%20Agencia%20Aduanal,%20deseo%20más%20información"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-8 h-8 rounded-full bg-slate-950 text-white hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.301-.15-1.785-.881-2.062-.982-.276-.101-.477-.15-.677.15-.199.301-.775.982-.95 1.183-.175.201-.351.226-.652.075-1.723-.86-2.861-1.529-4.004-3.489-.302-.519.302-.482.864-1.606.099-.201.049-.376-.025-.526-.075-.15-.677-1.631-.928-2.233-.244-.585-.494-.506-.677-.516-.174-.008-.375-.01-.576-.01-.2 0-.526.075-.802.376-.276.301-1.052 1.028-1.052 2.508 0 1.48 1.077 2.909 1.227 3.11 0.15.201 2.119 3.237 5.135 4.54 2.138.924 2.977.94 4.02.787.671-.099 1.785-.729 2.036-1.432.251-.703.251-1.304.176-1.432-.076-.127-.276-.227-.577-.377z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* HAMBURGER MENU BUTTON PARA MÓVIL */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden bg-slate-950 hover:bg-slate-900 text-white p-2 rounded-full border border-white/20 shadow-md flex items-center justify-center transition-all cursor-pointer"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-imas-pink" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>

        {/* DRAWER DESPLEGABLE MÓVIL */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#14030a]/95 backdrop-blur-2xl border-b border-imas-pink/30 px-4 py-5 flex flex-col gap-3 shadow-2xl animate-in slide-in-from-top-4 duration-300">
            <nav className="flex flex-col gap-1.5">
              {[
                { name: 'Inicio', href: '#inicio' },
                { name: 'Nosotros', href: '#nosotros' },
                { name: 'Objetivos', href: '#objetivos' },
                { name: 'Servicios', href: '#servicios' },
                { name: 'Contacto', href: '#contacto' },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl text-white font-extrabold text-sm bg-slate-900/60 border border-slate-800/80 active:bg-imas-pink/20 transition-all"
                >
                  <span>{item.name}</span>
                  <ChevronRight className="w-4 h-4 text-imas-pink" />
                </a>
              ))}
            </nav>

            <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setQuoteModalOpen(true);
                }}
                className="w-full bg-white text-[#E52E71] font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Cotizar Operación</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setChatOpen(true);
                }}
                className="w-full bg-slate-900 text-white font-bold text-xs py-3 rounded-xl border border-imas-pink/50 flex items-center justify-center gap-2 shadow-lg"
              >
                <Bot className="w-4 h-4 text-imas-pink" />
                <span>Chatea con nuestra IA</span>
              </button>

              <div className="flex items-center justify-center gap-3 pt-1">
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-slate-300 font-bold bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-800"
                >
                  <span>Instagram</span>
                </a>
                <a
                  href="https://wa.me/523141053428?text=Hola%20IMAS%20Agencia%20Aduanal,%20deseo%20más%20información"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-800"
                >
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO CON VIDEO DE FONDO Y CONTROLES CRUD ADMIN */}
      <VideoHero onOpenChat={() => setChatOpen(true)} adminToken={adminToken} />

      {/* 3. NUESTROS SERVICIOS — TARJETAS APILADAS (PILARES) */}
      <StackedServices adminToken={adminToken} />

      {/* 4. MARQUEE CONTINUO DE SERVICIOS CON GESTIÓN BD ADMIN */}
      <MarqueeServices adminToken={adminToken} />

      {/* 5. FUNCIONALIDADES INTERNACIONALES (MISIÓN / VISIÓN) CON EDIT ADMIN */}
      <FixedFeatures adminToken={adminToken} />

      {/* 6. SEGURIDAD & CONFIANZA */}
      <SecurityGrid />

      {/* 7. FOOTER ROSA FLAMENCO CON EDIT ADMIN Y FORMULARIO */}
      <Footer 
        adminToken={adminToken} 
        onOpenQuote={() => setQuoteModalOpen(true)}
      />



      {/* MODAL COTIZACIÓN / CONTACTO DIRECTO */}
      <ContactQuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />

      {/* 8. ASISTENTE DE IA FLOTANTE INTERACTIVO */}
      <AiChatAssistant
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />

      {/* BOTÓN FLOTANTE INFERIOR DERECHO CON BURBUJA DE TEXTO ARRIBA */}
      {!chatOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end animate-in fade-in slide-in-from-bottom-3 duration-300">
          
          {/* BURBUJA DE TEXTO SUPERIOR (SPEECH BUBBLE) */}
          <button
            onClick={() => setChatOpen(true)}
            className="mb-2 bg-slate-950/95 hover:bg-slate-900 text-white px-3.5 py-2 rounded-2xl rounded-br-xs border border-pink-500/40 shadow-xl shadow-black/40 backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-105 group text-left flex items-center gap-2.5 max-w-[220px]"
          >
            <div className="relative flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="text-[11px] leading-tight">
              <span className="font-extrabold text-white block group-hover:text-imas-pink transition-colors">
                Chatea con IMAS IA
              </span>
              <span className="text-[9.5px] text-slate-400 font-medium">
                Asesoría y cotización 💬
              </span>
            </div>
          </button>

          {/* BOTÓN CIRCULAR COMPACTO DEL ASISTENTE */}
          <div className="relative group">
            <button
              onClick={() => setChatOpen(true)}
              aria-label="Abrir Asistente IA IMAS"
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#E52E71] via-[#EA3875] to-[#EF4444] hover:from-[#C2185B] hover:to-[#DC2626] text-white shadow-2xl shadow-pink-500/40 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center border-2 border-white/40 cursor-pointer relative z-10"
            >
              <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:rotate-12 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full"></span>
            </button>

            {/* Efecto de resplandor / aura de fondo */}
            <div className="absolute inset-0 rounded-full bg-pink-500/30 blur-md group-hover:blur-lg transition-all pointer-events-none -z-0" />
          </div>

        </div>
      )}

    </div>
  );
}