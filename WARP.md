# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository Overview

This is a monorepo containing three React TypeScript healthcare applications that integrate with the HCX (Health Claims Exchange) platform:

- **`opd-app/`** - OPD Provider App for healthcare providers managing outpatient care
- **`beneficiary-app/`** - Beneficiary App for patients to manage their healthcare claims
- **`assisted-bsp/`** - Assisted BSP (Benefit Service Provider) App for insurance-related services

All applications are built with React 18, TypeScript, Vite, and Tailwind CSS.

## Common Development Commands

### Application-Specific Development

Each app (`opd-app`, `beneficiary-app`, `assisted-bsp`) has identical scripts:

```bash
# Navigate to specific app directory first
cd opd-app          # or beneficiary-app, assisted-bsp

# Install dependencies
npm install

# Development server (runs on localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Build Output Locations

Each app has specific postbuild configurations:
- `opd-app`: builds to `build/opd/`
- `beneficiary-app`: builds to `build/bsp/`
- `assisted-bsp`: builds to `build/absp/`

### Code Formatting

All apps include Prettier with Tailwind CSS plugin:
```bash
# Format code (run in each app directory)
npx prettier --write .
```

## Architecture and Code Structure

### Application Architecture

Each app follows a consistent React architecture:

```
src/
├── App.tsx              # Main routing and app configuration
├── main.tsx            # Application entry point
├── components/         # Reusable UI components
├── pages/              # Route-based page components
├── layout/             # Layout wrappers (DefaultLayout)
├── services/           # API services and external integrations
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and constants (strings.ts)
├── common/             # Common components (Loader, etc.)
└── images/             # Static image assets
```

### Key Page Components by App

**OPD App (`opd-app`):**
- `AddPatientAndInitiateCoverageEligibility/` - Patient onboarding and coverage verification
- `AddConsultation/` - Medical consultation management
- `InitiateNewClaimRequest/` - Healthcare claim initiation
- `InitiatePreAuthRequest/` - Pre-authorization requests
- `ViewPatientDetails/` - Patient information display
- `Authentication/` - Provider login system

**Key Routes in OPD App:**
- `/opd-login` - Provider authentication
- `/add-patient` - Patient registration and coverage eligibility
- `/initiate-claim-request` - New claim submission
- `/initiate-preauth-request` - Pre-authorization requests
- `/add-consultation` - Consultation management

### Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 4.x
- **Styling**: Tailwind CSS 3.x
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **State Management**: React hooks (useState, useEffect)
- **UI Libraries**: 
  - Heroicons for icons
  - ApexCharts for data visualization
  - React Toastify for notifications
  - HTML5 QR Code for QR scanning
  - Flatpickr for date selection

### Environment Configuration

Each app uses environment variables in `.env` files:

**Key Environment Variables:**
- `registry_url` - HCX Registry API endpoint
- `hcx_mock_service` - Local mock service URL
- `hcx_service` - HCX platform API endpoint
- `SEARCH_PARTICIPANT_USERNAME` - HCX participant credentials
- `SEARCH_PARTICIPANT_PASSWORD` - HCX participant password

**Reference App URLs** (configured in .env):
- `bsp` - Beneficiary Service Provider app
- `opd` - OPD Provider app
- `absp` - Assisted BSP app
- `ssp` - Service Support Provider app
- `payor` - Payor/Insurance app

### HCX Integration Patterns

The apps integrate with the HCX ecosystem for healthcare claims processing:

1. **Coverage Eligibility** - Verify patient insurance coverage
2. **Pre-Authorization** - Request approval for treatments
3. **Claims Processing** - Submit and track healthcare claims
4. **Participant Registry** - Lookup healthcare providers and insurers

### Development Patterns

**Service Layer Architecture:**
- API calls are abstracted into service modules (`src/services/`)
- Mock services available for local development
- Environment-based API endpoint configuration

**Component Patterns:**
- Consistent use of functional components with hooks
- Toast notifications for user feedback
- Form stepper components for multi-step workflows
- QR code scanning for patient identification

**Routing Patterns:**
- Protected routes with authentication
- Layout wrapper components for consistent UI
- Route-based code splitting

## Development Tips

- Each app runs independently on port 5173 via Vite
- All apps share similar dependencies and structure, making cross-app development predictable
- Use the mock service (`localhost:8080`) for local development without external HCX dependencies
- The apps are designed to work with staging HCX environment (`staging-hcx.swasth.app`)
- Build outputs are organized by app type for deployment convenience