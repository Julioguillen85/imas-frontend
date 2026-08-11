import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Edit2, Warehouse, Anchor, FileCheck2, Box, Truck, Globe2, Scale } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const ICON_OPTIONS = [
  { id: 'Warehouse', label: 'Warehouse (Almacén)', icon: Warehouse },
  { id: 'Anchor', label: 'Anchor (Flete/Puerto)', icon: Anchor },
  { id: 'FileCheck2', label: 'FileCheck2 (Trámites)', icon: FileCheck2 },
  { id: 'Box', label: 'Box (Contenedor)', icon: Box },
  { id: 'Truck', label: 'Truck (Transporte/Lavado)', icon: Truck },
  { id: 'Globe2', label: 'Globe2 (Internacional)', icon: Globe2 },
  { id: 'Scale', label: 'Scale (Legal/Asesoría)', icon: Scale },
];

export default function AdminServiceModal({ isOpen, onClose, serviceToEdit, onSaveSuccess, token }) {
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [icon, setIcon] = useState('Warehouse');
  const [videoUrl, setVideoUrl] = useState('/videos/agenciav1.mp4');
  const [isMain, setIsMain] = useState(false);
  const [categoryId, setCategoryId] = useState(1);
  const [displayOrder, setDisplayOrder] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (serviceToEdit) {
      setTitle(serviceToEdit.title || '');
      setShortDescription(serviceToEdit.shortDescription || '');
      setFullDescription(serviceToEdit.fullDescription || '');
      setFeatures(
        Array.isArray(serviceToEdit.features)
          ? serviceToEdit.features.join(', ')
          : (typeof serviceToEdit.features === 'string' ? serviceToEdit.features : '')
      );
      setIcon(serviceToEdit.icon || 'Warehouse');
      setVideoUrl(serviceToEdit.videoUrl || serviceToEdit.video || '/videos/agenciav1.mp4');
      setIsMain(Boolean(serviceToEdit.isMain));
      setCategoryId(serviceToEdit.categoryId || 1);
      setDisplayOrder(serviceToEdit.displayOrder || 1);
    } else {
      setTitle('');
      setShortDescription('');
      setFullDescription('');
      setFeatures('');
      setIcon('Warehouse');
      setVideoUrl('/videos/agenciav1.mp4');
      setIsMain(false);
      setCategoryId(1);
      setDisplayOrder(1);
    }
  }, [serviceToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Transform features text into JSON array string
    const featuresList = features
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0);
    const featuresJson = JSON.stringify(featuresList);

    const payload = {
      title,
      shortDescription,
      fullDescription,
      features: featuresJson,
      icon,
      videoUrl,
      isMain,
      categoryId: Number(categoryId),
      isActive: true,
      displayOrder: Number(displayOrder),
    };

    const isEdit = Boolean(serviceToEdit?.id);
    const url = isEdit
      ? `${API_BASE_URL}/api/v1/admin/services/${serviceToEdit.id}`
      : `${API_BASE_URL}/api/v1/admin/services`;

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
        throw new Error(`Error en el servidor (${response.status})`);
      }

      onSaveSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el servicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div
        className="absolute inset-0 bg-slate-950/80"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-white max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-imas-pink/20 text-imas-pink rounded-2xl flex items-center justify-center border border-imas-pink/30">
            {serviceToEdit ? <Edit2 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">
              {serviceToEdit ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              {serviceToEdit ? 'Modifica los datos del servicio seleccionado' : 'Ingresa la información para añadir un servicio a la landing'}
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
              Título del Servicio *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Resguardo y Almacenaje de Mercancía"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-imas-pink"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Categoría *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-imas-pink"
              >
                <option value={1}>📦 Almacén & Puerto</option>
                <option value={2}>🚢 Fletes & Transporte</option>
                <option value={3}>📄 Trámites & Legales</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Icono *
              </label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-imas-pink"
              >
                {ICON_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Video Asignado al Servicio *
              </label>
              <select
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-imas-pink"
              >
                <option value="/videos/agenciav1.mp4">🎬 /videos/agenciav1.mp4 (Despacho Aduanal)</option>
                <option value="/videos/agenciav2.mp4">🎬 /videos/agenciav2.mp4 (Fletes y Tráfico)</option>
                <option value="/videos/agenciav3.mp4">🎬 /videos/agenciav3.mp4 (Inspección y Normas)</option>
                <option value="/videos/hero1.mp4">🎬 /videos/hero1.mp4 (Operación Portuaria)</option>
                <option value="/videos/hero2.mp4">🎬 /videos/hero2.mp4 (Maniobras Manzanillo)</option>
                <option value="/videos/hero3.mp4">🎬 /videos/hero3.mp4 (Transporte y Carga)</option>
                <option value="/videos/hero4.mp4">🎬 /videos/hero4.mp4 (Almacén y Contenedores)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Orden de Visualización
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-imas-pink"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <input
              type="checkbox"
              id="isMainService"
              checked={isMain}
              onChange={(e) => setIsMain(e.target.checked)}
              className="w-4 h-4 rounded text-imas-pink focus:ring-imas-pink accent-imas-pink cursor-pointer"
            />
            <label htmlFor="isMainService" className="text-xs sm:text-sm font-bold text-white cursor-pointer select-none">
              ⭐ Destacar como Servicio Principal (Sección Pilares / StackedServices)
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Descripción Corta *
            </label>
            <input
              type="text"
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Ej. Almacenaje y custodia segura de tu carga..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-imas-pink"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Descripción Completa
            </label>
            <textarea
              rows={3}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Detalla la infraestructura, cobertura o beneficios del servicio..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-imas-pink resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Características / Puntos Clave (separados por coma)
            </label>
            <input
              type="text"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="Ej. Vigilancia 24/7, Monitoreo GPS, Patios estratégicos"
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
                  <span>{serviceToEdit ? 'Guardar Cambios' : 'Crear Servicio'}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
