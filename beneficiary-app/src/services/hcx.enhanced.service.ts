import { APIConfig } from './api.config';
import {
  Beneficiary,
  BeneficiaryRegistration,
  Policy,
  Claim,
  TimelineEvent,
  ConsentRequest,
  ESHICCard,
} from '../types/valify.types';

class HCXEnhancedService {
  /**
   * Register a new beneficiary with e-KYC data
   */
  async registerBeneficiary(
    registrationData: BeneficiaryRegistration
  ): Promise<{ beneficiary: Beneficiary; token: string }> {
    const api = APIConfig.getHCXInstance();

    try {
      const response = await api.post('/beneficiary/register', {
        national_id: registrationData.nationalId,
        full_name_arabic: registrationData.fullNameArabic,
        full_name_english: registrationData.fullNameEnglish,
        date_of_birth: registrationData.dateOfBirth,
        gender: registrationData.gender,
        address: registrationData.address,
        governorate: registrationData.governorate,
        phone_number: registrationData.phoneNumber,
        email: registrationData.email,
        valify_transaction_id: registrationData.valifyTransactionId,
        face_match_score: registrationData.faceMatchScore,
        liveness_verified: registrationData.livenessVerified,
      });

      // Store token
      APIConfig.setHCXToken(response.data.token);

      return {
        beneficiary: response.data.beneficiary,
        token: response.data.token,
      };
    } catch (error: any) {
      console.error('Beneficiary registration failed:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to register beneficiary'
      );
    }
  }

  /**
   * Login beneficiary
   */
  async login(
    nationalId: string,
    password: string
  ): Promise<{ beneficiary: Beneficiary; token: string }> {
    const api = APIConfig.getHCXInstance();

    try {
      const response = await api.post('/beneficiary/login', {
        national_id: nationalId,
        password: password,
      });

      // Store token
      APIConfig.setHCXToken(response.data.token);

      return {
        beneficiary: response.data.beneficiary,
        token: response.data.token,
      };
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  /**
   * Logout beneficiary
   */
  async logout(): Promise<void> {
    APIConfig.clearHCXToken();
  }

  /**
   * Get beneficiary profile
   */
  async getProfile(): Promise<Beneficiary> {
    const api = APIConfig.getHCXInstance();

    try {
      const response = await api.get('/beneficiary/profile');
      return response.data;
    } catch (error: any) {
      console.error('Failed to get profile:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to get profile'
      );
    }
  }

  /**
   * Update beneficiary profile
   */
  async updateProfile(updates: Partial<Beneficiary>): Promise<Beneficiary> {
    const api = APIConfig.getHCXInstance();

    try {
      const response = await api.put('/beneficiary/profile', updates);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  }

  /**
   * Get ESHIC card details
   */
  async getESHICCard(): Promise<ESHICCard> {
    const api = APIConfig.getHCXInstance();

    try {
      const response = await api.get('/beneficiary/eshic-card');
      return response.data;
    } catch (error: any) {
      console.error('Failed to get ESHIC card:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to get ESHIC card'
      );
    }
  }

  /**
   * Get all policies for beneficiary
   */
  async getPolicies(): Promise<Policy[]> {
    const api = APIConfig.getHCXInstance();

    try {
      const response = await api.get('/beneficiary/policies');
      return response.data;
    } catch (error: any) {
      console.error('Failed to get policies:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to get policies'
      );
    }
  }

  /**
   * Get policy details by ID
   */
  async getPolicyById(policyId: string): Promise<Policy> {
    const api = APIConfig.getHCXInstance();

    try {
      const response = await api.get(`/beneficiary/policies/${policyId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get policy:', error);
      throw new Error(error.response?.data?.message || 'Failed to get policy');
    }
  }

  /**
   * Get all claims for beneficiary
   */
  async getClaims(): Promise<Claim[]> {
    const api = APIConfig.getHCXInstance();

    try {
      const response = await api.get('/beneficiary/claims');
      return response.data;
    } catch (error: any) {
      console.error('Failed to get claims:', error);
      throw new Error(error.response?.data?.message || 'Failed to get claims');
    }
  }

  /**
   * Get claim details by ID
   */
  async getClaimById(claimId: string): Promise<Claim> {
    const api = APIConfig.getHCXInstance();

    try {
      const response = await api.get(`/beneficiary/claims/${claimId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get claim:', error);
      throw new Error(error.response?.data?.message || 'Failed to get claim');
    }
  }

  /**
   * Get claim timeline/history
   */
  async getClaimTimeline(claimId: string): Promise<TimelineEvent[]> {
    const api = APIConfig.getHCXInstance();

    try {
      const response = await api.get(`/beneficiary/claims/${claimId}/timeline`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get claim timeline:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to get claim timeline'
      );
    }
  }

  /**
   * Get pending consent requests
   */
  async getConsentRequests(): Promise<ConsentRequest[]> {
    const api = APIConfig.getHCXInstance();

    try {
      const response = await api.get('/beneficiary/consent/requests');
      return response.data;
    } catch (error: any) {
      console.error('Failed to get consent requests:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to get consent requests'
      );
    }
  }

  /**
   * Approve consent request
   */
  async approveConsent(consentId: string): Promise<void> {
    const api = APIConfig.getHCXInstance();

    try {
      await api.post(`/beneficiary/consent/${consentId}/approve`);
    } catch (error: any) {
      console.error('Failed to approve consent:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to approve consent'
      );
    }
  }

  /**
   * Deny consent request
   */
  async denyConsent(consentId: string, reason: string): Promise<void> {
    const api = APIConfig.getHCXInstance();

    try {
      await api.post(`/beneficiary/consent/${consentId}/deny`, { reason });
    } catch (error: any) {
      console.error('Failed to deny consent:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to deny consent'
      );
    }
  }

  /**
   * Revoke previously granted consent
   */
  async revokeConsent(consentId: string): Promise<void> {
    const api = APIConfig.getHCXInstance();

    try {
      await api.post(`/beneficiary/consent/${consentId}/revoke`);
    } catch (error: any) {
      console.error('Failed to revoke consent:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to revoke consent'
      );
    }
  }

  /**
   * Get consent history
   */
  async getConsentHistory(): Promise<ConsentRequest[]> {
    const api = APIConfig.getHCXInstance();

    try {
      const response = await api.get('/beneficiary/consent/history');
      return response.data;
    } catch (error: any) {
      console.error('Failed to get consent history:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to get consent history'
      );
    }
  }

  /**
   * Check eligibility for a service
   */
  async checkEligibility(serviceCode: string): Promise<any> {
    const api = APIConfig.getHCXInstance();

    try {
      const response = await api.post('/beneficiary/eligibility/check', {
        service_code: serviceCode,
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to check eligibility:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to check eligibility'
      );
    }
  }

  /**
   * Search for network providers
   */
  async searchProviders(query: {
    type?: string;
    location?: string;
    specialty?: string;
  }): Promise<any[]> {
    const api = APIConfig.getHCXInstance();

    try {
      const response = await api.get('/beneficiary/providers/search', {
        params: query,
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to search providers:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to search providers'
      );
    }
  }
}

export default new HCXEnhancedService();
