import React, { useState } from 'react';
import { careerAPI } from '../services/api';

function CareerInput({ goToStep, updateSessionData, sessionData }) {
  const [careerField, setCareerField] = useState(sessionData.careerField || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const examples = [
    'Software Engineer',
    'Data Scientist',
    'Investment Banker',
    'Product Manager',
    'UX Designer',
    'Research Scientist'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!careerField.trim()) {
      setError('Please enter a career field');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await careerAPI.analyzeCareer(careerField);
      updateSessionData({
        careerField,
        extractedSkills: result.skills
      });
      goToStep('profile');
    } catch (err) {
      console.error('Error analyzing career:', err);
      setError('Failed to analyze career. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            What career are you interested in?
          </h1>
          <p className="text-gray-600 mb-8">
            Enter your target career field and we'll analyze current job postings to find
            the most relevant courses for you.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="text"
                value={careerField}
                onChange={(e) => setCareerField(e.target.value)}
                placeholder="e.g., Software Engineer, Data Scientist, Product Manager"
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-uw-red focus:border-transparent"
                disabled={loading}
              />
              {error && (
                <p className="text-red-600 mt-2">{error}</p>
              )}
            </div>

            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-3">Popular careers:</p>
              <div className="flex flex-wrap gap-2">
                {examples.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setCareerField(example)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                    disabled={loading}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => goToStep('landing')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-uw-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Analyzing...' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CareerInput;
