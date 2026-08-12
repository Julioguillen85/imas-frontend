import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Edit2, Video, Trash2, Film } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export default function AdminHeroModal({ isOpen, onClose, videoToEdit, onSaveSuccess, token }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('/videos/hero1.mp4');
  const [mobileVideoUrl, setMobileVideoUrl] = useState('/videos/hero1.mp4');
  const [badgeText, setBadgeText] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (videoToEdit) {
      setTitle(videoToEdit.title || '');
      setSubtitle(videoToEdit.subtitle || '');
      setVideoUrl(videoToEdit.videoUrl || '/videos/hero1.mp4');
      setMobileVideoUrl(videoToEdit.mobileVideoUrl || videoToEdit.videoUrl || '/videos/hero1.mp4');
      setBadgeText(videoToEdit.badgeText || '');
      setDisplayOrder(videoToEdit.displayOrder || 1);
    } else {
      setTitle('');
      setSubtitle('');
      setVideoUrl('/videos/hero1.mp4');
      setMobileVideoUrl('/videos/hero1.mp4');
      setBadgeText('Operación Logística');
      setDisplayOrder(1);
    }
  }, [videoToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      title,
      subtitle,
      videoUrl,
      mobileVideoUrl,
      badgeText,
      displayOrder: Number(displayOrder),
      isActive: true,
    };

    const isEdit = Boolean(videoToEdit?.id);
    const url = isEdit
      ? `${API_BASE_URL}/api/v1/admin/hero/${videoToEdit.id}`
      : `${API_BASE_URL}/api/v1/admin/hero`;

    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error al guardar video (${response.status})`);
      }

      onSaveSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0 bg-slate-950/80" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-imas-pink/20 text-imas-pink rounded-2xl flex items-center justify-center border border-imas-pink/30">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">
              {videoToEdit ? 'Editar Video de Hero' : 'Agregar Nuevo Video Hero'}
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              Administra la secuencia de videos para Web y Celular Móvil
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Título Principal del Video *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Maniobras y Logística de Carga en Manzanillo"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-imas-pink"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Subtítulo / Slogan
            </label>
            <textarea
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ej. Despacho aduanal y gestión logística integral..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-imas-pink resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Video Web (Escritorio) *
              </label>
              <select
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-imas-pink"
              >
                <option value="/videos/hero1.mp4">🎬 /videos/hero1.mp4</option>
                <option value="/videos/hero2.mp4">🎬 /videos/hero2.mp4</option>
                <option value="/videos/hero3.mp4">🎬 /videos/hero3.mp4</option>
                <option value="/videos/hero4.mp4">🎬 /videos/hero4.mp4</option>
                <option value="/videos/agenciav1.mp4">🎬 /videos/agenciav1.mp4</option>
                <option value="/videos/agenciav2.mp4">🎬 /videos/agenciav2.mp4</option>
                <option value="/videos/agenciav3.mp4">🎬 /videos/agenciav3.mp4</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Video Móvil (Celular) *
              </label>
              <select
                value={mobileVideoUrl}
                onChange={(e) => setMobileVideoUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-imas-pink"
              >
                <option value="/videos/hero1.mp4">📱 /videos/hero1.mp4</option>
                <option value="/videos/hero2.mp4">📱 /videos/hero2.mp4</option>
                <option value="/videos/hero3.mp4">📱 /videos/hero3.mp4</option>
                <option value="/videos/hero4.mp4">📱 /videos/hero4.mp4</option>
                <option value="/videos/agenciav1.mp4">📱 /videos/agenciav1.mp4</option>
                <option value="/videos/agenciav2.mp4">📱 /videos/agenciav2.mp4</option>
                <option value="/videos/agenciav3.mp4">📱 /videos/agenciav3.mp4</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Etiqueta / Badge Text
            </label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="Ej. Operación Logística"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-imas-pink"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-imas-pink to-rose-600 hover:from-rose-600 hover:to-imas-pink text-white font-extrabold text-sm transition-all shadow-lg shadow-imas-pink/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{videoToEdit ? 'Guardar Cambios' : 'Agregar Video'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
