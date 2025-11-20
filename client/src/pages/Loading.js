import React, { useEffect, useState } from 'react';
import { recommendationAPI } from '../services/api';

function Loading({ goToStep, updateSessionData, sessionData }) {
  const [stage, setStage] = useState(0);
  const [error, setError] = useState('');

  const stages = [
    'Analyzing job market data...',
    'Matching courses to required skills...',
    'Building your personalized plan...',
    'Finalizing recommendations...'
  ];

  useEffect(() => {
    generateRecommendations();
  }, []);

  useEffect(() => {
    if (stage < stages.length - 1) {
      const timer = setTimeout(() => {
        setStage(stage + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const generateRecommendations = async () => {
    try {
      const result = await recommendationAPI.generateRecommendations({
        careerField: sessionData.careerField,
        extractedSkills: sessionData.extractedSkills,
        completedCourses: sessionData.completedCourses,
        major: sessionData.major,
        totalCreditsCompleted: sessionData.totalCreditsCompleted
      });

      updateSessionData({ recommendations: result });

      setTimeout(() => {
        goToStep('dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error generating recommendations:', err);
      setError('Failed to generate recommendations. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-uw-red to-red-800">
      <div className="max-w-2xl mx-auto px-6 text-center text-white">
        <div className="mb-8">
          <div className="inline-block animate-spin rounded-full h-20 w-20 border-b-4 border-white"></div>
        </div>

        {error ? (
          <div>
            <h2 className="text-3xl font-bold mb-4">Oops!</h2>
            <p className="text-xl mb-6">{error}</p>
            <button
              onClick={() => goToStep('profile')}
              className="bg-white text-uw-red px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold mb-8">
              Creating Your Course Plan
            </h2>
            <div className="space-y-4">
              {stages.map((stageText, index) => (
                <div
                  key={index}
                  className={`text-xl transition-all duration-500 ${
                    index <= stage ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  {index < stage && <span className="text-green-300 mr-2">✓</span>}
                  {index === stage && <span className="mr-2">▶</span>}
                  {stageText}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Loading;
