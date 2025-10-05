// ============================================================================
// NAVIGATION TYPES
// Location: beneficiary-app-mobile/src/navigation/types.ts
// ============================================================================

export type RootStackParamList = {
  // Auth Stack
  Welcome: undefined;
  PhoneVerification: undefined;
  KYC: { phoneNumber: string };
  RegistrationSuccess: { beneficiary: any; eshicCard: any };
  Login: undefined;
  
  // Main App
  MainApp: undefined;
  
  // Test
  ServiceTest: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Policies: undefined;
  Claims: undefined;
  Consent: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  ESHICCard: undefined;
};

export type PolicyStackParamList = {
  PoliciesList: undefined;
  PolicyDetail: { policyId: string };
  PolicyDocuments: { policyId: string };
};

export type ClaimStackParamList = {
  ClaimsList: undefined;
  ClaimDetail: { claimId: string };
  ClaimTimeline: { claimId: string };
  ClaimDocuments: { claimId: string };
};

export type ConsentStackParamList = {
  ConsentRequests: undefined;
  ConsentDetail: { consentId: string };
  ConsentHistory: undefined;
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  EditProfile: undefined;
  NotificationSettings: undefined;
  LanguageSettings: undefined;
};
