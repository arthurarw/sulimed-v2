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
