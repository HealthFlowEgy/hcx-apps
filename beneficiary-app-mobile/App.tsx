/**
 * App.tsx - Main Application Entry Point
 * Initializes services and sets up navigation
 */

import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';

// Services
import { initializeHCXService } from './services/hcx.protocol.service';
import envConfig from './config/env.config';

// Navigation
import RootNavigator from './navigation/RootNavigator';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('🚀 Initializing HCX Beneficiary App...');

      // Print environment configuration
      envConfig.printConfig();

      // Initialize HCX Service
      const bspConfig = envConfig.getBSPConfig();
      const hcxConfig = envConfig.getHCXConfig();

      initializeHCXService({
        bspApiUrl: bspConfig.apiUrl,
        hcxGatewayUrl: hcxConfig.gatewayUrl,
        participantCode: hcxConfig.participantCode,
        apiKey: bspConfig.apiKey,
        timeout: bspConfig.timeout,
      });

      console.log('✅ HCX Service initialized successfully');

      // Initialize Firebase (for notifications) - if configured
      if (envConfig.getFirebaseConfig().apiKey) {
        // TODO: Initialize Firebase
        console.log('✅ Firebase initialized (placeholder)');
      }

      // Initialize other services as needed
      // TODO: Initialize analytics, crash reporting, etc.

      setIsInitialized(true);
      console.log('✅ App initialization complete');
    } catch (error: any) {
      console.error('❌ App initialization failed:', error);
      setInitError(error.message || 'Initialization failed');
    }
  };

  // ==========================================================================
  // LOADING STATE
  // ==========================================================================

  if (!isInitialized && !initError) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>جاري تحميل التطبيق...</Text>
      </View>
    );
  }

  // ==========================================================================
  // ERROR STATE
  // ==========================================================================

  if (initError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>خطأ في التهيئة</Text>
        <Text style={styles.errorMessage}>{initError}</Text>
        <Text style={styles.errorHint}>
          يرجى التحقق من إعدادات التطبيق والمحاولة مرة أخرى
        </Text>
      </View>
    );
  }

  // ==========================================================================
  // MAIN APP
  // ==========================================================================

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Cairo-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 32,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontFamily: 'Cairo-Bold',
    color: '#F44336',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    fontFamily: 'Cairo-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorHint: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#999',
    textAlign: 'center',
  },
});

export default App;