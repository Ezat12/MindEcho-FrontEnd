import axiosInstance from './axiosConfig';


export const getDoctorSchedules = async (doctorId: string) => {
  const res = await axiosInstance.get(`/api/DoctorSchedule/doctorSchedules?DoctorId=${doctorId}`);
  return res.data;
};

export const getDoctorSlots = async (doctorId: string) => {
  const res = await axiosInstance.get(`/api/DoctorSchedule/slots?DoctorId=${doctorId}`);
  return res.data; 
};

export const addDoctorSchedule = async (scheduleData: {
  DayOfWeek: number,
  StartTime: string, 
  EndTime: string,   
  IsActive: boolean
}) => {
  const formData = new FormData();
  
  formData.append('DayOfWeek', scheduleData.DayOfWeek.toString());
  formData.append('StartTime', `${scheduleData.StartTime}:00`); 
  formData.append('EndTime', `${scheduleData.EndTime}:00`);
  formData.append('IsActive', scheduleData.IsActive ? 'true' : 'false');

 Content-Type لـ multipart/form-data
  const res = await axiosInstance.post('/api/DoctorSchedule/Add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return res.data; 
};

export const deleteDoctorSchedule = async (id: number) => {
  const res = await axiosInstance.delete(`/api/DoctorSchedule/${id}`); 
  return res.data; 
};


export const getDoctorBookings = async () => {
  const res = await axiosInstance.post('/api/Booking/getAllBookings?isDoctor=true'); 
  return res.data; 
};

export const updateBookingStatus = async (bookingId: number, status: number) => {
  const res = await axiosInstance.post(`/api/Booking/change-status?Id=${bookingId}&status=${status}`);
  return res.data;
};

export const getDoctorDashboardData = async () => {
  const res = await getDoctorBookings(); 
  if (!res?.success) return { success: false, data: null }; 
  const bookings = res.data || []; 
  const totalPatients = new Set(bookings.map((b: any) => b.patientId || b.userId)).size; 
  const today = new Date().toDateString(); 
  const appointmentsToday = bookings.filter((b: any) => b.bookingDate && new Date(b.bookingDate).toDateString() === today);
  const revenue = bookings.reduce((sum: number, b: any) => sum + (b.price || b.amount || 0), 0);
  return { success: true, data: { totalPatients, appointmentsToday: appointmentsToday.length, revenue, upcomingAppointments: bookings.slice(0, 5), bookings } };
};

export const getMyPatients = async () => {
  const res = await getDoctorBookings(); 
  const patients = (res?.data || []).filter((b: any) => b.bookingStatus === 1);
  return { success: true, data: patients };
};

export const getUpcomingAppointments = async () => {
  const res = await getDoctorBookings(); 
  const upcoming = (res?.data || []).filter((b: any) => new Date(b.bookingDate) >= new Date());
  return { success: true, data: upcoming };
};

export const getChatHistory = async (patientId: string) => {
  const res = await axiosInstance.get(`/api/Chat/history?patientId=${patientId}`); 
  return res.data; 
};

export const getDoctorProfile = async () => {
  const res = await axiosInstance.get('/api/Doctor/profile'); 
  return res.data; 
};

export const updateDoctorProfile = async (formData: FormData) => {
  const res = await axiosInstance.post('/api/Doctor', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }); 
  return res.data; 
};

export default {
  getDoctorBookings,
  updateBookingStatus,
  getDoctorDashboardData,
  getMyPatients,
  getUpcomingAppointments,
  getChatHistory,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorSchedules,
  getDoctorSlots,
  addDoctorSchedule,
  deleteDoctorSchedule,
};
