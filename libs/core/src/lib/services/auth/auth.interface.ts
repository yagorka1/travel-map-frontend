export interface AuthResponse {
  accessToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface SignUpDto {
  email: string;
  password: string;
  name: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  exp: number;
  iat: number;
}
