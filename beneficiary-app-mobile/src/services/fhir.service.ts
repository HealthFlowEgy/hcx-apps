// ============================================================================
// FHIR R4 SERVICE
// Creates FHIR R4 bundles for HCX Protocol
// Location: beneficiary-app-mobile/src/services/fhir.service.ts
// ============================================================================

/**
 * FHIR R4 Service
 * 
 * Creates FHIR R4 compliant bundles for:
 * - Coverage Eligibility Requests
 * - Claims
 * - Pre-Authorization Requests
 * - Communication Requests
 */
class FHIRService {
  
  /**
   * Create Coverage Eligibility Request bundle
   */
  createCoverageEligibilityRequest(data: {
    patientId: string;
    patientName: string;
    nationalId: string;
    policyNumber: string;
    providerId: string;
    providerName: string;
    payorId: string;
    serviceType: string;
    treatmentType?: string;
  }) {
    return {
      resourceType: 'Bundle',
      type: 'collection',
      timestamp: new Date().toISOString(),
      entry: [
        {
          fullUrl: `Patient/${data.patientId}`,
          resource: {
            resourceType: 'Patient',
            id: data.patientId,
            identifier: [
              {
                type: {
                  coding: [
                    {
                      system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                      code: 'NI',
                      display: 'National Identifier',
                    },
                  ],
                },
                system: 'http://egypt.gov/national-id',
                value: data.nationalId,
              },
            ],
            name: [
              {
                text: data.patientName,
              },
            ],
          },
        },
        {
          fullUrl: `Coverage/${data.policyNumber}`,
          resource: {
            resourceType: 'Coverage',
            id: data.policyNumber,
            status: 'active',
            beneficiary: {
              reference: `Patient/${data.patientId}`,
            },
            payor: [
              {
                reference: `Organization/${data.payorId}`,
              },
            ],
          },
        },
        {
          fullUrl: 'CoverageEligibilityRequest/1',
          resource: {
            resourceType: 'CoverageEligibilityRequest',
            id: '1',
            status: 'active',
            purpose: ['validation'],
            patient: {
              reference: `Patient/${data.patientId}`,
            },
            servicedDate: new Date().toISOString().split('T')[0],
            created: new Date().toISOString(),
            provider: {
              reference: `Organization/${data.providerId}`,
              display: data.providerName,
            },
            insurer: {
              reference: `Organization/${data.payorId}`,
            },
            insurance: [
              {
                coverage: {
                  reference: `Coverage/${data.policyNumber}`,
                },
              },
            ],
            item: [
              {
                category: {
                  coding: [
                    {
                      system: 'http://terminology.hl7.org/CodeSystem/ex-benefitcategory',
                      code: data.serviceType,
                      display: data.treatmentType || data.serviceType,
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    };
  }

  /**
   * Create Claim bundle
   */
  createClaim(data: {
    patientId: string;
    patientName: string;
    nationalId: string;
    policyNumber: string;
    providerId: string;
    providerName: string;
    payorId: string;
    diagnosisCode: string;
    diagnosisDisplay: string;
    treatmentType: string;
    billDate: string;
    totalAmount: number;
    items: Array<{
      serviceName: string;
      serviceCode?: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }>;
  }) {
    return {
      resourceType: 'Bundle',
      type: 'collection',
      timestamp: new Date().toISOString(),
      entry: [
        {
          fullUrl: `Patient/${data.patientId}`,
          resource: {
            resourceType: 'Patient',
            id: data.patientId,
            identifier: [
              {
                type: {
                  coding: [
                    {
                      system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                      code: 'NI',
                      display: 'National Identifier',
                    },
                  ],
                },
                system: 'http://egypt.gov/national-id',
                value: data.nationalId,
              },
            ],
            name: [
              {
                text: data.patientName,
              },
            ],
          },
        },
        {
          fullUrl: `Coverage/${data.policyNumber}`,
          resource: {
            resourceType: 'Coverage',
            id: data.policyNumber,
            status: 'active',
            beneficiary: {
              reference: `Patient/${data.patientId}`,
            },
            payor: [
              {
                reference: `Organization/${data.payorId}`,
              },
            ],
          },
        },
        {
          fullUrl: 'Claim/1',
          resource: {
            resourceType: 'Claim',
            id: '1',
            status: 'active',
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/claim-type',
                  code: 'institutional',
                  display: 'Institutional',
                },
              ],
            },
            use: 'claim',
            patient: {
              reference: `Patient/${data.patientId}`,
            },
            billablePeriod: {
              start: data.billDate,
              end: data.billDate,
            },
            created: new Date().toISOString(),
            provider: {
              reference: `Organization/${data.providerId}`,
              display: data.providerName,
            },
            priority: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/processpriority',
                  code: 'normal',
                },
              ],
            },
            insurance: [
              {
                sequence: 1,
                focal: true,
                coverage: {
                  reference: `Coverage/${data.policyNumber}`,
                },
              },
            ],
            diagnosis: [
              {
                sequence: 1,
                diagnosisCodeableConcept: {
                  coding: [
                    {
                      system: 'http://hl7.org/fhir/sid/icd-10',
                      code: data.diagnosisCode,
                      display: data.diagnosisDisplay,
                    },
                  ],
                },
              },
            ],
            item: data.items.map((item, index) => ({
              sequence: index + 1,
              productOrService: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/service-type',
                    code: item.serviceCode || 'general',
                    display: item.serviceName,
                  },
                ],
                text: item.serviceName,
              },
              quantity: {
                value: item.quantity,
              },
              unitPrice: {
                value: item.unitPrice,
                currency: 'EGP',
              },
              net: {
                value: item.totalPrice,
                currency: 'EGP',
              },
            })),
            total: {
              value: data.totalAmount,
              currency: 'EGP',
            },
          },
        },
      ],
    };
  }

  /**
   * Create Pre-Authorization Request bundle
   */
  createPreAuthRequest(data: {
    patientId: string;
    patientName: string;
    nationalId: string;
    policyNumber: string;
    providerId: string;
    providerName: string;
    payorId: string;
    diagnosisCode: string;
    diagnosisDisplay: string;
    treatmentType: string;
    proposedDate: string;
    estimatedAmount: number;
  }) {
    return {
      resourceType: 'Bundle',
      type: 'collection',
      timestamp: new Date().toISOString(),
      entry: [
        {
          fullUrl: `Patient/${data.patientId}`,
          resource: {
            resourceType: 'Patient',
            id: data.patientId,
            identifier: [
              {
                type: {
                  coding: [
                    {
                      system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                      code: 'NI',
                      display: 'National Identifier',
                    },
                  ],
                },
                system: 'http://egypt.gov/national-id',
                value: data.nationalId,
              },
            ],
            name: [
              {
                text: data.patientName,
              },
            ],
          },
        },
        {
          fullUrl: `Coverage/${data.policyNumber}`,
          resource: {
            resourceType: 'Coverage',
            id: data.policyNumber,
            status: 'active',
            beneficiary: {
              reference: `Patient/${data.patientId}`,
            },
            payor: [
              {
                reference: `Organization/${data.payorId}`,
              },
            ],
          },
        },
        {
          fullUrl: 'Claim/1',
          resource: {
            resourceType: 'Claim',
            id: '1',
            status: 'active',
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/claim-type',
                  code: 'institutional',
                  display: 'Institutional',
                },
              ],
            },
            use: 'preauthorization',
            patient: {
              reference: `Patient/${data.patientId}`,
            },
            created: new Date().toISOString(),
            provider: {
              reference: `Organization/${data.providerId}`,
              display: data.providerName,
            },
            priority: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/processpriority',
                  code: 'normal',
                },
              ],
            },
            insurance: [
              {
                sequence: 1,
                focal: true,
                coverage: {
                  reference: `Coverage/${data.policyNumber}`,
                },
              },
            ],
            diagnosis: [
              {
                sequence: 1,
                diagnosisCodeableConcept: {
                  coding: [
                    {
                      system: 'http://hl7.org/fhir/sid/icd-10',
                      code: data.diagnosisCode,
                      display: data.diagnosisDisplay,
                    },
                  ],
                },
              },
            ],
            item: [
              {
                sequence: 1,
                productOrService: {
                  coding: [
                    {
                      system: 'http://terminology.hl7.org/CodeSystem/service-type',
                      code: 'general',
                      display: data.treatmentType,
                    },
                  ],
                  text: data.treatmentType,
                },
                servicedDate: data.proposedDate,
                unitPrice: {
                  value: data.estimatedAmount,
                  currency: 'EGP',
                },
                net: {
                  value: data.estimatedAmount,
                  currency: 'EGP',
                },
              },
            ],
            total: {
              value: data.estimatedAmount,
              currency: 'EGP',
            },
          },
        },
      ],
    };
  }

  /**
   * Create Communication Request bundle
   */
  createCommunicationRequest(data: {
    patientId: string;
    senderId: string;
    recipientId: string;
    relatedClaimId?: string;
    message: string;
  }) {
    return {
      resourceType: 'Bundle',
      type: 'collection',
      timestamp: new Date().toISOString(),
      entry: [
        {
          fullUrl: 'Communication/1',
          resource: {
            resourceType: 'Communication',
            id: '1',
            status: 'preparation',
            subject: {
              reference: `Patient/${data.patientId}`,
            },
            sender: {
              reference: `Organization/${data.senderId}`,
            },
            recipient: [
              {
                reference: `Organization/${data.recipientId}`,
              },
            ],
            sent: new Date().toISOString(),
            payload: [
              {
                contentString: data.message,
              },
            ],
            ...(data.relatedClaimId && {
              basedOn: [
                {
                  reference: `Claim/${data.relatedClaimId}`,
                },
              ],
            }),
          },
        },
      ],
    };
  }

  /**
   * Validate FHIR bundle
   */
  validateBundle(bundle: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!bundle.resourceType || bundle.resourceType !== 'Bundle') {
      errors.push('Invalid resource type. Must be Bundle.');
    }

    if (!bundle.type) {
      errors.push('Bundle type is required.');
    }

    if (!bundle.entry || !Array.isArray(bundle.entry) || bundle.entry.length === 0) {
      errors.push('Bundle must contain at least one entry.');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export default new FHIRService();
