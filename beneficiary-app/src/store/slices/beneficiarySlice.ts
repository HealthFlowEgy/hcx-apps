import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import hcxService from '../../services/hcx.enhanced.service';
import valifyService from '../../services/valify.service';
import {
  Beneficiary,
  BeneficiaryRegistration,
  ESHICCard,
  NationalIDData,
  FaceMatchResult,
} from '../../types/valify.types';

interface BeneficiaryState {
  currentBeneficiary: Beneficiary | null;
  eshicCard: ESHICCard | null;
  kycData: {
    idData: NationalIDData | null;
    faceMatch: FaceMatchResult | null;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: BeneficiaryState = {
  currentBeneficiary: null,
  eshicCard: null,
  kycData: {
    idData: null,
    faceMatch: null,
  },
  isLoading: false,
  error: null,
};

// Async thunks
export const performKYC = createAsyncThunk(
  'beneficiary/performKYC',
  async (
    images: { front: File; back: File; selfie: File },
    { rejectWithValue }
  ) => {
    try {
      const result = await valifyService.completeKYC(
        images.front,
        images.back,
        images.selfie
      );
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerBeneficiary = createAsyncThunk(
  'beneficiary/register',
  async (registrationData: BeneficiaryRegistration, { rejectWithValue }) => {
    try {
      const response = await hcxService.registerBeneficiary(registrationData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchESHICCard = createAsyncThunk(
  'beneficiary/fetchESHICCard',
  async (_, { rejectWithValue }) => {
    try {
      const card = await hcxService.getESHICCard();
      return card;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'beneficiary/updateProfile',
  async (updates: Partial<Beneficiary>, { rejectWithValue }) => {
    try {
      const updated = await hcxService.updateProfile(updates);
      return updated;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const beneficiarySlice = createSlice({
  name: 'beneficiary',
  initialState,
  reducers: {
    clearKYCData: (state) => {
      state.kycData = {
        idData: null,
        faceMatch: null,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Perform KYC
    builder.addCase(performKYC.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(performKYC.fulfilled, (state, action) => {
      state.isLoading = false;
      state.kycData = action.payload;
    });
    builder.addCase(performKYC.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Register Beneficiary
    builder.addCase(registerBeneficiary.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerBeneficiary.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentBeneficiary = action.payload.beneficiary;
    });
    builder.addCase(registerBeneficiary.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch ESHIC Card
    builder.addCase(fetchESHICCard.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchESHICCard.fulfilled, (state, action) => {
      state.isLoading = false;
      state.eshicCard = action.payload;
    });
    builder.addCase(fetchESHICCard.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update Profile
    builder.addCase(updateProfile.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentBeneficiary = action.payload;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearKYCData, clearError } = beneficiarySlice.actions;
export default beneficiarySlice.reducer;
