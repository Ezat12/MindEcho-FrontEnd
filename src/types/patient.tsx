

export interface PatientProfile {
  id: string;
  fullName: string;
  age: number;
  imageUrl: string;
}

export interface PatientDoctor {
  id: string;
  fullName: string;
  specialization?: string;
  imageUrl?: string;
  rating?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  statusCode?: number;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  gender: number;
  age: number;
}

export interface ChatMessage
{
    id?: string;
  text: string;
  senderId?: string;
  receiverId?: string;
  time?: string;
}

export interface AppointmentStatus
{
    PENDING: 0;
  CONFIRMED: 1;
  CANCELLED: 2;
  COMPLETED: 3;
  REJECTED: 4;
}

