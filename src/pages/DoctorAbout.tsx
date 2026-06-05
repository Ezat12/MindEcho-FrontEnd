import React, { useState, useEffect } from 'react';
import { getDoctorProfile, updateDoctorProfile } from '../api/doctorService';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Award, Clock, DollarSign, FileText, Upload, Save, AlertCircle, CheckCircle } from 'lucide-react';

interface DoctorData {
  fullName: string;
  email: string;
  specialization: string;
  bio: string;
  sessionTime: string;
  price: string;
  profilePicture?: File | null;
}

export default function DoctorAbout() {
  const { updateUser } = useAuth(); 
  const [formData, setFormData] = useState<DoctorData>({
    fullName: '',
    email: '',
    specialization: '',
    bio: '',
    sessionTime: '',
    price: '',
    profilePicture: null,
  });

  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await getDoctorProfile();
        if (res?.success && res?.data) {
          const p = res.data;
          setFormData({
            fullName: p.fullName || '',
            email: p.email || '',
            specialization: p.specialization || '',
            bio: p.bio || '',
            sessionTime: p.sessionTime ? p.sessionTime.toString() : '',
            price: p.price ? p.price.toString() : '',
            profilePicture: null,
          });
          if (p.profilePicture) {
            setPreviewUrl(p.profilePicture);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, profilePicture: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const dataToSend = new FormData();
      dataToSend.append('FullName', formData.fullName);
      dataToSend.append('Email', formData.email);
      dataToSend.append('Specialization', formData.specialization);
      dataToSend.append('Bio', formData.bio);
      dataToSend.append('SessionTime', formData.sessionTime);
      dataToSend.append('Price', formData.price);

      if (formData.profilePicture) {
        dataToSend.append('ProfilePicture', formData.profilePicture);
      }

      const res = await updateDoctorProfile(dataToSend);

      if (res?.success) {
        updateUser({ fullName: formData.fullName });
        
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: res?.message || 'Something went wrong.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to connect to server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-8 font-sans" dir="ltr">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white border border-blue-600/30 rounded-xl flex items-center justify-center p-2 shadow-sm">
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
            <div>
              <h1 className="text-2xl font-bold text-black">Doctor Profile Settings</h1>
              <p className="text-xs text-gray-500 mt-1">Manage your clinical information, specialized fields, and session pricing.</p>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {message && (
          <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-3 border ${
            message.type === 'success' 
              ? 'bg-blue-50 text-blue-600 border-blue-200' 
              : 'bg-red-50 text-red-600 border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Main Profile Form Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border border-black bg-gray-50 flex items-center justify-center shadow-sm flex-shrink-0">
                {previewUrl ? (
                  <img src={previewUrl} alt="Doctor Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <label className="block text-xs font-semibold text-gray-700">Profile Picture Avatar</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 bg-white hover:bg-gray-50 text-black text-xs font-medium py-2 px-4 rounded-xl border border-gray-300 transition-colors cursor-pointer shadow-sm">
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Upload New Photo</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-black mb-2">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:border-blue-600 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-2">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:border-blue-600 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-2">Medical Specialization</label>
                <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} required className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:border-blue-600 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-black mb-2">Duration (Min)</label>
                  <input type="number" name="sessionTime" value={formData.sessionTime} onChange={handleChange} required className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:border-blue-600 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-black mb-2">Price (EGP)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:border-blue-600 outline-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-black mb-2">Professional Biography</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} required className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:border-blue-600 outline-none resize-none" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm">
              <Save className="w-4 h-4" />
              {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
