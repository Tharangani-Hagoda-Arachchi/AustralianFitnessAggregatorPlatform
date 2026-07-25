import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardApi } from '../../api/adminOwnerDashboardApi';


const initialState = {
    data: null,
    status: 'idle',
    error: null,
};

export const fetchUserDashboard = createAsyncThunk(
    'dashboard/fetchMine',
    async (_, { rejectWithValue }) => {
        try {
            const res = await dashboardApi.getMyDashboard();
            return res.data.dashboard;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDashboard.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserDashboard.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchUserDashboard.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default dashboardSlice.reducer;
