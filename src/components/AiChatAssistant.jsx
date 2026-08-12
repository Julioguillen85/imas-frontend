import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, X, Sparkles, CheckCircle2, User, Phone, Mail, Building2, 
  Package, ArrowRight, RefreshCw, ChevronDown, ChevronUp, ShieldCheck, AlertCircle, Minus 
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import { formatPhoneNumber } from '../utils/phoneFormatter';

export default function AiChatAssistant({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: '¡Hola! 👋 Estoy para ayudarte, ¿qué tipo de información necesitas?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadFormSubmitted, setLeadFormSubmitted] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [viewportStyle, setViewportStyle] = useState({});
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false);

  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    operationType: 'Importación Marítima',
    message: ''
  });

  const messagesEndRef = useRef(null);

  // Escuchar cambios de pantalla y del teclado virtual (visualViewport) para celulares
  useEffect(() => {
    const updateViewport = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);

      if (mobile && window.visualViewport) {
        setViewportStyle({
          height: `${window.visualViewport.height}px`,
          top: `${window.visualViewport.offsetTop}px`,
          bottom: 'auto',
          left: '0px',
          right: '0px',
          width: '100%'
        });
      } else {
        setViewportStyle({});
      }
    };

    window.addEventListener('resize', updateViewport);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewport);
      window.visualViewport.addEventListener('scroll', updateViewport);
    }
    updateViewport();

    return () => {
      window.removeEventListener('resize', updateViewport);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewport);
        window.visualViewport.removeEventListener('scroll', updateViewport);
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, showLeadForm, isOpen]);

  const handleSendMessage = async () => {
    const textToSend = inputValue.trim();
    if (!textToSend || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Historial para enviar a la IA
    const historyPayload = messages
      .filter(m => m.id !== 'welcome')
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSend,
          history: historyPayload
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botReply = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: data.response || 'Disculpa, no pude procesar la respuesta.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botReply]);
      } else {
        throw new Error('Error al conectar con la IA');
      }
    } catch (error) {
      console.error(error);
      const fallbackReply = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'En **IMAS Agencia Aduanal** te apoyamos con gusto. Para enviarte la propuesta formal a tu correo, ¿cuál es tu **nombre completo**?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadData.name || !leadData.email) return;

    setIsSubmittingLead(true);
    try {
      const payload = {
        ...leadData,
        source: 'AI_ASSISTANT',
        message: leadData.message || `Consulta desde chat IA (Último mensaje: ${messages[messages.length - 1]?.text || 'Cotización'})`
      };

      const response = await fetch(`${API_BASE_URL}/api/v1/ai/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setLeadFormSubmitted(true);
        const confirmationMsg = {
          id: Date.now().toString(),
          sender: 'bot',
          text: `✅ **¡Muchas gracias ${leadData.name}!**\n\nHemos registrado tus datos con éxito. Nuestro equipo de asesores se contactará contigo a la brevedad al correo **${leadData.email}** y teléfono **${leadData.phone || 'indicado'}**.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, confirmationMsg]);
        setTimeout(() => {
          setShowLeadForm(false);
        }, 3000);
      } else {
        throw new Error('Error al enviar formulario');
      }
    } catch (err) {
      console.error(err);
      alert('Ocurrió un detalle al enviar los datos. Por favor verifica tu conexión.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-[100] text-white backdrop-blur-xl transition-all duration-150 flex flex-col overflow-hidden ${
        isMobile
          ? 'w-full bg-slate-950 border-none rounded-none'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[430px] h-[610px] max-h-[88vh] bg-slate-900/95 border border-slate-700/90 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300'
      }`}
      style={isMobile ? viewportStyle : {}}
    >
      
      {/* ENCABEZADO DEL CHAT */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#E52E71] to-[#EF4444] text-white flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xs sm:text-sm text-white">Asistente Virtual IMAS</h3>
              <span className="bg-imas-pink/20 text-imas-pink text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border border-imas-pink/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> IA
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-emerald-400 font-medium">En línea • Especialista en Manzanillo</p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={() => setShowLeadForm(!showLeadForm)}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
            title="Formulario de cotización"
          >
            <Package className="w-3.5 h-3.5 text-[#E52E71]" />
            <span className="hidden sm:inline">Formulario</span>
            {showLeadForm ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* BOTÓN MINIMIZAR (SOLO MÓVIL / GENERAL) */}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Minimizar chat"
          >
            <Minus className="w-5 h-5" />
          </button>

          {/* BOTÓN CERRAR CON X */}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-rose-500/20 rounded-xl transition-colors cursor-pointer"
            title="Cerrar chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* NOTIFICACIÓN / BANNER */}
      <div className="bg-slate-950/90 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5 text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Atención y Cotizaciones en Tiempo Real
        </span>
        <span className="text-[10px] text-slate-500 font-mono">Asistente IA</span>
      </div>

      {/* ÁREA DE MENSAJES */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-950/60 to-slate-900/90 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
          >
            <div
              className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-[#E52E71] to-[#D82365] text-white rounded-tr-xs shadow-md shadow-pink-500/10'
                  : 'bg-slate-800/90 text-slate-100 rounded-tl-xs border border-slate-700/80 shadow-md'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-slate-500 px-1">{msg.time}</span>
          </div>
        ))}

        {/* INDICADOR DE CARGA / TIPEO */}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 bg-slate-800/60 border border-slate-700/60 p-3 rounded-2xl rounded-tl-xs max-w-[120px]">
            <span className="w-2 h-2 rounded-full bg-[#E52E71] animate-bounce"></span>
            <span className="w-2 h-2 rounded-full bg-[#E52E71] animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 rounded-full bg-[#E52E71] animate-bounce [animation-delay:0.4s]"></span>
          </div>
        )}

        {/* FORMULARIO DE CAPTURA DE DATOS DESPLEGABLE DENTRO DEL CHAT */}
        {showLeadForm && (
          <div className="bg-slate-950/95 border border-pink-500/30 rounded-2xl p-4 shadow-xl text-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-imas-pink" />
                <span className="font-bold text-xs text-white">Solicitud Directa de Cotización</span>
              </div>
              <button
                type="button"
                onClick={() => setShowLeadForm(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {leadFormSubmitted ? (
              <div className="text-center py-4 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-bold text-sm text-white">¡Datos enviados con éxito!</p>
                <p className="text-[11px] text-slate-400">
                  Un asesor se comunicará contigo a la brevedad.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Nombre Completo *</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="Tu nombre"
                        value={leadData.name}
                        onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-imas-pink"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Correo Electrónico *</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                      <input
                        type="email"
                        required
                        placeholder="correo@empresa.com"
                        value={leadData.email}
                        onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-imas-pink"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Teléfono / WhatsApp</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                      <input
                        type="tel"
                        placeholder="+52 (314) 000 0000"
                        value={leadData.phone}
                        onChange={(e) => setLeadData({ ...leadData, phone: formatPhoneNumber(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-imas-pink"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Empresa / Negocio</label>
                    <div className="relative">
                      <Building2 className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Nombre de empresa"
                        value={leadData.company}
                        onChange={(e) => setLeadData({ ...leadData, company: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-imas-pink"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Tipo de Operación</label>
                  <select
                    value={leadData.operationType}
                    onChange={(e) => setLeadData({ ...leadData, operationType: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-imas-pink"
                  >
                    <option value="Importación Marítima (FCL/LCL)">Importación Marítima (FCL/LCL)</option>
                    <option value="Despacho y Gestión Aduanal Manzanillo">Despacho y Gestión Aduanal Manzanillo</option>
                    <option value="Flete Terrestre Multimodal Nacional">Flete Terrestre Multimodal Nacional</option>
                    <option value="Resguardo y Almacenaje de Mercancía">Resguardo y Almacenaje de Mercancía</option>
                    <option value="Padrón de Importadores y Consultoría Legal">Padrón de Importadores y Consultoría Legal</option>
                    <option value="Otro Requerimiento">Otro Requerimiento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Detalles de la Carga / Mercancía</label>
                  <textarea
                    rows="2"
                    placeholder="Ej: 2 contenedores de 40ft con autopartes desde Ningbo hacia Guadalajara..."
                    value={leadData.message}
                    onChange={(e) => setLeadData({ ...leadData, message: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-imas-pink resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingLead}
                  className="w-full bg-gradient-to-r from-[#E52E71] to-[#EF4444] hover:from-[#C2185B] hover:to-[#DC2626] text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingLead ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Enviando requerimiento...</span>
                    </>
                  ) : (
                    <>
                      <span>Enviar Solicitud</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* CAMPO DE ENTRADA Y BOTÓN ENVIAR */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2 flex-shrink-0">
        <input
          type="text"
          placeholder="Escribe tu mensaje aquí..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          onFocus={() => setTimeout(scrollToBottom, 200)}
          className="flex-1 bg-slate-900 text-base sm:text-xs text-white placeholder-slate-500 rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-imas-pink shadow-inner"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim() || isLoading}
          className="bg-gradient-to-r from-[#E52E71] to-[#EF4444] hover:from-[#C2185B] hover:to-[#DC2626] disabled:opacity-40 text-white p-3 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* AVISO LEGAL Y ANTI-ALUCINACIÓN */}
      <div className="bg-slate-950 px-3 pb-2 pt-0.5 text-center flex-shrink-0 border-t border-slate-800/40">
        <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1.5 font-sans leading-tight">
          <AlertCircle className="w-3 h-3 text-amber-500/80 flex-shrink-0" />
          <span>La IA puede cometer errores. Verifica información crítica con un asesor.</span>
        </p>
      </div>

    </div>
  );
}
