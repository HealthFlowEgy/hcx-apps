// ============================================================================
// HCX PROTOCOL SERVICE
// Complete implementation of HCX Protocol v0.9 APIs
// Location: beneficiary-app-mobile/src/services/hcx.protocol.service.ts
// ============================================================================

import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * HCX Protocol Service
 * 
 * Implements all HCX Protocol v0.9 endpoints for:
 * - Coverage Eligibility
 * - Claims Management
 * - Pre-Authorization
 * - Communication
 * - Notifications
 * - Status Checking
 * - Participant Registry
 */
class HCXProtocolService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.HCX_API_URL || 'http://localhost:8082/api/v1';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, redirect to login
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('beneficiaryData');
        }
        return Promise.reject(error);
      }
    );
  }

  // ============================================================================
  // COVERAGE ELIGIBILITY APIs
  // ============================================================================

  /**
   * Check coverage eligibility
   * @param data Eligibility check request data
   */
  async checkCoverageEligibility(data: {
    providerId: string;
    serviceType: string;
    treatmentType?: string;
    estimatedAmount?: number;
  }) {
    try {
      const response = await this.api.post('/coverageeligibility/check', {
        provider_id: data.providerId,
        service_type: data.serviceType,
        treatment_type: data.treatmentType,
        estimated_amount: data.estimatedAmount,
      });
      return response.data;
    } catch (error: any) {
      console.error('Coverage eligibility check failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to check eligibility');
    }
  }

  /**
   * Handle eligibility check response (callback)
   * @param requestId Request ID to check status
   */
  async getEligibilityResponse(requestId: string) {
    try {
      const response = await this.api.get(`/coverageeligibility/status/${requestId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get eligibility response:', error);
      throw new Error(error.response?.data?.message || 'Failed to get response');
    }
  }

  // ============================================================================
  // CLAIMS APIs
  // ============================================================================

  /**
   * Submit a new claim
   * @param claimData Claim submission data
   */
  async submitClaim(claimData: {
    policyId: string;
    providerId: string;
    treatmentType: string;
    diagnosisCode: string;
    claimAmount: number;
    billDate: string;
    documents: string[]; // Document IDs
    items: Array<{
      serviceName: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }>;
  }) {
    try {
      const response = await this.api.post('/claim/submit', {
        policy_id: claimData.policyId,
        provider_id: claimData.providerId,
        treatment_type: claimData.treatmentType,
        diagnosis_code: claimData.diagnosisCode,
        claim_amount: claimData.claimAmount,
        bill_date: claimData.billDate,
        documents: claimData.documents,
        items: claimData.items,
      });
      return response.data;
    } catch (error: any) {
      console.error('Claim submission failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to submit claim');
    }
  }

  /**
   * Get claim response/status
   * @param claimId Claim ID
   */
  async getClaimResponse(claimId: string) {
    try {
      const response = await this.api.get(`/claim/status/${claimId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get claim response:', error);
      throw new Error(error.response?.data?.message || 'Failed to get claim status');
    }
  }

  /**
   * Get all claims for beneficiary
   */
  async getClaims(filters?: {
    status?: string;
    fromDate?: string;
    toDate?: string;
  }) {
    try {
      const response = await this.api.get('/claims', { params: filters });
      return response.data;
    } catch (error: any) {
      console.error('Failed to get claims:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch claims');
    }
  }

  /**
   * Get claim details
   * @param claimId Claim ID
   */
  async getClaimDetails(claimId: string) {
    try {
      const response = await this.api.get(`/claims/${claimId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get claim details:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch claim details');
    }
  }

  // ============================================================================
  // PRE-AUTHORIZATION APIs
  // ============================================================================

  /**
   * Submit pre-authorization request
   * @param preAuthData Pre-auth request data
   */
  async submitPreAuth(preAuthData: {
    policyId: string;
    providerId: string;
    treatmentType: string;
    diagnosisCode: string;
    estimatedAmount: number;
    proposedDate: string;
    documents: string[];
  }) {
    try {
      const response = await this.api.post('/preauth/submit', {
        policy_id: preAuthData.policyId,
        provider_id: preAuthData.providerId,
        treatment_type: preAuthData.treatmentType,
        diagnosis_code: preAuthData.diagnosisCode,
        estimated_amount: preAuthData.estimatedAmount,
        proposed_date: preAuthData.proposedDate,
        documents: preAuthData.documents,
      });
      return response.data;
    } catch (error: any) {
      console.error('Pre-auth submission failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to submit pre-authorization');
    }
  }

  /**
   * Get pre-auth response/status
   * @param preAuthId Pre-auth ID
   */
  async getPreAuthResponse(preAuthId: string) {
    try {
      const response = await this.api.get(`/preauth/status/${preAuthId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get pre-auth response:', error);
      throw new Error(error.response?.data?.message || 'Failed to get pre-auth status');
    }
  }

  // ============================================================================
  // COMMUNICATION APIs
  // ============================================================================

  /**
   * Send communication/query request
   * @param communicationData Communication data
   */
  async sendCommunication(communicationData: {
    relatedTo: string; // claim_id or preauth_id
    relatedType: 'claim' | 'preauth';
    message: string;
    recipientId: string;
  }) {
    try {
      const response = await this.api.post('/communication/request', {
        related_to: communicationData.relatedTo,
        related_type: communicationData.relatedType,
        message: communicationData.message,
        recipient_id: communicationData.recipientId,
      });
      return response.data;
    } catch (error: any) {
      console.error('Communication request failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to send communication');
    }
  }

  /**
   * Get communication response
   * @param communicationId Communication ID
   */
  async getCommunicationResponse(communicationId: string) {
    try {
      const response = await this.api.get(`/communication/${communicationId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get communication:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch communication');
    }
  }

  // ============================================================================
  // NOTIFICATION APIs
  // ============================================================================

  /**
   * Subscribe to notifications
   * @param topics Topics to subscribe to
   */
  async subscribeToNotifications(topics: string[]) {
    try {
      const response = await this.api.post('/notification/subscribe', {
        topics,
      });
      return response.data;
    } catch (error: any) {
      console.error('Notification subscription failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to subscribe to notifications');
    }
  }

  /**
   * Unsubscribe from notifications
   * @param topics Topics to unsubscribe from
   */
  async unsubscribeFromNotifications(topics: string[]) {
    try {
      const response = await this.api.post('/notification/unsubscribe', {
        topics,
      });
      return response.data;
    } catch (error: any) {
      console.error('Notification unsubscribe failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to unsubscribe');
    }
  }

  /**
   * Get notification subscriptions
   */
  async getNotificationSubscriptions() {
    try {
      const response = await this.api.get('/notification/subscription/list');
      return response.data;
    } catch (error: any) {
      console.error('Failed to get subscriptions:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch subscriptions');
    }
  }

  /**
   * Get available notification topics
   */
  async getNotificationTopics() {
    try {
      const response = await this.api.get('/notification/topic/list');
      return response.data;
    } catch (error: any) {
      console.error('Failed to get topics:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch topics');
    }
  }

  /**
   * Update notification subscription
   * @param subscriptionId Subscription ID
   * @param enabled Enable/disable subscription
   */
  async updateNotificationSubscription(subscriptionId: string, enabled: boolean) {
    try {
      const response = await this.api.post('/notification/subscription/update', {
        subscription_id: subscriptionId,
        enabled,
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to update subscription:', error);
      throw new Error(error.response?.data?.message || 'Failed to update subscription');
    }
  }

  // ============================================================================
  // STATUS & SEARCH APIs
  // ============================================================================

  /**
   * Check status of any HCX request
   * @param requestId Request ID
   */
  async checkStatus(requestId: string) {
    try {
      const response = await this.api.get(`/hcx/status/${requestId}`);
      return response.data;
    } catch (error: any) {
      console.error('Status check failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to check status');
    }
  }

  /**
   * Search participants (providers, payors)
   * @param filters Search filters
   */
  async searchParticipants(filters: {
    participantType?: 'provider' | 'payor';
    name?: string;
    location?: string;
    specialty?: string;
  }) {
    try {
      const response = await this.api.post('/participant/search', filters);
      return response.data;
    } catch (error: any) {
      console.error('Participant search failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to search participants');
    }
  }

  /**
   * Get participant details
   * @param participantCode Participant code
   */
  async getParticipantDetails(participantCode: string) {
    try {
      const response = await this.api.get(`/participant/${participantCode}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get participant details:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch participant');
    }
  }

  // ============================================================================
  // DOCUMENT MANAGEMENT
  // ============================================================================

  /**
   * Upload document
   * @param file File to upload
   * @param metadata Document metadata
   */
  async uploadDocument(file: {
    uri: string;
    type: string;
    name: string;
  }, metadata: {
    documentType: string;
    relatedTo?: string;
    relatedType?: string;
  }) {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);
      formData.append('document_type', metadata.documentType);
      if (metadata.relatedTo) {
        formData.append('related_to', metadata.relatedTo);
      }
      if (metadata.relatedType) {
        formData.append('related_type', metadata.relatedType);
      }

      const response = await this.api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Document upload failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload document');
    }
  }

  /**
   * Get document
   * @param documentId Document ID
   */
  async getDocument(documentId: string) {
    try {
      const response = await this.api.get(`/documents/${documentId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get document:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch document');
    }
  }
}

export default new HCXProtocolService();
