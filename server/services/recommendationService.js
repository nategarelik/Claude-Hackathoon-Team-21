const courseService = require('./courseService');
const aiService = require('./aiService');
const degreeRequirements = require('../data/degreeRequirements');

class RecommendationService {
  /**
   * Generate course recommendations based on career goals and student profile
   * @param {Object} params - Parameters for recommendation
   * @returns {Object} Recommendations with timeline
   */
  async generateRecommendations(params) {
    const {
      careerField,
      extractedSkills,
      completedCourses = [],
      major,
      totalCreditsCompleted = 0
    } = params;

    console.log(`Generating recommendations for ${careerField}...`);

    // Get all available courses
    const allCourses = await courseService.fetchCoursesFromGitHub();

    // Filter out completed courses
    const completedCodes = new Set(completedCourses.map(c => c.code || c));
    const availableCourses = allCourses.filter(c => !completedCodes.has(c.code));

    // Get degree requirements for the major
    const requirements = degreeRequirements.getRequirements(major);

    // Match courses to skills using AI
    console.log('Matching courses to skills...');
    const matchedCourses = await aiService.batchMatchCourses(
      availableCourses.slice(0, 100), // Limit to first 100 to avoid excessive API calls
      extractedSkills
    );

    // Score and rank courses
    const scoredCourses = this.scoreAndRankCourses(
      matchedCourses,
      requirements,
      completedCourses,
      extractedSkills
    );

    // Generate semester timeline
    const timeline = this.generateTimeline(
      scoredCourses,
      requirements,
      completedCourses,
      totalCreditsCompleted
    );

    return {
      recommendations: scoredCourses.slice(0, 20), // Top 20 recommendations
      timeline,
      degreeProgress: this.calculateDegreeProgress(completedCourses, requirements, totalCreditsCompleted),
      skillCoverage: this.calculateSkillCoverage(scoredCourses, extractedSkills)
    };
  }

  /**
   * Score and rank courses based on multiple factors
   * @param {Array} courses - Courses with AI match results
   * @param {Object} requirements - Degree requirements
   * @param {Array} completedCourses - Completed courses
   * @param {Object} skills - Extracted skills
   * @returns {Array} Scored and ranked courses
   */
  scoreAndRankCourses(courses, requirements, completedCourses, skills) {
    const completedCodes = new Set(completedCourses.map(c => c.code || c));

    const scored = courses.map(course => {
      const matchResult = course.matchResult || {};
      const relevanceScore = matchResult.relevance_score || 0;

      // Skill match score (50%)
      const skillScore = relevanceScore * 0.5;

      // Degree requirement score (30%)
      let requirementScore = 0;
      if (requirements.required.includes(course.code)) {
        requirementScore = 30;
      } else if (this.isElective(course, requirements)) {
        requirementScore = 20;
      } else if (this.fulfillsBreadth(course, requirements)) {
        requirementScore = 15;
      }

      // Prerequisite efficiency (10%)
      const prereqScore = this.calculatePrereqScore(course, completedCodes) * 10;

      // Career priority (10%)
      const priorityScore = this.calculatePriorityScore(matchResult, skills) * 10;

      const totalScore = skillScore + requirementScore + prereqScore + priorityScore;

      return {
        ...course,
        scores: {
          total: totalScore,
          skillMatch: skillScore,
          requirement: requirementScore,
          prereq: prereqScore,
          priority: priorityScore
        },
        reasoning: matchResult.reasoning || 'Relevant to your career goals',
        matchedSkills: matchResult.matched_skills || [],
        uniqueValue: matchResult.unique_value || ''
      };
    });

    // Sort by total score
    return scored.sort((a, b) => b.scores.total - a.scores.total);
  }

