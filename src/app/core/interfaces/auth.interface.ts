export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }
  
  export interface AuthResponse {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    token: string;
    refreshToken: string;
    refreshTokenExpiration: Date;
  }

  export interface UserInfo {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
  }