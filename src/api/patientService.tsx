import axiosInstance from "./axiosConfig";
import type { ApiResponse } from "../types/api.types";
import type { PatientProfile } from "../types/patient";

// ========== CHAT FUNCTIONS (Direct exports) ==========
export const getPatientChatHistory = async (
  doctorId: string,
): Promise<ApiResponse<any[]>> => {
  // ✅ شيل /api من الأول لأن axiosInstance.baseURL = '/api'
  const response = await axiosInstance.get(
    `/Chat/history?doctorId=${doctorId}`,
  );
  return response.data;
};

export const sendPatientMessage = async (
  doctorId: string,
  message: string,
): Promise<ApiResponse<any>> => {
  // ✅ شيل /api من الأول
  const response = await axiosInstance.post("/Chat/send", {
    receiverId: doctorId,
    message: message,
  });
  return response.data;
};

export const getMyDoctors = async (): Promise<ApiResponse<any[]>> => {
  // ✅ شيل /api من الأول
  const response = await axiosInstance.get("/Patient/my-doctors");
  return response.data;
};

export const patientService = {
  // Get Patient Profile
  getProfile: async (): Promise<ApiResponse<PatientProfile>> => {
    // ✅ شيل /api من الأول
    const response = await axiosInstance.get("/Patient/profile");
    return response.data;
  },

  // Update Patient Profile
  updateProfile: async (
    formData: FormData,
  ): Promise<ApiResponse<PatientProfile>> => {
    // ✅ شيل /api من الأول
    const response = await axiosInstance.post("/Patient", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Get All Doctors
  getAllDoctors: async (): Promise<ApiResponse<any[]>> => {
    // ✅ شيل /api من الأول
    const response = await axiosInstance.get("/Doctor/All");
    return response.data;
  },

  // Book Appointment
  bookAppointment: async (bookingData: any): Promise<ApiResponse<any>> => {
    // ✅ شيل /api من الأول
    const response = await axiosInstance.post("/Booking/create", bookingData);
    return response.data;
  },

  // Get My Appointments
  getMyAppointments: async (): Promise<ApiResponse<any[]>> => {
    // ✅ شيل /api من الأول
    const response = await axiosInstance.get(
      "/Booking/getAllBookings?isDoctor=false",
    );
    return response.data;
  },

  // Get Doctor Slots
  getDoctorSlots: async (doctorId: string): Promise<ApiResponse<any[]>> => {
    // ✅ شيل /api من الأول
    const response = await axiosInstance.get(
      `/DoctorSchedule/slots?DoctorId=${doctorId}`,
    );
    return response.data;
  },

  // Cancel Appointment
  cancelAppointment: async (bookingId: string): Promise<ApiResponse<any>> => {
    // ✅ شيل /api من الأول
    const response = await axiosInstance.post(
      `/Booking/cancel?bookingId=${bookingId}`,
    );
    return response.data;
  },

  // Chat Functions
  getChatHistory: getPatientChatHistory,
  sendMessage: sendPatientMessage,
  getMyDoctors: getMyDoctors,
};

export default patientService;
