import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingApi } from '../../api/bookingApi';


const initialState = {
    classes: [],
    myBookings: [],
    status: 'idle',
    bookStatus: 'idle',
    error: null,
};

function extractError(err) {
    return err.response?.data?.message || err.message || 'Something went wrong';
}

export const fetchClassesForGym = createAsyncThunk(
    'bookings/fetchClasses',
    async (gymId, { rejectWithValue }) => {
        try {
            const res = await bookingApi.getClassesForGym(gymId);
            return res.data.classes;
        } catch (err) {
            return rejectWithValue(extractError(err));
        }
    }
);

export const fetchMyBookings = createAsyncThunk(
    'bookings/fetchMine',
    async (_, { rejectWithValue }) => {
        try {
            const res = await bookingApi.getMyBookings();
            return res.data.bookings;
        } catch (err) {
            return rejectWithValue(extractError(err));
        }
    }
);

// On success (or "class is full" 409), re-fetch classes so bookedCount reflects
// reality immediately — protects the UI from showing stale capacity.
export const createBooking = createAsyncThunk(
    'bookings/create',
    async (gymClassId, { rejectWithValue }) => {
        try {
            const res = await bookingApi.createBooking(gymClassId);
            return res.data.booking;
        } catch (err) {
            return rejectWithValue(extractError(err));
        }
    }
);

export const cancelBooking = createAsyncThunk(
    'bookings/cancel',
    async (bookingId, { rejectWithValue }) => {
        try {
            await bookingApi.cancelBooking(bookingId);
            return bookingId;
        } catch (err) {
            return rejectWithValue(extractError(err));
        }
    }
);

const bookingSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        clearBookingError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClassesForGym.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchClassesForGym.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.classes = action.payload;
            })
            .addCase(fetchClassesForGym.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchMyBookings.fulfilled, (state, action) => {
                state.myBookings = action.payload;
            })
            .addCase(createBooking.pending, (state) => {
                state.bookStatus = 'loading';
                state.error = null;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.bookStatus = 'succeeded';
                state.myBookings.unshift(action.payload);
                // Optimistically bump the local bookedCount for the booked class
                const cls = state.classes.find((c) => c._id === action.payload.gymClass);
                if (cls) cls.bookedCount += 1;
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.bookStatus = 'failed';
                state.error = action.payload; // e.g. "This class is fully booked"
            })
            .addCase(cancelBooking.fulfilled, (state, action) => {
                state.myBookings = state.myBookings.filter((b) => b._id !== action.payload);
            });
    },
});

export const { clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
