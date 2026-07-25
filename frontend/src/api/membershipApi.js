import api from "./axioInstance.js";


export const membershipApi = {
  getPlansForGym: (gymId) => api.get(`/memberships/plans/${gymId}`),
  createPlan: (data) => api.post('/memberships/plans', data),
  getMyMembership: () => api.get('/memberships/me'),
  subscribe: (planId) => api.post('/memberships/subscribe', { planId }),
  changePlan: (membershipId, newPlanId) =>
    api.put(`/memberships/${membershipId}/change-plan`, { newPlanId }),
  cancel: (membershipId) => api.put(`/memberships/${membershipId}/cancel`),
};
