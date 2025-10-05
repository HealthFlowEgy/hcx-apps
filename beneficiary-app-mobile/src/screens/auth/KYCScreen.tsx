// ============================================================================
// KYC SCREEN - Complete Identity Verification
// Location: beneficiary-app-mobile/src/screens/auth/KYCScreen.tsx
// ============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../navigation/types';
import { IDScanner } from '../../components/camera/IDScanner';
import { FaceCapture } from '../../components/camera/FaceCapture';
import ValifyService from '../../services/valify.service';
import HCXEnhancedService from '../../services/hcx.enhanced.service';

type KYCScreenNavigationProp = StackNavigationProp<RootStackParamList, 'KYC'>;
type KYCScreenRouteProp = RouteProp<RootStackParamList, 'KYC'>;

interface Props {
  navigation: KYCScreenNavigationProp;
  route: KYCScreenRouteProp;
}

type KYCStep = 'intro' | 'id-front' | 'id-back' | 'selfie' | 'processing';

interface KYCData {
  phoneNumber: string;
  idFrontImage: string | null;
  idBackImage: string | null;
  selfieImage: string | null;
  extractedData: any | null;
}

export const KYCScreen: React.FC<Props> = ({ navigation, route }) => {
  const { phoneNumber } = route.params;
  
  const [currentStep, setCurrentStep] = useState<KYCStep>('intro');
  const [kycData, setKycData] = useState<KYCData>({
    phoneNumber,
    idFrontImage: null,
    idBackImage: null,
    selfieImage: null,
    extractedData: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');

  // Handle ID front capture
  const handleIDFrontCapture = (imageBase64: string) => {
    setKycData({ ...kycData, idFrontImage: imageBase64 });
    setCurrentStep('id-back');
  };

  // Handle ID back capture
  const handleIDBackCapture = (imageBase64: string) => {
    setKycData({ ...kycData, idBackImage: imageBase64 });
    setCurrentStep('selfie');
  };

  // Handle selfie capture
  const handleSelfieCapture = (imageBase64: string) => {
    setKycData({ ...kycData, selfieImage: imageBase64 });
    setCurrentStep('processing');
    processKYC(kycData.idFrontImage!, kycData.idBackImage!, imageBase64);
  };

  // Process complete KYC
  const processKYC = async (
    idFront: string,
    idBack: string,
    selfie: string
  ) => {
    try {
      setIsProcessing(true);

      // Step 1: Process National ID with Valify OCR
      setProcessingMessage('جاري قراءة بيانات بطاقة الهوية...');
      const ocrResult = await ValifyService.processNationalID(idFront, idBack);
      
      if (!ocrResult.success) {
        throw new Error(ocrResult.error || 'فشل قراءة بيانات بطاقة الهوية');
      }

      setKycData({ ...kycData, extractedData: ocrResult.data });

      // Step 2: Verify face match with Valify
      setProcessingMessage('جاري التحقق من مطابقة الوجه...');
      const faceMatchResult = await ValifyService.verifyFaceMatch(selfie, idFront);
      
      if (!faceMatchResult.success || !faceMatchResult.data?.isMatch) {
        Alert.alert(
          'تحذير',
          'لم نتمكن من التحقق من مطابقة الوجه. هل تريد المتابعة؟',
          [
            { text: 'إعادة المحاولة', onPress: () => setCurrentStep('selfie') },
            { text: 'متابعة', onPress: () => registerBeneficiary(ocrResult.data) },
          ]
        );
        return;
      }

      // Step 3: Register beneficiary with HCX
      await registerBeneficiary(ocrResult.data);
      
    } catch (error: any) {
      console.error('KYC Processing Error:', error);
      setIsProcessing(false);
      Alert.alert(
        'خطأ في التحقق',
        error.message || 'حدث خطأ أثناء معالجة بياناتك',
        [
          { text: 'إعادة المحاولة', onPress: () => setCurrentStep('intro') },
        ]
      );
    }
  };

  // Register beneficiary with HCX
  const registerBeneficiary = async (extractedData: any) => {
    try {
      setProcessingMessage('جاري إنشاء حسابك...');

      const beneficiaryData = {
        phoneNumber: kycData.phoneNumber,
        nationalId: extractedData.nationalId,
        fullName: extractedData.fullName,
        dateOfBirth: extractedData.dateOfBirth,
        gender: extractedData.gender,
        nationality: extractedData.nationality,
        address: extractedData.address,
        idFrontImage: kycData.idFrontImage!,
        idBackImage: kycData.idBackImage!,
        selfieImage: kycData.selfieImage!,
      };

      const registrationResult = await HCXEnhancedService.registerBeneficiary(
        beneficiaryData
      );

      if (!registrationResult.success) {
        throw new Error(registrationResult.error || 'فشل إنشاء الحساب');
      }

      // Get ESHIC card
      setProcessingMessage('جاري إصدار بطاقة التأمين الصحي...');
      const eshicResult = await HCXEnhancedService.getESHICCard(
        registrationResult.data.beneficiaryId
      );

      setIsProcessing(false);

      // Navigate to success screen
      navigation.replace('RegistrationSuccess', {
        beneficiary: registrationResult.data,
        eshicCard: eshicResult.data,
      });

    } catch (error: any) {
      console.error('Registration Error:', error);
      setIsProcessing(false);
      Alert.alert(
        'خطأ في التسجيل',
        error.message || 'حدث خطأ أثناء إنشاء حسابك',
        [
          { text: 'إعادة المحاولة', onPress: () => setCurrentStep('intro') },
        ]
      );
    }
  };

  // Render intro screen
  const renderIntro = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Icon name="shield-checkmark" size={80} color="#007AFF" />
        <Text style={styles.title}>التحقق من الهوية</Text>
        <Text style={styles.subtitle}>
          نحتاج إلى التحقق من هويتك لإنشاء حسابك
        </Text>
      </View>

      <View style={styles.stepsContainer}>
        <Text style={styles.stepsTitle}>الخطوات المطلوبة:</Text>
        
        <View style={styles.stepCard}>
          <View style={styles.stepIconContainer}>
            <Icon name="card" size={30} color="#007AFF" />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>1. صورة بطاقة الهوية</Text>
            <Text style={styles.stepDescription}>
              سنحتاج إلى صور للوجه الأمامي والخلفي لبطاقة هويتك الوطنية
            </Text>
          </View>
        </View>

        <View style={styles.stepCard}>
          <View style={styles.stepIconContainer}>
            <Icon name="person-circle" size={30} color="#007AFF" />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>2. صورة شخصية</Text>
            <Text style={styles.stepDescription}>
              التقط صورة سيلفي للتحقق من مطابقة الوجه مع بطاقة الهوية
            </Text>
          </View>
        </View>

        <View style={styles.stepCard}>
          <View style={styles.stepIconContainer}>
            <Icon name="checkmark-circle" size={30} color="#34C759" />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>3. التحقق والموافقة</Text>
            <Text style={styles.stepDescription}>
              سيتم التحقق من بياناتك تلقائياً وإصدار بطاقة التأمين الصحي
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.noticeContainer}>
        <Icon name="information-circle" size={24} color="#FF9500" />
        <Text style={styles.noticeText}>
          جميع بياناتك محمية ومشفرة. نستخدم تقنيات متقدمة للتحقق من الهوية بشكل آمن.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => setCurrentStep('id-front')}
      >
        <Text style={styles.startButtonText}>ابدأ التحقق</Text>
        <Icon name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );

  // Render processing screen
  const renderProcessing = () => (
    <View style={styles.processingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.processingTitle}>جاري المعالجة...</Text>
      <Text style={styles.processingMessage}>{processingMessage}</Text>
      
      <View style={styles.processingSteps}>
        <View style={styles.processingStep}>
          <Icon 
            name={kycData.idFrontImage ? "checkmark-circle" : "ellipse-outline"} 
            size={24} 
            color={kycData.idFrontImage ? "#34C759" : "#ccc"} 
          />
          <Text style={styles.processingStepText}>بطاقة الهوية - الوجه الأمامي</Text>
        </View>
        
        <View style={styles.processingStep}>
          <Icon 
            name={kycData.idBackImage ? "checkmark-circle" : "ellipse-outline"} 
            size={24} 
            color={kycData.idBackImage ? "#34C759" : "#ccc"} 
          />
          <Text style={styles.processingStepText}>بطاقة الهوية - الوجه الخلفي</Text>
        </View>
        
        <View style={styles.processingStep}>
          <Icon 
            name={kycData.selfieImage ? "checkmark-circle" : "ellipse-outline"} 
            size={24} 
            color={kycData.selfieImage ? "#34C759" : "#ccc"} 
          />
          <Text style={styles.processingStepText}>الصورة الشخصية</Text>
        </View>
        
        <View style={styles.processingStep}>
          <Icon 
            name={isProcessing ? "hourglass" : "ellipse-outline"} 
            size={24} 
            color={isProcessing ? "#007AFF" : "#ccc"} 
          />
          <Text style={styles.processingStepText}>التحقق والتسجيل</Text>
        </View>
      </View>
    </View>
  );

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'intro':
        return renderIntro();
      
      case 'id-front':
        return (
          <IDScanner
            side="front"
            onCapture={handleIDFrontCapture}
          />
        );
      
      case 'id-back':
        return (
          <IDScanner
            side="back"
            onCapture={handleIDBackCapture}
          />
        );
      
      case 'selfie':
        return (
          <FaceCapture
            onCapture={handleSelfieCapture}
          />
        );
      
      case 'processing':
        return renderProcessing();
      
      default:
        return renderIntro();
    }
  };

  return (
    <View style={styles.screenContainer}>
      {renderCurrentStep()}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  stepsContainer: {
    marginBottom: 30,
  },
  stepsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  stepIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  noticeContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
  },
  noticeText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  processingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 30,
    marginBottom: 10,
  },
  processingMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  processingSteps: {
    width: '100%',
    maxWidth: 400,
  },
  processingStep: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    marginBottom: 10,
  },
  processingStepText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 15,
  },
});

export default KYCScreen;
