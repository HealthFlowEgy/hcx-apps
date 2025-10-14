/**
 * HCX Protocol Service
 * Handles communication with HCX Gateway through BSP Backend
 * Based on HCX Protocol v0.9 specifications
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface HCXConfig {
  bspApiUrl: string;
  hcxGatewayUrl: string;
  participantCode: string;
  apiKey?: string;
  timeout?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  beneficiaryId: string;
}

export interface Policy {
  id: string;
  policyNumber: string;
  insurerName: string;
  insurerLogo?: string;
  planName: string;
  coverageAmount: number;
  usedAmount: number;
  status: 'active' | 'inactive' | 'expired' | 'suspended';
  startDate: string;
  endDate: string;
  policyType: 'individual' | 'family' | 'group';
  premiumAmount?: number;
  members?: PolicyMember[];
  benefits?: Benefit[];
  networkProviders?: string[];
}

export interface PolicyMember {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth: string;
  gender: string;
  membershipNumber: string;
}

export interface Benefit {
  id: string;
  category: string;
  description: string;
  coverageLimit: number;
  copayPercentage?: number;
  conditions?: string[];
}

export interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  policyNumber: string;
  insurerName: string;
  providerName: string;
  providerType: string;
  status: 'submitted' | 'pending' | 'approved' | 'rejected' | 'settled' | 'processing';
  claimType: 'cashless' | 'reimbursement';
  treatmentType: 'opd' | 'ipd';
  submissionDate: string;
  treatmentDate: string;
  claimedAmount: number;
  approvedAmount?: number;
  settledAmount?: number;
  diagnosis?: string;
  documents?: ClaimDocument[];
  timeline?: ClaimTimeline[];
  rejectionReason?: string;
}

export interface ClaimDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  size?: number;
}

export interface ClaimTimeline {
  id: string;
  status: string;
  date: string;
  description: string;
  actor?: string;
}

export interface ConsentRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterType: 'provider' | 'payor' | 'researcher' | 'government';
  purpose: string;
  dataRequested: string[];
  validFrom: string;
  validTo: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  requestDate: string;
  responseDate?: string;
  description?: string;
}

export interface Notification {
  id: string;
  type: 'claim_update' | 'consent_request' | 'policy_update' | 'payment' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface BeneficiaryProfile {
  id: string;
  nationalId: string;
  phone: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  email?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
  profilePhoto?: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// ============================================================================
// HCX PROTOCOL SERVICE CLASS
// ============================================================================

class HCXProtocolService {
  private config: HCXConfig;
  private authTokens: AuthTokens | null = null;
  private refreshTokenPromise: Promise<void> | null = null;

  constructor(config: HCXConfig) {
    this.config = {
      timeout: 30000,
      ...config,
    };
    this.loadTokens();
  }

  // ==========================================================================
  // AUTHENTICATION & TOKEN MANAGEMENT
  // ==========================================================================

  private async loadTokens(): Promise<void> {
    try {
      const tokensJson = await AsyncStorage.getItem('hcx_auth_tokens');
      if (tokensJson) {
        this.authTokens = JSON.parse(tokensJson);
      }
    } catch (error) {
      console.error('Error loading tokens:', error);
    }
  }

  private async saveTokens(tokens: AuthTokens): Promise<void> {
    try {
      this.authTokens = tokens;
      await AsyncStorage.setItem('hcx_auth_tokens', JSON.stringify(tokens));
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  }

  private async clearTokens(): Promise<void> {
    try {
      this.authTokens = null;
      await AsyncStorage.removeItem('hcx_auth_tokens');
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  private isTokenExpired(): boolean {
    if (!this.authTokens) return true;
    return Date.now() >= this.authTokens.expiresAt;
  }

  private async refreshAccessToken(): Promise<void> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.refreshTokenPromise = (async () => {
      try {
        if (!this.authTokens?.refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await fetch(`${this.config.bspApiUrl}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refreshToken: this.authTokens.refreshToken,
          }),
        });

        if (!response.ok) {
          throw new Error('Token refresh failed');
        }

        const data = await response.json();
        await this.saveTokens(data.tokens);
      } catch (error) {
        await this.clearTokens();
        throw error;
      } finally {
        this.refreshTokenPromise = null;
      }
    })();

    return this.refreshTokenPromise;
  }

  // ==========================================================================
  // HTTP REQUEST HANDLER
  // ==========================================================================

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      // Check if token needs refresh
      if (this.isTokenExpired()) {
        await this.refreshAccessToken();
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (this.authTokens?.accessToken) {
        headers['Authorization'] = `Bearer ${this.authTokens.accessToken}`;
      }

      if (this.config.apiKey) {
        headers['X-API-Key'] = this.config.apiKey;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout!);

      const response = await fetch(`${this.config.bspApiUrl}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.error?.code || `HTTP_${response.status}`,
            message: data.error?.message || response.statusText,
            details: data.error?.details,
          },
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        data: data.data || data,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error(`API Request Error [${endpoint}]:`, error);

      return {
        success: false,
        error: {
          code: error.name || 'NETWORK_ERROR',
          message: error.message || 'Network request failed',
          details: error,
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  // ==========================================================================
  // AUTHENTICATION APIs
  // ==========================================================================

  async login(phone: string, otp: string): Promise<APIResponse<AuthTokens>> {
    const response = await this.request<AuthTokens>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });

    if (response.success && response.data) {
      await this.saveTokens(response.data);
    }

    return response;
  }

  async register(kycData: {
    nationalId: string;
    phone: string;
    name: string;
    dateOfBirth: string;
    idFrontImage: string;
    idBackImage: string;
    selfieImage: string;
  }): Promise<APIResponse<{ beneficiaryId: string; eshicNumber: string }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(kycData),
    });
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await this.clearTokens();
    }
  }

  async verifyPhone(phone: string): Promise<APIResponse<{ otpSent: boolean }>> {
    return this.request('/auth/verify-phone', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  // ==========================================================================
  // POLICY APIs
  // ==========================================================================

  async getPolicies(): Promise<APIResponse<Policy[]>> {
    return this.request<Policy[]>('/beneficiary/policies');
  }

  async getPolicyDetails(policyId: string): Promise<APIResponse<Policy>> {
    return this.request<Policy>(`/beneficiary/policies/${policyId}`);
  }

  async searchPolicies(query: string): Promise<APIResponse<Policy[]>> {
    return this.request<Policy[]>(`/beneficiary/policies/search?q=${encodeURIComponent(query)}`);
  }

  // ==========================================================================
  // CLAIM APIs
  // ==========================================================================

  async getClaims(filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<APIResponse<Claim[]>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const queryString = params.toString();
    const endpoint = queryString ? `/beneficiary/claims?${queryString}` : '/beneficiary/claims';

    return this.request<Claim[]>(endpoint);
  }

  async getClaimDetails(claimId: string): Promise<APIResponse<Claim>> {
    return this.request<Claim>(`/beneficiary/claims/${claimId}`);
  }

  async getClaimDocuments(claimId: string): Promise<APIResponse<ClaimDocument[]>> {
    return this.request<ClaimDocument[]>(`/beneficiary/claims/${claimId}/documents`);
  }

  async downloadClaimDocument(documentId: string): Promise<APIResponse<{ url: string }>> {
    return this.request<{ url: string }>(`/beneficiary/documents/${documentId}/download`);
  }

  // Optional: Submit reimbursement claim
  async submitReimbursementClaim(claimData: {
    policyId: string;
    providerId: string;
    treatmentDate: string;
    diagnosis: string;
    claimedAmount: number;
    documents: string[]; // Document IDs
  }): Promise<APIResponse<{ claimId: string }>> {
    return this.request('/beneficiary/claims/submit', {
      method: 'POST',
      body: JSON.stringify(claimData),
    });
  }

  // ==========================================================================
  // CONSENT APIs
  // ==========================================================================

  async getConsentRequests(status?: string): Promise<APIResponse<ConsentRequest[]>> {
    const endpoint = status 
      ? `/beneficiary/consents?status=${status}`
      : '/beneficiary/consents';
    return this.request<ConsentRequest[]>(endpoint);
  }

  async getConsentDetails(consentId: string): Promise<APIResponse<ConsentRequest>> {
    return this.request<ConsentRequest>(`/beneficiary/consents/${consentId}`);
  }

  async approveConsent(consentId: string): Promise<APIResponse<{ success: boolean }>> {
    return this.request(`/beneficiary/consents/${consentId}/approve`, {
      method: 'POST',
    });
  }

  async rejectConsent(
    consentId: string,
    reason?: string
  ): Promise<APIResponse<{ success: boolean }>> {
    return this.request(`/beneficiary/consents/${consentId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // ==========================================================================
  // NOTIFICATION APIs
  // ==========================================================================

  async subscribeToNotifications(
    fcmToken: string
  ): Promise<APIResponse<{ subscribed: boolean }>> {
    return this.request('/beneficiary/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify({ fcmToken }),
    });
  }

  async getNotifications(
    unreadOnly: boolean = false
  ): Promise<APIResponse<Notification[]>> {
    const endpoint = unreadOnly
      ? '/beneficiary/notifications?unread=true'
      : '/beneficiary/notifications';
    return this.request<Notification[]>(endpoint);
  }

  async markNotificationAsRead(notificationId: string): Promise<APIResponse<void>> {
    return this.request(`/beneficiary/notifications/${notificationId}/read`, {
      method: 'POST',
    });
  }

  async markAllNotificationsAsRead(): Promise<APIResponse<void>> {
    return this.request('/beneficiary/notifications/read-all', {
      method: 'POST',
    });
  }

  // ==========================================================================
  // PROFILE APIs
  // ==========================================================================

  async getProfile(): Promise<APIResponse<BeneficiaryProfile>> {
    return this.request<BeneficiaryProfile>('/beneficiary/profile');
  }

  async updateProfile(updates: Partial<BeneficiaryProfile>): Promise<APIResponse<BeneficiaryProfile>> {
    return this.request<BeneficiaryProfile>('/beneficiary/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async updatePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<APIResponse<{ success: boolean }>> {
    return this.request('/beneficiary/profile/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async uploadProfilePhoto(imageBase64: string): Promise<APIResponse<{ url: string }>> {
    return this.request('/beneficiary/profile/photo', {
      method: 'POST',
      body: JSON.stringify({ image: imageBase64 }),
    });
  }

  // ==========================================================================
  // ESHIC CARD API
  // ==========================================================================

  async getESHICCard(): Promise<APIResponse<{
    cardNumber: string;
    memberName: string;
    membershipId: string;
    validFrom: string;
    validTo: string;
    qrCode: string;
    insurerInfo: {
      name: string;
      phone: string;
      email: string;
    };
  }>> {
    return this.request('/beneficiary/eshic-card');
  }

  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================

  isAuthenticated(): boolean {
    return this.authTokens !== null && !this.isTokenExpired();
  }

  getBeneficiaryId(): string | null {
    return this.authTokens?.beneficiaryId || null;
  }

  updateConfig(config: Partial<HCXConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

// Will be initialized with actual config from environment
let hcxServiceInstance: HCXProtocolService | null = null;

export const initializeHCXService = (config: HCXConfig): void => {
  hcxServiceInstance = new HCXProtocolService(config);
};

export const getHCXService = (): HCXProtocolService => {
  if (!hcxServiceInstance) {
    throw new Error('HCX Service not initialized. Call initializeHCXService first.');
  }
  return hcxServiceInstance;
};

export default HCXProtocolService;