import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2, Edit2, Target, ShieldCheck, Compass } from 'lucide-react';
import AdminContentModal from './AdminContentModal';
import { API_BASE_URL } from '../config/api';

export default function FixedFeatures({ adminToken }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [settings, setSettings] = useState({
    about_p1: 'Somos una Agencia Aduanal que ofrece un servicio integral para tus proyectos de importación y exportación, transformándolos en operaciones exitosas, apegadas a la legalidad, mediante un proceso ágil con atención personalizada.',
    about_p2: 'Ofrecemos asesoría legal especializada que respalda cada operación y gestión ante la autoridad.',
    about_p3: 'Nuestro compromiso es ser un socio comercial estratégico que impulsa el crecimiento de nuestros clientes.',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef(null);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/public/settings`);
      if (response.ok) {
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      }
    } catch (err) {
      console.log('Usando valores por defecto para Quiénes Somos');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const features = [
    {
      id: 1,
      badge: 'Servicio Integral',
      title: 'Operaciones Exitosas y Ágiles',
      text: settings.about_p1 || 'Somos una Agencia Aduanal que ofrece un servicio integral para tus proyectos de importación y exportación, transformándolos en operaciones exitosas, apegadas a la legalidad, mediante un proceso ágil con atención personalizada.',
      linkText: 'Conoce nuestros servicios',
      href: '#servicios',
      image: '/images/agencia4.png',
      alt: 'Equipo profesional de IMAS'
    },
    {
      id: 2,
      badge: 'Respaldo Jurídico',
      title: 'Asesoría Legal Especializada',
      text: settings.about_p2 || 'Ofrecemos asesoría legal especializada que respalda cada operación y gestión ante la autoridad.',
      linkText: 'Consulta con un especialista',
      href: '#contacto',
      image: '/images/agencia5.webp',
      alt: 'Gestión y respaldo legal especializado'
    },
    {
      id: 3,
      badge: 'Alianza de Crecimiento',
      title: 'Socio Comercial Estratégico',
      text: settings.about_p3 || 'Nuestro compromiso es ser un socio comercial estratégico que impulsa el crecimiento de nuestros clientes.',
      linkText: 'Cotizar Operación',
      href: '#contacto',
      image: '/images/agencia6.jpg',
      alt: 'Crecimiento y redes de logística global de IMAS'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;

      if (totalScrollableDistance <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / totalScrollableDistance, 0), 1);

      if (progress < 0.35) {
        setActiveIndex(0);
      } else if (progress < 0.68) {
        setActiveIndex(1);
      } else {
        setActiveIndex(2);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="nosotros" ref={containerRef} className="relative z-10 h-[240vh] bg-transparent border-t border-slate-900/80">
      <div className="sticky top-20 sm:top-24 py-4 sm:py-8 w-full flex items-center">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-imas-pink/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          
          <div className="max-w-3xl mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-imas-pink/10 border border-imas-pink/20 text-imas-pink text-xs font-extrabold uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-imas-pink" />
                <span>IMAS Agencia Aduanal</span>
              </div>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-2">
                ¿Quiénes Somos?
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm md:text-base font-medium leading-relaxed max-w-2xl">
                Somos una Agencia Aduanal que ofrece un servicio integral para tus proyectos de importación y exportación, transformándolos en operaciones exitosas, apegadas a la legalidad, mediante un proceso ágil con atención personalizada.
              </p>
            </div>

            {/* BOTÓN ADMIN EDITAR QUIÉNES SOMOS */}
            {adminToken && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-xs flex items-center gap-2 border border-amber-500/40 transition-all cursor-pointer shadow-lg"
              >
                <Edit2 className="w-4 h-4" />
                <span>Editar Quiénes Somos</span>
              </button>
            )}
          </div>

          <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            <div className="lg:col-span-6 relative min-h-[260px] sm:min-h-[320px] flex items-center">
              {features.map((feat, index) => {
                const isActive = activeIndex === index;
                const isPast = activeIndex > index;

                let transformStyle = 'translate-y-16 opacity-0 pointer-events-none';
                if (isActive) {
                  transformStyle = 'translate-y-0 opacity-100 pointer-events-auto z-20';
                } else if (isPast) {
                  transformStyle = '-translate-y-16 opacity-0 pointer-events-none z-0';
                }

                return (
                  <div
                    key={feat.id}
                    className={`absolute inset-x-0 transition-all duration-700 ease-in-out ${transformStyle}`}
                  >
                    <div className="p-2 sm:p-4 border-l-4 border-l-imas-pink pl-4 sm:pl-6">
                      <span className="text-xs font-bold uppercase tracking-widest text-imas-pink block mb-2">
                        {feat.badge}
                      </span>

                      <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-3 leading-tight tracking-tight">
                        {feat.title}
                      </h3>

                      <div className="h-1 w-16 bg-gradient-to-r from-imas-pink to-rose-500 rounded-full mb-4" />

                      {feat.bullets ? (
                        <ul className="space-y-2 mb-6 max-w-xl">
                          {feat.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-center gap-2.5 text-slate-200 text-sm sm:text-base font-semibold">
                              <span className="w-2 h-2 rounded-full bg-imas-pink flex-shrink-0 shadow-sm shadow-imas-pink" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-300 text-xs sm:text-base leading-relaxed mb-6 font-normal max-w-xl">
                          {feat.text}
                        </p>
                      )}

                      <a
                        href={feat.href}
                        className="inline-flex items-center gap-3 text-sm font-bold text-imas-pink hover:text-white transition-colors group"
                      >
                        <span className="border-b border-imas-pink/40 group-hover:border-white transition-colors">
                          {feat.linkText}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:bg-imas-pink group-hover:border-imas-pink group-hover:text-white transition-all shadow-md">
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </a>

                    </div>
                  </div>
                );
              })}

              <div className="absolute -bottom-8 left-6 flex items-center gap-2">
                {features.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      activeIndex === idx ? 'w-8 bg-imas-pink' : 'w-2 bg-slate-800 hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="w-full lg:col-span-6 mt-4 lg:mt-0">
              <div className="relative w-full h-[240px] sm:h-[300px] md:h-[360px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl shadow-black/90">
                {features.map((feat, index) => {
                  const isActive = activeIndex === index;

                  return (
                    <div
                      key={feat.id}
                      className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
                        isActive
                          ? 'opacity-100 scale-100 z-10'
                          : 'opacity-0 scale-95 z-0 pointer-events-none'
                      }`}
                    >
                      <img
                        src={feat.image}
                        alt={feat.alt}
                        loading="lazy"
                        className="w-full h-full object-cover object-center"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 backdrop-blur-md bg-slate-950/80 p-3 sm:p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between shadow-2xl z-20">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-imas-pink block mb-0.5">
                            {feat.badge}
                          </span>
                          <p className="text-white text-xs sm:text-sm font-bold leading-tight">
                            {feat.title}
                          </p>
                        </div>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-imas-pink/20 border border-imas-pink/40 text-imas-pink flex items-center justify-center flex-shrink-0 ml-3">
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* MODAL ADMIN PARA MISIÓN Y VISIÓN */}
      <AdminContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialSettings={settings}
        token={adminToken}
        onSaveSuccess={fetchSettings}
      />
    </section>
  );
}
