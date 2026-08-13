import React, { useState, useEffect } from 'react';
import { 
  MapPin, Mail, Phone, Globe, ArrowRight, ShieldCheck, Anchor, 
  Truck, FileText, Edit2, Send, CheckCircle2, User, Building2, Package, RefreshCw 
} from 'lucide-react';
import AdminFooterModal from './AdminFooterModal';
import ContactQuoteModal from './ContactQuoteModal';
import { API_BASE_URL } from '../config/api';
import { APP_VERSION } from '../config/version';
import { formatPhoneNumber } from '../utils/phoneFormatter';

export default function Footer({ adminToken, onOpenQuote }) {
  const [settings, setSettings] = useState({
    footer_email: 'info@imasagenciaaduanal.com',
    footer_phone: '+52 (314) 105 3428',
    footer_address: 'Av. Paseo de las gaviotas #190, Col. Valle de las garzas.',
    footer_rights: '© 2026 IMAS Agencia Aduanal. Todos los derechos reservados.',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Formulario rápido en el footer
  const [quickForm, setQuickForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    operationType: 'Importación Marítima (FCL/LCL)',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/public/settings`, {
        cache: 'no-store'
      });
      if (response.ok) {
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      }
    } catch (err) {
      console.log('Usando datos por defecto para Footer');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    if (!quickForm.name || !quickForm.email) return;

    setIsSending(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/public/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quickForm,
          source: 'LANDING_PAGE'
        })
      });

      if (response.ok) {
        setSentSuccess(true);
        setTimeout(() => {
          setSentSuccess(false);
          setQuickForm({
            name: '',
            email: '',
            phone: '',
            company: '',
            operationType: 'Importación Marítima (FCL/LCL)',
            message: ''
          });
        }, 5000);
      }
    } catch (err) {
      console.error(err);
      alert('Hubo un detalle al enviar el formulario. Por favor intenta de nuevo.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <footer id="contacto" className="relative z-30 bg-gradient-to-b from-[#E52E71]/90 via-[#EA3875]/90 to-[#D82365]/90 backdrop-blur-2xl text-white overflow-hidden selection:bg-slate-950 selection:text-white">
      
      {/* Luz ambiental decorativa de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-24 bg-gradient-to-b from-slate-950/20 to-transparent pointer-events-none" />

      {/* CTA BANNER SUPERIOR - ESLOGAN Y CONTROLES ADMIN */}
      <div className="border-b border-white/20 py-12 px-6 bg-black/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <img
              src="/images/logo1.png"
              alt="IMAS Agencia Aduanal Logo"
              className="h-14 sm:h-16 w-auto object-contain drop-shadow-md mb-2"
            />
            <h2 className="text-lg sm:text-xl font-bold tracking-widest uppercase text-white/95">
              AGENCIA ADUANAL
            </h2>
          </div>

          {/* LISTÓN DE ESLOGAN DE LA IMAGEN */}
          <div className="bg-white px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-full shadow-2xl transform hover:scale-105 transition-transform border border-white/40 max-w-full text-center">
            <span className="text-xs sm:text-2xl lg:text-3xl font-black text-[#E52E71] tracking-tight font-['Outfit',sans-serif] drop-shadow-sm leading-snug block">
              ¡Transporta tu cadena logística a otro nivel!
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                if (onOpenQuote) onOpenQuote();
                else setIsQuoteModalOpen(true);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-all shadow-xl border border-white/20 cursor-pointer"
            >
              <span>Cotizar Operación</span>
              <ArrowRight className="w-4 h-4 text-imas-pink" />
            </button>

            {/* BOTÓN ADMIN EDITAR FOOTER */}
            {adminToken && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto justify-center px-4 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-xl cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
                <span>Editar Footer</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL DEL FOOTER (DATOS DE CONTACTO + FORMULARIO + SERVICIOS) */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 items-start">
          
          {/* COLUMNA 1: IDENTIDAD Y CONTACTO OFICIAL (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="/images/logo1.png"
                  alt="IMAS Agencia Aduanal"
                  className="h-12 w-auto object-contain drop-shadow-lg"
                />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Soluciones logísticas y aduanales integrales. Garantizamos seguridad, rapidez y total apego a la normativa para el éxito de tus operaciones.
              </p>
            </div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/20 pb-2 flex items-center gap-2">
              <span>Contacto Directo</span>
            </h3>

            <ul className="space-y-4 text-sm font-medium">
              {/* DIRECCIÓN */}
              <li className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 border border-white/20 text-white shadow-md">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="leading-snug pt-0.5">
                  <strong className="block text-white font-bold">Ubicación Oficial:</strong>
                  <span className="text-white/90 text-xs">{settings.footer_address || 'Av. Paseo de las gaviotas #190, Col. Valle de las garzas.'}</span>
                </div>
              </li>

              {/* CORREO */}
              <li className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 border border-white/20 text-white shadow-md">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="leading-tight pt-1">
                  <a href={`mailto:${settings.footer_email}`} className="block hover:underline text-white font-medium text-xs">
                    {settings.footer_email || 'info@imasagenciaaduanal.com'}
                  </a>
                </div>
              </li>

              {/* TELÉFONOS */}
              <li className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 border border-white/20 text-white shadow-md">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="leading-tight pt-1 flex flex-col gap-1.5">
                  {(settings.footer_phone || '+52 (618) 151 0581')
                    .split(/[,/\n]/)
                    .map((p) => p.trim())
                    .filter(Boolean)
                    .map((phoneNum, idx) => (
                      <a
                        key={idx}
                        href={`tel:${phoneNum.replace(/[^+\d]/g, '')}`}
                        className="hover:underline font-bold text-white text-sm block"
                      >
                        {phoneNum}
                      </a>
                    ))}
                </div>
              </li>

              {/* SITIO WEB */}
              <li className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 border border-white/20 text-white shadow-md">
                  <Globe className="w-4 h-4" />
                </div>
                <a
                  href="http://www.imasagenciaaduanal.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline font-extrabold text-white text-sm tracking-wide"
                >
                  www.imasagenciaaduanal.com
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMNA 2: FORMULARIO DE CONTACTO Y COTIZACIÓN RÁPIDA (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950/40 p-7 rounded-3xl border border-white/15 backdrop-blur-md shadow-xl text-white">
            <h3 className="text-lg font-black uppercase tracking-wider text-white border-b border-white/20 pb-3 flex items-center gap-2">
              <Send className="w-5 h-5 text-white/90" />
              <span>Envíanos tu Consulta</span>
            </h3>

            {sentSuccess ? (
              <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">¡Mensaje Enviado con Éxito!</h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  Tu solicitud ha sido recibida con éxito. Nuestro equipo de asesores especializados se pondrá en contacto contigo a la brevedad.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuickSubmit} className="mt-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-extrabold text-white mb-1">Nombre *</label>
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre"
                      value={quickForm.name}
                      onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-extrabold text-white mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="correo@empresa.com"
                      value={quickForm.email}
                      onChange={(e) => setQuickForm({ ...quickForm, email: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-extrabold text-white mb-1">Teléfono</label>
                    <input
                      type="tel"
                      placeholder="+52 (314) 000 0000"
                      value={quickForm.phone}
                      onChange={(e) => setQuickForm({ ...quickForm, phone: formatPhoneNumber(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-extrabold text-white mb-1">Empresa</label>
                    <input
                      type="text"
                      placeholder="Nombre de empresa"
                      value={quickForm.company}
                      onChange={(e) => setQuickForm({ ...quickForm, company: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-extrabold text-white mb-1">Operación / Requerimiento</label>
                  <select
                    value={quickForm.operationType}
                    onChange={(e) => setQuickForm({ ...quickForm, operationType: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-950 transition-all shadow-sm"
                  >
                    <option value="Importación Marítima (FCL/LCL)" className="text-slate-900">Importación Marítima (FCL/LCL)</option>
                    <option value="Despacho Aduanal" className="text-slate-900">Despacho Aduanal</option>
                    <option value="Flete Terrestre Multimodal" className="text-slate-900">Flete Terrestre Multimodal</option>
                    <option value="Resguardo y Almacenaje" className="text-slate-900">Resguardo y Almacenaje</option>
                    <option value="Seguro de Mercancías" className="text-slate-900">Seguro de Mercancías</option>
                    <option value="Etiquetado de Mercancías dentro y fuera de puerto" className="text-slate-900">Etiquetado de Mercancías dentro y fuera de puerto</option>
                    <option value="Padrón de Importadores" className="text-slate-900">Padrón de Importadores</option>
                    <option value="Defensa y Asesoría Legal" className="text-slate-900">Defensa y Asesoría Legal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-extrabold text-white mb-1">Mensaje</label>
                  <textarea
                    rows="2"
                    placeholder="Detalles sobre tu mercancía o dudas de importación/exportación..."
                    value={quickForm.message}
                    onChange={(e) => setQuickForm({ ...quickForm, message: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 resize-none transition-all shadow-sm"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-slate-950 hover:bg-slate-900 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg border border-white/20 cursor-pointer disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-pink-400" />
                      <span>Enviando mensaje...</span>
                    </>
                  ) : (
                    <>
                      <span>Enviar Mensaje a IMAS</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#E52E71]" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* COLUMNA 3: SERVICIOS Y ENLACES (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-3 bg-slate-950/20 p-6 rounded-3xl border border-white/10">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/20 pb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-white/80" />
                <span>Nuestros Servicios</span>
              </h4>
              <ul className="space-y-2 text-xs text-white/90 font-medium">
                <li className="hover:text-white transition-colors">• Despacho Aduanal</li>
                <li className="hover:text-white transition-colors">• Flete Terrestre & Marítimo</li>
                <li className="hover:text-white transition-colors">• Resguardo & Almacenaje</li>
                <li className="hover:text-white transition-colors">• Padrón de Importadores</li>
                <li className="hover:text-white transition-colors">• Seguro de Mercancías</li>
                <li className="hover:text-white transition-colors">• Etiquetado de Mercancías dentro y fuera de puerto</li>
                <li className="hover:text-white transition-colors">• Defensa y Asesoría Legal</li>
                <li className="hover:text-white transition-colors">• Sanitizado de Contenedores</li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* BARRA INFERIOR DE DERECHOS RESERVADOS, REDES SOCIALES Y LEGALES */}
      <div className="border-t border-white/20 py-6 px-6 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-white/90">
          <div className="flex flex-wrap items-center gap-3">
            <p>{settings.footer_rights || `© ${new Date().getFullYear()} IMAS Agencia Aduanal. Todos los derechos reservados.`}</p>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/30 font-bold shadow-sm" title="Versión de Despliegue">
              {APP_VERSION}
            </span>
          </div>
          
          <div className="flex items-center gap-3 my-2 md:my-0">
            <span className="font-extrabold text-white uppercase tracking-wider text-[11px]">SÍGUENOS:</span>
            
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram IMAS"
              title="Instagram IMAS"
              className="w-8 h-8 rounded-full bg-slate-950/80 text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 border border-white/20"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            <a
              href="https://wa.me/526181510581?text=Hola%20IMAS%20Agencia%20Aduanal,%20deseo%20m%C3%A1s%20informaci%C3%B3n"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp IMAS"
              title="WhatsApp IMAS"
              className="w-8 h-8 rounded-full bg-slate-950/80 text-white hover:bg-[#25D366] flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 border border-white/20"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.301-.15-1.785-.881-2.062-.982-.276-.101-.477-.15-.677.15-.199.301-.775.982-.95 1.183-.175.201-.351.226-.652.075-1.723-.86-2.861-1.529-4.004-3.489-.302-.519.302-.482.864-1.606.099-.201.049-.376-.025-.526-.075-.15-.677-1.631-.928-2.233-.244-.585-.494-.506-.677-.516-.174-.008-.375-.01-.576-.01-.2 0-.526.075-.802.376-.276.301-1.052 1.028-1.052 2.508 0 1.48 1.077 2.909 1.227 3.11 0.15.201 2.119 3.237 5.135 4.54 2.138.924 2.977.94 4.02.787.671-.099 1.785-.729 2.036-1.432.251-.703.251-1.304.176-1.432-.076-.127-.276-.227-.577-.377z"/>
              </svg>
            </a>

            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook IMAS"
              title="Facebook IMAS"
              className="w-8 h-8 rounded-full bg-slate-950/80 text-white hover:bg-[#1877F2] flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 border border-white/20"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>

          <div className="flex items-center gap-6">
            <a href="#contacto" className="hover:text-white transition-colors">Aviso de Privacidad</a>
            <a href="#contacto" className="hover:text-white transition-colors">Términos y Condiciones</a>
            <a href="#inicio" className="hover:text-white transition-colors font-bold text-white">Volver arriba ↑</a>
          </div>
        </div>
      </div>

      {/* MODAL ADMIN FOOTER */}
      <AdminFooterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={settings}
        adminToken={adminToken}
        onSuccess={fetchSettings}
      />

      {/* MODAL COTIZACIÓN DIRECTA */}
      <ContactQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </footer>
  );
}
