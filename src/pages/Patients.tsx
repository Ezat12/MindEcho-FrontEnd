import React, { useEffect, useState, useCallback } from 'react';
import {
  Search, MessageCircle, Calendar, Loader2,
  Activity, LogOut, X, Clock
} from 'lucide-react';

import { getMyPatients } from '../api/doctorService';
import { getAllBookings } from '../api/bookingService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import signalRService from '../api/signalRService'; 

const Patients = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const response: any = await getMyPatients();
      const data = Array.isArray(response) ? response : (response?.data ?? []);
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Patients error:", err);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
    
    signalRService.startSignalR();
    const handleNotification = () => fetchPatients();
    signalRService.onReceiveNotification(handleNotification);

    return () => {
      signalRService.offReceiveNotification(handleNotification);
      signalRService.stopSignalR();
    };
  }, [fetchPatients]);

  const handleViewBookings = async (patient: any) => {
    setSelectedPatient(patient);
    setBookingLoading(true);
    try {
      const response = await getAllBookings();
      const allBookings = Array.isArray(response) ? response : (response?.data ?? []);
      
      const filtered = (Array.isArray(allBookings) ? allBookings : []).filter((b: any) =>
        b?.UserId === patient?.id ||
        b?.PatientId === patient?.id ||
        b?.userId === patient?.id ||
        b?.patientId === patient?.id
      );
      setBookings(filtered);
    } catch (err) {
      console.error("Bookings error:", err);
      setBookings([]);
    } finally {
      setBookingLoading(false);
    }
  };

  const safePatients = Array.isArray(patients) ? patients : [];
  const filteredPatients = safePatients.filter(p =>
    (p?.fullName ?? p?.name ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans relative">
      {/* NAVBAR */}
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/doctor-dashboard')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Activity className="text-white" />
          </div>
          <span className="font-black text-xl">MindEcho</span>
        </div>

        <div className="hidden md:flex gap-8">
          <button onClick={() => navigate('/doctor-dashboard')} className="hover:text-blue-600">Overview</button>
          <button className="text-blue-600 font-black">Patients</button>
          <button onClick={() => navigate('/schedule')} className="hover:text-blue-600">Schedule</button>
          <button onClick={() => navigate('/messages')} className="hover:text-blue-600">Messages</button>
        </div>

        <button onClick={logout} className="text-red-500 flex items-center gap-2"><LogOut size={20} /> Logout</button>
      </nav>

      {/* MAIN CONTENT */}
      <div className="max-w-[1400px] mx-auto p-6">
        <div className="flex justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black">My Patients</h1>
            <p className="text-gray-400">{safePatients.length} Patients</p>
          </div>
          <div className="relative w-80">
            <Search className="absolute left-4 top-3 text-gray-400" />
            <input
              className="w-full p-3 pl-10 border rounded-xl"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <div key={patient?.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center font-black text-blue-600">
                    {(patient?.fullName ?? patient?.name ?? '').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black">{patient?.fullName ?? patient?.name}</h3>
                    <p className="text-sm text-gray-400">{patient?.diagnosis ?? 'General Patient'}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => navigate(`/messages?patientId=${patient?.id}`)} className="flex-1 bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition"><MessageCircle size={16} /></button>
                  <button onClick={() => handleViewBookings(patient)} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"><Calendar size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOOKINGS MODAL */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white w-[400px] rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between mb-4">
              <h2 className="font-black text-lg">Bookings: {selectedPatient.fullName || selectedPatient.name}</h2>
              <button onClick={() => setSelectedPatient(null)} className="hover:bg-gray-100 p-1 rounded-full"><X size={20} /></button>
            </div>

            {bookingLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
            ) : (bookings.length > 0) ? (
              bookings.map((b: any) => (
                <div key={b?.Id ?? b?.id} className="p-4 bg-gray-50 rounded-xl mb-2 border border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={14} />
                      <p>{b?.DoctorSessionsSlot?.StartTime ?? b?.doctorSessionsSlot?.startTime ?? '--:--'}</p>
                    </div>
                    <span className={`text-xs font-black px-2 py-1 rounded-md ${(b?.BookingStatus === 1 || b?.bookingStatus === 1) ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {(b?.BookingStatus === 1 || b?.bookingStatus === 1) ? 'Confirmed' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-10">No upcoming bookings</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
