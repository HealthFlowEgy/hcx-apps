import axios, { AxiosInstance, AxiosError } from 'axios';

export class APIConfig {
  private static hcxInstance: AxiosInstance;
  private static valifyInstance: AxiosInstance;

  static initializeHCXAPI(): AxiosInstance {
    this.hcxInstance = axios.create({
      baseURL: import.meta.env.VITE_HCX_API_URL || 'http://localhost:8080',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-HCX-Version': import.meta.env.VITE_HCX_API_VERSION || 'v0.9',
      },
    });

    // Add auth interceptor
    this.hcxInstance.interceptors.request.use(
      async (config) => {
        const token = localStorage.getItem('hcx_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add error interceptor
    this.hcxInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired - logout user
          localStorage.removeItem('hcx_token');
          localStorage.removeItem('user_data');
          // Redirect to login
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    return this.hcxInstance;
  }

  static initializeValifyAPI(): AxiosInstance {
    this.valifyInstance = axios.create({
      baseURL: import.meta.env.VITE_VALIFY_API_URL || 'https://api.valify.me',
      timeout: 60000, // Longer timeout for image processing
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add error interceptor
    this.valifyInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('Valify API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );

    return this.valifyInstance;
  }

  static getHCXInstance(): AxiosInstance {
    if (!this.hcxInstance) {
      this.initializeHCXAPI();
    }
    return this.hcxInstance;
  }

  static getValifyInstance(): AxiosInstance {
    if (!this.valifyInstance) {
      this.initializeValifyAPI();
    }
    return this.valifyInstance;
  }

  static setHCXToken(token: string): void {
    localStorage.setItem('hcx_token', token);
  }

  static getHCXToken(): string | null {
    return localStorage.getItem('hcx_token');
  }

  static clearHCXToken(): void {
    localStorage.removeItem('hcx_token');
    localStorage.removeItem('user_data');
  }
}

// Initialize on module load
APIConfig.initializeHCXAPI();
APIConfig.initializeValifyAPI();
