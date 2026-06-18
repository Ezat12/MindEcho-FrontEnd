export type IDoctor = {
  id: string;
  fullName: string;
  email: string;
  gender: number;
  age: number;
  specialization: string;
  sessionTime: number;
  price: number;
  bio: string;
  profilePicture: string | null;
  avgResponseTime?: string;
  experience?: number;
  patientsHelped?: number;
  rating?: number;
  ratingCount?: number;
};

export interface ISlot {
  id: number;
  doctorWeeklyScheduleId: number;
  startTime: string; // "12:00:00"
  endTime: string; // "13:00:00"
  date: string; // "2026-06-07T00:00:00"
  isBooked?: boolean;
}

export interface IBooking {
  id: number;
  doctorSessionSlotId: number;
  userId: string;
  doctorId: string;
  doctor: IDoctor | null;
  bookingStatus: number; // 0 = Pending, 1 = Confirmed, 2 = Cancelled, 3 = Completed, 4 = Rejected
  requestedAt: string;
  confirmedAt: string | null;
}

export const BookingStatus = {
  Pending: 0,
  Confirmed: 1,
  Cancelled: 2,
  Completed: 3,
  Rejected: 4,
} as const;
