import React, { useState, useEffect, useRef } from 'react';
import { Target, Eye, Award, CheckCircle2 } from 'lucide-react';

const OBJECTIVE_ITEMS = [
  {
    id: 1,
    icon: Target,
    title: 'Misión',
    text: 'Brindar asesoría y soluciones integrales en la cadena logística y gestión aduanal, con atención personalizada, siempre apegados a la legalidad. Optimizando tiempos y costos para potenciar el comercio de nuestros clientes.',
    accent: '#E52E71'
  },
  {
    id: 2,
    icon: Eye,
    title: 'Visión',
    text: 'Consolidarnos como una agencia aduanal líder, destacando por nuestro compromiso con la legalidad y satisfacción de nuestros clientes.',
    accent: '#38bdf8'
  },
  {
    id: 3,
    icon: Award,
    title: 'Valores',
    bullets: [
      'Compromiso',
      'Responsabilidad',
      'Puntualidad',
      'Calidad',
      'Proactividad'
    ],
    accent: '#34d399'
  }
];

function ObjectiveCard({ item, idx, isVisible }) {
  const Icon = item.icon;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2); // -1 to 1
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2); // -1 to 1
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  const initialRotations = ['-rotate-3', 'rotate-0', 'rotate-3'];
  const rotClass = initialRotations[idx % initialRotations.length];

  // Desplazamiento reactivo del ícono al mover el mouse
  const iconTransform = isHovered
    ? `translate3d(${mousePos.x * 24}px, ${mousePos.y * 24}px, 0) scale(1.22) rotate(${mousePos.x * 10}deg)`
    : 'translate3d(0, 0, 0) scale(1) rotate(0deg)';

  // Desplazamiento del resplandor de fondo
  const glowTransform = isHovered
    ? `translate3d(${mousePos.x * 35}px, ${mousePos.y * 35}px, 0)`
    : 'translate3d(0, 0, 0)';

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transitionDelay: isVisible ? `${idx * 160}ms` : '0ms'
      }}
      className={`group relative bg-slate-900/50 border border-slate-800/80 hover:border-imas-pink/60 hover:bg-slate-900/80 rounded-3xl p-6 sm:p-10 backdrop-blur-md transition-all duration-700 ease-out flex flex-col justify-between overflow-hidden cursor-pointer ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 rotate-0 hover:-translate-y-3 hover:shadow-2xl hover:shadow-imas-pink/25'
          : `opacity-0 translate-y-24 scale-80 ${rotClass}`
      }`}
    >
      {/* Resplandor interactivo seguidor de cursor */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(350px circle at ${50 + mousePos.x * 30}% ${50 + mousePos.y * 30}%, ${item.accent}25, transparent 70%)`,
          transform: glowTransform
        }}
      />

      <div className="relative z-10">
        {/* CONTENEDOR DEL ÍCONO — MÁS GRANDE, DINÁMICO Y INTERACTIVO AL MOVER EL MOUSE */}
        <div className="relative mb-6 sm:mb-8 inline-block">
          {/* Halo sutil de fondo iluminado */}
          <div
            className="absolute -inset-3 rounded-3xl opacity-0 group-hover:opacity-70 transition-all duration-300 blur-lg pointer-events-none"
            style={{
              background: item.accent,
              transform: iconTransform
            }}
          />

          {/* Ícono Principal */}
          <div
            className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl flex items-center justify-center transition-transform duration-200 ease-out shadow-2xl relative z-10"
            style={{
              background: `linear-gradient(135deg, ${item.accent}30, ${item.accent}08)`,
              color: item.accent,
              border: `1.5px solid ${item.accent}50`,
              boxShadow: isHovered ? `0 20px 40px -10px ${item.accent}50` : 'none',
              transform: iconTransform
            }}
          >
            <Icon className="w-8 h-8 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
          </div>
        </div>

        {/* Título de tarjeta */}
        <h3 className="text-xl sm:text-3xl font-black text-white mb-3 sm:mb-4 tracking-tight group-hover:text-imas-pink transition-colors">
          {item.title}
        </h3>

        {/* Texto explicativo o Lista de Viñetas */}
        {item.bullets ? (
          <ul className="space-y-2 my-2">
            {item.bullets.map((bullet, bIdx) => (
              <li
                key={bIdx}
                className="flex items-center gap-2.5 text-slate-200 text-xs sm:text-base font-semibold transition-all duration-300 group-hover:translate-x-1"
              >
                <div
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${item.accent}20`,
                    border: `1px solid ${item.accent}60`,
                    color: item.accent
                  }}
                >
                  <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-300 text-xs sm:text-base leading-relaxed font-normal">
            {item.text}
          </p>
        )}
      </div>

      {/* Línea inferior indicadora reactiva */}
      <div
        className="w-full h-1.5 rounded-full mt-6 sm:mt-8 transition-all duration-500 opacity-30 group-hover:opacity-100 group-hover:scale-105"
        style={{
          background: `linear-gradient(90deg, ${item.accent}, ${item.accent}80)`,
          boxShadow: isHovered ? `0 0 15px ${item.accent}` : 'none'
        }}
      />
    </div>
  );
}

export default function SecurityGrid() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="objetivos" className="relative z-10 bg-transparent py-14 sm:py-24 border-t border-slate-900/80 overflow-hidden">
      
      {/* Glow de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-imas-pink/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* CABECERA DE SECCIÓN CON TÍTULO 'Nuestros Objetivos' */}
        <div className={`text-center max-w-3xl mx-auto mb-10 sm:mb-16 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-imas-pink/10 border border-imas-pink/20 text-imas-pink text-[11px] sm:text-xs font-extrabold uppercase tracking-wider mb-3 sm:mb-4">
            <span className="w-2 h-2 rounded-full bg-imas-pink animate-pulse" />
            <span>IMAS AGENCIA ADUANAL</span>
          </div>

          <h2 className="text-2xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Nuestros Objetivos
          </h2>
        </div>

        {/* GRID DE 3 TARJETAS INTERACTIVAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          {OBJECTIVE_ITEMS.map((item, idx) => (
            <ObjectiveCard
              key={item.id}
              item={item}
              idx={idx}
              isVisible={isVisible}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
