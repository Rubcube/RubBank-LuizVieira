import { AccountIn } from './AccountDTO';
import { AddressIn } from './AddressDTO';

export interface UserInfoIn{
  full_name: string,
  phone: string,
  email: string,
  birth?: Date,
  user_auth: UserAuthIn,
  address: AddressIn,
  account: AccountIn
}

export interface UserAuthIn{
  cpf: string,
  password: string
}

export interface UserOut {
  id: string;
  full_name: string | null;
}