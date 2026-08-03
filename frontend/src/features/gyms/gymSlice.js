import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { gymApi } from '../../api/gymApi';


const initialState = {
    results: [],
    total: 0,
    page: 1,
    totalPages: 1,
    current: null, // currently viewed gym detail
    status: 'idle',
    detailStatus: 'idle',
    error: null,
};

function extractError(err) {
    return err.response?.data?.message || err.message || 'Something went wrong';
}

export const searchGyms = createAsyncThunk('gyms/search', async (params, { rejectWithValue }) => {
    try {
        const res = await gymApi.search(params);
        return res.data;
    } catch (err) {
        return rejectWithValue(extractError(err));
    }
});

export const fetchGymById = createAsyncThunk('gyms/fetchById', async (id, { rejectWithValue }) => {
    try {
        const res = await gymApi.getById(id);
        return res.data.gym;
    } catch (err) {
        return rejectWithValue(extractError(err));
    }
});

export const toggleFavouriteGym = createAsyncThunk(
    'gyms/toggleFavourite',
    async (id, { rejectWithValue }) => {
        try {
            const res = await gymApi.toggleFavourite(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(extractError(err));
        }
    }
);

export const createGym = createAsyncThunk('gyms/create', async (data, { rejectWithValue }) => {
    try {
        const res = await gymApi.create(data);
        return res.data.gym;
    } catch (err) {
        return rejectWithValue(extractError(err));
    }
});

export const deleteGymById = createAsyncThunk('gyms/deleteById', async (gymId, { rejectWithValue }) => {
    try {
        const res = await gymApi.remove(gymId);
        return res.data;
    } catch (err) {
        return rejectWithValue(
            error.response?.data?.message || "Delete failed"
        );
    }
});

const gymSlice = createSlice({
    name: 'gyms',
    initialState,
    reducers: {
        clearCurrentGym(state) {
            state.current = null;
        },
        clearGymError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchGyms.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(searchGyms.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.results = action.payload.gyms;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(searchGyms.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchGymById.pending, (state) => {
                state.detailStatus = 'loading';
                state.error = null;
            })
            .addCase(fetchGymById.fulfilled, (state, action) => {
                state.detailStatus = 'succeeded';
                state.current = action.payload;
            })
            .addCase(fetchGymById.rejected, (state, action) => {
                state.detailStatus = 'failed';
                state.error = action.payload;
            })
            .addCase(createGym.fulfilled, (state, action) => {
                state.results.unshift(action.payload);
            })
            .addCase(deleteGymById.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.message = action.payload.message;
            })

    },
});

export const { clearCurrentGym, clearGymError } = gymSlice.actions;
export default gymSlice.reducer;
