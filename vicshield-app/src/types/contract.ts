export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  category: ContractCategory;
  fields: ContractField[];
  icon?: string;
  isPopular?: boolean;
}

export interface ContractField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  required: boolean;
  options?: string[]; // for select type
  placeholder?: string;
}

export interface Contract {
  id: string;
  templateId: string;
  templateName: string;
  title: string;
  data: Record<string, any>;
  status: ContractStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  parties?: ContractParty[];
}

export interface ContractParty {
  id: string;
  name: string;
  email: string;
  role: 'signer' | 'witness' | 'notary';
  signed: boolean;
  signedAt?: Date;
}

export type ContractCategory = 
  | 'real-estate' 
  | 'employment' 
  | 'rental' 
  | 'service' 
  | 'purchase' 
  | 'partnership'
  | 'other';

export type ContractStatus = 
  | 'draft' 
  | 'pending' 
  | 'signed' 
  | 'completed' 
  | 'cancelled';

export interface ContractSearchFilters {
  query?: string;
  category?: ContractCategory;
  status?: ContractStatus;
  dateFrom?: Date;
  dateTo?: Date;
}