import { useState } from "react";
import { ONBOARDING_DATA } from "../constants/onboardingData";

const OnboardingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const data = ONBOARDING_DATA[currentStep];

  return (
    <div>
      <img src={data.image} alt={data.title} />
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </div>
  );
};
