import React, { useState, useEffect } from 'react';
import { X, Save, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import { formatPhoneNumber } from '../utils/phoneFormatter';

export default function AdminFooterModal({
  isOpen,
  onClose,
  initialSettings,
  initialData,
  onSaveSuccess,
  onSuccess,
  token,
  adminToken
}) {
  const settingsData = initialSettings || initialData;
  const authToken = token || adminToken;
  const handleSaveSuccess = onSaveSuccess || onSuccess;

  const [email, setEmail] = useState('');
  const [phonesList, setPhonesList] = useState(['+52 (618) 151 0581']);
  const [address, setAddress] = useState('');
  const [rights, setRights] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (settingsData) {
      setEmail(settingsData.footer_email || 'info@imasagenciaaduanal.com');
      
      const rawPhones = settingsData.footer_phone || '+52 (618) 151 0581';
      const parsed = rawPhones
        .split(/[,/\n]/)
        .map((p) => p.trim())
        .filter(Boolean);
      setPhonesList(parsed.length > 0 ? parsed : ['+52 (618) 151 0581']);
      
      setAddress(settingsData.footer_address || 'Av. Paseo de las gaviotas #190, Col. Valle de las garzas.');
      setRights(settingsData.footer_rights || '© 2026 IMAS Agencia Aduanal. Todos los derechos reservados.');
    }
  }, [settingsData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const combinedPhones = phonesList.filter((p) => p.trim() !== '').join(' / ');

    const payload = {
      footer_email: email,
      footer_phone: combinedPhones,
      footer_address: address,
      footer_rights: rights,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/settings/batch`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken ? `Bearer ${authToken}` : '',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Error al actualizar datos del pie de página');
      }

      if (handleSaveSuccess) {
        handleSaveSuccess();
      }
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
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">Editar Pie de Página (Footer)</h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              Modifica la información de contacto y ubicación de la agencia
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
              Correo Electrónico Oficial *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="info@imasagenciaaduanal.com"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-imas-pink"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Teléfonos de Contacto ({phonesList.length}) *
              </label>
              <button
                type="button"
                onClick={() => setPhonesList([...phonesList, ''])}
                className="text-xs font-bold text-imas-pink hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
              >
                + Agregar otro teléfono
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {phonesList.map((p, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={p}
                    onChange={(e) => {
                      const updated = [...phonesList];
                      updated[index] = formatPhoneNumber(e.target.value);
                      setPhonesList(updated);
                    }}
                    placeholder="+52 (618) 151 0581"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-imas-pink"
                  />
                  {phonesList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setPhonesList(phonesList.filter((_, i) => i !== index))}
                      className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl cursor-pointer transition-colors flex-shrink-0"
                      title="Eliminar este teléfono"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Dirección Física / Ubicación *
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Av. Paseo de las gaviotas #190, Col. Valle de las garzas."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-imas-pink"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Derechos de Autor (Copyright)
            </label>
            <input
              type="text"
              required
              value={rights}
              onChange={(e) => setRights(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-imas-pink"
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
                  <span>Guardar Pie de Página</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
