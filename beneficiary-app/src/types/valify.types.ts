// Valify e-KYC Type Definitions

export interface NationalIDData {
  transactionId: string;
  nationalId: string;
  fullNameArabic: string;
  fullNameEnglish: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  address: string;
  governorate: string;
  religion?: string;
  maritalStatus?: string;
}

export interface FaceMatchResult {
  transactionId: string;
  matchScore: number;
  isMatch: boolean;
  confidence: 'high' | 'medium' | 'low';
}

export interface LivenessResult {
  transactionId: string;
  isLive: boolean;
  confidenceScore: number;
}

export interface BeneficiaryRegistration {
  nationalId: string;
  fullNameArabic: string;
  fullNameEnglish: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  governorate: string;
  phoneNumber: string;
  email?: string;
  valifyTransactionId: string;
  faceMatchScore: number;
  livenessVerified: boolean;
}

export interface Beneficiary {
  id: string;
  nationalId: string;
  fullNameArabic: string;
  fullNameEnglish: string;
  eshicNumber: string;
  phoneNumber: string;
  email?: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  governorate: string;
  registeredAt: string;
  isVerified: boolean;
}

export interface Policy {
  id: string;
  policyNumber: string;
  insurerCode: string;
  insurerName: string;
  policyType: 'individual' | 'family' | 'group';
  status: 'active' | 'expired' | 'suspended';
  startDate: string;
  endDate: string;
  coverageAmount: number;
  currency: string;
  beneficiaries: string[];
}

export interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  providerCode: string;
  providerName: string;
  claimType: 'OPD' | 'IPD';
  status: 'submitted' | 'processing' | 'approved' | 'rejected' | 'partial';
  claimedAmount: number;
  approvedAmount?: number;
  submittedDate: string;
  processedDate?: string;
  diagnosisCodes: string[];
  treatmentDescription: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  eventType: string;
  description: string;
  status: 'success' | 'pending' | 'error';
  metadata?: any;
}

export interface ConsentRequest {
  id: string;
  requesterCode: string;
  requesterName: string;
  purpose: string;
  dataTypes: string[];
  requestedAt: string;
  expiresAt: string;
  status: 'pending' | 'approved' | 'denied';
}

export interface ESHICCard {
  cardNumber: string;
  beneficiaryName: string;
  nationalId: string;
  dateOfBirth: string;
  bloodType?: string;
  emergencyContact?: string;
  qrCode: string;
  issueDate: string;
  expiryDate: string;
}

export interface ValifyOAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface ValifyOCRResponse {
  transaction_id: string;
  trials_remaining: number;
  data: {
    national_id: string;
    full_name_arabic: string;
    full_name_english: string;
    date_of_birth: string;
    gender: string;
    address: string;
    religion?: string;
    marital_status?: string;
    governorate: string;
  };
}

export interface ValifyFaceMatchResponse {
  transaction_id: string;
  match_score: number;
  is_match: boolean;
  confidence: 'high' | 'medium' | 'low';
}
