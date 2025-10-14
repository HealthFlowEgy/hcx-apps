# 🧪 HCX Integration Testing Guide

Complete guide for testing the beneficiary app with real backend integration.

---

## 📋 PRE-TESTING CHECKLIST

### ✅ **1. Environment Setup**

```bash
# Install dependencies
npm install

# Install additional required packages
npm install react-native-config
npm install @react-native-async-storage/async-storage

# iOS specific
cd ios && pod install && cd ..
```

### ✅ **2. Environment Configuration**

1. **Copy environment file:**
```bash
# For development
cp .env.development .env

# For staging
cp .env.staging .env

# For local mock
cp .env.local .env
```

2. **Update `.env` with your actual values:**
```bash
# Edit .env file
BSP_API_URL=https://your-actual-bsp-api.com/api/v1
BSP_API_KEY=your_actual_api_key
HCX_GATEWAY_URL=https://your-hcx-gateway.com
HCX_PARTICIPANT_CODE=YOUR_PARTICIPANT_CODE
```

### ✅ **3. Code Integration**

1. **Add services to your project:**
```bash
# Create services directory if not exists
mkdir -p src/services

# Copy the service files
# - hcx.protocol.service.ts
# - fhir.service.ts (optional)
```

2. **Add config directory:**
```bash
mkdir -p src/config
# Copy env.config.ts
```

3. **Update App.tsx:**
```typescript
// Replace existing App.tsx with the new initialization code
```

---

## 🧪 TESTING SCENARIOS

### **Scenario 1: Service Initialization Test**

**Purpose:** Verify services initialize correctly

**Steps:**
```bash
# Run the app
npm run android
# or
npm run ios
```

**Expected Results:**
- ✅ App loads without errors
- ✅ Console shows initialization messages:
  ```
  🚀 Initializing HCX Beneficiary App...
  ========================================
  ENVIRONMENT CONFIGURATION
  ========================================
  Environment: DEVELOPMENT
  BSP API: https://dev-bsp...
  ✅ HCX Service initialized successfully
  ✅ App initialization complete
  ```

**Troubleshooting:**
- If initialization fails, check `.env` file configuration
- Verify all required environment variables are set
- Check console for specific error messages

---

### **Scenario 2: Authentication Flow Test**

**Purpose:** Test login with real backend

**Steps:**
1. Launch app
2. Enter phone number: `+20 123 456 7890`
3. Request OTP
4. Enter received OTP
5. Complete login

**API Calls Made:**
```
POST /api/v1/auth/verify-phone
POST /api/v1/auth/login
GET  /api/v1/beneficiary/profile
```

**Expected Results:**
- ✅ Phone verification successful
- ✅ OTP sent notification
- ✅ Login successful
- ✅ Token saved to AsyncStorage
- ✅ Navigate to HomeScreen

