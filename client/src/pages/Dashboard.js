import React, { useState } from 'react';

function Dashboard({ sessionData, resetSession }) {
  const [activeTab, setActiveTab] = useState('recommendations'); // 'recommendations' or 'timeline'
  const { recommendations, careerField, extractedSkills } = sessionData;

  if (!recommendations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No recommendations available</p>
      </div>
    );
  }

  const { recommendations: courses, timeline, degreeProgress, skillCoverage } = recommendations;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-uw-red text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Your Course Recommendations
              </h1>
              <p className="text-xl text-red-100">
                Career Goal: {careerField}
              </p>
            </div>
            <button
              onClick={resetSession}
              className="bg-white text-uw-red px-6 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Start Over
            </button>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-red-100 text-sm">Degree Progress</p>
              <p className="text-3xl font-bold">
                {degreeProgress.percentComplete.toFixed(0)}%
              </p>
              <p className="text-red-100 text-sm mt-1">
                {degreeProgress.creditsCompleted} / {degreeProgress.creditsTotal} credits
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-red-100 text-sm">Required Courses</p>
              <p className="text-3xl font-bold">
                {degreeProgress.requiredCoursesMet} / {degreeProgress.requiredCoursesTotal}
              </p>
              <p className="text-red-100 text-sm mt-1">completed</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-red-100 text-sm">Skill Coverage</p>
              <p className="text-3xl font-bold">
                {skillCoverage.coveragePercent.toFixed(0)}%
              </p>
              <p className="text-red-100 text-sm mt-1">
                {skillCoverage.coveredSkills} / {skillCoverage.totalSkills} skills
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Overview */}
      {extractedSkills && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Key Skills for {careerField}
            </h2>
            <div className="flex flex-wrap gap-2">
              {extractedSkills.technical_skills.slice(0, 10).map((skill, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm ${
                    skill.importance === 'high'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {skill.skill}
                  {skill.importance === 'high' && ' ⭐'}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                activeTab === 'recommendations'
                  ? 'border-uw-red text-uw-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Course Recommendations
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                activeTab === 'timeline'
                  ? 'border-uw-red text-uw-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Semester Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'recommendations' ? (
          <CourseRecommendations courses={courses} />
        ) : (
          <SemesterTimeline timeline={timeline} />
        )}
      </div>
    </div>
  );
}

function CourseRecommendations({ courses }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Top Recommended Courses
      </h2>
      <div className="space-y-4">
        {courses.map((course, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {course.code} - {course.title}
                </h3>
                <p className="text-gray-600">{course.credits} credits</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-uw-red">
                  {course.scores.total.toFixed(0)}
                </div>
                <p className="text-sm text-gray-500">Match Score</p>
              </div>
            </div>

            {course.description && (
              <p className="text-gray-700 mb-4">{course.description}</p>
            )}

            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                Why this course?
              </p>
              <p className="text-blue-800">{course.reasoning}</p>
            </div>

            {course.matchedSkills && course.matchedSkills.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Skills covered:
                </p>
                <div className="flex flex-wrap gap-2">
                  {course.matchedSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {course.prerequisites && course.prerequisites.length > 0 && (
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Prerequisites:</span>{' '}
                {course.prerequisites.join(', ')}
              </div>
            )}

            <div className="grid grid-cols-4 gap-2 mt-4 text-xs text-gray-600">
              <div>
                <span className="font-semibold">Skill Match:</span> {course.scores.skillMatch.toFixed(0)}
              </div>
              <div>
                <span className="font-semibold">Requirement:</span> {course.scores.requirement.toFixed(0)}
              </div>
              <div>
                <span className="font-semibold">Prereq:</span> {course.scores.prereq.toFixed(0)}
              </div>
              <div>
                <span className="font-semibold">Priority:</span> {course.scores.priority.toFixed(0)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SemesterTimeline({ timeline }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Semester-by-Semester Plan
      </h2>
      <div className="space-y-6">
        {timeline.map((semester, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {semester.season} {semester.year}
              </h3>
              <span className="text-gray-600 font-semibold">
                {semester.totalCredits} credits
              </span>
            </div>

            <div className="space-y-3">
              {semester.courses.map((course, courseIndex) => (
                <div
                  key={courseIndex}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">
                        {course.code} - {course.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {course.reasoning}
                      </p>
                      {course.matchedSkills && course.matchedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {course.matchedSkills.slice(0, 3).map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-lg font-bold text-uw-red">
                        {course.scores.total.toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-500">{course.credits} cr</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
