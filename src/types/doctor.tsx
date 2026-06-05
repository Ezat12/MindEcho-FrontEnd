
export interface DoctorPatient {
  id: string;
  fullName: string;
  imageUrl?: string;
  age?: number;
  lastMessage?: string;
  online?: boolean;
}

export interface DoctorScheduleDto {
  id: number;
  doctorId: string;
  dayOfWeek: number | string;
  startTime: string;
  endTime: string;
}

export interface DoctorSessionSlotDto {
  id: number;
  doctorId: string;
  startTime: string;
  endTime: string;
  isReserved: boolean;
}

export interface DoctorStats {
  totalPatients: number;
  appointmentsToday: number;
  revenue: number;
}

export interface Appointment {
  id: string;
  patientName: string;
  date?: string;
  time: string;
  status: number;
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