**Test API Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresAt": 1735747200000,
    "beneficiaryId": "BEN123456"
  },
  "timestamp": "2025-01-02T10:00:00Z"
}
```

---

### **Scenario 3: Dashboard Data Loading Test**

**Purpose:** Test fetching dashboard data from real APIs

**Steps:**
1. Login successfully
2. Observe HomeScreen loading
3. Pull to refresh

**API Calls Made:**
```
GET /api/v1/beneficiary/profile
GET /api/v1/beneficiary/policies
GET /api/v1/beneficiary/claims
GET /api/v1/beneficiary/consents?status=pending
```

**Expected Results:**
- ✅ Loading indicator displays
- ✅ Statistics cards populate with real data
- ✅ Recent claims display (if any)
- ✅ Pull-to-refresh works
- ✅ Error handling if API fails

**Console Logging:**
```
Fetching policies...
✅ Received 3 policies
Fetching claims...
✅ Received 5 claims
Fetching consents...
✅ Received 2 pending consents
```

---

### **Scenario 4: Policy Management Test**

**Purpose:** Test policy viewing with real data

**Steps:**
1. Navigate to "Policies" tab
2. View policy list
3. Tap on a policy
4. View policy details

**API Calls Made:**
```
GET /api/v1/beneficiary/policies
GET /api/v1/beneficiary/policies/{policyId}
```

**Expected Results:**
- ✅ Policy list displays correctly
- ✅ Search functionality works
- ✅ Filter by status works
- ✅ Policy details show complete information
- ✅ Benefits and members display

---

### **Scenario 5: Claim Tracking Test**

**Purpose:** Test claim viewing and tracking

**Steps:**
1. Navigate to "Claims" tab
2. View claim list
3. Filter by status
4. Tap on a claim
5. View claim timeline
6. Download document

**API Calls Made:**
```
GET /api/v1/beneficiary/claims
GET /api/v1/beneficiary/claims?status=pending
GET /api/v1/beneficiary/claims/{claimId}
GET /api/v1/beneficiary/claims/{claimId}/documents
GET /api/v1/beneficiary/documents/{documentId}/download
```

**Expected Results:**
- ✅ Claims display with correct status
- ✅ Filter works properly
- ✅ Claim details show timeline
- ✅ Documents are downloadable
- ✅ Status updates reflect correctly

---

### **Scenario 6: Consent Management Test**

**Purpose:** Test consent approval/rejection

**Steps:**
1. Navigate to "Consent" tab
2. View pending requests
3. Tap on a consent request
4. Review details
5. Approve or reject

**API Calls Made:**
```
GET  /api/v1/beneficiary/consents?status=pending
GET  /api/v1/beneficiary/consents/{consentId}
POST /api/v1/beneficiary/consents/{consentId}/approve
POST /api/v1/beneficiary/consents/{consentId}/reject
```

**Expected Results:**
- ✅ Pending consents display
- ✅ Consent details show requester info
- ✅ Approve action works
- ✅ Reject action works
- ✅ Status updates immediately

---

### **Scenario 7: Token Refresh Test**

**Purpose:** Test automatic token refresh

**Steps:**
1. Login and wait for token to expire (or manually set short expiry)
2. Make any API call after expiry
3. Observe automatic refresh

**Expected Behavior:**
```
Token expired, refreshing...
POST /api/v1/auth/refresh
✅ Token refreshed successfully
Retrying original request...
✅ Request successful
```

**Expected Results:**
- ✅ Token refreshes automatically
- ✅ Original request retries
- ✅ No user interruption
- ✅ New token saved

---

### **Scenario 8: Error Handling Test**

**Purpose:** Test error scenarios and recovery

**Test Cases:**

#### **8.1 Network Error**
```bash
# Disable network
# Try to refresh data
```
**Expected:**
- ✅ Error alert displays
- ✅ Retry option available
- ✅ App doesn't crash

#### **8.2 API Error (500)**
```bash
# Backend returns 500 error
```
**Expected:**
- ✅ User-friendly error message
- ✅ Error logged to console
- ✅ App remains functional

#### **8.3 Invalid Token**
```bash
# Manually invalidate token
# Try to make API call
```
**Expected:**
- ✅ Automatic logout
- ✅ Redirect to login
- ✅ Token cleared from storage

#### **8.4 Timeout**
```bash
# Simulate slow network (30+ seconds)
```
**Expected:**
- ✅ Request times out (30s)
- ✅ Error message displays
- ✅ Retry option available

---

## 🔧 MOCK BACKEND SETUP (For Testing Without Real Backend)

### **Option 1: JSON Server (Quick)**

```bash
# Install json-server globally
npm install -g json-server

# Create db.json
cat > db.json << 'EOF'
{
  "profile": {
    "id": "BEN123",
    "name": "محمد أحمد",
    "nationalId": "12345678901234",
    "phone": "+20123456789",
    "email": "mohamed@example.com"
  },
  "policies": [
    {
      "id": "POL001",
      "policyNumber": "EG-2024-001",
      "insurerName": "مصر للتأمين",
      "planName": "التأمين الصحي الشامل",
      "coverageAmount": 100000,
      "usedAmount": 15000,
      "status": "active",
      "startDate": "2024-01-01",
      "endDate": "2024-12-31"
    }
  ],
  "claims": [
    {
      "id": "CLM001",
      "claimNumber": "CLM-2024-001",
      "policyId": "POL001",
      "policyNumber": "EG-2024-001",
      "insurerName": "مصر للتأمين",
      "providerName": "مستشفى النيل",
      "status": "pending",
      "claimType": "cashless",
      "treatmentType": "opd",
      "submissionDate": "2024-12-20",
      "treatmentDate": "2024-12-19",
      "claimedAmount": 5000
    }
  ],
  "consents": [
    {
      "id": "CON001",
      "requesterId": "PROV001",
      "requesterName": "مستشفى النيل",
      "requesterType": "provider",
      "purpose": "للعلاج الطبي",
      "dataRequested": ["medical_history", "policies"],
      "validFrom": "2024-12-20",
      "validTo": "2025-01-20",
      "status": "pending",
      "requestDate": "2024-12-20"
    }
  ]
}
EOF

# Start server
json-server --watch db.json --port 3000

