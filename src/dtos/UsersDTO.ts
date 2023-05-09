export interface UserInfoIn {
  full_name: string;
  phone: string;
  cpf: string;
  birth?: Date;
}

export interface UserAuthIn{
  user_info_id: string,
  email: string,
  password: string
}

export interface UserOut {
  id: string;
  full_name: string | null;
}