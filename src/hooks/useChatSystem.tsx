

import { useEffect, useState } from 'react';
import signalRService from '../api/signalrService';
import { bookingService } from '../api/bookingService';

export const useChatSystem = (patientId: string) => {

  const [canChat, setCanChat] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  // Load Bookings + Permission Check

  const checkPermission = async () => {

    const res = await bookingService.getAllBookings();

    const data = res.data || [];

    setBookings(data);

    const allowed = data.some(
      (b: any) =>
        b.userId === patientId &&
        b.bookingStatus === 1
    );

    setCanChat(allowed);
  };

  // Start SignalR

  useEffect(() => {

    signalRService.startConnection();

    signalRService.onReceiveMessage((msg) => {

      setMessages((prev) => [...prev, msg]);
    });

    checkPermission();

    return () => {
      signalRService.stopConnection();
    };

  }, []);

  
  // Send Message

  const sendMessage = async (message: string) => {

    if (!canChat) {
      alert('❌ You must book first');
      return;
    }

    await signalRService.sendMessage(
      patientId,
      message
    );
  };

  return {
    canChat,
    messages,
    sendMessage,
    bookings,
  };
};

