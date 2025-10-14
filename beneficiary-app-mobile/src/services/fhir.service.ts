/**
 * FHIR Service
 * Handles FHIR R4 bundle creation and parsing
 * Based on HCX FHIR Implementation Guide v0.9
 * 
 * Note: For beneficiary app, most FHIR handling is done by BSP backend.
 * This service provides helper functions for client-side FHIR operations.
 */

// ============================================================================
// FHIR TYPE DEFINITIONS (Simplified)
// ============================================================================

export interface FHIRBundle {
  resourceType: 'Bundle';
  id: string;
  type: 'document' | 'message' | 'transaction' | 'collection';
  timestamp: string;
  entry: FHIRBundleEntry[];
}

export interface FHIRBundleEntry {
  fullUrl?: string;
  resource: FHIRResource;
}

export interface FHIRResource {
  resourceType: string;
  id?: string;
  meta?: FHIRMeta;
  [key: string]: any;
}

export interface FHIRMeta {
  versionId?: string;
  lastUpdated?: string;
  profile?: string[];
}

export interface FHIRPatient extends FHIRResource {
  resourceType: 'Patient';
  identifier: FHIRIdentifier[];
  name: FHIRHumanName[];
  gender: 'male' | 'female' | 'other' | 'unknown';
  birthDate: string;
  telecom?: FHIRContactPoint[];
  address?: FHIRAddress[];
}

export interface FHIRIdentifier {
  system: string;
  value: string;
  type?: FHIRCodeableConcept;
}

export interface FHIRHumanName {
  use?: 'official' | 'usual' | 'nickname' | 'anonymous';
  text?: string;
  family?: string;
  given?: string[];
}

export interface FHIRContactPoint {
  system: 'phone' | 'email' | 'fax' | 'url' | 'sms';
  value: string;
  use?: 'home' | 'work' | 'mobile';
}

export interface FHIRAddress {
  use?: 'home' | 'work' | 'billing';
  line?: string[];
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface FHIRCodeableConcept {
  coding?: FHIRCoding[];
  text?: string;
}

export interface FHIRCoding {
  system: string;
  code: string;
  display?: string;
}

export interface FHIRClaim extends FHIRResource {
  resourceType: 'Claim';
  identifier: FHIRIdentifier[];
  status: 'active' | 'cancelled' | 'draft' | 'entered-in-error';
  type: FHIRCodeableConcept;
  use: 'claim' | 'preauthorization' | 'predetermination';
  patient: FHIRReference;
  created: string;
  insurer: FHIRReference;
  provider: FHIRReference;
  priority: FHIRCodeableConcept;
  insurance: FHIRClaimInsurance[];
  item?: FHIRClaimItem[];
  total?: FHIRMoney;
}

export interface FHIRReference {
  reference: string;
  display?: string;
}

export interface FHIRClaimInsurance {
  sequence: number;
  focal: boolean;
  coverage: FHIRReference;
}

export interface FHIRClaimItem {
  sequence: number;
  productOrService: FHIRCodeableConcept;
  quantity?: FHIRQuantity;
  unitPrice?: FHIRMoney;
  net?: FHIRMoney;
}

export interface FHIRQuantity {
  value: number;
  unit: string;
  system?: string;
  code?: string;
}

export interface FHIRMoney {
  value: number;
  currency: string;
}

// ============================================================================
// FHIR SERVICE CLASS
// ============================================================================

class FHIRService {
  private readonly HCX_PROFILE_BASE = 'https://ig.hcxprotocol.io/v0.9/StructureDefinition';
  
  // ==========================================================================
  // PATIENT RESOURCE HELPERS
  // ==========================================================================

  createPatientResource(patientData: {
    nationalId: string;
    name: string;
    gender: 'male' | 'female' | 'other';
    birthDate: string;
    phone?: string;
    email?: string;
  }): FHIRPatient {
    const patient: FHIRPatient = {
      resourceType: 'Patient',
      id: this.generateId(),
      meta: {
        profile: [`${this.HCX_PROFILE_BASE}/HCXPatient`],
      },
      identifier: [
        {
          system: 'https://nid.gov.eg',
          value: patientData.nationalId,
          type: {
            coding: [{
              system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
              code: 'NI',
              display: 'National Identifier',
            }],
          },
        },
      ],
      name: [
        {
          use: 'official',
          text: patientData.name,
        },
      ],
      gender: patientData.gender,
      birthDate: patientData.birthDate,
    };

    if (patientData.phone || patientData.email) {
      patient.telecom = [];
      if (patientData.phone) {
        patient.telecom.push({
          system: 'phone',
          value: patientData.phone,
          use: 'mobile',
        });
      }
      if (patientData.email) {
        patient.telecom.push({
          system: 'email',
          value: patientData.email,
        });
      }
    }

    return patient;
  }

