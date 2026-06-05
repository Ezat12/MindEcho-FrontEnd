import axiosInstance from './axiosConfig';
import type { ApiResponse } from '../types/api.types';
import type { PatientProfile } from '../types/patient';

// Get Patient Profile

export const patientService = {

  getProfile: async (): Promise<ApiResponse<PatientProfile>> => {
    const response = await axiosInstance.get('/api/Patient/profile');
    return response.data;
  },

  // Update Patient Profile

  updateProfile: async (formData: FormData): Promise<ApiResponse<PatientProfile>> => {
    const response = await axiosInstance.post('/api/Patient', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Get All Doctors

  getAllDoctors: async (): Promise<ApiResponse<any[]>> => {
    const response = await axiosInstance.get('/api/Doctor/All');
    return response.data;
  },

  bookAppointment: async (bookingData: any): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.post('/api/Booking/create', bookingData);
    return response.data;
  },

  getMyAppointments: async (): Promise<ApiResponse<any[]>> => {
    const response = await axiosInstance.get('/api/Booking/getAllBookings?isDoctor=false');
    return response.data;
  },

getDoctorSlots: async (doctorId: string): Promise<ApiResponse<any[]>> => {
  const response = await axiosInstance.get(`/api/DoctorSchedule/slots?DoctorId=${doctorId}`);
  return response.data;
},

  cancelAppointment: async (bookingId: string): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.post(`/api/Booking/cancel?bookingId=${bookingId}`);
    return response.data;
  }
};

export default patientService;
