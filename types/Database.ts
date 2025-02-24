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
  is_company: string;
  colab_id: string;
  pre_contract: string;
  category_id: string;
  person_type: string;
  person_name: string;
  person_nickname: string;
  person_observation: string;
  gender: string;
  civil_state: string;
  observation: string;
  unity_consumer: string;
  dealership_id: string;
  phone_1: string;
  phone_2: string;
  cellphone: string;
  observation_phone_1: string;
  observation_phone_2: string;
  observation_cellphone: string;
  name: string;
  type: string;
  email: string;
  phone: string;
  telephone: string;
  zipcode: string;
  street_id: string;
  neighborhood_id: string;
  number: string;
  city_id: string;
  signature: string;
  created_at: string;
  sale_at: string;
  contract_at: string;
  document: string;
  document_2: string;
  mensality_price: string;
  due_contract_day: string;
  observation_remote: string;
  parents_address: string;
  father_name: string;
  mother_name: string;
  naturality_city: string;
  bankslip_installments_generated: string;
  bankslip_installments: string;
  membership_fee: string;
  account_holder_name: string;
  account_holder_type: string;
  account_document: string;
  account_document_2: string;
  action_registration: string;
  action_registration_send: string;
  installation_partner: string;
  sync: boolean;
}

export interface LocalCity {
  id: number;
  name: string;
}

export interface LocalStreet {
  id: number;
  name: string;
}

export interface LocalNeighborhood {
  id: number;
  name: string;
}

export interface LocalKinship {
  id: number;
  name: string;
}

export interface LocalCategory {
  id: number;
  description: string;
  price: number;
  max_colabs: number;
}

export interface BusinessContract {
  id: number;
  is_company: boolean;
  colab_id: number | null;
  pre_contract: string;
  category_id: number | null;
  category_business_id: number | null;
  person_type: string;
  person_name: string;
  person_nickname: string;
  person_observation: string;
  gender: number;
  civil_state: number;
  observation: string;
  unity_consumer: string;
  dealership_id: number | null;
  phone_1: string | null;
  phone_2: string | null;
  cellphone: string | null;
  observation_phone_1: string | null;
  observation_phone_2: string | null;
  observation_cellphone: string | null;
  name: string | null;
  type: string | null;
  email: string | null;
  zipcode: string | null;
  complement: string | null;
  street_id: number;
  neighborhood_id: number;
  number: string | null;
  city_id: number;
  signature: string | null;
  created_at: string | null;
  sale_at: string | null;
  contract_at: string | null;
  document: string | null;
  document_2: string | null;
  company_fundation_at: string | null;
  mensality_price: string | null;
  due_contract_day: string | number | null;
  observation_remote: string | null;
  parents_address: string | null;
  father_name: string | null;
  mother_name: string | null;
  naturality_city: number | null;
  bankslip_installments_generated: string | null;
  bankslip_installments: number | null;
  membership_fee: number | null;
  account_holder_name: string | null;
  account_holder_type: string | null;
  account_document: string | null;
  account_document_2: string | null;
  action_registration: string | null;
  action_registration_send: string | null;
  installation_partner: string | null;
}
