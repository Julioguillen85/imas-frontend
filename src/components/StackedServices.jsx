import React from 'react';
import { FileCheck2, Anchor, Truck, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const DEFAULT_CARDS = [
  {
    id: 1,
    label: 'Agencia Aduanal y Logística',
    icon: FileCheck2,
    accent: '#E52E71',
    accentBg: 'rgba(229,46,113,0.12)',
    bg: '#0f172a',
    title: 'Agencia Aduanal y Logística',
    description:
      'Brindamos asesoría y consultoría, gestionamos todos los trámites aduanales, garantizamos el manejo seguro y eficiente en tu cadena logística mediante nuestro amplio conocimiento en comercio exterior.',
    features: [
      'Despacho y liberación de mercancías',
      'Clasificación arancelaria y NOMs',
      'Padrón de importadores',
      'Asesoría en comercio exterior',
    ],
    cta: 'Explorar servicios aduanales',
    topOffset: '80px',
    rotate: '0deg',
    zIndex: 10,
    video: '/videos/agenciav1.mp4',
    alt: 'Agencia Aduanal y Logística IMAS'
  },
  {
    id: 2,
    label: 'Proyectos Portuarios',
    icon: Anchor,
    accent: '#38bdf8',
    accentBg: 'rgba(56,189,248,0.12)',
    bg: '#0c1a2e',
    title: 'Proyectos Portuarios',
    description:
      'Coordinamos el movimiento de mercancías dentro y fuera de puerto, almacenaje, etiquetado de carga general, peligrosa y especializada.',
    features: [
      'Consolidación y desconsolidación',
      'Resguardo y almacenaje en terminal',
      'Maniobras en Puerto de Manzanillo',
      'Manejo de carga peligrosa y especial',
    ],
    cta: 'Ver proyectos portuarios',
    topOffset: '100px',
    rotate: '-0.5deg',
    zIndex: 20,
    video: '/videos/hero2.mp4',
    alt: 'Proyectos Portuarios y maniobras en Manzanillo'
  },
  {
    id: 3,
    label: 'Transporte y Seguridad',
    icon: Truck,
    accent: '#34d399',
    accentBg: 'rgba(52,211,153,0.12)',
    bg: '#091a14',
    title: 'Transporte y Seguridad',
    description:
      'Ofrecemos soluciones de transporte y seguro para que tu mercancía llegue a salvo desde su origen hasta su destino, optimizando tiempos y costos.',
    features: [
      'Fletes terrestres multimodales',
      'Seguro de carga internacional',
      'Monitoreo en tiempo real',
      'Optimización de rutas y costos',
    ],
    cta: 'Ver soluciones de transporte',
    topOffset: '120px',
    rotate: '0.5deg',
    zIndex: 30,
    video: '/videos/hero3.mp4',
    alt: 'Transporte y seguridad de carga IMAS'
  },
];

const ICON_LOOKUP = {
  FileCheck2,
  Anchor,
  Truck,
  Warehouse: FileCheck2,
  Box: Anchor,
  Globe2: Truck,
  Scale: FileCheck2,
  ShieldCheck: FileCheck2,
  HeartHandshake: Anchor,
  Sparkles: Truck
};

export default function StackedServices({ adminToken }) {
  const [cards, setCards] = React.useState(DEFAULT_CARDS);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/public/services`)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          const mainList = data.filter(s => s.isMain || s.categoryId === 1 || s.id <= 3);
          if (mainList.length > 0) {
            const mapped = mainList.slice(0, 3).map((item, idx) => {
              const base = DEFAULT_CARDS[idx] || DEFAULT_CARDS[0];
              let parsedFeatures = base.features;
              if (Array.isArray(item.features)) {
                parsedFeatures = item.features;
              } else if (typeof item.features === 'string' && item.features.trim()) {
                try {
                  const jsonParsed = JSON.parse(item.features);
                  parsedFeatures = Array.isArray(jsonParsed) ? jsonParsed : item.features.split(',').map(s => s.trim());
                } catch {
                  parsedFeatures = item.features.split(',').map(s => s.trim());
                }
              }

              const resolvedIcon = typeof item.icon === 'function'
                ? item.icon
                : (ICON_LOOKUP[item.icon] || base.icon || FileCheck2);

              return {
                ...base,
                id: item.id || base.id,
                title: item.title || base.title,
                label: item.title || base.label,
                description: item.shortDescription || item.fullDescription || base.description,
                features: parsedFeatures && parsedFeatures.length > 0 ? parsedFeatures : base.features,
                video: item.videoUrl || base.video,
                icon: resolvedIcon
              };
            });
            setCards(mapped);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Force play mobile service videos on user touch or scroll
  React.useEffect(() => {
    const playAllServiceVideos = () => {
      const videos = document.querySelectorAll('#servicios video');
      videos.forEach((vid) => {
        vid.defaultMuted = true;
        vid.muted = true;
        vid.playsInline = true;
        vid.play().catch(() => {});
      });
    };

    playAllServiceVideos();

    window.addEventListener('touchstart', playAllServiceVideos, { passive: true });
    window.addEventListener('pointerdown', playAllServiceVideos, { passive: true });
    window.addEventListener('scroll', playAllServiceVideos, { passive: true });

    return () => {
      window.removeEventListener('touchstart', playAllServiceVideos);
      window.removeEventListener('pointerdown', playAllServiceVideos);
      window.removeEventListener('scroll', playAllServiceVideos);
    };
  }, [cards]);

  return (
    <section id="servicios" className="relative z-10 bg-transparent py-12">
      {/* Header fijo de la sección */}
      <div className="sticky top-20 z-0 py-6 px-6 text-center pointer-events-none select-none max-w-2xl mx-auto">
        <div>
          <span className="inline-block text-imas-pink font-extrabold text-xs uppercase tracking-widest bg-imas-pink/10 px-3.5 py-1.5 rounded-full border border-imas-pink/20 mb-3">
            Cobertura Operativa
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Nuestros Servicios
          </h2>
        </div>
      </div>

      {/* Contenedor de las tarjetas apiladas */}
      <div className="relative" style={{ paddingBottom: '10vh' }}>
        {cards.map((card, index) => {
          const Icon = typeof card.icon === 'function' ? card.icon : (ICON_LOOKUP[card.icon] || FileCheck2);
          return (
            <div
              key={card.id}
              className="sticky px-3 sm:px-6"
              style={{
                top: card.topOffset,
                zIndex: card.zIndex,
                marginBottom: index < cards.length - 1 ? '0' : '0',
              }}
            >
              <div
                className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 group backdrop-blur-xl"
                style={{
                  background: card.bg,
                  transform: `rotate(${card.rotate})`,
                  transition: 'transform 0.3s ease',
                  willChange: 'transform',
                }}
              >
                <div className="grid md:grid-cols-2 gap-0 min-h-0 md:min-h-[500px]">
                  {/* Columna izquierda — contenido */}
                  <div className="p-6 sm:p-12 flex flex-col justify-between relative z-10">
                    {/* Top */}
                    <div>
                      <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
                        <div
                          className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 border"
                          style={{
                            background: card.accentBg,
                            color: card.accent,
                            borderColor: `${card.accent}33`,
                          }}
                        >
                          <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
                        </div>
                        <span
                          className="text-[11px] sm:text-sm font-bold uppercase tracking-widest px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border truncate"
                          style={{
                            color: card.accent,
                            background: card.accentBg,
                            borderColor: `${card.accent}33`,
                          }}
                        >
                          {card.label}
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-3 sm:mb-4">
                        {card.title}
                      </h3>
                      <p className="text-slate-200 text-xs sm:text-base leading-relaxed mb-6 sm:mb-8 font-normal">
                        {card.description}
                      </p>

                      {/* Lista de características */}
                      <ul className="space-y-2 sm:space-y-3">
                        {card.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-base text-slate-100 font-medium">
                            <span
                              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0"
                              style={{ background: card.accent }}
                            />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <a
                      href="#contacto"
                      className="group/btn inline-flex items-center gap-2.5 sm:gap-3 mt-6 sm:mt-8 text-xs sm:text-base font-bold transition-colors w-fit"
                      style={{ color: card.accent }}
                    >
                      <span>{card.cta}</span>
                      <div
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-transform group-hover/btn:translate-x-1"
                        style={{ background: card.accentBg }}
                      >
                        <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </div>
                    </a>
                  </div>

                  {/* Columna derecha — VIDEO DE FONDO DINÁMICO (hero1, hero2, hero3) */}
                  <div className="relative h-[220px] md:h-auto md:min-h-full overflow-hidden border-t md:border-t-0 md:border-l border-slate-800/60 bg-slate-950">
                    <video
                      src={card.video}
                      autoPlay
                      loop
                      muted
                      defaultMuted
                      playsInline
                      preload="auto"
                      onCanPlay={(e) => e.target.play().catch(() => {})}
                      onLoadedData={(e) => e.target.play().catch(() => {})}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Overlay degradado sutil de color para integración con la tarjeta */}
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                    {/* Card flotante inferior sobre el video */}
                    <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 backdrop-blur-md bg-slate-950/80 p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-white/10 flex items-center gap-3 shadow-xl">
                      <div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border"
                        style={{
                          background: card.accentBg,
                          color: card.accent,
                          borderColor: `${card.accent}33`
                        }}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-400 block truncate">
                          IMAS Agencia Aduanal • Servicios
                        </span>
                        <p className="text-white text-xs sm:text-sm font-bold leading-tight truncate">
                          {card.title}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
