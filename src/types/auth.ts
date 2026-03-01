export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  username: string;
  password: string;
}
