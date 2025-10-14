# 📱 Android APK Build Guide

## 🎯 Overview

This guide explains how to build and download the Android APK for the HCX Beneficiary mobile app using GitHub Actions.

---

## 🚀 Method 1: Automatic Build via GitHub Actions (RECOMMENDED)

### How It Works:
- GitHub Actions automatically builds the APK when you push code
- No need for Android Studio or local Android SDK
- APK is available for download from GitHub

### Steps to Get Your APK:

#### Option A: Manual Trigger (Fastest)

1. **Go to GitHub Actions**
   - Visit: https://github.com/HealthFlowEgy/hcx-apps/actions
   - Click on "Build Android APK" workflow

2. **Run Workflow**
   - Click "Run workflow" button (top right)
   - Select branch: `feature/valify-kyc-integration`
   - Choose build type: `debug` (for testing) or `release` (for production)
   - Click "Run workflow"

3. **Wait for Build** (5-10 minutes)
   - Watch the progress in real-time
   - Green checkmark = Success ✅
   - Red X = Failed ❌

4. **Download APK**
   - Scroll down to "Artifacts" section
   - Click on `app-debug` or `app-release`
   - Download the ZIP file
   - Extract the APK from the ZIP

5. **Install on Device**
   - Transfer APK to your Android device
   - Enable "Install from Unknown Sources" in Settings
   - Tap the APK file to install
   - Open the app and test!

#### Option B: Automatic Build on Push

The APK builds automatically when you:
- Push to `feature/valify-kyc-integration` branch
- Push to `main` or `develop` branch
- Create a Pull Request

**To download:**
1. Go to the commit on GitHub
2. Click the green checkmark ✅
3. Click "Details" next to "Build Android APK"
4. Scroll down to "Artifacts"
5. Download the APK

---

## 📦 Build Types

### Debug APK
- **Purpose**: Testing and development
- **Size**: Larger (~50-80 MB)
- **Features**: 
  - Includes debugging information
  - Not optimized
  - Can be installed alongside other apps
  - Easier to debug issues

**When to use**: Daily testing, development, QA

### Release APK
- **Purpose**: Production deployment
- **Size**: Smaller (~30-50 MB)
- **Features**:
  - Optimized and minified
  - ProGuard enabled
  - Better performance
  - Requires signing for Play Store

**When to use**: Beta testing, Play Store submission

---

## 🔧 Configuration

### Environment Variables

The GitHub Actions workflow automatically creates a `.env` file with:

```bash
# BSP Backend API
BSP_API_URL=https://dev-bsp.healthflow.eg/api/v1
BSP_API_KEY=dev_key_placeholder

# HCX Gateway
HCX_GATEWAY_URL=https://dev-hcx.healthflow.eg
HCX_PARTICIPANT_CODE=BSP001

# Valify KYC Service (Staging)
VALIFY_API_URL=https://valifystage.com
VALIFY_USERNAME=healthflow__79742_integration_bundle
VALIFY_PASSWORD=9ud5nKUeC@96W3S7
VALIFY_CLIENT_ID=lwsx7HOCt5o3bm6QmxBb3F3TExi72drzayCIZOnh
VALIFY_CLIENT_SECRET=Uv24K9zhKs6kiPpySvE2pnIo2Zzu29Ii8glz2cYMmu2QESJeMw1nWP5g4w2JaceVaCDagsulvmboI490HTAWz9paFXczdjWDYuTGj34d4tjuv9kY5UfTGGbmNMdfQ5bE
VALIFY_BUNDLE_KEY=b2978014d0b94653be8da42d5d99058b

# App Configuration
APP_ENV=development
API_TIMEOUT=30000
ENABLE_LOGGING=true
```

**To customize:**
1. Edit `.github/workflows/build-android.yml`
2. Update the "Create .env file" step
3. Commit and push changes

---

## 📱 Installing APK on Android Device

### Method 1: Direct Install (USB)

1. **Enable Developer Options**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Developer Options will be enabled

2. **Enable USB Debugging**
   - Go to Settings → Developer Options
   - Enable "USB Debugging"

3. **Connect Device**
   - Connect phone to computer via USB
   - Allow USB debugging when prompted

4. **Install APK**
   ```bash
   adb install app-debug.apk
   ```

### Method 2: Install via File Manager

1. **Transfer APK**
   - Send APK to phone via:
     - Email attachment
     - Google Drive
     - WhatsApp
     - USB transfer

2. **Enable Unknown Sources**
   - Go to Settings → Security
   - Enable "Install from Unknown Sources"
   - Or allow for specific app (Chrome, Files, etc.)

3. **Install**
   - Open File Manager
   - Navigate to APK location
   - Tap APK file
   - Click "Install"
   - Click "Open" to launch

### Method 3: Install via QR Code

1. **Upload APK**
   - Upload APK to cloud storage (Google Drive, Dropbox)
   - Get shareable link

2. **Generate QR Code**
   - Use QR code generator with the link
   - Print or display QR code

3. **Scan and Install**
   - Scan QR code with phone camera
   - Download APK
   - Install as above

---

## 🧪 Testing the APK

### Pre-Installation Checklist:
- [ ] Android version 6.0 (API 23) or higher
- [ ] At least 100 MB free storage
- [ ] Internet connection (for API calls)
- [ ] Camera permission (for KYC)
- [ ] Storage permission (for documents)

### Test Scenarios:

#### 1. Registration Flow
- [ ] Open app
- [ ] Complete welcome screens
- [ ] Enter phone number
- [ ] Verify OTP
- [ ] Complete KYC (ID scan + selfie)
- [ ] View success screen

