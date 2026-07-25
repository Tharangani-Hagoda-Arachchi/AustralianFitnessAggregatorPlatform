import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import gymReducer from '../features/gyms/gymSlice.js';
import checkinReducer from '../features/checkin/checkinSlice.js';
import membershipReducer from '../features/memberships/membershipSlice.js';
import bookingReducer from '../features/booking/bookingSlice.js';
import dashboardReducer from '../features/dashboard/dashboardSlice.js';
import ownerReducer from '../features/owner/ownerSlice.js';
import adminReducer from '../features/admin/adminSclice.js';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        gyms: gymReducer,
        checkin: checkinReducer,
        memberships: membershipReducer,
        bookings: bookingReducer,
        dashboard: dashboardReducer,
        owner: ownerReducer,
        admin: adminReducer,
    },
});

