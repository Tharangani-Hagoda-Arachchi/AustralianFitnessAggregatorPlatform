import api from "./axioInstance.js";


export const dashboardApi = {
  getMyDashboard: () => api.get('/dashboard/me'),
};

export const ownerApi = {
  getMyGyms: () => api.get('/owner/gyms'),
  getGymAnalytics: (gymId, params) => api.get(`/gyms/${gymId}/analytics`, { params }),
};

export const adminApi = {
  getAllUsers: (params) => api.get('/users', { params }),
  updateUserStatus: (userId, isActive) =>
    api.put(`/users/${userId}/status`, { isActive }),
  getAllGyms: (params) => api.get('/admin/gyms', { params }),
  approveGym: (gymId) => api.put(`/gyms/${gymId}/approve`),
  rejectGym: (gymId) => api.put(`/gyms/${gymId}/reject`),
  getAllPayments: (params) => api.get('/payments', { params }),
  getOverview: () => api.get('/reports/overview'),
};
