# HCX Beneficiary App - Valify Integration

A comprehensive beneficiary application for the Egyptian Health Claims Exchange (HCX) platform, integrated with Valify e-KYC for secure identity verification.

## 🚀 New Features (v2.0.0)

### ✅ Valify e-KYC Integration
- **Egyptian National ID Verification**: Automated OCR scanning of front and back of ID
- **Face Verification**: Biometric face matching for identity confirmation
- **Liveness Detection**: Anti-spoofing protection
- **Real-time Validation**: Instant verification results

### ✅ Enhanced HCX Platform Integration
- **Complete Registration Flow**: Seamless beneficiary onboarding
- **ESHIC Card Generation**: Electronic Social Health Insurance Card with QR code
- **Policy Management**: View and manage insurance policies
- **Claims Tracking**: Real-time claim status and detailed timeline
- **Consent Management**: Control data sharing permissions with providers

### ✅ State Management & Architecture
- **Redux Toolkit**: Centralized state management
- **TypeScript**: Full type safety
- **Modular Services**: Clean separation of concerns
- **Error Handling**: Comprehensive error management

### ✅ Bilingual Support
- **Arabic (Primary)**: Full RTL support
- **English**: Complete translation
- **Dynamic Switching**: Change language on the fly

## 📋 Prerequisites

- Node.js 18+ and npm
- Valify API credentials:
  - Client ID
  - Client Secret
  - Bundle Key
  - HMAC Key
- HCX Platform backend access

## 🔧 Installation

```bash
# Navigate to beneficiary-app directory
cd beneficiary-app

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your actual credentials
```

## ⚙️ Environment Configuration

The `.env` file contains all necessary configuration:

```env
# HCX Platform
VITE_HCX_API_URL=https://dev-hcx.swasth.app/api/v0.8
VITE_HCX_API_VERSION=v0.8

# Valify e-KYC (Update with your credentials)
VITE_VALIFY_API_URL=https://www.valifystage.com
VITE_VALIFY_CLIENT_ID=your_client_id_here
VITE_VALIFY_CLIENT_SECRET=your_client_secret_here
VITE_VALIFY_BUNDLE_KEY=your_bundle_key_here
VITE_VALIFY_HMAC_KEY=your_hmac_key_here

# App Configuration
VITE_APP_ENV=development
VITE_APP_NAME=HealthFlow Beneficiary
VITE_DEFAULT_LANGUAGE=ar
```

## 🏃 Running the Application

```bash
# Development mode
npm run dev
# Opens at http://localhost:5173

# Production build
npm run build

# Preview production build
npm run preview
```

## 📁 New Project Structure

```
beneficiary-app/
├── src/
│   ├── services/                    # API Integration Layer
│   │   ├── api.config.ts           # Axios instances & interceptors
│   │   ├── valify.service.ts       # Valify e-KYC API integration
│   │   ├── hcx.enhanced.service.ts # Enhanced HCX platform API
│   │   ├── hcxService.ts           # Original HCX service (legacy)
│   │   └── hcxMockService.ts       # Mock service for testing
│   │
│   ├── store/                       # Redux State Management
│   │   ├── index.ts                # Store configuration
│   │   └── slices/
│   │       ├── authSlice.ts        # Authentication state
│   │       ├── beneficiarySlice.ts # Beneficiary & KYC state
│   │       ├── policySlice.ts      # Policy management state
│   │       ├── claimSlice.ts       # Claims tracking state
│   │       └── consentSlice.ts     # Consent management state
│   │
│   ├── types/                       # TypeScript Type Definitions
│   │   ├── valify.types.ts         # Valify & HCX types
│   │   ├── cards.ts                # UI card types (existing)
│   │   └── faq.ts                  # FAQ types (existing)
│   │
│   ├── utils/                       # Utility Functions
│   │   └── i18n.ts                 # Internationalization config
│   │
│   ├── screens/                     # Application Screens (New)
│   │   ├── auth/                   # Authentication & Registration
│   │   ├── home/                   # Dashboard
│   │   ├── policies/               # Policy management
│   │   ├── claims/                 # Claims tracking
│   │   ├── consent/                # Consent management
│   │   └── profile/                # User profile
│   │
│   ├── components/                  # React Components
│   │   ├── kyc/                    # KYC-specific components (New)
│   │   ├── common/                 # Common UI components (New)
│   │   └── [existing components]   # Original components
│   │
│   └── [existing files]             # Original app files
│
├── .env                             # Environment variables (Updated)
├── .env.example                     # Environment template (New)
├── package.json                     # Dependencies (Updated)
└── README_VALIFY.md                 # This file
```

## 🔑 Key Features Implementation

### 1. Valify e-KYC Flow

```typescript
import valifyService from './services/valify.service';

// Complete KYC process
const kycResult = await valifyService.completeKYC(
  frontIdImage,  // File: Front of National ID
  backIdImage,   // File: Back of National ID
  selfieImage    // File: User selfie
);

// Returns:
// - idData: Extracted National ID information
// - faceMatch: Face verification result with match score
```

### 2. Beneficiary Registration

