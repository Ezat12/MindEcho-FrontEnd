import axiosInstance from "./axiosConfig";

export const getAllBookings = async (isDoctor: boolean) => {
  const res = await axiosInstance.post(
    `/Booking/getAllBookings?isDoctor=${isDoctor}`,
  );
  return res.data;
};

export const getDoctorBookings = async () => {
  const res = await axiosInstance.post("/Booking/getAllBookings?isDoctor=true");
  return res.data;
};

export const updateBookingStatus = async (Id: number, status: number) => {
  const res = await axiosInstance.post(
    `/Booking/change-status?Id=${Id}&status=${status}`,
  );
  return res.data;
};

export const createBooking = async (data: {
  doctorId: string;
  doctorSessionSlotId: number;
}) => {
  const formData = new FormData();
  formData.append("DoctorId", data.doctorId);
  formData.append("DoctorSessionSlotId", data.doctorSessionSlotId.toString());
  const res = await axiosInstance.post("/Booking/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export default {
  getAllBookings,
  getDoctorBookings,
  updateBookingStatus,
  createBooking,
};
