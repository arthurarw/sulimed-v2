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
