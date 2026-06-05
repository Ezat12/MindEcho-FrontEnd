import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, User, Stethoscope } from 'lucide-react';
import authService from '../api/authService';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // الـ Payload بالحروف الكابيتال طبقاً لطلب الـ API والـ JSON المتوقع بالباك آند
      const payload = { 
        Email: email, 
        Password: password 
      };
      
      let res;
      if (role === 'doctor') {
        res = await authService.loginDoctor(payload);
      } else {
        res = await authService.loginUser(payload);
      }

      if (res?.success && res?.data?.token) {
        // استخراج المعرف طبقاً لمحتوى الريسبونس الخاص بكل دور
        const userId = role === 'doctor' ? (res.data.doctorId || '') : (res.data.userId || '');
        
        login(res.data, res.data.token, role, userId);
        
        if (role === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/patient-dashboard'); 
        }
      } else {
        setError(res?.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-center items-center p-4 font-sans" dir="ltr">
      
      <Link to="/" className="absolute top-6 right-6 flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors">
        <span>Back to Home</span>
        <ArrowRight className="w-4 h-4" />
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-gray-200 shadow-md space-y-6">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 bg-white border border-gray-200 rounded-xl flex items-center justify-center p-2 shadow-sm">
            <svg viewBox="0 0 100 100" className="w-full h-full text-blue-600">
              <path d="M30,50 Q50,20 70,50 T30,50" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="30" cy="50" r="5" fill="#000" />
              <circle cx="50" cy="23" r="5" fill="#2563eb" />
              <circle cx="70" cy="50" r="5" fill="#000" />
              <path d="M40,65 L45,75 L35,80" fill="none" stroke="#2563eb" strokeWidth="3" />
              <path d="M60,65 L55,75 L65,80" fill="none" stroke="#2563eb" strokeWidth="3" />
              <text x="50" y="95" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor">BATCH 4</text>
            </svg>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-black">Welcome to MindEcho</h1>
            <p className="text-xs text-gray-500">Securely sign in to your wellness clinical account.</p>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
          <button
            type="button"
            onClick={() => { setRole('patient'); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              role === 'patient'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            <User className="w-4 h-4" />
            Patient Portal
          </button>
          <button
            type="button"
            onClick={() => { setRole('doctor'); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              role === 'doctor'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            Doctor Portal
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-black mb-2">
              {role === 'doctor' ? 'Clinical Email Address' : 'Personal Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
              <input
                type="email"
                placeholder={role === 'doctor' ? 'doctor@mindecho.com' : 'patient@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm text-black focus:outline-none focus:border-blue-600 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-black mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-10 py-3 text-sm text-black focus:outline-none focus:border-blue-600 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm text-sm"
          >
            {loading ? 'Authenticating...' : `Sign In as ${role === 'doctor' ? 'Doctor' : 'Patient'}`}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100 flex justify-center gap-1">
          <span>Don't have an account?</span>
          {role === 'doctor' ? (
            <Link to="/register-doctor" className="text-blue-600 hover:underline font-semibold">
              Register as Doctor
            </Link>
          ) : (
            <Link to="/register-patient" className="text-blue-600 hover:underline font-semibold">
              Create Patient Account
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
