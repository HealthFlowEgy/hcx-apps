import { APIConfig } from './api.config';
import {
  NationalIDData,
  FaceMatchResult,
  LivenessResult,
  ValifyOAuthResponse,
  ValifyOCRResponse,
  ValifyFaceMatchResponse,
} from '../types/valify.types';

class ValifyService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  /**
   * Get OAuth access token from Valify
   */
  async getAccessToken(): Promise<string> {
    // Check if token is still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const clientId = import.meta.env.VITE_VALIFY_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_VALIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Valify credentials not configured');
    }

    const credentials = btoa(`${clientId}:${clientSecret}`);
    const api = APIConfig.getValifyInstance();

    try {
      const response = await api.post<ValifyOAuthResponse>(
        '/o/token/',
        new URLSearchParams({
          grant_type: 'client_credentials',
        }),
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      // Set expiry to 5 minutes before actual expiry for safety
      this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;

      return this.accessToken;
    } catch (error: any) {
      console.error('Failed to get Valify access token:', error);
      throw new Error('Failed to authenticate with Valify service');
    }
  }

  /**
   * Perform OCR on Egyptian National ID (front and back)
   */
  async scanNationalID(
    frontImage: File,
    backImage: File
  ): Promise<NationalIDData> {
    const token = await this.getAccessToken();
    const api = APIConfig.getValifyInstance();

    const formData = new FormData();
    formData.append('front_image', frontImage);
    formData.append('back_image', backImage);

    try {
      const response = await api.post<ValifyOCRResponse>(
        '/v1/services/national-id/ocr',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const data = response.data.data;

      return {
        transactionId: response.data.transaction_id,
        nationalId: data.national_id,
        fullNameArabic: data.full_name_arabic,
        fullNameEnglish: data.full_name_english,
        dateOfBirth: data.date_of_birth,
        gender: data.gender as 'M' | 'F',
        address: data.address,
        governorate: data.governorate,
        religion: data.religion,
        maritalStatus: data.marital_status,
      };
    } catch (error: any) {
      console.error('National ID OCR failed:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to scan National ID'
      );
    }
  }

  /**
   * Verify face match between selfie and ID photo
   */
  async verifyFaceMatch(
    selfieImage: File,
    idImage: File
  ): Promise<FaceMatchResult> {
    const token = await this.getAccessToken();
    const api = APIConfig.getValifyInstance();

    const formData = new FormData();
    formData.append('selfie_image', selfieImage);
    formData.append('id_image', idImage);

    try {
      const response = await api.post<ValifyFaceMatchResponse>(
        '/v1/services/face-match',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return {
        transactionId: response.data.transaction_id,
        matchScore: response.data.match_score,
        isMatch: response.data.is_match,
        confidence: response.data.confidence,
      };
    } catch (error: any) {
      console.error('Face match verification failed:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to verify face match'
      );
    }
  }

  /**
   * Perform liveness detection (optional)
   */
  async verifyLiveness(video: File): Promise<LivenessResult> {
    const token = await this.getAccessToken();
    const api = APIConfig.getValifyInstance();

    const formData = new FormData();
    formData.append('video', video);

    try {
      const response = await api.post(
        '/v1/services/liveness',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return {
        transactionId: response.data.transaction_id,
        isLive: response.data.is_live,
        confidenceScore: response.data.confidence_score,
      };
    } catch (error: any) {
      console.error('Liveness verification failed:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to verify liveness'
      );
    }
  }

  /**
   * Complete e-KYC flow: ID scan + face match
   */
  async completeKYC(
    frontImage: File,
    backImage: File,
    selfieImage: File
  ): Promise<{
    idData: NationalIDData;
    faceMatch: FaceMatchResult;
  }> {
    try {
      // Step 1: Scan National ID
      const idData = await this.scanNationalID(frontImage, backImage);

      // Step 2: Verify face match
      // Note: We need to extract the face from the ID card
      // For now, we'll use the front image as a proxy
      const faceMatch = await this.verifyFaceMatch(selfieImage, frontImage);

      // Check if face match score is acceptable (>70%)
      if (faceMatch.matchScore < 70) {
        throw new Error('Face verification failed. Match score too low.');
      }

      return {
        idData,
        faceMatch,
      };
    } catch (error: any) {
      console.error('KYC process failed:', error);
      throw error;
    }
  }
}

export default new ValifyService();
