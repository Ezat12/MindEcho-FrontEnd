import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, LogOut, Check, X, Clock, Loader2, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import bookingService from '../api/bookingService';
import signalRService from '../api/signalRService';

const DoctorBookings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getDoctorBookings();
      setBookings(res?.data || res || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    signalRService.startSignalR();
    
    const handleNotification = () => fetchBookings();
    signalRService.onReceiveNotification(handleNotification);
    
    return () => {
      signalRService.offReceiveNotification(handleNotification);
      signalRService.stopSignalR();
    };
  }, []);

  const handleStatusUpdate = async (id: number, status: number) => {
    try {
      await bookingService.updateBookingStatus(id, status);
      fetchBookings(); 
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/doctor-dashboard')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Activity className="text-white" />
          </div>
          <span className="font-black text-xl">MindEcho</span>
        </div>

        <div className="hidden md:flex gap-8">
          <button onClick={() => navigate('/doctor-dashboard')} className="hover:text-blue-600">Overview</button>
          <button onClick={() => navigate('/patients')} className="hover:text-blue-600">Patients</button>
          <button className="text-blue-600 font-black">Bookings</button>
          <button onClick={() => navigate('/schedule')} className="hover:text-blue-600">Schedule</button>
        </div>

        <button onClick={logout} className="text-red-500 flex items-center gap-2 font-medium hover:text-red-600">
          <LogOut size={20} /> Logout
        </button>
      </nav>

      {/* CONTENT */}
      <div className="max-w-[1200px] mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900">Bookings Management</h1>
          <p className="text-gray-400 mt-2">Manage your patient appointments and schedules</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
        ) : (
          <div className="grid gap-4">
            {bookings.length > 0 ? (
              bookings.map((b: any) => (
                <div key={b.id || b.Id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="font-black text-lg">{b.patientName || "Patient"}</h3>
                    <div className="flex items-center gap-6 text-gray-500 text-sm mt-2">
                      <span className="flex items-center gap-2"><Calendar size={16}/> {new Date(b.bookingDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-2"><Clock size={16}/> {b.startTime || "N/A"}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider
                        ${(b.bookingStatus === 1) ? 'bg-green-100 text-green-700' : 
                          (b.bookingStatus === 2) ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {(b.bookingStatus === 1) ? 'Confirmed' : (b.bookingStatus === 2) ? 'Cancelled' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button onClick={() => handleStatusUpdate(b.id || b.Id, 1)} className="bg-green-50 text-green-600 p-3 rounded-xl hover:bg-green-100 transition-colors">
                      <Check size={20}/>
                    </button>
                    <button onClick={() => handleStatusUpdate(b.id || b.Id, 2)} className="bg-red-50 text-red-600 p-3 rounded-xl hover:bg-red-100 transition-colors">
                      <X size={20}/>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400">No bookings found at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorBookings;
