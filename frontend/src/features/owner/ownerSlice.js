import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ownerApi } from '../../api/adminOwnerDashboardApi';

const initialState = {
    myGyms: [],
    analytics: null,
    status: 'idle',
    analyticsStatus: 'idle',
    error: null,
};

export const fetchMyGyms = createAsyncThunk('owner/fetchMyGyms', async (_, { rejectWithValue }) => {
    try {
        const res = await ownerApi.getMyGyms();
        return res.data.gyms;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

export const fetchGymAnalytics = createAsyncThunk(
    'owner/fetchAnalytics',
    async ({ gymId, params }, { rejectWithValue }) => {
        try {
            const res = await ownerApi.getGymAnalytics(gymId, params);
            return res.data.analytics;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const ownerSlice = createSlice({
    name: 'owner',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyGyms.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMyGyms.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.myGyms = action.payload;
            })
            .addCase(fetchMyGyms.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchGymAnalytics.pending, (state) => {
                state.analyticsStatus = 'loading';
            })
            .addCase(fetchGymAnalytics.fulfilled, (state, action) => {
                state.analyticsStatus = 'succeeded';
                state.analytics = action.payload;
            })
            .addCase(fetchGymAnalytics.rejected, (state, action) => {
                state.analyticsStatus = 'failed';
                state.error = action.payload;
            });
    },
});

export default ownerSlice.reducer;
