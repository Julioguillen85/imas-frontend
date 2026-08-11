// Configuración centralizada de la URL de la API Backend
// Por defecto en desarrollo usa http://localhost:8080
// En producción tomará el valor configurado en las variables de entorno (VITE_API_URL)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
