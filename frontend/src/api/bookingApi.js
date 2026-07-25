import api from "./axioInstance.js";


export const bookingApi = {
  getClassesForGym: (gymId) => api.get(`/bookings/classes/gym/${gymId}`),
  createClass: (data) => api.post('/bookings/classes', data),
  getMyBookings: () => api.get('/bookings/me'),
  createBooking: (gymClassId) => api.post('/bookings', { gymClassId }),
  cancelBooking: (bookingId) => api.put(`/bookings/${bookingId}/cancel`),
};
