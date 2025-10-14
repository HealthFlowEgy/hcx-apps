import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import hcxService from '../../services/hcx.enhanced.service';
import { Claim, TimelineEvent } from '../../types/valify.types';

interface ClaimState {
  claims: Claim[];
  selectedClaim: Claim | null;
  claimTimeline: TimelineEvent[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ClaimState = {
  claims: [],
  selectedClaim: null,
  claimTimeline: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchClaims = createAsyncThunk(
  'claim/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const claims = await hcxService.getClaims();
      return claims;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchClaimById = createAsyncThunk(
  'claim/fetchById',
  async (claimId: string, { rejectWithValue }) => {
    try {
      const claim = await hcxService.getClaimById(claimId);
      return claim;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchClaimTimeline = createAsyncThunk(
  'claim/fetchTimeline',
  async (claimId: string, { rejectWithValue }) => {
    try {
      const timeline = await hcxService.getClaimTimeline(claimId);
      return timeline;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const claimSlice = createSlice({
  name: 'claim',
  initialState,
  reducers: {
    clearSelectedClaim: (state) => {
      state.selectedClaim = null;
      state.claimTimeline = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all claims
    builder.addCase(fetchClaims.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchClaims.fulfilled, (state, action) => {
      state.isLoading = false;
      state.claims = action.payload;
    });
    builder.addCase(fetchClaims.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch claim by ID
    builder.addCase(fetchClaimById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchClaimById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedClaim = action.payload;
    });
    builder.addCase(fetchClaimById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch claim timeline
    builder.addCase(fetchClaimTimeline.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchClaimTimeline.fulfilled, (state, action) => {
      state.isLoading = false;
      state.claimTimeline = action.payload;
    });
    builder.addCase(fetchClaimTimeline.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearSelectedClaim, clearError } = claimSlice.actions;
export default claimSlice.reducer;
