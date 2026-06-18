// SignalRService.tsx - نسخة مبسطة
import * as signalR from "@microsoft/signalr";

interface ChatMessage {
  senderId: string;
  message: string;
  timestamp?: string;
}

class SignalRService {
  public connection: signalR.HubConnection | null = null;

  async startSignalR(): Promise<boolean> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      console.log("✅ SignalR already connected");
      return true;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("⚠️ No token found. Cannot start SignalR.");
      return false;
    }

    // Use relative path through Vite proxy (/api prefix routes to backend)
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`/api/chatHub`, {
        accessTokenFactory: () => localStorage.getItem("token") || "",
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .build();

    this.connection.onclose((error) => {
      console.error("❌ SignalR connection closed:", error);
    });

    this.connection.onreconnecting(() => {
      console.warn("🔄 SignalR reconnecting...");
    });

    this.connection.onreconnected(() => {
      console.log("✅ SignalR Reconnected");
    });

    try {
      await this.connection.start();
      console.log("✅ SignalR Connected successfully");
      console.log("📡 Connection state:", this.connection.state);
      return true;
    } catch (err) {
      console.error("❌ SignalR Connection Error:", err);
      return false;
    }
  }

  // Ensure connection is alive before invoking methods
  private async ensureConnected(): Promise<boolean> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return true;
    }
    console.warn("⚠️ SignalR not connected, attempting to reconnect...");
    const success = await this.startSignalR();
    return success;
  }

  onReceiveMessage(callback: (senderId: string, message: string) => void) {
    this.connection?.on("ReceiveMessage", callback);
  }

  // Listen for LoadMessages response from server
  onLoadMessages(callback: (messages: ChatMessage[]) => void) {
    this.connection?.on("LoadMessages", callback);
  }

  async joinChat(bookingId: number) {
    if (!(await this.ensureConnected())) return false;

    try {
      await this.connection!.invoke("JoinChat", bookingId);
      console.log("🚪 Joined chat for booking:", bookingId);
      return true;
    } catch (err) {
      console.error("❌ Error joining chat:", err);
      return false;
    }
  }

  async loadMessages(bookingId: number) {
    if (!(await this.ensureConnected())) return false;

    try {
      await this.connection!.invoke("LoadMessages", bookingId);
      console.log("📜 Loaded messages for booking:", bookingId);
      return true;
    } catch (err) {
      console.error("❌ Error loading messages:", err);
      return false;
    }
  }

  async sendMessage(bookingId: number, message: string) {
    if (!(await this.ensureConnected())) return false;

    try {
      await this.connection!.invoke("SendMessage", bookingId, message);
      console.log("📤 Message sent for booking:", bookingId);
      return true;
    } catch (err) {
      console.error("❌ Error sending message:", err);
      return false;
    }
  }

  async stopSignalR() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      console.log("🛑 SignalR Disconnected");
    }
  }
}

const signalRService = new SignalRService();
export default signalRService;
