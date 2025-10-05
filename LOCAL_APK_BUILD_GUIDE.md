# 📱 Local APK Build Guide - Step by Step

## 🎯 Overview

This guide will help you build the Android APK for the HCX Beneficiary app on your local machine in **15-20 minutes**.

---

## ✅ Prerequisites

### Required Software:

1. **Node.js 18+**
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **JDK 17**
   - Download: https://adoptium.net/
   - Verify: `java --version`

3. **Android Studio**
   - Download: https://developer.android.com/studio
   - Install Android SDK (API 33)
   - Install Android SDK Build-Tools

4. **Git**
   - Download: https://git-scm.com/
   - Verify: `git --version`

---

## 🚀 Step-by-Step Instructions

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/HealthFlowEgy/hcx-apps.git
cd hcx-apps

# Checkout the feature branch
git checkout feature/valify-kyc-integration

# Navigate to mobile app
cd beneficiary-app-mobile
```

### Step 2: Install Dependencies

```bash
# Install npm packages
npm install --legacy-peer-deps

# This will take 2-3 minutes
```

### Step 3: Generate Android Project

```bash
# Create a temporary React Native project to get Android files
cd ..
npx react-native@0.72.6 init TempRNProject --skip-install

# Copy the Android directory to our project
cp -r TempRNProject/android beneficiary-app-mobile/

# Clean up
rm -rf TempRNProject

# Go back to our project
cd beneficiary-app-mobile
```

### Step 4: Configure Android Project

#### 4.1 Update `android/app/build.gradle`

Open `android/app/build.gradle` and update:

```gradle
android {
    compileSdkVersion 33
    
    defaultConfig {
        applicationId "com.healthflow.beneficiary"
        minSdkVersion 23
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
    }
}
```

#### 4.2 Update `android/app/src/main/AndroidManifest.xml`

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.healthflow.beneficiary">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

    <application
        android:name=".MainApplication"
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:allowBackup="false"
        android:theme="@style/AppTheme">
        
        <activity
            android:name=".MainActivity"
            android:label="@string/app_name"
            android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
            android:launchMode="singleTask"
            android:windowSoftInputMode="adjustResize"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

### Step 5: Create .env File

```bash
# Create .env file in beneficiary-app-mobile/
cat > .env << 'EOF'
# BSP Backend API
BSP_API_URL=https://dev-bsp.healthflow.eg/api/v1
BSP_API_KEY=dev_key_placeholder

# HCX Gateway
HCX_GATEWAY_URL=https://dev-hcx.healthflow.eg
HCX_PARTICIPANT_CODE=BSP001

# Valify KYC Service
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
EOF
```

### Step 6: Build the APK

```bash
# Navigate to android directory
cd android

# Make gradlew executable (Mac/Linux)
chmod +x gradlew

# Build Debug APK
./gradlew assembleDebug

# On Windows, use:
# gradlew.bat assembleDebug
```

**Build time**: 5-10 minutes (first time)

### Step 7: Locate the APK

```bash
# The APK will be at:
# android/app/build/outputs/apk/debug/app-debug.apk

# Copy to easy location
cp app/build/outputs/apk/debug/app-debug.apk ~/Desktop/hcx-beneficiary-debug.apk

echo "✅ APK is ready at ~/Desktop/hcx-beneficiary-debug.apk"
```

---

## 📱 Install APK on Device

### Method 1: Via USB (ADB)

```bash
# Enable USB Debugging on your Android device
# Connect device via USB

# Install APK
adb install ~/Desktop/hcx-beneficiary-debug.apk

# Launch app
adb shell am start -n com.healthflow.beneficiary/.MainActivity
```

### Method 2: Direct Install

1. Transfer APK to your phone (email, drive, etc.)
2. Enable "Install from Unknown Sources" in Settings
3. Tap the APK file to install
4. Open the app

---

## 🐛 Troubleshooting

### Build Fails with "SDK not found"

**Solution**: Set ANDROID_HOME environment variable

```bash
# Mac/Linux - Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Windows - Set in System Environment Variables
ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk
```

### Build Fails with "Java version"

**Solution**: Use JDK 17

```bash
# Check Java version
java --version

# Should show: openjdk 17.x.x

# If not, install JDK 17 from:
# https://adoptium.net/temurin/releases/?version=17
```

### Gradle Build Fails

**Solution**: Clean and rebuild

```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### App Crashes on Launch

**Solution**: Check logs

```bash
# View real-time logs
adb logcat | grep -i "react"

# Common issues:
# 1. Missing .env file
# 2. Permissions not granted
# 3. Network connectivity
```

---

## 🎯 Build for Release (Production)

### Step 1: Generate Signing Key

```bash
# Generate keystore
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Enter password and details when prompted
```

### Step 2: Configure Signing

Edit `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('my-release-key.keystore')
            storePassword 'YOUR_PASSWORD'
            keyAlias 'my-key-alias'
            keyPassword 'YOUR_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Step 3: Build Release APK

```bash
cd android
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## ✅ Quick Command Summary

```bash
# Complete build process in one go:

git clone https://github.com/HealthFlowEgy/hcx-apps.git
cd hcx-apps/beneficiary-app-mobile
npm install --legacy-peer-deps

# Generate Android project
cd ..
npx react-native@0.72.6 init TempRNProject --skip-install
cp -r TempRNProject/android beneficiary-app-mobile/
rm -rf TempRNProject
cd beneficiary-app-mobile

# Create .env (copy from above)
# Configure build.gradle and AndroidManifest.xml (see above)

# Build APK
cd android
chmod +x gradlew
./gradlew assembleDebug

# APK ready at:
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📊 Build Information

| Setting | Value |
|---------|-------|
| **Package Name** | com.healthflow.beneficiary |
| **Min SDK** | Android 6.0 (API 23) |
| **Target SDK** | Android 13 (API 33) |
| **Version Code** | 1 |
| **Version Name** | 1.0.0 |
| **Debug APK Size** | ~50-80 MB |
| **Release APK Size** | ~30-50 MB |

---

## 🎉 Success!

Once you have the APK:

✅ Install on Android devices  
✅ Test all features  
✅ Share with QA team  
✅ Demo to stakeholders  
✅ Prepare for beta release  

---

## 📞 Need Help?

Common issues and solutions are in the Troubleshooting section above.

For additional help:
1. Check React Native documentation
2. Check Android Studio documentation
3. Contact the development team

**Happy Building! 🚀**
