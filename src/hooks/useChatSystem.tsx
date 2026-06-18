import { useEffect, useState, useCallback } from "react";
import signalRService from "../api/signalrService";
import bookingService from "../api/bookingService";

export const useChatSystem = (patientId: string) => {
  const [canChat, setCanChat] = useState(false);
  const [bookings, setBookings] = useState<unknown[]>([]);
  const [messages, setMessages] = useState<unknown[]>([]);
  const [bookingId, setBookingId] = useState<string | number>(0);

  // Load Bookings + Permission Check

  const checkPermission = useCallback(async () => {
    const res = await bookingService.getAllBookings(false);

    const data = res.data || [];

    setBookings(data);

    const allowed = data.some(
      (b: { userId: string; bookingStatus: number; id: string | number }) => {
        if (b.userId === patientId && b.bookingStatus === 1) {
          setBookingId(b.id);
          return true;
        }
        return false;
      },
    );

    setCanChat(allowed);
  }, [patientId]);

  // Start SignalR

  useEffect(() => {
    signalRService.startSignalR();

    signalRService.onReceiveMessage((senderId, message) => {
      setMessages((prev) => [...prev, { senderId, message }]);
    });

    checkPermission();

    return () => {
      signalRService.stopSignalR();
    };
  }, [checkPermission]);

  // Send Message

  const sendMessage = async (message: string) => {
    if (!canChat) {
      alert("❌ You must book first");
      return;
    }

    await signalRService.sendMessage(bookingId as number, message);
  };

  return {
    canChat,
    messages,
    sendMessage,
    bookings,
  };
};
