import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import hcxService from '../../services/hcx.enhanced.service';
import { ConsentRequest } from '../../types/valify.types';

interface ConsentState {
  pendingRequests: ConsentRequest[];
  consentHistory: ConsentRequest[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ConsentState = {
  pendingRequests: [],
  consentHistory: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchConsentRequests = createAsyncThunk(
  'consent/fetchRequests',
  async (_, { rejectWithValue }) => {
    try {
      const requests = await hcxService.getConsentRequests();
      return requests;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const approveConsent = createAsyncThunk(
  'consent/approve',
  async (consentId: string, { rejectWithValue }) => {
    try {
      await hcxService.approveConsent(consentId);
      return consentId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const denyConsent = createAsyncThunk(
  'consent/deny',
  async (
    { consentId, reason }: { consentId: string; reason: string },
    { rejectWithValue }
  ) => {
    try {
      await hcxService.denyConsent(consentId, reason);
      return consentId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const revokeConsent = createAsyncThunk(
  'consent/revoke',
  async (consentId: string, { rejectWithValue }) => {
    try {
      await hcxService.revokeConsent(consentId);
      return consentId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchConsentHistory = createAsyncThunk(
  'consent/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const history = await hcxService.getConsentHistory();
      return history;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const consentSlice = createSlice({
  name: 'consent',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch consent requests
    builder.addCase(fetchConsentRequests.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchConsentRequests.fulfilled, (state, action) => {
      state.isLoading = false;
      state.pendingRequests = action.payload;
    });
    builder.addCase(fetchConsentRequests.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Approve consent
    builder.addCase(approveConsent.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(approveConsent.fulfilled, (state, action) => {
      state.isLoading = false;
      state.pendingRequests = state.pendingRequests.filter(
        (req) => req.id !== action.payload
      );
    });
    builder.addCase(approveConsent.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Deny consent
    builder.addCase(denyConsent.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(denyConsent.fulfilled, (state, action) => {
      state.isLoading = false;
      state.pendingRequests = state.pendingRequests.filter(
        (req) => req.id !== action.payload
      );
    });
    builder.addCase(denyConsent.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Revoke consent
    builder.addCase(revokeConsent.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(revokeConsent.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(revokeConsent.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch consent history
    builder.addCase(fetchConsentHistory.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchConsentHistory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.consentHistory = action.payload;
    });
    builder.addCase(fetchConsentHistory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = consentSlice.actions;
export default consentSlice.reducer;
