

import { useEffect, useState } from 'react';
import signalRService from '../api/signalrService';

export const useNotifications = () => {

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {

    signalRService. startSignalR();

    signalRService.onReceiveNotification((data) => {

      setNotifications((prev) => [data, ...prev]);
    });

  }, []);

  return { notifications };
};

