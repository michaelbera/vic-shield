export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

export interface IdentityInfo {
  documentType: 'passport' | 'drivingLicense' | 'nationalId';
  documentNumber: string;
  documentFile?: File | null;
}

export interface AddressInfo {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface KYCData {
  personalInfo: PersonalInfo;
  identityInfo: IdentityInfo;
  addressInfo: AddressInfo;
}

export type KYCStep = 'personal' | 'identity' | 'address' | 'review';

export interface KYCContextType {
  currentStep: KYCStep;
  kycData: KYCData;
  setCurrentStep: (step: KYCStep) => void;
  updatePersonalInfo: (info: PersonalInfo) => void;
  updateIdentityInfo: (info: IdentityInfo) => void;
  updateAddressInfo: (info: AddressInfo) => void;
  isStepCompleted: (step: KYCStep) => boolean;
}