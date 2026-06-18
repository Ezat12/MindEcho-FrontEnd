import { useState, useEffect } from "react";
import * as bookingService from "../api/bookingService";
import signalRService from "../api/signalrService";

export const useBooking = () => {
  const [bookings, setBookings] = useState<unknown[]>([]);

  const fetchBookings = async (isDoctor: boolean) => {
    try {
      const data = await bookingService.getAllBookings(isDoctor);
      setBookings(Array.isArray(data) ? data : (data?.data ?? []));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateStatus = async (Id: number, status: number) => {
    await bookingService.updateBookingStatus(Id, status);
  };

  useEffect(() => {
    signalRService.startSignalR();

    signalRService.onReceiveMessage(() => {
      const isDoctor = localStorage.getItem("role") === "doctor";
      fetchBookings(isDoctor);
    });

    return () => {
      signalRService.stopSignalR();
    };
  }, []);

  return { bookings, fetchBookings, updateStatus };
};
