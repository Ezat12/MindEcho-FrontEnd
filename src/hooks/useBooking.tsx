import { useState, useEffect } from 'react';
import * as bookingService from '../services/bookingService';
import signalRService from '../services/signalRService';

export const useBooking = () => {
  const [bookings, setBookings] = useState<any[]>([]);

  const fetchBookings = async (isDoctor: boolean) => {
    try {
      const data = await bookingService.getAllBookings(isDoctor);
      setBookings(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateStatus = async (Id: number, status: number) => {
    await bookingService.changeBookingStatus(Id, status);
  };

  useEffect(() => {
    signalRService.startSignalR();
    
    signalRService.onReceiveNotification(() => {
      const isDoctor = localStorage.getItem('role') === 'Doctor';
      fetchBookings(isDoctor === 'true'); 
    });

    return () => signalRService.stopSignalR();
  }, []);

  return { bookings, fetchBookings, updateStatus };
};
