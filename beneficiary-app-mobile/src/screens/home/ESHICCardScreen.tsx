// ============================================================================
// ESHIC CARD SCREEN - Digital Insurance Card Display
// Location: beneficiary-app-mobile/src/screens/home/ESHICCardScreen.tsx
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeStackParamList } from '../../navigation/types';

type ESHICCardNavigationProp = StackNavigationProp<HomeStackParamList, 'ESHICCard'>;

interface Props {
  navigation: ESHICCardNavigationProp;
}

const { width } = Dimensions.get('window');

const ESHICCardScreen: React.FC<Props> = ({ navigation }) => {
  const [eshicCard, setEshicCard] = useState<any>(null);
  const [beneficiary, setBeneficiary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    loadCardData();
  }, []);

  const loadCardData = async () => {
    try {
      const [cardData, beneficiaryData] = await Promise.all([
        AsyncStorage.getItem('eshicCard'),
        AsyncStorage.getItem('beneficiaryData'),
      ]);

      if (cardData) {
        setEshicCard(JSON.parse(cardData));
      } else {
        // Mock ESHIC data
        setEshicCard({
          cardNumber: 'EG-ESHIC-2024-001234',
          issueDate: '2024-01-01',
          expiryDate: '2024-12-31',
          status: 'active',
          insuranceProvider: 'شركة التأمين الوطنية',
          coverageType: 'شامل',
          emergencyNumber: '16123',
        });
      }

      if (beneficiaryData) {
        setBeneficiary(JSON.parse(beneficiaryData));
      }
    } catch (error) {
      console.error('Error loading card data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `بطاقة التأمين الصحي ESHIC\nرقم البطاقة: ${eshicCard?.cardNumber}\nالاسم: ${beneficiary?.fullName}`,
        title: 'بطاقة ESHIC',
      });
    } catch (error) {
      console.error('Error sharing card:', error);
    }
  };

  const handleDownload = () => {
    Alert.alert(
      'تحميل البطاقة',
      'هل تريد حفظ البطاقة كصورة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حفظ',
          onPress: () => {
            Alert.alert('تم', 'تم حفظ البطاقة في المعرض');
          },
        },
      ]
    );
  };

  const handleEmergencyCall = () => {
    Alert.alert(
      'اتصال طوارئ',
      `هل تريد الاتصال بالرقم ${eshicCard?.emergencyNumber}؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'اتصال',
          onPress: () => {
            console.log('Calling emergency number');
          },
        },
      ]
    );
  };

  const toggleCardSide = () => {
    setShowBack(!showBack);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>جاري تحميل البطاقة...</Text>
      </View>
    );
  }

  const qrData = JSON.stringify({
    cardNumber: eshicCard?.cardNumber,
    name: beneficiary?.fullName,
    nationalId: beneficiary?.nationalId,
    expiryDate: eshicCard?.expiryDate,
  });

  return (
    <ScrollView style={styles.container}>
      {/* Card Display */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={toggleCardSide}
          style={styles.cardTouchable}
        >
          {!showBack ? (
            // Front Side
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardLogo}>
                  <Icon name="shield" size={40} color="#fff" />
                </View>
                <View style={styles.cardHeaderText}>
                  <Text style={styles.cardTitle}>ESHIC</Text>
                  <Text style={styles.cardSubtitle}>بطاقة التأمين الصحي</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardLabel}>الاسم</Text>
                  <Text style={styles.cardValue}>{beneficiary?.fullName}</Text>
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.cardLabel}>رقم البطاقة</Text>
                  <Text style={styles.cardNumber}>{eshicCard?.cardNumber}</Text>
                </View>

                <View style={styles.cardRow}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardLabel}>تاريخ الإصدار</Text>
                    <Text style={styles.cardValueSmall}>{eshicCard?.issueDate}</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardLabel}>تاريخ الانتهاء</Text>
                    <Text style={styles.cardValueSmall}>{eshicCard?.expiryDate}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={[styles.statusBadge, { backgroundColor: 'rgba(76, 175, 80, 0.2)' }]}>
                  <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.statusText}>ساري</Text>
                </View>
                <Text style={styles.tapHint}>انقر للعرض الخلفي</Text>
              </View>
            </View>
          ) : (
            // Back Side
            <View style={styles.card}>
              <View style={styles.cardBackHeader}>
                <Text style={styles.cardBackTitle}>معلومات إضافية</Text>
              </View>

              <View style={styles.qrContainer}>
                <QRCode
                  value={qrData}
                  size={180}
                  backgroundColor="#fff"
                  color="#000"
                />
                <Text style={styles.qrText}>امسح للتحقق</Text>
              </View>

              <View style={styles.cardBackInfo}>
                <View style={styles.infoRow}>
                  <Icon name="business" size={20} color="#fff" />
                  <Text style={styles.infoText}>{eshicCard?.insuranceProvider}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Icon name="shield-checkmark" size={20} color="#fff" />
                  <Text style={styles.infoText}>نوع التغطية: {eshicCard?.coverageType}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Icon name="call" size={20} color="#fff" />
                  <Text style={styles.infoText}>طوارئ: {eshicCard?.emergencyNumber}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.tapHint}>انقر للعرض الأمامي</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Icon name="share-social" size={24} color="#007AFF" />
          <Text style={styles.actionButtonText}>مشاركة</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
          <Icon name="download" size={24} color="#007AFF" />
          <Text style={styles.actionButtonText}>حفظ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleEmergencyCall}>
          <Icon name="call" size={24} color="#F44336" />
          <Text style={[styles.actionButtonText, { color: '#F44336' }]}>طوارئ</Text>
        </TouchableOpacity>
      </View>

      {/* Card Details */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>تفاصيل البطاقة</Text>

        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Icon name="person" size={20} color="#007AFF" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>اسم المؤمن له</Text>
              <Text style={styles.detailValue}>{beneficiary?.fullName}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="card" size={20} color="#007AFF" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>رقم الهوية الوطنية</Text>
              <Text style={styles.detailValue}>{beneficiary?.nationalId}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="calendar" size={20} color="#007AFF" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>تاريخ الميلاد</Text>
              <Text style={styles.detailValue}>{beneficiary?.dateOfBirth}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="business" size={20} color="#007AFF" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>شركة التأمين</Text>
              <Text style={styles.detailValue}>{eshicCard?.insuranceProvider}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="shield-checkmark" size={20} color="#007AFF" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>نوع التغطية</Text>
              <Text style={styles.detailValue}>{eshicCard?.coverageType}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="time" size={20} color="#007AFF" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>صلاحية البطاقة</Text>
              <Text style={styles.detailValue}>
                من {eshicCard?.issueDate} إلى {eshicCard?.expiryDate}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsSection}>
        <Text style={styles.sectionTitle}>كيفية استخدام البطاقة</Text>

        <View style={styles.instructionCard}>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>
              اعرض البطاقة أو رمز QR عند زيارة أي مستشفى أو عيادة
            </Text>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>
              تأكد من صلاحية البطاقة قبل الاستخدام
            </Text>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>
              في حالة الطوارئ، اتصل بالرقم الموضح على البطاقة
            </Text>
          </View>
        </View>
      </View>

      {/* Emergency Contact */}
      <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall}>
        <Icon name="call" size={24} color="#fff" />
        <View style={styles.emergencyContent}>
          <Text style={styles.emergencyTitle}>اتصال طوارئ</Text>
          <Text style={styles.emergencyNumber}>{eshicCard?.emergencyNumber}</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  cardContainer: {
    padding: 20,
    alignItems: 'center',
  },
  cardTouchable: {
    width: '100%',
  },
  card: {
    width: '100%',
    aspectRatio: 1.586,
    backgroundColor: '#667eea',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  cardLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
  },
  cardInfo: {
    marginBottom: 15,
  },
  cardLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardValueSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 5,
  },
  tapHint: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.7,
  },
  cardBackHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardBackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  qrContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  qrText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  cardBackInfo: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 8,
  },
  detailsSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  detailCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailContent: {
    marginLeft: 15,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  instructionsSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
  },
  instructionCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  instructionNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  instructionNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emergencyContent: {
    marginLeft: 15,
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  emergencyNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ESHICCardScreen;
