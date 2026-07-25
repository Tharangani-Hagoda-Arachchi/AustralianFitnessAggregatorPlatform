import api from './axiosInstance';

export const gymApi = {
  search: (params) => api.get('/gyms', { params }),
  getById: (id) => api.get(`/gyms/${id}`),
  create: (data) => api.post('/gyms', data),
  update: (id, data) => api.put(`/gyms/${id}`, data),
  remove: (id) => api.delete(`/gyms/${id}`),
  toggleFavourite: (id) => api.post(`/gyms/${id}/favourite`),
};
