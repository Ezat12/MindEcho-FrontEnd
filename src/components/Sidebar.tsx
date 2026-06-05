import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, MessageSquare, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/doctor-dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Patients', path: '/patients', icon: <Users size={20} /> },
    { name: 'Schedule', path: '/schedule', icon: <Calendar size={20} /> },
    { name: 'Messages', path: '/messages', icon: <MessageSquare size={20} /> },
    { name: 'Profile', path: '/complete-profile', icon: <UserCircle size={20} /> },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col p-6 fixed left-0 top-0">
      <div className="flex items-center gap-3 mb-10 px-2">
        <img src="/Photos/logo.png" alt="Logo" className="w-10 h-10" />
        <span className="font-black text-xl text-slate-800">MindEcho</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all ${
                isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <button 
        onClick={logout}
        className="flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-red-400 hover:bg-red-50 transition-all mt-auto"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
