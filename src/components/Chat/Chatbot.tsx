// components/Chatbot/Chatbot.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Maximize2,
  Sparkles,
  Heart,
  Smile,
  Zap,
  RefreshCw,
} from "lucide-react";
import axiosInstance from "../../api/axiosConfig";

interface Message {
  id: string;
  text: string;
  sender: "User" | "Bot";
  timestamp: Date;
  emotion?: string;
}

interface ChatHistoryItem {
  id: number;
  userId: string;
  sender: "User" | "Bot";
  content: string;
  createdAt: string;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // جلب تاريخ المحادثات
  useEffect(() => {
    if (isOpen) {
      fetchChatHistory();
    }
  }, [isOpen]);

  const fetchChatHistory = async () => {
    try {
      setIsLoadingHistory(true);

      const res = await axiosInstance.get(`/ChatBot/history`);

      console.log("Chat history:", res.data);

      if (res.data?.success && res.data?.data) {
        const historyMessages: Message[] = res.data.data.map(
          (item: ChatHistoryItem) => ({
            id: item.id.toString(),
            text: item.content,
            sender: item.sender,
            timestamp: new Date(item.createdAt),
          }),
        );
        setMessages(historyMessages);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      if (messages.length === 0) {
        setMessages([
          {
            id: "welcome",
            text: "Hello! 👋 I'm your mental health assistant. How can I help you today?",
            sender: "Bot",
            timestamp: new Date(),
          },
        ]);
      }
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && !isLoadingHistory) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized, isLoadingHistory]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "User",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      console.log("Sending message:", messageToSend);

      const res = await axiosInstance.post(`/ChatBot/send`, {
        message: messageToSend,
      });

      console.log("Response:", res.data);

      let botReply = "I'm here for you. How can I help? 💙";
      let emotion = "";

      if (res.data?.success && res.data?.data) {
        botReply = res.data.data.reply || botReply;
        emotion = res.data.data.emotion || "";
      } else if (res.data?.reply) {
        botReply = res.data.reply;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botReply,
        sender: "Bot",
        timestamp: new Date(),
        emotion: emotion,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: unknown) {
      const err = error as { response?: { data?: Record<string, unknown> } };
      console.error("Error sending message:", error);
      console.error("Error response:", err.response?.data);

      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm here to support you. Can you tell me more? 💙",
        sender: "Bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { day: "numeric", month: "short" });
    }
  };

  const getEmotionIcon = (emotion?: string) => {
    switch (emotion?.toLowerCase()) {
      case "joy":
        return <Smile className="size-3 text-yellow-500" />;
      case "sadness":
        return <Heart className="size-3 text-blue-500" />;
      case "anger":
        return <Zap className="size-3 text-red-500" />;
      default:
        return <Sparkles className="size-3 text-purple-500" />;
    }
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  messages.forEach((message) => {
    const dateKey = formatDate(message.timestamp);
    const lastGroup = groupedMessages[groupedMessages.length - 1];
    if (lastGroup && lastGroup.date === dateKey) {
      lastGroup.messages.push(message);
    } else {
      groupedMessages.push({ date: dateKey, messages: [message] });
    }
  });

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
          <MessageCircle className="size-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl transition-all duration-300 flex flex-col overflow-hidden ${
            isMinimized ? "w-80 h-14" : "w-[400px] h-[600px] sm:w-[420px]"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🧠</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">MindEcho Assistant</h3>
                <p className="text-blue-100 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online • Here to support you 💙
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={toggleMinimize}
                className="text-white/80 hover:text-white p-1 rounded-lg transition-colors"
              >
                {isMinimized ? (
                  <Maximize2 className="size-4" />
                ) : (
                  <Minimize2 className="size-4" />
                )}
              </button>
              <button
                onClick={toggleChat}
                className="text-white/80 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white">
                {isLoadingHistory ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-xs text-slate-400">
                        Loading conversation...
                      </p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                      <MessageCircle className="size-8 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-700">
                      Welcome! 👋
                    </h4>
                    <p className="text-sm text-slate-400 mt-1 max-w-[250px]">
                      Start a conversation with MindEcho Assistant. I'm here to
                      listen and support you.
                    </p>
                  </div>
                ) : (
                  groupedMessages.map((group, groupIdx) => (
                    <div key={groupIdx}>
                      <div className="flex justify-center mb-3">
                        <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                          {group.date}
                        </span>
                      </div>
                      {group.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === "User"
                              ? "justify-end"
                              : "justify-start"
                          } animate-in fade-in slide-in-from-bottom-2 duration-300 mb-3`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-2xl ${
                              message.sender === "User"
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                                : "bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm"
                            }`}
                          >
                            <div className="flex items-center gap-1 mb-1">
                              {message.sender === "Bot" && message.emotion && (
                                <span className="flex items-center gap-0.5 text-[10px]">
                                  {getEmotionIcon(message.emotion)}
                                </span>
                              )}
                              <span
                                className={`text-[10px] font-medium ${
                                  message.sender === "User"
                                    ? "text-blue-100"
                                    : "text-slate-400"
                                }`}
                              >
                                {message.sender === "User" ? "You" : "MindEcho"}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed">
                              {message.text}
                            </p>
                            <p
                              className={`text-[10px] mt-1 text-right ${
                                message.sender === "User"
                                  ? "text-blue-100"
                                  : "text-slate-400"
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                )}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm">
                      <div className="flex gap-1">
                        <span
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></span>
                        <span
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></span>
                        <span
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-slate-100 p-4 bg-white">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    <Send className="size-5" />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-slate-400">
                    🔒 Your conversations are private and secure
                  </p>
                  <button
                    onClick={fetchChatHistory}
                    className="text-xs text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className="size-3" />
                    Refresh
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;
