export interface UserIn {
  full_name: string;
  email: string;
  password: string;
  phone: string;
  cpf: string;
  transaction_password: string;
  birth: Date;
}

export interface UserOut {
  id: number;
  full_name: string | null;
}