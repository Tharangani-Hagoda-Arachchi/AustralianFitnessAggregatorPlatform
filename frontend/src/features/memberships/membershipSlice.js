import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { membershipApi } from '../../api/membershipApi';


const initialState = {
    plans: [],
    myMembership: null,
    status: 'idle',
    actionStatus: 'idle',
    error: null,
};

function extractError(err) {
    return err.response?.data?.message || err.message || 'Something went wrong';
}

export const fetchPlansForGym = createAsyncThunk(
    'memberships/fetchPlans',
    async (gymId, { rejectWithValue }) => {
        try {
            const res = await membershipApi.getPlansForGym(gymId);
            return res.data.plans;
        } catch (err) {
            return rejectWithValue(extractError(err));
        }
    }
);

export const fetchMyMembership = createAsyncThunk(
    'memberships/fetchMine',
    async (_, { rejectWithValue }) => {
        try {
            const res = await membershipApi.getMyMembership();
            return res.data.membership;
        } catch (err) {
            return rejectWithValue(extractError(err));
        }
    }
);

export const subscribeToPlan = createAsyncThunk(
    'memberships/subscribe',
    async (planId, { rejectWithValue }) => {
        try {
            const res = await membershipApi.subscribe(planId);
            return res.data.membership;
        } catch (err) {
            return rejectWithValue(extractError(err));
        }
    }
);

export const changeMembershipPlan = createAsyncThunk(
    'memberships/changePlan',
    async ({ membershipId, newPlanId }, { rejectWithValue }) => {
        try {
            const res = await membershipApi.changePlan(membershipId, newPlanId);
            return res.data.membership;
        } catch (err) {
            return rejectWithValue(extractError(err));
        }
    }
);

export const cancelMembership = createAsyncThunk(
    'memberships/cancel',
    async (membershipId, { rejectWithValue }) => {
        try {
            const res = await membershipApi.cancel(membershipId);
            return res.data.membership;
        } catch (err) {
            return rejectWithValue(extractError(err));
        }
    }
);

const membershipSlice = createSlice({
    name: 'memberships',
    initialState,
    reducers: {
        clearMembershipError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlansForGym.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPlansForGym.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.plans = action.payload;
            })
            .addCase(fetchPlansForGym.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchMyMembership.fulfilled, (state, action) => {
                state.myMembership = action.payload;
            })
            .addCase(subscribeToPlan.pending, (state) => {
                state.actionStatus = 'loading';
                state.error = null;
            })
            .addCase(subscribeToPlan.fulfilled, (state, action) => {
                state.actionStatus = 'succeeded';
                state.myMembership = action.payload;
            })
            .addCase(subscribeToPlan.rejected, (state, action) => {
                state.actionStatus = 'failed';
                state.error = action.payload;
            })
            .addCase(changeMembershipPlan.fulfilled, (state, action) => {
                state.myMembership = action.payload;
            })
            .addCase(cancelMembership.fulfilled, (state, action) => {
                state.myMembership = action.payload;
            });
    },
});

export const { clearMembershipError } = membershipSlice.actions;
export default membershipSlice.reducer;
