// pages/MyBookings/MyBookings.tsx
import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import {
  getUserBookings,
  changeBookingStatus,
  getStatusText,
  getStatusColor,
} from "../../services/bookings";
import type { IBooking } from "../../types/IDoctor";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import signalRService from "../../api/signalrService";

const MyBookings = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Chat states
  const [chatBooking, setChatBooking] = useState<IBooking | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [signalRReady, setSignalRReady] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = localStorage.getItem("userId") || "";

  // localStorage helpers
  const chatKey = (bookingId: number) => `chat_booking_${bookingId}`;
  const loadMessages = (bookingId: number) => {
    const saved = localStorage.getItem(chatKey(bookingId));
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  };
  const saveMessages = (bookingId: number, msgs: any[]) => {
    localStorage.setItem(chatKey(bookingId), JSON.stringify(msgs));
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getUserBookings();
      setBookings(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Start SignalR once
  useEffect(() => {
    const initSignalR = async () => {
      try {
        const connected = await signalRService.startSignalR();
        if (!connected) {
          console.warn("⚠️ SignalR failed to connect, will retry on send");
        }
        setSignalRReady(connected);

        // Listen for incoming messages
        signalRService.onReceiveMessage((senderId: string, message: string) => {
          setChatMessages((prev) => {
            const newMsg = {
              senderId,
              message,
              timestamp: new Date().toISOString(),
            };
            const updated = [...prev, newMsg];
            if (chatBooking) saveMessages(chatBooking.id, updated);
            return updated;
          });
        });

        // Listen for LoadMessages response from server
        signalRService.onLoadMessages((msgs) => {
          if (msgs && msgs.length > 0) {
            const formatted = msgs.map((m) => ({
              senderId: m.senderId,
              message: m.message,
              timestamp: m.timestamp || new Date().toISOString(),
            }));
            setChatMessages(formatted);
            if (chatBooking) saveMessages(chatBooking.id, formatted);
          }
        });
      } catch (err) {
        console.error("SignalR init error:", err);
      }
    };
    initSignalR();
    return () => {
      signalRService.stopSignalR();
    };
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setUpdatingId(bookingId);
    const success = await changeBookingStatus(bookingId, 2); // 2 = Cancelled
    if (success) {
      await fetchBookings();
    }
    setUpdatingId(null);
  };

  // Open chat for a booking
  const openChat = async (booking: IBooking) => {
    setChatBooking(booking);
    // Load from localStorage first (fast)
    const saved = loadMessages(booking.id);
    setChatMessages(saved);

    if (signalRReady) {
      // Join the chat room, then load messages from server
      await signalRService.joinChat(booking.id);
      await signalRService.loadMessages(booking.id);
    }
  };

  const closeChat = () => {
    setChatBooking(null);
    setChatMessages([]);
    setNewMessage("");
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !chatBooking) return;
    setSendingMsg(true);
    try {
      await signalRService.sendMessage(chatBooking.id, newMessage);
      const msg = {
        senderId: currentUserId,
        message: newMessage,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => {
        const updated = [...prev, msg];
        saveMessages(chatBooking.id, updated);
        return updated;
      });
      setNewMessage("");
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSendingMsg(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "0001-01-01T00:00:00") return "Pending";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-slate-800">
              My Appointments
            </h1>
            <button
              onClick={fetchBookings}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition"
            >
              <RefreshCw className="size-4" />
              Refresh
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <CalendarDays className="size-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-lg">No appointments yet</p>
              <p className="text-slate-400 text-sm mt-1">
                Book your first appointment with a doctor
              </p>
              <a
                href="/doctors"
                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Browse Doctors
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-slate-100"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-semibold text-slate-800">
                          {booking.doctor?.fullName || "Doctor"}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(booking.bookingStatus)}`}
                        >
                          {getStatusText(booking.bookingStatus)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">
                        {booking.doctor?.specialization || "General Doctor"}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="size-4" />
                          <span>{formatDate(booking.requestedAt)}</span>
                        </div>
                        {booking.confirmedAt && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="size-4" />
                            <span>
                              Confirmed: {formatDate(booking.confirmedAt)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {booking.bookingStatus === 0 && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={updatingId === booking.id}
                          className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50"
                        >
                          {updatingId === booking.id
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      )}
                      {booking.bookingStatus === 1 && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={updatingId === booking.id}
                          className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() =>
                          (window.location.href = `/doctors/${booking.doctorId}`)
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                      >
                        View Doctor
                      </button>
                      <button
                        onClick={() => openChat(booking)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition flex items-center gap-1"
                      >
                        <MessageCircle className="size-4" />
                        Chat
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Chat Modal */}
      {chatBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col"
            style={{ height: "550px" }}
          >
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center rounded-t-3xl bg-indigo-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  {chatBooking.doctor?.fullName?.[0] || "D"}
                </div>
                <div>
                  <h3 className="font-bold">
                    {chatBooking.doctor?.fullName || "Doctor"}
                  </h3>
                  <p className="text-xs text-indigo-200">
                    Booking #{chatBooking.id} •{" "}
                    {getStatusText(chatBooking.bookingStatus)}
                  </p>
                </div>
              </div>
              <button
                onClick={closeChat}
                className="p-1 hover:bg-white/20 rounded-full transition"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {!signalRReady && (
                <div className="text-center py-4 text-sm text-gray-400">
                  Connecting to chat...
                </div>
              )}
              {chatMessages.length === 0 && signalRReady && (
                <div className="text-center py-8 text-gray-400">
                  <MessageCircle className="size-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs mt-1">
                    Start the conversation with your doctor
                  </p>
                </div>
              )}
              {chatMessages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl ${m.senderId === currentUserId ? "bg-indigo-600 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"}`}
                  >
                    <p className="text-sm">{m.message}</p>
                    <p
                      className={`text-xs mt-1 ${m.senderId === currentUserId ? "text-indigo-200" : "text-gray-400"}`}
                    >
                      {m.timestamp
                        ? new Date(m.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t flex gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1 p-3 rounded-xl border focus:outline-none focus:border-indigo-400"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim() || sendingMsg || !signalRReady}
                className="bg-indigo-600 text-white px-5 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                title="Send message"
                aria-label="Send message"
              >
                {sendingMsg ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="size-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
