import React, { useState, useEffect } from 'react';
import { X, Save, Edit3 } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export default function AdminContentModal({ isOpen, onClose, initialSettings, onSaveSuccess, token }) {
  const [aboutP1, setAboutP1] = useState('');
  const [aboutP2, setAboutP2] = useState('');
  const [aboutP3, setAboutP3] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialSettings) {
      setAboutP1(initialSettings.about_p1 || 'Somos una Agencia Aduanal que ofrece un servicio integral para tus proyectos de importación y exportación, transformándolos en operaciones exitosas, apegadas a la legalidad, mediante un proceso ágil con atención personalizada.');
      setAboutP2(initialSettings.about_p2 || 'Ofrecemos asesoría legal especializada que respalda cada operación y gestión ante la autoridad.');
      setAboutP3(initialSettings.about_p3 || 'Nuestro compromiso es ser un socio comercial estratégico que impulsa el crecimiento de nuestros clientes.');
    }
  }, [initialSettings, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      about_p1: aboutP1,
      about_p2: aboutP2,
      about_p3: aboutP3,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/settings/batch`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la sección ¿Quiénes Somos?');
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

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-white max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-imas-pink/20 text-imas-pink rounded-2xl flex items-center justify-center border border-imas-pink/30">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">Editar ¿Quiénes Somos?</h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              Actualiza los textos institucionales de la sección ¿Quiénes Somos?
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
              1. Servicio Integral (Importación & Exportación)
            </label>
            <textarea
              rows={3}
              required
              value={aboutP1}
              onChange={(e) => setAboutP1(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-imas-pink resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              2. Asesoría Legal Especializada
            </label>
            <textarea
              rows={3}
              required
              value={aboutP2}
              onChange={(e) => setAboutP2(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-imas-pink resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              3. Socio Comercial Estratégico
            </label>
            <textarea
              rows={3}
              required
              value={aboutP3}
              onChange={(e) => setAboutP3(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-imas-pink resize-none"
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
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
