import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import hcxService from '../../services/hcx.enhanced.service';
import { Policy } from '../../types/valify.types';

interface PolicyState {
  policies: Policy[];
  selectedPolicy: Policy | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PolicyState = {
  policies: [],
  selectedPolicy: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchPolicies = createAsyncThunk(
  'policy/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const policies = await hcxService.getPolicies();
      return policies;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPolicyById = createAsyncThunk(
  'policy/fetchById',
  async (policyId: string, { rejectWithValue }) => {
    try {
      const policy = await hcxService.getPolicyById(policyId);
      return policy;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const policySlice = createSlice({
  name: 'policy',
  initialState,
  reducers: {
    clearSelectedPolicy: (state) => {
      state.selectedPolicy = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all policies
    builder.addCase(fetchPolicies.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPolicies.fulfilled, (state, action) => {
      state.isLoading = false;
      state.policies = action.payload;
    });
    builder.addCase(fetchPolicies.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch policy by ID
    builder.addCase(fetchPolicyById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPolicyById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedPolicy = action.payload;
    });
    builder.addCase(fetchPolicyById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearSelectedPolicy, clearError } = policySlice.actions;
export default policySlice.reducer;
