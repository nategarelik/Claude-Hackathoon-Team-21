import React from 'react';

function Landing({ goToStep }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-uw-red to-red-800">
      <div className="max-w-4xl mx-auto px-6 py-12 text-center text-white">
        <h1 className="text-6xl font-bold mb-6">
          UW Course Recommender
        </h1>
        <p className="text-2xl mb-8 text-red-100">
          Find the perfect courses to match your career goals
        </p>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
          <p className="text-lg mb-4">
            Our AI-powered system analyzes real job postings to recommend UW Madison courses
            that will prepare you for your dream career.
          </p>
          <ul className="text-left max-w-2xl mx-auto space-y-3 text-lg">
            <li className="flex items-start">
              <span className="text-red-300 mr-3">✓</span>
              <span>Personalized course recommendations based on your career interests</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-300 mr-3">✓</span>
              <span>AI analysis of current job market requirements</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-300 mr-3">✓</span>
              <span>Semester-by-semester planning with prerequisite tracking</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-300 mr-3">✓</span>
              <span>Progress tracking toward degree requirements</span>
            </li>
          </ul>
        </div>
        <button
          onClick={() => goToStep('career')}
          className="bg-white text-uw-red px-12 py-4 rounded-lg text-xl font-semibold hover:bg-red-50 transition-colors shadow-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Landing;
