import React, { useEffect, useState } from 'react';
import {
  Users,
  Calendar,
  CreditCard,
  MessageSquare,
  LogOut,
  Bell,
  Activity,
  Settings,
  Loader2,
} from 'lucide-react';

import { useNavigate, useLocation } from 'react-router-dom';
import { getDoctorDashboardData } from '../api/doctorService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const currentName = user?.fullName || user?.name || 'Doctor';

  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsCount: 0,
    totalRevenue: 0,
  });

  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  
  // LOAD DASHBOARD
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const res = await getDoctorDashboardData();

        if (res?.success && res?.data) {
          setStats({
            totalPatients: res.data.totalPatients || 0,
            appointmentsCount: res.data.appointmentsToday || 0,
            totalRevenue: res.data.revenue || 0,
          });
          setUpcoming(res.data.upcomingAppointments || []);
        } else {
          toast.error('Failed to load dashboard data');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error loading dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">

      {/* ================= NAVBAR ================= */}
      <nav className="bg-white/80 backdrop-blur-md border-b px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/doctor-dashboard')}>
          <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Activity className="text-white" />
          </div>
          <span className="font-black text-2xl">MindEcho</span>
        </div>

        <div className="hidden lg:flex gap-2">
          <NavLink label="Overview" active={isActive('/doctor-dashboard')} onClick={() => navigate('/doctor-dashboard')} />
          <NavLink label="Patients" active={isActive('/patients')} onClick={() => navigate('/patients')} />
          <NavLink label="Schedule" active={isActive('/schedule')} onClick={() => navigate('/schedule')} />
          <NavLink label="Messages" active={isActive('/messages')} onClick={() => navigate('/messages')} />
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/messages')}><MessageSquare /></button>
          <button onClick={() => navigate('/notifications')}><Bell /></button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-xl font-black">
              {currentName.charAt(0).toUpperCase()}
            </div>
            <button onClick={handleLogout}><LogOut /></button>
          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <main className="max-w-[1440px] mx-auto p-6">
        <header className="flex justify-between mb-10">
          <h1 className="text-4xl font-black">
            Welcome Dr. <span className="text-blue-600">{currentName}</span>
          </h1>
          <div className="flex gap-3">
            <button onClick={() => navigate('/doctor-about')} className="px-5 py-3 bg-white border rounded-xl flex items-center gap-2">
              <Settings size={18} /> Settings
            </button>
            <button onClick={() => navigate('/schedule')} className="px-5 py-3 bg-black text-white rounded-xl flex items-center gap-2">
              <Calendar size={18} /> Schedule
            </button>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6 mb-10">
          <StatCard title="Patients" value={stats.totalPatients} icon={<Users />} />
          <StatCard title="Today" value={stats.appointmentsCount} icon={<Calendar />} />
          <StatCard title="Revenue" value={`$${stats.totalRevenue}`} icon={<CreditCard />} />
        </div>

        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-8 bg-white p-8 rounded-3xl">
            <h2 className="text-xl font-black mb-6">Upcoming Appointments</h2>
            {loading ? <Loader2 className="animate-spin" /> : upcoming.map((app: any) => (
              <div key={app.id} className="flex justify-between p-4 bg-gray-50 rounded-xl mb-3">
                <div><h3 className="font-bold">{app.patientName || 'Patient'}</h3></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

const NavLink = ({ label, active, onClick }: any) => (
  <button onClick={onClick} className={`px-4 py-2 rounded-xl font-bold ${active ? 'bg-blue-600 text-white' : ''}`}>
    {label}
  </button>
);

const StatCard = ({ title, value, icon }: any) => (
  <div className="bg-white p-6 rounded-2xl flex gap-4 items-center">
    <div>{icon}</div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <h3 className="text-xl font-black">{value}</h3>
    </div>
  </div>
);

export default DoctorDashboard;
