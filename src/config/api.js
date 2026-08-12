// Configuración centralizada de la URL de la API Backend
const getDynamicApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    // Si estamos en desarrollo local (localhost o IP de red local 192.168.x.x / 10.x.x)
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.')) {
      const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
      return `${protocol}//${hostname}:8080`;
    }
  }
  // URL por defecto para el backend de producción
  return 'https://api.imasagenciaaduanal.com';
};

export const API_BASE_URL = getDynamicApiUrl();
