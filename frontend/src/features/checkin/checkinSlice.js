import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkinApi } from '../../api/checkinApi';



const initialState = {
    qrImage: null,
    qrExpiresAt: null, // ISO string — drives the 60s countdown in the UI
    history: [],
    qrStatus: 'idle',
    checkinStatus: 'idle',
    historyStatus: 'idle',
    error: null,
    lastResult: null, // success message after a check-in
};

function extractError(err) {
    return err.response?.data?.message || err.message || 'Something went wrong';
}

export const generateQrPass = createAsyncThunk(
    'checkin/generateQr',
    async (gymId, { rejectWithValue }) => {
        try {
            const res = await checkinApi.generateQr(gymId);
            return res.data;
        } catch (err) {
            return rejectWithValue(extractError(err));
        }
    }
);

export const submitCheckIn = createAsyncThunk(
    'checkin/submit',
    async ({ gymId, qrToken }, { rejectWithValue }) => {
        try {
            const res = await checkinApi.checkIn(gymId, qrToken);
            return res.data;
        } catch (err) {
            return rejectWithValue(extractError(err));
        }
    }
);

export const fetchMyCheckinHistory = createAsyncThunk(
    'checkin/history',
    async (_, { rejectWithValue }) => {
        try {
            const res = await checkinApi.getMyHistory();
            return res.data.checkins;
        } catch (err) {
            return rejectWithValue(extractError(err));
        }
    }
);

const checkinSlice = createSlice({
    name: 'checkin',
    initialState,
    reducers: {
        clearQrPass(state) {
            state.qrImage = null;
            state.qrExpiresAt = null;
        },
        clearCheckinError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateQrPass.pending, (state) => {
                state.qrStatus = 'loading';
                state.error = null;
            })
            .addCase(generateQrPass.fulfilled, (state, action) => {
                state.qrStatus = 'succeeded';
                state.qrImage = action.payload.qrImage;
                state.qrExpiresAt = action.payload.expiresAt;
            })
            .addCase(generateQrPass.rejected, (state, action) => {
                state.qrStatus = 'failed';
                state.error = action.payload;
            })
            .addCase(submitCheckIn.pending, (state) => {
                state.checkinStatus = 'loading';
                state.error = null;
            })
            .addCase(submitCheckIn.fulfilled, (state, action) => {
                state.checkinStatus = 'succeeded';
                state.lastResult = action.payload.message;
                state.qrImage = null;
                state.qrExpiresAt = null;
            })
            .addCase(submitCheckIn.rejected, (state, action) => {
                state.checkinStatus = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchMyCheckinHistory.pending, (state) => {
                state.historyStatus = 'loading';
            })
            .addCase(fetchMyCheckinHistory.fulfilled, (state, action) => {
                state.historyStatus = 'succeeded';
                state.history = action.payload;
            })
            .addCase(fetchMyCheckinHistory.rejected, (state, action) => {
                state.historyStatus = 'failed';
                state.error = action.payload;
            });
    },
});

export const { clearQrPass, clearCheckinError } = checkinSlice.actions;
export default checkinSlice.reducer;
