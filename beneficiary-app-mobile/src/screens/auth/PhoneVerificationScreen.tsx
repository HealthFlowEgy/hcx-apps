// ============================================================================
// PHONE VERIFICATION SCREEN
// Location: beneficiary-app-mobile/src/screens/auth/PhoneVerificationScreen.tsx
// ============================================================================

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../navigation/types';

type PhoneVerificationNavigationProp = StackNavigationProp<RootStackParamList, 'PhoneVerification'>;

interface Props {
  navigation: PhoneVerificationNavigationProp;
}

const PhoneVerificationScreen: React.FC<Props> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  
  const otpInputs = useRef<Array<TextInput | null>>([]);

  const handleSendOtp = async () => {
    if (phoneNumber.length < 11) {
      Alert.alert('خطأ', 'الرجاء إدخال رقم هاتف صحيح');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsOtpSent(true);
      Alert.alert('تم', 'تم إرسال رمز التحقق إلى هاتفك');
      startTimer();
    }, 1500);
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits entered
    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (otpCode: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to KYC screen
      navigation.navigate('KYC', { phoneNumber: `+20${phoneNumber}` });
    }, 1500);
  };

  const handleResendOtp = () => {
    if (timer > 0) return;
    
    setTimer(60);
    startTimer();
    Alert.alert('تم', 'تم إعادة إرسال رمز التحقق');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="phone-portrait" size={80} color="#007AFF" />
        </View>

        <Text style={styles.title}>التحقق من رقم الهاتف</Text>
        <Text style={styles.subtitle}>
          {isOtpSent
            ? 'أدخل رمز التحقق المرسل إلى هاتفك'
            : 'أدخل رقم هاتفك للحصول على رمز التحقق'}
        </Text>

        {!isOtpSent ? (
          <>
            {/* Phone Number Input */}
            <View style={styles.phoneInputContainer}>
              <Text style={styles.countryCode}>+20</Text>
              <TextInput
                style={styles.phoneInput}
                placeholder="1XXXXXXXXX"
                keyboardType="phone-pad"
                maxLength={11}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>

            <TouchableOpacity
              style={[styles.sendButton, isLoading && styles.buttonDisabled]}
              onPress={handleSendOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.sendButtonText}>إرسال رمز التحقق</Text>
                  <Icon name="arrow-forward" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* OTP Input */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (otpInputs.current[index] = ref)}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleOtpKeyPress(e, index)}
                />
              ))}
            </View>

            {/* Resend Timer */}
            <View style={styles.resendContainer}>
              {timer > 0 ? (
                <Text style={styles.timerText}>
                  إعادة الإرسال بعد {timer} ثانية
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResendOtp}>
                  <Text style={styles.resendText}>إعادة إرسال الرمز</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={[styles.verifyButton, isLoading && styles.buttonDisabled]}
              onPress={() => handleVerifyOtp(otp.join(''))}
              disabled={isLoading || otp.some(digit => !digit)}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.verifyButtonText}>تحقق</Text>
                  <Icon name="checkmark" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  countryCode: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    color: '#000',
    paddingVertical: 15,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    width: 50,
    height: 60,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 14,
    color: '#666',
  },
  resendText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default PhoneVerificationScreen;
