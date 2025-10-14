# HCX Beneficiary Mobile App (React Native)

A React Native mobile application for HCX beneficiaries with Valify e-KYC integration.

## 🚀 Features

- ✅ **Valify e-KYC Integration**: Complete identity verification with OCR and face matching
- ✅ **Camera Components**: ID card scanner and selfie capture
- ✅ **HCX Platform Integration**: Beneficiary registration, policies, claims, and consent management
- ✅ **Multi-step KYC Flow**: Guided identity verification process
- ✅ **Arabic UI**: Full Arabic language support with RTL layout
- ✅ **Type-Safe**: Written in TypeScript

## 📋 Prerequisites

- **Node.js**: v16.x or higher
- **React Native**: v0.72.6
- **npm** or **yarn**
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd beneficiary-app-mobile
npm install
```

### 2. iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update with your credentials:

```bash
cp .env.example .env
```

The `.env` file is already configured with Valify staging credentials.

### 4. Setup Camera Permissions

#### Android

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

#### iOS

Add to `ios/BeneficiaryApp/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to scan your ID and capture your photo</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to save your documents</string>
```

### 5. Setup Vector Icons

#### Android

Add to `android/app/build.gradle`:

```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

#### iOS

Already included via CocoaPods.

## 🏃 Running the App

### Android

```bash
# Start Metro bundler
npm start

# In another terminal, run Android
npm run android
```

### iOS

```bash
# Start Metro bundler
npm start

# In another terminal, run iOS
npm run ios
```

## 📁 Project Structure

```
beneficiary-app-mobile/
├── src/
│   ├── components/
│   │   └── camera/
│   │       ├── IDScanner.tsx          # ID card scanner component
│   │       └── FaceCapture.tsx        # Selfie capture component
│   ├── navigation/
│   │   └── types.ts                   # Navigation type definitions
│   ├── screens/
│   │   └── auth/
│   │       └── KYCScreen.tsx          # Complete KYC flow
│   ├── services/
│   │   ├── valify.service.ts          # Valify e-KYC API integration
│   │   └── hcx.enhanced.service.ts    # HCX platform API integration
│   └── types/
│       └── valify.types.ts            # TypeScript type definitions
├── .env                                # Environment variables (not in git)
├── .env.example                        # Environment template
├── App.tsx                             # Main app component
├── index.js                            # App entry point
├── package.json                        # Dependencies
└── README.md                           # This file
```

## 🎯 Core Components

### IDScanner

Captures ID card images (front and back) with guided overlay:

```typescript
import { IDScanner } from './src/components/camera/IDScanner';

<IDScanner
  side="front"  // or "back"
  onCapture={(imageBase64) => {
    // Handle captured image
  }}
/>
```

### FaceCapture

Captures selfie with face guidance:

```typescript
import { FaceCapture } from './src/components/camera/FaceCapture';

<FaceCapture
  onCapture={(imageBase64) => {
    // Handle captured selfie
  }}
/>
```

### KYCScreen

Complete multi-step KYC flow:

1. Introduction and instructions
2. ID card front capture
3. ID card back capture
4. Selfie capture
5. Processing and verification
6. Registration with HCX

## 🔌 Services

### Valify Service

```typescript
import ValifyService from './src/services/valify.service';

// Process National ID
const ocrResult = await ValifyService.processNationalID(
  frontImageBase64,
  backImageBase64
);

// Verify Face Match
const faceResult = await ValifyService.verifyFaceMatch(
  selfieBase64,
  idPhotoBase64
);
```

### HCX Service

```typescript
import HCXEnhancedService from './src/services/hcx.enhanced.service';

// Register Beneficiary
const registration = await HCXEnhancedService.registerBeneficiary({
  phoneNumber: "+201234567890",
  nationalId: "12345678901234",
  fullName: "أحمد محمد علي",
  // ... other fields
});

// Get ESHIC Card
const eshicCard = await HCXEnhancedService.getESHICCard(beneficiaryId);
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run service validation
npm run test-services
```

## 🐛 Troubleshooting

### Camera Not Working

```bash
# Android - Uninstall and reinstall
adb uninstall com.beneficiaryapp
npm run android

# iOS - Reset simulator
xcrun simctl erase all
npm run ios
```

### Module Not Found

```bash
watchman watch-del-all
rm -rf node_modules
npm install
npm start -- --reset-cache
```

### Build Fails

```bash
# Android
cd android && ./gradlew clean && cd ..

# iOS
cd ios && pod deintegrate && pod install && cd ..
```

## 📦 Building for Production

### Android

```bash
cd android
./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

### iOS

1. Open `ios/BeneficiaryApp.xcworkspace` in Xcode
2. Product → Archive
3. Distribute to App Store or Ad Hoc

## 🔐 Security

- ✅ Environment variables not committed to git
- ✅ HTTPS only for API calls
- ✅ Token storage with AsyncStorage
- ✅ Sensitive data cleared on logout

## 📚 Documentation

- [React Native](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Vision Camera](https://react-native-vision-camera.com/)
- [Valify API](https://valify.me/docs)
- [HCX Protocol](https://docs.hcxprotocol.io/)

## 🤝 Contributing

This is a foundation implementation. To add more screens:

1. Create screen components in `src/screens/`
2. Add navigation types in `src/navigation/types.ts`
3. Implement navigation stacks
4. Connect to services

## 📝 Next Steps

1. **Complete Navigation**: Implement all navigation stacks (Auth, Main, Home, Policy, Claim, Consent, Profile)
2. **Add Screens**: Create all remaining screens (Welcome, Phone Verification, Login, Home, Policies, Claims, etc.)
3. **State Management**: Add Redux or Context API for global state
4. **Internationalization**: Add i18n support for Arabic/English
5. **Offline Support**: Implement local caching
6. **Push Notifications**: Add Firebase Cloud Messaging
7. **Analytics**: Integrate analytics tracking
8. **Testing**: Add unit and integration tests

## 📄 License

Proprietary - HealthFlow Egypt

## 👥 Team

Developed by HealthFlow Development Team

---

**Status**: ✅ Core Foundation Complete

The app has the essential KYC functionality working. Your development team can now:
- Build additional screens
- Implement complete navigation
- Add state management
- Test with real devices

For questions or support, contact the development team.
