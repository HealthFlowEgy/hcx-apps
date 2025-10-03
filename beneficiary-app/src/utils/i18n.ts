import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      welcome: 'Welcome',
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
      submit: 'Submit',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      back: 'Back',
      next: 'Next',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      
      // Navigation
      home: 'Home',
      policies: 'Policies',
      claims: 'Claims',
      consent: 'Consent',
      profile: 'Profile',
      
      // Registration
      registration: 'Registration',
      nationalId: 'National ID',
      fullName: 'Full Name',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      address: 'Address',
      governorate: 'Governorate',
      phoneNumber: 'Phone Number',
      email: 'Email',
      
      // KYC
      kyc: 'Identity Verification',
      scanId: 'Scan National ID',
      scanIdFront: 'Scan ID Front',
      scanIdBack: 'Scan ID Back',
      takeSelfie: 'Take Selfie',
      verifyingIdentity: 'Verifying your identity...',
      identityVerified: 'Identity verified successfully',
      identityFailed: 'Identity verification failed',
      
      // ESHIC Card
      eshicCard: 'ESHIC Card',
      cardNumber: 'Card Number',
      issueDate: 'Issue Date',
      expiryDate: 'Expiry Date',
      downloadCard: 'Download Card',
      
      // Policies
      myPolicies: 'My Policies',
      policyDetails: 'Policy Details',
      policyNumber: 'Policy Number',
      insurer: 'Insurer',
      coverage: 'Coverage',
      status: 'Status',
      active: 'Active',
      expired: 'Expired',
      suspended: 'Suspended',
      
      // Claims
      myClaims: 'My Claims',
      claimDetails: 'Claim Details',
      claimNumber: 'Claim Number',
      provider: 'Provider',
      claimType: 'Claim Type',
      claimedAmount: 'Claimed Amount',
      approvedAmount: 'Approved Amount',
      submitted: 'Submitted',
      processing: 'Processing',
      approved: 'Approved',
      rejected: 'Rejected',
      claimTimeline: 'Claim Timeline',
      
      // Consent
      consentRequests: 'Consent Requests',
      consentHistory: 'Consent History',
      approve: 'Approve',
      deny: 'Deny',
      revoke: 'Revoke',
      requester: 'Requester',
      purpose: 'Purpose',
      dataTypes: 'Data Types',
      requestedAt: 'Requested At',
      expiresAt: 'Expires At',
      
      // Messages
      loginSuccess: 'Logged in successfully',
      loginFailed: 'Login failed',
      registrationSuccess: 'Registration successful',
      registrationFailed: 'Registration failed',
      updateSuccess: 'Updated successfully',
      updateFailed: 'Update failed',
    },
  },
  ar: {
    translation: {
      // Common
      welcome: 'مرحباً',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      register: 'تسجيل',
      submit: 'إرسال',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      save: 'حفظ',
      edit: 'تعديل',
      delete: 'حذف',
      back: 'رجوع',
      next: 'التالي',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجح',
      
      // Navigation
      home: 'الرئيسية',
      policies: 'البوليصات',
      claims: 'المطالبات',
      consent: 'الموافقات',
      profile: 'الملف الشخصي',
      
      // Registration
      registration: 'التسجيل',
      nationalId: 'الرقم القومي',
      fullName: 'الاسم الكامل',
      dateOfBirth: 'تاريخ الميلاد',
      gender: 'الجنس',
      male: 'ذكر',
      female: 'أنثى',
      address: 'العنوان',
      governorate: 'المحافظة',
      phoneNumber: 'رقم الهاتف',
      email: 'البريد الإلكتروني',
      
      // KYC
      kyc: 'التحقق من الهوية',
      scanId: 'مسح البطاقة الشخصية',
      scanIdFront: 'مسح وجه البطاقة',
      scanIdBack: 'مسح ظهر البطاقة',
      takeSelfie: 'التقط صورة شخصية',
      verifyingIdentity: 'جاري التحقق من هويتك...',
      identityVerified: 'تم التحقق من الهوية بنجاح',
      identityFailed: 'فشل التحقق من الهوية',
      
      // ESHIC Card
      eshicCard: 'بطاقة التأمين الصحي',
      cardNumber: 'رقم البطاقة',
      issueDate: 'تاريخ الإصدار',
      expiryDate: 'تاريخ الانتهاء',
      downloadCard: 'تحميل البطاقة',
      
      // Policies
      myPolicies: 'بوليصاتي',
      policyDetails: 'تفاصيل البوليصة',
      policyNumber: 'رقم البوليصة',
      insurer: 'شركة التأمين',
      coverage: 'التغطية',
      status: 'الحالة',
      active: 'نشط',
      expired: 'منتهي',
      suspended: 'معلق',
      
      // Claims
      myClaims: 'مطالباتي',
      claimDetails: 'تفاصيل المطالبة',
      claimNumber: 'رقم المطالبة',
      provider: 'مقدم الخدمة',
      claimType: 'نوع المطالبة',
      claimedAmount: 'المبلغ المطالب به',
      approvedAmount: 'المبلغ المعتمد',
      submitted: 'مقدم',
      processing: 'قيد المعالجة',
      approved: 'معتمد',
      rejected: 'مرفوض',
      claimTimeline: 'سجل المطالبة',
      
      // Consent
      consentRequests: 'طلبات الموافقة',
      consentHistory: 'سجل الموافقات',
      approve: 'موافقة',
      deny: 'رفض',
      revoke: 'إلغاء',
      requester: 'الجهة الطالبة',
      purpose: 'الغرض',
      dataTypes: 'أنواع البيانات',
      requestedAt: 'تاريخ الطلب',
      expiresAt: 'تاريخ الانتهاء',
      
      // Messages
      loginSuccess: 'تم تسجيل الدخول بنجاح',
      loginFailed: 'فشل تسجيل الدخول',
      registrationSuccess: 'تم التسجيل بنجاح',
      registrationFailed: 'فشل التسجيل',
      updateSuccess: 'تم التحديث بنجاح',
      updateFailed: 'فشل التحديث',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: import.meta.env.VITE_DEFAULT_LANGUAGE || 'ar',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
