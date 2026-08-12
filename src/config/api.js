// Configuración centralizada de la URL de la API Backend
// Resuelve dinámicamente la IP del host en red local (ej: http://192.168.x.x:8080) para celulares
const getDynamicApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:8080`;
  }
  return 'http://localhost:8080';
};

export const API_BASE_URL = getDynamicApiUrl();