# Update .env
BSP_API_URL=http://localhost:3000
```

### **Option 2: Express Mock Server (Advanced)**

Create `mock-server/index.js`:

```javascript
const express = require('express');
const app = express();
app.use(express.json());

// Mock authentication
app.post('/api/v1/auth/login', (req, res) => {
  res.json({
    success: true,
    data: {
      accessToken: 'mock_access_token_' + Date.now(),
      refreshToken: 'mock_refresh_token',
      expiresAt: Date.now() + 3600000,
      beneficiaryId: 'BEN123'
    }
  });
});

// Mock profile
app.get('/api/v1/beneficiary/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      id: 'BEN123',
      name: 'محمد أحمد',
      nationalId: '12345678901234',
      phone: '+20123456789'
    }
  });
});

// Add more endpoints as needed...

app.listen(3000, () => {
  console.log('Mock server running on http://localhost:3000');
});
```

Run: `node mock-server/index.js`

---

## 📊 TEST CHECKLIST

### **Authentication & Setup**
- [ ] App initializes without errors
- [ ] Environment config loads correctly
- [ ] Phone verification works
- [ ] OTP verification works
- [ ] Login successful
- [ ] Token saved correctly
- [ ] Auto-refresh token works

### **Dashboard**
- [ ] Profile loads
- [ ] Statistics display correctly
- [ ] Quick actions work
- [ ] Recent claims display
- [ ] Pull-to-refresh works

### **Policies**
- [ ] Policy list loads
- [ ] Search works
- [ ] Filter works
- [ ] Policy details display
- [ ] Benefits show correctly
- [ ] Members list displays

### **Claims**
- [ ] Claims list loads
- [ ] Filter by status works
- [ ] Claim details display
- [ ] Timeline shows correctly
- [ ] Documents list
- [ ] Download works

### **Consents**
- [ ] Consent list loads
- [ ] Consent details display
- [ ] Approve action works
- [ ] Reject action works
- [ ] Status updates

### **Profile**
- [ ] Profile displays
- [ ] Edit profile works
- [ ] Update saves correctly
- [ ] Photo upload works (if implemented)

### **Error Handling**
- [ ] Network errors handled
- [ ] API errors handled
- [ ] Timeout handled
- [ ] Invalid token handled
- [ ] 401 triggers logout

---

## 🐛 COMMON ISSUES & SOLUTIONS

### **Issue 1: "HCX Service not initialized"**
```
Solution: Ensure initializeHCXService() is called in App.tsx before rendering navigation
```

### **Issue 2: Network request failed**
```
Solution: 
1. Check .env BSP_API_URL is correct
2. Verify backend is running
3. Check network connectivity
4. For iOS simulator, use computer's IP instead of localhost
```

### **Issue 3: Token refresh loop**
```
Solution:
1. Check token expiry time is set correctly
2. Verify refresh token endpoint works
3. Clear AsyncStorage and re-login
```

### **Issue 4: "Cannot read property 'data' of undefined"**
```
Solution:
1. Check API response structure matches expected format
2. Add null checks in code
3. Verify backend returns proper APIResponse format
```

---

## 📈 PERFORMANCE TESTING

### **Load Time Benchmarks**

| **Screen** | **Target** | **Acceptable** |
|------------|-----------|----------------|
| App Init | < 2s | < 5s |
| Login | < 1s | < 3s |
| Dashboard | < 2s | < 4s |
| Policy List | < 1s | < 3s |
| Claim Details | < 1s | < 2s |

### **API Response Time**

| **Endpoint** | **Target** | **Acceptable** |
|--------------|-----------|----------------|
| Login | < 500ms | < 2s |
| Get Policies | < 300ms | < 1s |
| Get Claims | < 500ms | < 2s |
| Get Details | < 200ms | < 1s |

---

## ✅ PRODUCTION READINESS CHECKLIST

Before deploying to production:

- [ ] All tests pass
- [ ] Error handling complete
- [ ] Loading states implemented
- [ ] Empty states implemented
- [ ] Offline mode (if enabled)
- [ ] Security audit completed
- [ ] API keys secured
- [ ] Logging configured correctly
- [ ] Analytics integrated (if enabled)
- [ ] Crash reporting (if enabled)
- [ ] App Store/Play Store metadata
- [ ] Privacy policy updated
- [ ] Terms of service updated

---

## 📞 SUPPORT

If you encounter issues:

1. Check this guide first
2. Review console logs
3. Verify environment configuration
4. Check backend API status
5. Contact backend team for API issues

---

**Happy Testing! 🎉**