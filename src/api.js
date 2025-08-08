import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const fetchAvailableDates = (tourId) =>
  api.get(`/available-dates/${tourId}`);

export const createAvailableDate = (data) =>
  api.post('/available-dates', data);

export const deleteAvailableDate = (id) =>
  api.delete(`/available-dates/${id}`);

// Añadir token automáticamente si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
