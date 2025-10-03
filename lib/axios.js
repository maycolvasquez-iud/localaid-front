import axios from 'axios';
import { getFromLocalStorage, removeFromLocalStorage } from './localStorage';

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL: 'https://localaid-backend.onrender.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = getFromLocalStorage('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el token expiró o es inválido, limpiar localStorage
    if (error.response?.status === 401) {
      removeFromLocalStorage('token');
      removeFromLocalStorage('user');
      // Redirigir al login si no estamos ya ahí
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

