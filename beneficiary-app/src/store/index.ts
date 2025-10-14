import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import beneficiaryReducer from './slices/beneficiarySlice';
import policyReducer from './slices/policySlice';
import claimReducer from './slices/claimSlice';
import consentReducer from './slices/consentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    beneficiary: beneficiaryReducer,
    policy: policyReducer,
    claim: claimReducer,
    consent: consentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
