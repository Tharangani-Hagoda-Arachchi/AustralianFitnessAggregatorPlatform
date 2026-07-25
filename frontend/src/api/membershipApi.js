import api from "./axioInstance.js";


export const membershipApi = {
  getPlansForGym: (gymId) => api.get(`/plans/${gymId}`),
  createPlan: (data) => api.post('/plans', data),
  getMyMembership: () => api.get('/plans/me'),
  subscribe: (planId) => api.post('/plans/subscribe', { planId }),
  changePlan: (membershipId, newPlanId) =>
    api.put(`/plans/${membershipId}/change-plan`, { newPlanId }),
  cancel: (membershipId) => api.put(`/plans/${membershipId}/cancel`),
};
