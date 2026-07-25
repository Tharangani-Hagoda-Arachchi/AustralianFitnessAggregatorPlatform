import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';

const token = localStorage.getItem('token');

const initialState = {
    user: null,
    token: token || null,
    isAuthenticated: false, // becomes true only after /auth/me confirms the token
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    message: null, // used for forgot-password / reset-password confirmation text
};

function extractError(err) {
    return err.response?.data?.message || err.message || 'Something went wrong';
}

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
    try {
        const res = await authApi.register(data);
        return res.data;
    } catch (err) {
        return rejectWithValue(extractError(err));
    }
});

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
    try {
        const res = await authApi.login(data);
        return res.data;
    } catch (err) {
        return rejectWithValue(extractError(err));
    }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
    try {
        const res = await authApi.getMe();
        return res.data;
    } catch (err) {
        return rejectWithValue(extractError(err));
    }
});

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const res = await authApi.forgotPassword(email);
            return res.data;
        } catch (err) {
            return rejectWithValue(extractError(err));
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ token: resetToken, password }, { rejectWithValue }) => {
        try {
            const res = await authApi.resetPassword(resetToken, password);
            return res.data;
        } catch (err) {
            return rejectWithValue(extractError(err));
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            localStorage.removeItem('token');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
        clearAuthError(state) {
            state.error = null;
        },
        clearAuthMessage(state) {
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Login
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Fetch current user (used on app load if a token exists)
            .addCase(fetchMe.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(fetchMe.rejected, (state) => {
                state.status = 'failed';
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                localStorage.removeItem('token');
            })
            // Forgot password
            .addCase(forgotPassword.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.message = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.message = action.payload.message;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Reset password
            .addCase(resetPassword.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload.token;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Keep the logged-in user's favouriteGym in sync when it's toggled from
            // the gym detail page — that action lives in gymSlice, but this is the
            // single source of truth for `user`, so we listen for it here too.
            .addMatcher(
                (action) => action.type === 'gyms/toggleFavourite/fulfilled',
                (state, action) => {
                    if (state.user) {
                        state.user.favouriteGym = action.payload.favouriteGym;
                    }
                }
            );
    },
});

export const { logout, clearAuthError, clearAuthMessage } = authSlice.actions;
export default authSlice.reducer;
