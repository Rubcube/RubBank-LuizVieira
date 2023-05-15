export interface AddressIn {
  user_id?: string;
  cep: string;
  type: string | "";
  street: string;
  number: string;
  complement: string | "";
  neighborhood: string;
  city: string;
  state: string;
}