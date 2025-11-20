import React, { useState, useEffect } from 'react';
import { courseAPI, transcriptAPI } from '../services/api';

function ProfileSetup({ goToStep, updateSessionData, sessionData }) {
  const [major, setMajor] = useState(sessionData.major || '');
  const [majors, setMajors] = useState([]);
  const [inputMethod, setInputMethod] = useState('manual'); // 'manual' or 'upload'
  const [courseText, setCourseText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedCourses, setParsedCourses] = useState(sessionData.completedCourses || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMajors();
  }, []);

  const loadMajors = async () => {
    try {
      const result = await courseAPI.getMajors();
      setMajors(result.majors);
      if (result.majors.length > 0 && !major) {
        setMajor(result.majors[0]);
      }
    } catch (err) {
      console.error('Error loading majors:', err);
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
    setError('');
  };

  const handleUploadTranscript = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await transcriptAPI.uploadTranscript(selectedFile);
      setParsedCourses(result.courses);
      setError('');
    } catch (err) {
      console.error('Error uploading transcript:', err);
      setError('Failed to parse transcript. Please try manual entry.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualParse = async () => {
    if (!courseText.trim()) {
      setError('Please enter course codes');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await transcriptAPI.parseManualInput(courseText);
      setParsedCourses(result.courses);
      setError('');
    } catch (err) {
      console.error('Error parsing courses:', err);
      setError('Failed to parse courses. Please check the format.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!major) {
      setError('Please select a major');
      return;
    }

    const totalCredits = parsedCourses.reduce((sum, c) => sum + (c.credits || 3), 0);

    updateSessionData({
      major,
      completedCourses: parsedCourses,
      totalCreditsCompleted: totalCredits
    });

    goToStep('loading');
  };

  const removeCourse = (index) => {
    setParsedCourses(parsedCourses.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Academic Profile Setup
          </h1>
          <p className="text-gray-600 mb-8">
            Help us understand your academic background to provide personalized recommendations.
          </p>

          {/* Major Selection */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              What's your major?
            </label>
            <select
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uw-red focus:border-transparent"
            >
              <option value="">Select a major</option>
              {majors.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Course Input Method Toggle */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Add your completed courses
            </label>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setInputMethod('manual')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                  inputMethod === 'manual'
                    ? 'bg-uw-red text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Manual Entry
              </button>
              <button
                onClick={() => setInputMethod('upload')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                  inputMethod === 'upload'
                    ? 'bg-uw-red text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upload Transcript
              </button>
            </div>

            {inputMethod === 'manual' ? (
              <div>
                <textarea
                  value={courseText}
                  onChange={(e) => setCourseText(e.target.value)}
                  placeholder="Enter course codes (one per line):&#10;CS 400&#10;MATH 234&#10;STAT 340"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-uw-red focus:border-transparent"
                  disabled={loading}
                />
                <button
                  onClick={handleManualParse}
                  disabled={loading}
                  className="mt-3 px-6 py-2 bg-uw-red text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Parsing...' : 'Parse Courses'}
                </button>
              </div>
            ) : (
              <div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="transcript-upload"
                    disabled={loading}
                  />
                  <label
                    htmlFor="transcript-upload"
                    className="cursor-pointer inline-block px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {selectedFile ? selectedFile.name : 'Choose PDF file'}
                  </label>
                  <p className="text-gray-500 mt-3 text-sm">
                    Upload your UW Madison transcript (PDF)
                  </p>
                </div>
                <button
                  onClick={handleUploadTranscript}
                  disabled={loading || !selectedFile}
                  className="mt-3 px-6 py-2 bg-uw-red text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Processing...' : 'Upload & Parse'}
                </button>
              </div>
            )}

            {error && (
              <p className="text-red-600 mt-3">{error}</p>
            )}
          </div>

          {/* Parsed Courses Display */}
          {parsedCourses.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Completed Courses ({parsedCourses.length})
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {parsedCourses.map((course, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-3 rounded"
                    >
                      <div>
                        <span className="font-semibold">{course.code}</span>
                        {course.title && (
                          <span className="text-gray-600 ml-2">- {course.title}</span>
                        )}
                        {course.credits && (
                          <span className="text-gray-500 ml-2">({course.credits} cr)</span>
                        )}
                      </div>
                      <button
                        onClick={() => removeCourse(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4">
            <button
              onClick={() => goToStep('career')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 bg-uw-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Generate Recommendations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;
