// services/bookings.ts
import axiosInstance from "../api/axiosConfig";
import type { IBooking } from "../types/IDoctor";
import toast from "react-hot-toast";

// جلب كل حجوزات المستخدم
export const getUserBookings = async (): Promise<IBooking[]> => {
  try {
    const res = await axiosInstance.post(
      `/Booking/getAllBookings?isDoctor=false`,
    );

    console.log("User bookings response:", res.data);

    if (res.data?.success && res.data?.data) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};

// تغيير حالة الحجز
export const changeBookingStatus = async (
  bookingId: number,
  status: number,
): Promise<boolean> => {
  try {
    const res = await axiosInstance.post(`/Booking/change-status`, null, {
      params: {
        Id: bookingId,
        status: status,
      },
    });

    console.log("Change status response:", res.data);

    if (res.data?.success) {
      toast.success(`Booking ${getStatusText(status)} successfully!`);
      return true;
    } else {
      toast.error(res.data?.message || "Failed to update booking");
      return false;
    }
  } catch (error) {
    console.error("Error changing booking status:", error);
    toast.error("Failed to update booking");
    return false;
  }
};

// دالة مساعدة للحصول على نص الحالة
export const getStatusText = (status: number): string => {
  switch (status) {
    case 0:
      return "Pending";
    case 1:
      return "Confirmed";
    case 2:
      return "Cancelled";
    case 3:
      return "Completed";
    case 4:
      return "Rejected";
    default:
      return "Unknown";
  }
};

// دالة للحصول على لون الحالة
export const getStatusColor = (status: number): string => {
  switch (status) {
    case 0:
      return "bg-yellow-100 text-yellow-800";
    case 1:
      return "bg-green-100 text-green-800";
    case 2:
      return "bg-red-100 text-red-800";
    case 3:
      return "bg-blue-100 text-blue-800";
    case 4:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
