import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Stethoscope, ArrowRight } from 'lucide-react';

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'patient',
      title: 'Patient',
      description: 'I am looking for mental health support and exercises.',
      icon: <User className="w-10 h-10" />,
      path: '/register-patient', 
      color: 'blue'
    },
    {
      id: 'doctor',
      title: 'Doctor',
      description: 'I want to provide care and assist others.',
      icon: <Stethoscope className="w-10 h-10" />,
      path: '/register-doctor',
      color: 'indigo'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans" dir="ltr">
      <div className="max-w-4xl w-full text-center">
        
        {/* Header Section */}
        <div className="mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-black text-[#1e293b] mb-4 tracking-tight">
            Who are <span className="text-blue-600">you?</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            Choose your account type to personalize your experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => navigate(role.path)}
              className="group relative bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/60 border-2 border-transparent hover:border-blue-500 hover:-translate-y-2 transition-all duration-500 text-left flex flex-col items-center md:items-start overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-50"></div>

              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500 relative z-10">
                {role.icon}
              </div>

              <div className="relative z-10 text-center md:text-left">
                <h3 className="text-2xl font-black text-[#1e293b] mb-3 group-hover:text-blue-600 transition-colors">
                  {role.title}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-6">
                  {role.description}
                </p>
              </div>

              <div className="mt-auto flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-wider group-hover:gap-4 transition-all relative z-10">
                Select This Role <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>

        <p className="mt-12 text-slate-400 font-bold text-sm">
          Already have an account? 
          <button onClick={() => navigate('/login')} className="text-blue-600 ml-2 hover:underline underline-offset-4">
            Sign In
          </button>
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default RoleSelection;
