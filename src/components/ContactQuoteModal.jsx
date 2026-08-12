import React, { useState } from 'react';
import { 
  X, CheckCircle2, User, Phone, Mail, Building2, Package, 
  MessageSquare, ArrowRight, RefreshCw, ShieldCheck, Send 
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import { formatPhoneNumber } from '../utils/phoneFormatter';

export default function ContactQuoteModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    operationType: 'Importación Marítima (FCL/LCL)',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setErrorMsg('Por favor ingresa tu nombre y correo.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/public/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'LANDING_PAGE'
        })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error('No se pudo procesar la solicitud');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Hubo un error al enviar tu información. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      operationType: 'Importación Marítima (FCL/LCL)',
      message: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden text-white relative">
        
        {/* ENCABEZADO */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E52E71] to-[#EF4444] text-white flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Solicitar Cotización de Comercio Exterior</h3>
              <p className="text-xs text-slate-400">Atención personalizada • Puerto de Manzanillo, Colima</p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GARANTÍA DE PRIVACIDAD */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Atención prioritaria y confidencial
          </span>
          <span className="text-[11px] text-emerald-400 font-semibold">Respuesta Rápida</span>
        </div>

        {/* CONTENIDO DEL MODAL */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-white">¡Cotización Enviada Exitosamente!</h4>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Hemos recibido tu información y un ejecutivo de **IMAS Agencia Aduanal** analizará tu embarque para brindarte la propuesta más ágil y económica.
              </p>
              <button
                onClick={resetAndClose}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-3 rounded-full text-xs transition-colors shadow-lg mt-4 cursor-pointer"
              >
                Cerrar Ventana
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="bg-rose-500/20 border border-rose-500/50 text-rose-300 px-4 py-2 rounded-xl text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                    Nombre Completo <span className="text-[#E52E71]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Ej: Lic. Carlos Mendoza"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-imas-pink transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                    Correo Electrónico <span className="text-[#E52E71]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="contacto@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-imas-pink transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                    Teléfono / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                    <input
                      type="tel"
                      placeholder="+52 (314) 000 0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-imas-pink transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                    Empresa / Razón Social
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Nombre de la empresa"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-imas-pink transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                  Tipo de Operación o Servicio Requerido
                </label>
                <select
                  value={formData.operationType}
                  onChange={(e) => setFormData({ ...formData, operationType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-imas-pink transition-colors"
                >
                  <option value="Importación Marítima (FCL/LCL)">Importación Marítima (FCL/LCL)</option>
                  <option value="Despacho y Trámites Aduanales">Despacho y Trámites Aduanales</option>
                  <option value="Flete Terrestre Multimodal Nacional">Flete Terrestre Multimodal Nacional</option>
                  <option value="Resguardo, Almacenaje y Maniobras">Resguardo, Almacenaje y Maniobras</option>
                  <option value="Seguro de Mercancías">Seguro de Mercancías</option>
                  <option value="Etiquetado de Mercancías dentro y fuera de puerto">Etiquetado de Mercancías dentro y fuera de puerto</option>
                  <option value="Alta y Reactivación de Padrón">Alta y Reactivación de Padrón</option>
                  <option value="Asesoría Legal y Defensa Aduanera">Asesoría Legal y Defensa Aduanera</option>
                  <option value="Otro Requerimiento Especial">Otro Requerimiento Especial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                  Detalles del Requerimiento / Mensaje
                </label>
                <textarea
                  rows="3"
                  placeholder="Indícanos origen, destino, tipo de producto, volumen o cualquier duda aduanal..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-imas-pink transition-colors resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#E52E71] to-[#EF4444] hover:from-[#C2185B] hover:to-[#DC2626] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Despachando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Solicitud</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
