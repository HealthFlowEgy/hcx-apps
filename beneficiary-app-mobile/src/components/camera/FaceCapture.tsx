// ============================================================================
// FACE CAPTURE COMPONENT
// Location: beneficiary-app-mobile/src/components/camera/FaceCapture.tsx
// ============================================================================

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';

const { width, height } = Dimensions.get('window');

interface FaceCaptureProps {
  onCapture: (imageBase64: string) => void;
  onSkip?: () => void;
}

export const FaceCapture: React.FC<FaceCaptureProps> = ({ onCapture, onSkip }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [instruction, setInstruction] = useState('ضع وجهك في الإطار');
  const cameraRef = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.front; // Use front camera for selfie

  React.useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const permission = await Camera.requestCameraPermission();
    setHasPermission(permission === 'authorized');
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      setIsProcessing(true);
      setInstruction('جاري التقاط الصورة...');

      const photo = await cameraRef.current.takePhoto({
        qualityPrioritization: 'quality',
        flash: 'off',
      });

      // Convert to base64
      const base64 = await RNFS.readFile(photo.path, 'base64');
      setCapturedImage(`data:image/jpeg;base64,${base64}`);
      setIsProcessing(false);
      setInstruction('ضع وجهك في الإطار');
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('خطأ', 'فشل التقاط الصورة. حاول مرة أخرى.');
      setIsProcessing(false);
      setInstruction('ضع وجهك في الإطار');
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      // Remove data:image/jpeg;base64, prefix
      const base64Only = capturedImage.split(',')[1];
      onCapture(base64Only);
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Icon name="person-circle-outline" size={80} color="#ccc" />
        <Text style={styles.permissionText}>
          نحتاج إلى إذن الكاميرا لالتقاط صورة شخصية
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
          <Text style={styles.permissionButtonText}>منح الإذن</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>جاري تحميل الكاميرا...</Text>
      </View>
    );
  }

  // Preview captured image
  if (capturedImage) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>صورتك الشخصية</Text>
        </View>

        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          
          <View style={styles.checklistContainer}>
            <Text style={styles.checklistTitle}>تأكد من:</Text>
            <View style={styles.checklistItem}>
              <Icon name="checkmark-circle" size={20} color="#34C759" />
              <Text style={styles.checklistText}>الوجه واضح ومرئي بالكامل</Text>
            </View>
            <View style={styles.checklistItem}>
              <Icon name="checkmark-circle" size={20} color="#34C759" />
              <Text style={styles.checklistText}>الإضاءة جيدة</Text>
            </View>
            <View style={styles.checklistItem}>
              <Icon name="checkmark-circle" size={20} color="#34C759" />
              <Text style={styles.checklistText}>لا توجد نظارات شمسية أو قبعة</Text>
            </View>
          </View>
        </View>

        <View style={styles.previewActions}>
          <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
            <Icon name="refresh" size={24} color="#fff" />
            <Text style={styles.retakeButtonText}>إعادة التقاط</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.confirmButton} onPress={confirmPhoto}>
            <Icon name="checkmark" size={24} color="#fff" />
            <Text style={styles.confirmButtonText}>تأكيد</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Camera view
  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />

      {/* Overlay with guide */}
      <View style={styles.overlay}>
        <View style={styles.topOverlay}>
          <Text style={styles.instructionText}>{instruction}</Text>
          <Text style={styles.subInstructionText}>
            تأكد من وضوح الوجه والإضاءة الجيدة
          </Text>
        </View>

        {/* Face oval guide */}
        <View style={styles.frameContainer}>
          <View style={styles.faceOval}>
            {/* Guide dots */}
            <View style={[styles.guideDot, styles.topDot]} />
            <View style={[styles.guideDot, styles.leftDot]} />
            <View style={[styles.guideDot, styles.rightDot]} />
            <View style={[styles.guideDot, styles.bottomDot]} />
          </View>
        </View>

        {/* Bottom controls */}
        <View style={styles.bottomOverlay}>
          <View style={styles.tipsContainer}>
            <View style={styles.tipRow}>
              <Icon name="sunny" size={20} color="#FFD60A" />
              <Text style={styles.tipText}>تأكد من الإضاءة الجيدة</Text>
            </View>
            <View style={styles.tipRow}>
              <Icon name="glasses-outline" size={20} color="#fff" />
              <Text style={styles.tipText}>انزع النظارات الشمسية</Text>
            </View>
          </View>

          {isProcessing ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <View style={styles.controlsRow}>
              {onSkip && (
                <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
                  <Text style={styles.skipButtonText}>تخطي</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <View style={styles.captureButtonInner}>
                  <Icon name="person" size={30} color="#007AFF" />
                </View>
              </TouchableOpacity>
              
              <View style={styles.skipButton} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
    color: '#333',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    marginTop: 20,
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    alignItems: 'center',
  },
  instructionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subInstructionText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  frameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceOval: {
    width: width * 0.7,
    height: width * 0.9,
    borderWidth: 3,
    borderColor: '#007AFF',
    borderRadius: (width * 0.7) / 2,
    position: 'relative',
  },
  guideDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
  topDot: {
    top: 20,
    left: '50%',
    marginLeft: -4,
  },
  leftDot: {
    left: 20,
    top: '50%',
    marginTop: -4,
  },
  rightDot: {
    right: 20,
    top: '50%',
    marginTop: -4,
  },
  bottomDot: {
    bottom: 20,
    left: '50%',
    marginLeft: -4,
  },
  bottomOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  tipsContainer: {
    marginBottom: 20,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 10,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    width: 60,
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    paddingVertical: 20,
  },
  previewImage: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  checklistContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 12,
    width: width * 0.9,
  },
  checklistTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checklistText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 10,
  },
  previewActions: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'space-around',
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
  },
  retakeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
