export interface Customer {
  customer_id: string;
  company_name: string;
  contact_name: string;
  contact_title: string;
  address: string;
  city: string;
  region: string | null;
  postal_code: string;
  country: string;
  phone: string;
  fax: string | null;
}