  /**
   * Check if course is an elective for the major
   * @param {Object} course - Course object
   * @param {Object} requirements - Degree requirements
   * @returns {boolean}
   */
  isElective(course, requirements) {
    if (!requirements.electives) return false;

    for (const category of requirements.electives.categories || []) {
      if (category.subjects && category.subjects.includes(course.subject)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if course fulfills breadth requirements
   * @param {Object} course - Course object
   * @param {Object} requirements - Degree requirements
   * @returns {boolean}
   */
  fulfillsBreadth(course, requirements) {
    if (!requirements.breadth) return false;
    return requirements.breadth.some(b => b.subjects && b.subjects.includes(course.subject));
  }

  /**
   * Calculate prerequisite score (0-1)
   * @param {Object} course - Course object
   * @param {Set} completedCodes - Set of completed course codes
   * @returns {number}
   */
  calculatePrereqScore(course, completedCodes) {
    if (!course.prerequisites || course.prerequisites.length === 0) {
      return 1; // No prerequisites = immediately available
    }

    const metPrereqs = course.prerequisites.filter(p => completedCodes.has(p)).length;
    const totalPrereqs = course.prerequisites.length;

    return metPrereqs / totalPrereqs;
  }

  /**
   * Calculate priority score based on skill importance (0-1)
   * @param {Object} matchResult - AI match result
   * @param {Object} skills - Extracted skills
   * @returns {number}
   */
  calculatePriorityScore(matchResult, skills) {
    if (!matchResult.matched_skills || matchResult.matched_skills.length === 0) {
      return 0.5;
    }

    // Count how many high-importance skills are matched
    const highImportanceSkills = skills.technical_skills
      .filter(s => s.importance === 'high')
      .map(s => s.skill.toLowerCase());

    const matchedHighImportance = matchResult.matched_skills.filter(ms =>
      highImportanceSkills.some(his => ms.toLowerCase().includes(his))
    ).length;

    return Math.min(matchedHighImportance / 3, 1); // Max out at 3 high-importance matches
  }

  /**
   * Generate semester-by-semester timeline
   * @param {Array} rankedCourses - Ranked course recommendations
   * @param {Object} requirements - Degree requirements
   * @param {Array} completedCourses - Completed courses
   * @param {number} creditsCompleted - Total credits completed
   * @returns {Array} Semester timeline
   */
  generateTimeline(rankedCourses, requirements, completedCourses, creditsCompleted) {
    const creditsPerSemester = 15;
    const totalCreditsNeeded = requirements.total_credits || 120;
    const remainingCredits = totalCreditsNeeded - creditsCompleted;
    const semestersNeeded = Math.ceil(remainingCredits / creditsPerSemester);

    const completedCodes = new Set(completedCourses.map(c => c.code || c));
    const timeline = [];

    // Current semester counter (start from next semester)
    const now = new Date();
    const currentMonth = now.getMonth();
    let semesterYear = now.getFullYear();
    let semesterSeason = currentMonth < 6 ? 'Fall' : 'Spring';

    if (semesterSeason === 'Spring' && currentMonth >= 5) {
      semesterSeason = 'Fall';
    } else if (semesterSeason === 'Fall' && currentMonth >= 12) {
      semesterSeason = 'Spring';
      semesterYear++;
    }

    let remainingCourses = [...rankedCourses];
    const scheduledCodes = new Set();

    for (let i = 0; i < Math.min(semestersNeeded, 8); i++) {
      const semester = {
        season: semesterSeason,
        year: semesterYear,
        courses: [],
        totalCredits: 0
      };

      // Add courses until we hit credit limit
      while (semester.totalCredits < creditsPerSemester && remainingCourses.length > 0) {
        // Find next available course with prerequisites met
        const availableIndex = remainingCourses.findIndex(course => {
          const prereqsMet = !course.prerequisites || course.prerequisites.length === 0 ||
            course.prerequisites.every(p => completedCodes.has(p) || scheduledCodes.has(p));

          const creditsOk = (semester.totalCredits + course.credits) <= creditsPerSemester;

          return prereqsMet && creditsOk;
        });

        if (availableIndex === -1) break;

        const course = remainingCourses.splice(availableIndex, 1)[0];
        semester.courses.push(course);
        semester.totalCredits += course.credits;
        scheduledCodes.add(course.code);
      }

      timeline.push(semester);

      // Advance to next semester
      if (semesterSeason === 'Fall') {
        semesterSeason = 'Spring';
        semesterYear++;
      } else {
        semesterSeason = 'Fall';
      }
    }

    return timeline;
  }

  /**
   * Calculate degree progress
   * @param {Array} completedCourses - Completed courses
   * @param {Object} requirements - Degree requirements
   * @param {number} creditsCompleted - Total credits completed
   * @returns {Object} Progress information
   */
  calculateDegreeProgress(completedCourses, requirements, creditsCompleted) {
    const completedCodes = new Set(completedCourses.map(c => c.code || c));

    const requiredMet = requirements.required.filter(r => completedCodes.has(r)).length;
    const requiredTotal = requirements.required.length;

    const totalCreditsNeeded = requirements.total_credits || 120;

    return {
      creditsCompleted,
      creditsRemaining: totalCreditsNeeded - creditsCompleted,
      creditsTotal: totalCreditsNeeded,
      percentComplete: (creditsCompleted / totalCreditsNeeded) * 100,
      requiredCoursesMet: requiredMet,
      requiredCoursesTotal: requiredTotal
    };
  }

  /**
   * Calculate how well recommendations cover the required skills
   * @param {Array} rankedCourses - Ranked courses
   * @param {Object} skills - Extracted skills
   * @returns {Object} Skill coverage analysis
   */
  calculateSkillCoverage(rankedCourses, skills) {
    const allTechnicalSkills = skills.technical_skills.map(s => s.skill.toLowerCase());
    const coveredSkills = new Set();

    rankedCourses.slice(0, 20).forEach(course => {
      if (course.matchedSkills) {
        course.matchedSkills.forEach(skill => {
          coveredSkills.add(skill.toLowerCase());
        });
      }
    });

    const coveragePercent = (coveredSkills.size / allTechnicalSkills.length) * 100;

    return {
      totalSkills: allTechnicalSkills.length,
      coveredSkills: coveredSkills.size,
      coveragePercent: Math.min(coveragePercent, 100),
      uncoveredSkills: allTechnicalSkills.filter(s => !coveredSkills.has(s))
    };
  }
}

module.exports = new RecommendationService();
