// src/api/index.js
import axios from 'axios';

// Usa variable de entorno y deja fallback sensato:
const baseURL =
  import.meta.env.VITE_API_URL // define esto en .env
  || (typeof window !== 'undefined' && window.location.origin.includes('vercel.app')
      // Si está corriendo en Vercel (front), pega al /api del mismo dominio (serverless)
      ? '/api'
      // Fallback local (ajusta a la IP de tu PC si pruebas desde el celular)
      : 'http://localhost:5000/api');

const api = axios.create({
  baseURL,
  // si usas cookies/refresh token, pon true y configura CORS+cookies
  withCredentials: false,
  timeout: 15000,
});

// Añadir token automáticamente si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// (Opcional) Si el token expira, puedes manejar 401 aquí
// api.interceptors.response.use(
//   r => r,
//   async (error) => {
//     if (error.response?.status === 401) {
//       // redirige a login o intenta refresh aquí
//     }
//     return Promise.reject(error);
//   }
// );

export const fetchAvailableDates = (tourId) => api.get(`/available-dates/${tourId}`);
export const createAvailableDate = (data) => api.post('/available-dates', data);
export const deleteAvailableDate = (id) => api.delete(`/available-dates/${id}`);

export default api;
