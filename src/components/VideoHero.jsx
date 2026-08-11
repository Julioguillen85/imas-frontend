import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Bot, Plus, Edit2, Trash2 } from 'lucide-react';
import AdminHeroModal from './AdminHeroModal';
import { API_BASE_URL } from '../config/api';

const DEFAULT_HERO_VIDEOS = [
  { id: 1, title: 'Maniobras y Logística de Carga en Manzanillo', subtitle: 'Despacho aduanal y gestión logística integral en el puerto más importante de México', videoUrl: '/videos/hero1.mp4', badgeText: 'Operación Logística en Vivo' },
  { id: 2, title: 'Despacho Aduanal & Comercio Exterior', subtitle: 'Agilidad, cumplimiento normativo y asesoría especializada para tus operaciones', videoUrl: '/videos/hero2.mp4', badgeText: 'Cumplimiento SAT & NOMs' },
  { id: 3, title: 'Transporte Terrestre y Multimodal Seguro', subtitle: 'Conectividad nacional e internacional con monitoreo GPS 24/7 de tu carga', videoUrl: '/videos/hero3.mp4', badgeText: 'Rastreo GPS en Tiempo Real' },
  { id: 4, title: 'Almacenaje, Custodia y Sanitización de Contenedores', subtitle: 'Infraestructura propia y patios de resguardo estratégicos en Puerto de Manzanillo', videoUrl: '/videos/hero4.mp4', badgeText: 'Custodia 24/7 en Manzanillo' },
];

export default function VideoHero({ onOpenChat, adminToken }) {
  const [heroVideos, setHeroVideos] = useState(DEFAULT_HERO_VIDEOS);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  // Admin Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState(null);

  const fetchHeroVideos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/public/hero`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setHeroVideos(data);
        }
      }
    } catch (err) {
      console.log('Usando videos por defecto para Hero');
    }
  };

  useEffect(() => {
    fetchHeroVideos();
  }, []);

  const safeIndex = currentVideoIndex % (heroVideos.length || 1);
  const currentVideo = heroVideos[safeIndex] || heroVideos[0] || DEFAULT_HERO_VIDEOS[0];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [safeIndex, heroVideos]);

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % (heroVideos.length || 1));
  };

  const handleDeleteVideo = async (id, title) => {
    if (!window.confirm(`¿Estás seguro de eliminar el video "${title}"?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/hero/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });
      if (response.ok) {
        fetchHeroVideos();
      } else {
        alert('Error al eliminar video');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  return (
    <section id="inicio" className="relative z-30 w-full min-h-screen h-[100dvh] flex items-center justify-center overflow-hidden bg-slate-950">
      
      {/* 1. BACKGROUND VIDEO EXCLUSIVO / MULTI-VIDEO HERO */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          key={currentVideo.videoUrl}
          ref={videoRef}
          autoPlay
          muted={isMuted}
          playsInline
          onEnded={nextVideo}
          className="w-full h-full object-cover scale-100 transition-opacity duration-700 brightness-105 contrast-105"
        >
          <source src={currentVideo.videoUrl} type="video/mp4" />
        </video>

        {/* OVERLAY LIGERO SEMI-TRANSPARENTE */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-brightness-95 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50 z-10 pointer-events-none" />
      </div>

      {/* 2. CONTENIDO CENTRADO CON LOGO OFICIAL Y CINTA SLOGAN */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 pt-16 pb-12 text-center flex flex-col items-center justify-center">
        
        {/* Sub-badge superior */}
        <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-700/80 backdrop-blur-md text-white text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-4 shadow-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-imas-pink animate-pulse" />
          <span>{currentVideo.badgeText || 'Soluciones Integrales en Comercio Exterior'}</span>
        </div>

        {/* LOGO OFICIAL IMAS */}
        <div className="relative mb-4 select-none flex flex-col items-center">
          <img
            src="/images/logo1.png"
            alt="IMAS Agencia Aduanal"
            className="h-28 sm:h-36 md:h-44 lg:h-52 w-auto object-contain mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* CINTA / LISTÓN ROSA FLAMENCO CON TÍTULO DINÁMICO */}
        <div className="my-3 sm:my-4 max-w-2xl sm:max-w-3xl w-full">
          <div className="bg-gradient-to-r from-[#E52E71] via-[#EF4444] to-[#E52E71] px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-xl sm:rounded-full shadow-xl shadow-imas-pink/30 border border-pink-400/40 inline-block transform hover:scale-[1.01] transition-all">
            <span className="font-sans font-extrabold text-lg sm:text-2xl md:text-3xl text-white tracking-tight block leading-tight drop-shadow-md">
              {currentVideo.title || '¡Transporta tu cadena logística a otro nivel!'}
            </span>
          </div>
        </div>

        {/* Descripción explicativa / Subtítulo dinámico */}
        <p className="text-white/90 text-sm sm:text-lg max-w-2xl font-medium leading-relaxed mb-6 logo-text-shadow">
          {currentVideo.subtitle || 'Despacho aduanal, fletes internacionales y logística portuaria desde Manzanillo con atención 100% personalizada.'}
        </p>

        {/* BOTONES DE ACCIÓN Y CONTROLES ADMIN */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a 
            href="#contacto" 
            className="inline-flex items-center justify-center bg-white text-slate-900 hover:bg-slate-100 font-extrabold px-7 py-3.5 rounded-full transition-all shadow-xl text-base sm:text-lg group border border-white/80"
          >
            Cotizar Operación
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform text-imas-pink" />
          </a>

          <button
            onClick={onOpenChat}
            className="inline-flex items-center justify-center bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-bold px-7 py-3.5 rounded-full backdrop-blur-xl transition-all text-base sm:text-lg gap-2.5 shadow-xl group"
          >
            <Bot className="w-5 h-5 text-imas-pink group-hover:rotate-12 transition-transform" />
            <span>Chatea con nuestra IA</span>
          </button>
        </div>

        {/* CONTROLES ADMIN PARA EL HERO VIDEO (SI ESTÁ CONECTADO) */}
        {adminToken && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 bg-slate-900/90 p-2.5 rounded-2xl border border-amber-500/40 shadow-2xl backdrop-blur-md">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider px-2">
              ⚙️ Admin Hero:
            </span>
            <button
              onClick={() => {
                setVideoToEdit(null);
                setIsModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-emerald-500/40"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Agregar Video</span>
            </button>
            <button
              onClick={() => {
                setVideoToEdit(currentVideo);
                setIsModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-amber-500/40"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Editar Este Video</span>
            </button>
            <button
              onClick={() => handleDeleteVideo(currentVideo.id, currentVideo.title)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-rose-500/40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar Video</span>
            </button>
          </div>
        )}

      </div>

      {/* MODAL CREAR/EDITAR HERO VIDEO */}
      <AdminHeroModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoToEdit={videoToEdit}
        token={adminToken}
        onSaveSuccess={fetchHeroVideos}
      />

    </section>
  );
}
