// src/api/index.js
import axios from 'axios';

const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
  // quita slashes al final para evitar // duplicados
  .replace(/\/+$/, '');

const api = axios.create({
  baseURL: base,
  withCredentials: true, // si vas a usar cookies/refresh token
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// EJEMPLOS (NO vuelvas a anteponer /api aquí, ya viene en baseURL)
export const fetchAvailableDates = (tourId) => api.get(`/available-dates/${tourId}`);
export const createAvailableDate = (data) => api.post('/available-dates', data);
export const deleteAvailableDate = (id) => api.delete(`/available-dates/${id}`);

export default api;
