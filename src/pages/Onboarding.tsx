import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ONBOARDING_DATA } from '../constants/onboardingData';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const data = ONBOARDING_DATA[currentStep];

  const handleNext = () => {
    if (currentStep < ONBOARDING_DATA.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/role-selection');
    }
  };

  return (
    <div className="min-h-screen bg-[#eff6ff] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-8 shadow-2xl shadow-blue-100 transition-all">
        <div className="h-64 flex items-center justify-center mb-8">
          <img src={"Photos/logo.png"} alt={data.title} className="max-h-full object-contain" />
        </div>
        
        <h1 className="text-3xl font-black text-slate-800 mb-4">{data.title}</h1>
        <p className="text-slate-500 font-medium leading-relaxed mb-10">{data.description}</p>
        
        <button 
          onClick={handleNext}
          className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-blue-200"
        >
          {currentStep === ONBOARDING_DATA.length - 1 ? 'Start Now' : 'التالي'}
        </button>

        <div className="flex justify-center gap-2 mt-8">
          {ONBOARDING_DATA.map((_, index) => (
            <div key={index} className={`h-2 rounded-full transition-all ${index === currentStep ? 'w-8 bg-[#2563eb]' : 'w-2 bg-blue-200'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
