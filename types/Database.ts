export interface CustomerDatabase {
  id: number;
  name: string;
  email: string;
  phone: string;
  telephone?: string;
  zipcode?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  number?: string;
  signature?: string;
  sync?: boolean;
}

export interface ContractCustomerList {
  id: number;
  name: string;
  created_at: string;
  sync: boolean;
}

export interface Contract {
  id: number;
  is_company: boolean;
  fathers_name: string;
  mothers_name: string;
  observation: string;
  unity_consumer: string;
  phone_1: string;
  phone_2: string;
  observation_phone_1: string;
  observation_phone_2: string;
  name: string;
  type: string;
  email: string;
  phone: string;
  telephone: string;
  zipcode: string;
  street: string;
  neighborhood: string;
  number: string;
  city: string;
  state: string;
  signature: string;
  created_at: string;
  document: string;
  document_2: string;
  external_id: number;
  sync: boolean;
}

export interface LocalCity {
  id: number;
  name: string;
}

export interface LocalCategory {
  id: number;
  description: string;
  price: number;
}
