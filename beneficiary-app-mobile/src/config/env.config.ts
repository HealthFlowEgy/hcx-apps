/**
 * Environment Configuration Module
 * Manages environment variables and configuration across environments
 */

import Config from 'react-native-config';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AppConfig {
  bsp: {
    apiUrl: string;
    apiKey: string;
    timeout: number;
  };
  hcx: {
    gatewayUrl: string;
    participantCode: string;
  };
  valify: {
    apiUrl: string;
    apiKey: string;
    appId: string;
  };
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  app: {
    environment: 'development' | 'staging' | 'production' | 'local';
    enableLogging: boolean;
    enableMockData: boolean;
  };
  features: {
    reimbursementClaims: boolean;
    biometricAuth: boolean;
    offlineMode: boolean;
    analytics: boolean;
  };
}

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

class EnvironmentConfig {
  private config: AppConfig;

  constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  private loadConfig(): AppConfig {
    return {
      bsp: {
        apiUrl: Config.BSP_API_URL || 'http://localhost:3000/api/v1',
        apiKey: Config.BSP_API_KEY || '',
        timeout: parseInt(Config.API_TIMEOUT || '30000', 10),
      },
      hcx: {
        gatewayUrl: Config.HCX_GATEWAY_URL || 'http://localhost:3001',
        participantCode: Config.HCX_PARTICIPANT_CODE || 'BSP001',
      },
      valify: {
        apiUrl: Config.VALIFY_API_URL || 'https://api.valify.me/v1',
        apiKey: Config.VALIFY_API_KEY || '',
        appId: Config.VALIFY_APP_ID || '',
      },
      firebase: {
        apiKey: Config.FIREBASE_API_KEY || '',
        authDomain: Config.FIREBASE_AUTH_DOMAIN || '',
        projectId: Config.FIREBASE_PROJECT_ID || '',
        storageBucket: Config.FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: Config.FIREBASE_MESSAGING_SENDER_ID || '',
        appId: Config.FIREBASE_APP_ID || '',
      },
      app: {
        environment: (Config.APP_ENV || 'development') as AppConfig['app']['environment'],
        enableLogging: Config.ENABLE_LOGGING === 'true',
        enableMockData: Config.ENABLE_MOCK_DATA === 'true',
      },
      features: {
        reimbursementClaims: Config.FEATURE_REIMBURSEMENT_CLAIMS !== 'false',
        biometricAuth: Config.FEATURE_BIOMETRIC_AUTH !== 'false',
        offlineMode: Config.FEATURE_OFFLINE_MODE === 'true',
        analytics: Config.FEATURE_ANALYTICS === 'true',
      },
    };
  }

  private validateConfig(): void {
    const errors: string[] = [];

    // Validate BSP configuration
    if (!this.config.bsp.apiUrl) {
      errors.push('BSP_API_URL is required');
    }

    // Validate HCX configuration
    if (!this.config.hcx.gatewayUrl) {
      errors.push('HCX_GATEWAY_URL is required');
    }

    if (!this.config.hcx.participantCode) {
      errors.push('HCX_PARTICIPANT_CODE is required');
    }

    // Warn about missing optional configurations
    if (!this.config.bsp.apiKey && !this.config.app.enableMockData) {
      console.warn('BSP_API_KEY is not set. API calls may fail.');
    }

    if (!this.config.valify.apiKey && !this.config.app.enableMockData) {
      console.warn('VALIFY_API_KEY is not set. KYC verification may fail.');
    }

    if (!this.config.firebase.apiKey && this.config.app.environment === 'production') {
      console.warn('FIREBASE_API_KEY is not set. Push notifications will not work.');
    }

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
    }
  }

  // ==========================================================================
  // PUBLIC GETTERS
  // ==========================================================================

  getConfig(): AppConfig {
    return { ...this.config };
  }

  getBSPConfig() {
    return { ...this.config.bsp };
  }

  getHCXConfig() {
    return { ...this.config.hcx };
  }

  getValifyConfig() {
    return { ...this.config.valify };
  }

  getFirebaseConfig() {
    return { ...this.config.firebase };
  }

  getAppConfig() {
    return { ...this.config.app };
  }

  getFeatures() {
    return { ...this.config.features };
  }

  // ==========================================================================
  // ENVIRONMENT CHECKS
  // ==========================================================================

  isDevelopment(): boolean {
    return this.config.app.environment === 'development';
  }

  isStaging(): boolean {
    return this.config.app.environment === 'staging';
  }

  isProduction(): boolean {
    return this.config.app.environment === 'production';
  }

  isLocal(): boolean {
    return this.config.app.environment === 'local';
  }

  shouldUseMockData(): boolean {
    return this.config.app.enableMockData;
  }

  shouldEnableLogging(): boolean {
    return this.config.app.enableLogging;
  }

  // ==========================================================================
  // FEATURE FLAGS
  // ==========================================================================

  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.config.features[feature];
  }

  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================

  printConfig(): void {
    if (!this.shouldEnableLogging()) return;

    console.log('='.repeat(60));
    console.log('ENVIRONMENT CONFIGURATION');
    console.log('='.repeat(60));
    console.log(`Environment: ${this.config.app.environment.toUpperCase()}`);
    console.log(`BSP API: ${this.config.bsp.apiUrl}`);
    console.log(`HCX Gateway: ${this.config.hcx.gatewayUrl}`);
    console.log(`Participant Code: ${this.config.hcx.participantCode}`);
    console.log(`Mock Data: ${this.config.app.enableMockData ? 'ENABLED' : 'DISABLED'}`);
    console.log(`Logging: ${this.config.app.enableLogging ? 'ENABLED' : 'DISABLED'}`);
    console.log('\nFeature Flags:');
    Object.entries(this.config.features).forEach(([key, value]) => {
      console.log(`  - ${key}: ${value ? 'ENABLED' : 'DISABLED'}`);
    });
    console.log('='.repeat(60));
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

const envConfig = new EnvironmentConfig();

// Print configuration in development
if (envConfig.shouldEnableLogging()) {
  envConfig.printConfig();
}

export default envConfig;