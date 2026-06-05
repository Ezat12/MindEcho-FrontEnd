import * as signalR from '@microsoft/signalr';

class SignalRService {
  public connection: signalR.HubConnection | null = null;

  // START CONNECTION

  async startSignalR() {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    const token = localStorage.getItem('token');

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://chef-reclining-deodorize.ngrok-free.dev/chatHub', {
        accessTokenFactory: () => token || '',
      })
      .withAutomaticReconnect()
      .build();

    try {
      await this.connection.start();
      console.log('✅ SignalR Connected');
    } catch (err) {
      console.error('❌ SignalR Error:', err);
      setTimeout(() => this.startSignalR(), 5000);
    }
  }

  // RECEIVE MESSAGE

  onReceiveMessage(callback: (senderId: string, message: string) => void) {
    this.connection?.on('ReceiveMessage', callback);
  }

  offReceiveMessage(callback: (senderId: string, message: string) => void) {
    this.connection?.off('ReceiveMessage', callback);
  }

  // SEND MESSAGE

  async sendMessage(receiverId: string, message: string) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke('SendMessage', receiverId, message);
    } else {
      console.warn('⚠️ SignalR is not connected. Cannot send message.');
    }
  }

  // NOTIFICATIONS

  onReceiveNotification(callback: (data: any) => void) {
    this.connection?.on('ReceiveNotification', callback);
  }

  offReceiveNotification(callback: (data: any) => void) {
    this.connection?.off('ReceiveNotification', callback);
  }

  // STOP

  async stopSignalR() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      console.log('🛑 SignalR Disconnected');
    }
  }
}

const signalRService = new SignalRService();
export default signalRService;