#### 2. Login Flow
- [ ] Open app
- [ ] Click "Login"
- [ ] Enter credentials
- [ ] Verify login success
- [ ] View home dashboard

#### 3. Core Features
- [ ] View policies list
- [ ] View policy details
- [ ] View claims list
- [ ] View claim details
- [ ] View consent requests
- [ ] Approve/reject consent
- [ ] View ESHIC card
- [ ] View profile
- [ ] Update profile

#### 4. Camera Features
- [ ] ID card front scan
- [ ] ID card back scan
- [ ] Selfie capture
- [ ] Image preview
- [ ] Retake functionality

#### 5. API Integration
- [ ] Data loads from backend
- [ ] Loading states show
- [ ] Error messages display
- [ ] Pull-to-refresh works
- [ ] Offline mode (if enabled)

---

## 🐛 Troubleshooting

### Build Fails

**Problem**: GitHub Actions build fails

**Solutions**:
1. Check the error logs in GitHub Actions
2. Common issues:
   - Node modules issue: Clear cache and retry
   - Gradle issue: Update Gradle version
   - Dependency conflict: Check package.json

**Fix**:
```bash
# In beneficiary-app-mobile/
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "fix: Update dependencies"
git push
```

### APK Won't Install

**Problem**: "App not installed" error

**Solutions**:
1. **Insufficient storage**: Free up space (need 100+ MB)
2. **Corrupted APK**: Re-download the APK
3. **Conflicting app**: Uninstall previous version
4. **Security settings**: Enable "Unknown Sources"

### App Crashes on Launch

**Problem**: App crashes immediately after opening

**Solutions**:
1. **Check logs**:
   ```bash
   adb logcat | grep -i "react"
   ```

2. **Common causes**:
   - Missing environment variables
   - Network connectivity
   - Permissions not granted

3. **Fix**:
   - Grant all permissions in Settings
   - Check internet connection
   - Reinstall app

### Camera Not Working

**Problem**: Camera doesn't open for KYC

**Solutions**:
1. Grant camera permission in Settings
2. Check if camera is used by another app
3. Restart device
4. Reinstall app

### API Errors

**Problem**: "Network Error" or "Failed to fetch"

**Solutions**:
1. Check internet connection
2. Verify backend URL in `.env`
3. Check if backend is running
4. Check API keys are correct

---

## 📊 Build Status

### Current Build Configuration:

| Setting | Value |
|---------|-------|
| **Min SDK** | Android 6.0 (API 23) |
| **Target SDK** | Android 13 (API 33) |
| **Build Tools** | 33.0.0 |
| **Gradle** | 8.0+ |
| **Node.js** | 18.x |
| **Java** | 17 |

### Build Triggers:

| Event | Branch | Build Type |
|-------|--------|------------|
| Push | feature/valify-kyc-integration | Debug |
| Push | main | Debug |
| Push | develop | Debug |
| Pull Request | Any → main/develop | Debug |
| Manual | Any | Debug or Release |

---

## 🚀 Quick Start Commands

### Trigger Build:
```bash
# Push to trigger automatic build
git push origin feature/valify-kyc-integration
```

### Download Latest APK:
```bash
# Using GitHub CLI
gh run download --repo HealthFlowEgy/hcx-apps

# Or visit:
# https://github.com/HealthFlowEgy/hcx-apps/actions
```

### Install APK:
```bash
# Via ADB
adb install app-debug.apk

# Check if installed
adb shell pm list packages | grep healthflow
```

### View Logs:
```bash
# Real-time logs
adb logcat | grep -i "react"

# Save logs to file
adb logcat > app-logs.txt
```

---

## 📱 Distribution Options

### For Internal Testing:

1. **Direct APK Distribution**
   - Download from GitHub Actions
   - Share via email/drive
   - Install manually

2. **Firebase App Distribution**
   - Upload APK to Firebase
   - Invite testers via email
   - Automatic updates

3. **Google Play Internal Testing**
   - Upload to Play Console
   - Add testers
   - Install via Play Store

### For Beta Testing:

1. **Google Play Beta Track**
   - Upload signed APK
   - Create beta testing group
   - Distribute via Play Store

2. **TestFlight (iOS equivalent)**
   - For iOS version
   - Apple Developer account required

---

## ✅ Checklist for Production Release

### Before Building Release APK:

- [ ] Update version in `package.json`
- [ ] Update version code in `android/app/build.gradle`
- [ ] Configure release signing (keystore)
- [ ] Update production API URLs
- [ ] Remove debug logging
- [ ] Test thoroughly on multiple devices
- [ ] Enable ProGuard
- [ ] Generate signed APK
- [ ] Test signed APK
- [ ] Prepare Play Store listing
- [ ] Submit for review

---

## 📞 Support

### Need Help?

1. **Check GitHub Actions logs**
   - https://github.com/HealthFlowEgy/hcx-apps/actions

2. **Review documentation**
   - README.md
   - INTEGRATION_GUIDE.md
   - TESTING_GUIDE.md

3. **Common issues**
   - Check this troubleshooting section
   - Search GitHub Issues

4. **Contact team**
   - Create GitHub Issue
   - Contact development team

---

## 🎉 Success!

Once you have the APK installed and running:

✅ You can test all features on real devices  
✅ You can share with QA team  
✅ You can demo to stakeholders  
✅ You can prepare for beta release  

**Happy Testing! 🚀**

---

**Last Updated**: October 5, 2025  
**Version**: 1.0.0  
**Status**: ✅ Ready for APK Generation
