export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
    gender: number;
    age: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export interface LoginData {
    token: string;
    userName: string;
}

export interface GeneralResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}
