import React, { useState } from 'react';
import Landing from './pages/Landing';
import CareerInput from './pages/CareerInput';
import ProfileSetup from './pages/ProfileSetup';
import Loading from './pages/Loading';
import Dashboard from './pages/Dashboard';

function App() {
  const [step, setStep] = useState('landing'); // landing, career, profile, loading, dashboard
  const [sessionData, setSessionData] = useState({
    careerField: '',
    extractedSkills: null,
    major: '',
    completedCourses: [],
    totalCreditsCompleted: 0,
    recommendations: null,
  });

  const updateSessionData = (data) => {
    setSessionData(prev => ({ ...prev, ...data }));
  };

  const goToStep = (newStep) => {
    setStep(newStep);
  };

  const resetSession = () => {
    setSessionData({
      careerField: '',
      extractedSkills: null,
      major: '',
      completedCourses: [],
      totalCreditsCompleted: 0,
      recommendations: null,
    });
    setStep('landing');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {step === 'landing' && <Landing goToStep={goToStep} />}
      {step === 'career' && (
        <CareerInput
          goToStep={goToStep}
          updateSessionData={updateSessionData}
          sessionData={sessionData}
        />
      )}
      {step === 'profile' && (
        <ProfileSetup
          goToStep={goToStep}
          updateSessionData={updateSessionData}
          sessionData={sessionData}
        />
      )}
      {step === 'loading' && (
        <Loading
          goToStep={goToStep}
          updateSessionData={updateSessionData}
          sessionData={sessionData}
        />
      )}
      {step === 'dashboard' && (
        <Dashboard
          sessionData={sessionData}
          resetSession={resetSession}
        />
      )}
    </div>
  );
}

export default App;
