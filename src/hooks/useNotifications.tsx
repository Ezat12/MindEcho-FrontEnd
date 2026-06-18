import { useEffect, useState } from "react";
import signalRService from "../api/signalrService";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<unknown[]>([]);

  useEffect(() => {
    signalRService.startSignalR();

    signalRService.onReceiveMessage((_senderId, data) => {
      setNotifications((prev) => [data, ...prev]);
    });
  }, []);

  return { notifications };
};