```typescript
import hcxService from './services/hcx.enhanced.service';

const registrationData = {
  nationalId: kycResult.idData.nationalId,
  fullNameArabic: kycResult.idData.fullNameArabic,
  fullNameEnglish: kycResult.idData.fullNameEnglish,
  // ... other fields
  valifyTransactionId: kycResult.idData.transactionId,
  faceMatchScore: kycResult.faceMatch.matchScore,
  livenessVerified: true,
};

const result = await hcxService.registerBeneficiary(registrationData);
// Returns: { beneficiary, token }
```

### 3. Redux State Management

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { performKYC } from './store/slices/beneficiarySlice';

function KYCComponent() {
  const dispatch = useDispatch();
  const { kycData, isLoading, error } = useSelector(
    (state) => state.beneficiary
  );

  const handleKYC = async () => {
    await dispatch(performKYC({ front, back, selfie }));
  };
}
```

### 4. Internationalization

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button onClick={() => i18n.changeLanguage('ar')}>
        العربية
      </button>
    </div>
  );
}
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **OAuth 2.0**: Valify integration using client credentials flow
- **Secure Storage**: Tokens stored in localStorage with automatic cleanup
- **Request Interceptors**: Automatic token injection and refresh
- **HTTPS Only**: All API calls over secure connections

## 🧪 Testing

### Manual Testing Checklist

#### Registration & KYC
- [ ] Scan Egyptian National ID (front and back)
- [ ] Verify OCR extracts correct data
- [ ] Capture selfie photo
- [ ] Verify face match passes (score > 70%)
- [ ] Complete registration
- [ ] Receive ESHIC card

#### Authentication
- [ ] Login with National ID and password
- [ ] Logout successfully
- [ ] Token persists across page refresh
- [ ] Automatic logout on token expiry

#### Policy Management
- [ ] View list of policies
- [ ] View policy details
- [ ] Filter policies by status
- [ ] View coverage information

#### Claims Tracking
- [ ] View list of claims
- [ ] View claim details
- [ ] View claim timeline
- [ ] Real-time status updates

#### Consent Management
- [ ] View pending consent requests
- [ ] Approve consent request
- [ ] Deny consent request with reason
- [ ] Revoke previously granted consent
- [ ] View consent history

#### Internationalization
- [ ] Switch to Arabic
- [ ] Switch to English
- [ ] Verify RTL layout in Arabic
- [ ] Verify all translations

## 🐛 Troubleshooting

### Valify API Issues

**Error: "Failed to authenticate with Valify service"**
- Check `VITE_VALIFY_CLIENT_ID` and `VITE_VALIFY_CLIENT_SECRET` in `.env`
- Verify credentials are correct
- Ensure no extra spaces in environment variables

**Error: "Face verification failed. Match score too low."**
- Ensure good lighting for selfie
- Face should be clearly visible
- Use high-quality camera
- Ensure ID photo is clear

### HCX API Issues

**Error: 401 Unauthorized**
- Check JWT token is present
- Verify token hasn't expired
- Check `VITE_HCX_API_URL` is correct

**Error: CORS issues**
- Ensure HCX backend allows your domain
- Check proxy configuration in `vite.config.ts`

### Build Issues

**Error: Module not found**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 API Documentation

### Valify Service Methods

```typescript
// Get OAuth token
await valifyService.getAccessToken()

// Scan National ID
await valifyService.scanNationalID(frontImage, backImage)

// Verify face match
await valifyService.verifyFaceMatch(selfieImage, idImage)

// Complete KYC (all-in-one)
await valifyService.completeKYC(frontImage, backImage, selfieImage)
```

### HCX Service Methods

```typescript
// Authentication
await hcxService.registerBeneficiary(data)
await hcxService.login(nationalId, password)
await hcxService.logout()

// Profile
await hcxService.getProfile()
await hcxService.updateProfile(updates)
await hcxService.getESHICCard()

// Policies
await hcxService.getPolicies()
await hcxService.getPolicyById(policyId)

// Claims
await hcxService.getClaims()
await hcxService.getClaimById(claimId)
await hcxService.getClaimTimeline(claimId)

// Consent
await hcxService.getConsentRequests()
await hcxService.approveConsent(consentId)
await hcxService.denyConsent(consentId, reason)
await hcxService.revokeConsent(consentId)
await hcxService.getConsentHistory()
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Output directory: build/
# Deploy to your web server or CDN
```

## 📞 Support

- **Valify Support**: techsupport@valify.me
- **Valify Documentation**: https://valify.gitbook.io/documentation
- **HCX Platform**: https://github.com/HealthFlowEgy/hcx-platform
- **Issues**: https://github.com/HealthFlowEgy/hcx-apps/issues

## 📄 License

See [LICENSE.md](LICENSE.md)

## 👥 Contributors

- HealthFlow Egypt Development Team

## 📝 Changelog

### Version 2.0.0 (Current - Valify Integration)
- ✅ Valify e-KYC integration with OAuth 2.0
- ✅ Redux Toolkit state management
- ✅ Enhanced HCX service with complete API coverage
- ✅ TypeScript type definitions
- ✅ Arabic/English bilingual support with i18next
- ✅ Complete policy and claims management
- ✅ Consent management system
- ✅ ESHIC card generation and display
- ✅ Modular architecture with clean separation

### Version 1.0.6 (Previous)
- Basic beneficiary app
- Mock HCX services
- Simple UI components

---

**Ready to build!** 🎉

For detailed implementation guide, see the attached artifacts in the development team instructions.
