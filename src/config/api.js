// Configuración centralizada de la URL de la API Backend
const PROD_API_URL = 'https://imas-backend-production.up.railway.app';

export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // En producción (al compilar para IONOS / web), SIEMPRE usar Railway
  if (import.meta.env.PROD) {
    return PROD_API_URL;
  }
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    // Solo en desarrollo local (npm run dev)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
      return `${protocol}//${hostname}:8080`;
    }
  }
  return PROD_API_URL;
};

export const API_BASE_URL = getApiBaseUrl();
