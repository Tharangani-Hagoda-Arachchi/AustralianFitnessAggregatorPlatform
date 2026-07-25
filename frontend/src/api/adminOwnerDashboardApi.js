import api from './axiosInstance';

export const dashboardApi = {
  getMyDashboard: () => api.get('/dashboard/me'),
};

export const ownerApi = {
  getMyGyms: () => api.get('/owner/gyms'),
  getGymAnalytics: (gymId, params) => api.get(`/owner/gyms/${gymId}/analytics`, { params }),
};

export const adminApi = {
  getAllUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (userId, isActive) =>
    api.put(`/admin/users/${userId}/status`, { isActive }),
  getAllGyms: (params) => api.get('/admin/gyms', { params }),
  approveGym: (gymId) => api.put(`/admin/gyms/${gymId}/approve`),
  rejectGym: (gymId) => api.put(`/admin/gyms/${gymId}/reject`),
  getAllPayments: (params) => api.get('/admin/payments', { params }),
  getOverview: () => api.get('/admin/reports/overview'),
};
