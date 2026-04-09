import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5119/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (email, password) => api.post('/auth/register', { email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
};

export const albumService = {
  getAll: () => api.get('/albums'),
  getById: (id) => api.get(`/albums/${id}`),
  create: (data) => api.post('/albums', data),
  update: (id, data) => api.put(`/albums/${id}`, data),
  delete: (id) => api.delete(`/albums/${id}`),
};

export const photoService = {
  getByAlbum: (albumId) => api.get(`/albums/${albumId}/photos`),
  upload: (albumId, formData) => api.post(`/albums/${albumId}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/photos/${id}`),
};

export default api;
