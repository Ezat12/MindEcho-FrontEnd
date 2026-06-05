import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Activity, MessageSquare, LogOut, Loader2, User, Phone, Video, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import signalRService from '../api/SignalRService';
import { getMyPatients, getChatHistory } from '../api/doctorService';
import { toast } from 'react-hot-toast';

export default function Messages() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingPatients, setLoadingPatients] = useState(true);
  
  const currentDoctorId = localStorage.getItem('doctorId') || user?.id;

  useEffect(() => {
    initChat();
    return () => { signalRService.stopSignalR(); };
  }, []);

  const initChat = async () => {
    try {
      await signalRService.startSignalR();
      const res = await getMyPatients();
      setPatients(res?.data || []);
    } catch { toast.error("Error loading chat"); }
    finally { setLoadingPatients(false); }
  };

  const handleSelectPatient = async (patient: any) => {
    setActiveChat(patient);
    const res = await getChatHistory(currentDoctorId, patient.id);
    setMessages(res?.data || []);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;
    try {
      await signalRService.sendMessage(activeChat.id, newMessage);
      setMessages(prev => [...prev, { senderId: currentDoctorId, message: newMessage, timestamp: new Date().toISOString() }]);
      setNewMessage('');
    } catch { toast.error("Failed to send"); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans" dir="ltr">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/doctor-dashboard')}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><Activity className="text-white" /></div>
            <span className="text-xl font-black">MindEcho</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/doctor-dashboard')} className="font-semibold text-gray-500">Overview</button>
            <button onClick={() => navigate('/schedule')} className="font-semibold text-gray-500">Schedule</button>
            <button className="font-semibold text-blue-600 border-b-2 border-blue-600 pb-1">Messages</button>
            <button onClick={logout} className="text-red-500"><LogOut /></button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto p-6 h-[calc(100vh-80px)] flex gap-6">
        {/* PATIENT LIST */}
        <div className="w-1/3 bg-white rounded-3xl border shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b"><h2 className="font-bold">Patients</h2></div>
          <div className="flex-1 overflow-y-auto">
            {patients.map(p => (
              <button key={p.id} onClick={() => handleSelectPatient(p)} 
                className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 ${activeChat?.id === p.id ? 'bg-blue-50' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">{p.fullName[0]}</div>
                <span className="font-semibold">{p.fullName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 bg-white rounded-3xl border shadow-sm flex flex-col">
          {activeChat ? (
            <>
              <div className="p-4 border-b flex justify-between items-center">
                <span className="font-bold">{activeChat.fullName}</span>
                <div className="flex gap-2 text-gray-400"><Phone size={18} /><Video size={18} /></div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={`p-3 rounded-2xl max-w-[70%] ${m.senderId === currentDoctorId ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-100'}`}>
                    {m.message}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t flex gap-2">
                <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1 p-3 rounded-xl border" placeholder="Type a message..." />
                <button onClick={handleSendMessage} className="bg-blue-600 text-white px-6 rounded-xl font-bold"><Send size={18} /></button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">Select a patient to start chat</div>
          )}
        </div>
      </main>
    </div>
  );
}
