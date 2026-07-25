import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi } from '../../api/adminOwnerDashboardApi';


const initialState = {
    users: [],
    gyms: [],
    payments: [],
    overview: null,
    status: 'idle',
    error: null,
};

function extractError(err) {
    return err.response?.data?.message || err.message || 'Something went wrong';
}

export const fetchAllUsers = createAsyncThunk('admin/fetchUsers', async (params, { rejectWithValue }) => {
    try {
        const res = await adminApi.getAllUsers(params);
        return res.data.users;
    } catch (err) {
        return rejectWithValue(extractError(err));
    }
});

export const updateUserStatus = createAsyncThunk(
    'admin/updateUserStatus',
    async ({ userId, isActive }, { rejectWithValue }) => {
        try {
            const res = await adminApi.updateUserStatus(userId, isActive);
            return res.data.user;
        } catch (err) {
            return rejectWithValue(extractError(err));
        }
    }
);

export const fetchAllGyms = createAsyncThunk('admin/fetchGyms', async (params, { rejectWithValue }) => {
    try {
        const res = await adminApi.getAllGyms(params);
        return res.data.gyms;
    } catch (err) {
        return rejectWithValue(extractError(err));
    }
});

export const approveGym = createAsyncThunk('admin/approveGym', async (gymId, { rejectWithValue }) => {
    try {
        const res = await adminApi.approveGym(gymId);
        return res.data.gym;
    } catch (err) {
        return rejectWithValue(extractError(err));
    }
});

export const rejectGym = createAsyncThunk('admin/rejectGym', async (gymId, { rejectWithValue }) => {
    try {
        const res = await adminApi.rejectGym(gymId);
        return res.data.gym;
    } catch (err) {
        return rejectWithValue(extractError(err));
    }
});

export const fetchAllPayments = createAsyncThunk(
    'admin/fetchPayments',
    async (params, { rejectWithValue }) => {
        try {
            const res = await adminApi.getAllPayments(params);
            return res.data.payments;
        } catch (err) {
            return rejectWithValue(extractError(err));
        }
    }
);

export const fetchOverview = createAsyncThunk('admin/fetchOverview', async (_, { rejectWithValue }) => {
    try {
        const res = await adminApi.getOverview();
        return res.data.overview;
    } catch (err) {
        return rejectWithValue(extractError(err));
    }
});

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.users = action.payload;
            })
            .addCase(updateUserStatus.fulfilled, (state, action) => {
                const idx = state.users.findIndex((u) => u._id === action.payload._id);
                if (idx !== -1) state.users[idx] = action.payload;
            })
            .addCase(fetchAllGyms.fulfilled, (state, action) => {
                state.gyms = action.payload;
            })
            .addCase(approveGym.fulfilled, (state, action) => {
                const idx = state.gyms.findIndex((g) => g._id === action.payload._id);
                if (idx !== -1) state.gyms[idx] = action.payload;
            })
            .addCase(rejectGym.fulfilled, (state, action) => {
                const idx = state.gyms.findIndex((g) => g._id === action.payload._id);
                if (idx !== -1) state.gyms[idx] = action.payload;
            })
            .addCase(fetchAllPayments.fulfilled, (state, action) => {
                state.payments = action.payload;
            })
            .addCase(fetchOverview.fulfilled, (state, action) => {
                state.overview = action.payload;
            })
            .addMatcher(
                (action) => action.type.startsWith('admin/') && action.type.endsWith('/rejected'),
                (state, action) => {
                    state.error = action.payload;
                }
            );
    },
});

export default adminSlice.reducer;