  // ==========================================================================
  // BUNDLE HELPERS
  // ==========================================================================

  createBundle(
    type: FHIRBundle['type'],
    entries: FHIRResource[]
  ): FHIRBundle {
    return {
      resourceType: 'Bundle',
      id: this.generateId(),
      type,
      timestamp: new Date().toISOString(),
      entry: entries.map(resource => ({
        fullUrl: `urn:uuid:${resource.id || this.generateId()}`,
        resource,
      })),
    };
  }

  // ==========================================================================
  // PARSING HELPERS
  // ==========================================================================

  parseBundle(bundle: FHIRBundle): FHIRResource[] {
    return bundle.entry.map(entry => entry.resource);
  }

  findResourceInBundle<T extends FHIRResource>(
    bundle: FHIRBundle,
    resourceType: string
  ): T | undefined {
    const entry = bundle.entry.find(
      entry => entry.resource.resourceType === resourceType
    );
    return entry?.resource as T | undefined;
  }

  findAllResourcesInBundle<T extends FHIRResource>(
    bundle: FHIRBundle,
    resourceType: string
  ): T[] {
    return bundle.entry
      .filter(entry => entry.resource.resourceType === resourceType)
      .map(entry => entry.resource as T);
  }

  // ==========================================================================
  // VALIDATION HELPERS
  // ==========================================================================

  validateBundle(bundle: FHIRBundle): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!bundle.resourceType || bundle.resourceType !== 'Bundle') {
      errors.push('Invalid bundle: resourceType must be "Bundle"');
    }

    if (!bundle.type) {
      errors.push('Invalid bundle: type is required');
    }

    if (!bundle.entry || !Array.isArray(bundle.entry)) {
      errors.push('Invalid bundle: entry array is required');
    }

    if (bundle.entry) {
      bundle.entry.forEach((entry, index) => {
        if (!entry.resource) {
          errors.push(`Invalid entry at index ${index}: resource is required`);
        }
        if (entry.resource && !entry.resource.resourceType) {
          errors.push(`Invalid entry at index ${index}: resourceType is required`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // ==========================================================================
  // CODEABLE CONCEPT HELPERS
  // ==========================================================================

  createCodeableConcept(
    system: string,
    code: string,
    display?: string,
    text?: string
  ): FHIRCodeableConcept {
    return {
      coding: [
        {
          system,
          code,
          display,
        },
      ],
      text,
    };
  }

  // ==========================================================================
  // REFERENCE HELPERS
  // ==========================================================================

  createReference(
    resourceType: string,
    id: string,
    display?: string
  ): FHIRReference {
    return {
      reference: `${resourceType}/${id}`,
      display,
    };
  }

  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatDateTime(date: Date): string {
    return date.toISOString();
  }

  // ==========================================================================
  // HCX-SPECIFIC HELPERS
  // ==========================================================================

  createHCXIdentifier(value: string, type: 'claim' | 'preauth' | 'policy'): FHIRIdentifier {
    const typeMap = {
      claim: 'CLM',
      preauth: 'PAU',
      policy: 'POL',
    };

    return {
      system: `https://hcx.eg/identifiers/${type}`,
      value,
      type: {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
          code: typeMap[type],
          display: type.charAt(0).toUpperCase() + type.slice(1),
        }],
      },
    };
  }

  extractClaimAmount(claim: FHIRClaim): number {
    if (claim.total?.value) {
      return claim.total.value;
    }
    
    if (claim.item) {
      return claim.item.reduce((sum, item) => {
        return sum + (item.net?.value || 0);
      }, 0);
    }

    return 0;
  }

  extractPatientName(patient: FHIRPatient): string {
    if (patient.name && patient.name.length > 0) {
      const name = patient.name[0];
      if (name.text) return name.text;
      
      const parts = [];
      if (name.given) parts.push(...name.given);
      if (name.family) parts.push(name.family);
      return parts.join(' ');
    }
    return 'Unknown Patient';
  }

  extractIdentifierValue(
    resource: FHIRResource,
    system: string
  ): string | undefined {
    if ('identifier' in resource && Array.isArray(resource.identifier)) {
      const identifier = resource.identifier.find(
        (id: FHIRIdentifier) => id.system === system
      );
      return identifier?.value;
    }
    return undefined;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

const fhirService = new FHIRService();

export default fhirService;