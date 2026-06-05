import axiosInstance from './axiosConfig';

export const getAllBookings = async (isDoctor: boolean) => {
  const res = await axiosInstance.post(`/api/Booking/getAllBookings?isDoctor=${isDoctor}`);
  return res.data;
};

export const getDoctorBookings = async () => {
  const res = await axiosInstance.post('/api/Booking/getAllBookings?isDoctor=true');
  return res.data;
};

export const updateBookingStatus = async (Id: number, status: number) => {
  const res = await axiosInstance.post(`/api/Booking/change-status?Id=${Id}&status=${status}`);
  return res.data;
};

export const createBooking = async (data: { doctorId: string, doctorSessionSlotId: number }) => {
  const res = await axiosInstance.post('/api/Booking/create', data);
  return res.data;
};

export default {
  getAllBookings,
  getDoctorBookings,
  updateBookingStatus,
  createBooking
};
