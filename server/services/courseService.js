const axios = require('axios');
const NodeCache = require('node-cache');
const fs = require('fs').promises;
const path = require('path');

// Cache for 24 hours
const cache = new NodeCache({ stdTTL: 86400 });

class CourseService {
  constructor() {
    this.coursesData = null;
    this.cacheFile = path.join(__dirname, '../cache/courses.json');
  }

  /**
   * Fetch course data from UW Coursemap GitHub repo
   * @returns {Array} Array of course objects
   */
  async fetchCoursesFromGitHub() {
    try {
      // Check cache first
      const cached = cache.get('courses');
      if (cached) {
        console.log('Returning courses from memory cache');
        return cached;
      }

      // Try to load from file cache
      try {
        const fileData = await fs.readFile(this.cacheFile, 'utf8');
        const courses = JSON.parse(fileData);
        cache.set('courses', courses);
        console.log('Loaded courses from file cache');
        return courses;
      } catch (fileError) {
        console.log('No file cache found, fetching from GitHub...');
      }

      // Fetch from GitHub
      // The UW Coursemap repo has course data - we'll fetch the raw JSON
      const response = await axios.get(
        'https://raw.githubusercontent.com/twangodev/uw-coursemap/main/data/courses.json',
        { timeout: 10000 }
      );

      const rawCourses = response.data;
      const courses = this.transformCourseData(rawCourses);

      // Cache the results
      cache.set('courses', courses);

      // Save to file cache
      await fs.mkdir(path.dirname(this.cacheFile), { recursive: true });
      await fs.writeFile(this.cacheFile, JSON.stringify(courses, null, 2));

      console.log(`Fetched ${courses.length} courses from GitHub`);
      return courses;
    } catch (error) {
      console.error('Error fetching courses:', error.message);

      // Return mock data if GitHub fetch fails
      return this.getMockCourses();
    }
  }

  /**
   * Transform raw course data into standardized format
   * @param {Object} rawData - Raw course data from GitHub
   * @returns {Array} Transformed course data
   */
  transformCourseData(rawData) {
    // The actual structure may vary, so we'll handle different formats
    if (Array.isArray(rawData)) {
      return rawData.map(course => this.normalizeCourse(course));
    } else if (typeof rawData === 'object') {
      // If it's an object with courses nested
      const courses = [];
      for (const key in rawData) {
        if (Array.isArray(rawData[key])) {
          courses.push(...rawData[key].map(c => this.normalizeCourse(c)));
        }
      }
      return courses;
    }
    return [];
  }

  /**
   * Normalize course data to standard format
   * @param {Object} course - Raw course object
   * @returns {Object} Normalized course
   */
  normalizeCourse(course) {
    return {
      code: course.code || course.courseCode || `${course.subject} ${course.number}`,
      title: course.title || course.name || '',
      description: course.description || course.desc || '',
      credits: course.credits || course.credit || 3,
      prerequisites: course.prerequisites || course.prereqs || [],
      subject: course.subject || course.department || '',
      number: course.number || course.courseNumber || '',
      level: course.level || this.determineCourseLevel(course.number),
    };
  }

  /**
   * Determine course level from course number
   * @param {string|number} number - Course number
   * @returns {string} Course level
   */
  determineCourseLevel(number) {
    const num = parseInt(number);
    if (num < 300) return 'introductory';
    if (num < 500) return 'intermediate';
    if (num < 700) return 'advanced';
    return 'graduate';
  }

  /**
   * Search courses by various criteria
   * @param {Object} criteria - Search criteria
   * @returns {Array} Matching courses
   */
  async searchCourses(criteria = {}) {
    const courses = await this.fetchCoursesFromGitHub();

    let results = courses;

    if (criteria.subject) {
      results = results.filter(c =>
        c.subject.toLowerCase() === criteria.subject.toLowerCase()
      );
    }

    if (criteria.level) {
      results = results.filter(c => c.level === criteria.level);
    }

    if (criteria.search) {
      const searchLower = criteria.search.toLowerCase();
      results = results.filter(c =>
        c.title.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower) ||
        c.code.toLowerCase().includes(searchLower)
      );
    }

    return results;
  }

  /**
   * Get all unique subjects/departments
   * @returns {Array} List of subjects
   */
  async getSubjects() {
    const courses = await this.fetchCoursesFromGitHub();
    const subjects = [...new Set(courses.map(c => c.subject))];
    return subjects.sort();
  }

  /**
   * Mock course data for testing/fallback
   * @returns {Array} Mock courses
   */
  getMockCourses() {
    return [
      {
        code: 'CS 400',
        title: 'Programming III',
        description: 'Introduction to algorithm design and analysis. Topics include sorting, searching, graph algorithms, and dynamic programming.',
        credits: 3,
        prerequisites: ['CS 300'],
        subject: 'CS',
        number: '400',
        level: 'intermediate'
      },
      {
        code: 'CS 540',
        title: 'Introduction to Artificial Intelligence',
        description: 'Principles of knowledge-based search techniques, automatic deduction, knowledge representation, machine learning, and natural language processing.',
        credits: 3,
        prerequisites: ['CS 400', 'MATH 340'],
        subject: 'CS',
        number: '540',
        level: 'advanced'
      },
      {
        code: 'CS 564',
        title: 'Database Management Systems',
        description: 'Database design, query languages, transaction processing, and distributed databases.',
        credits: 3,
        prerequisites: ['CS 400'],
        subject: 'CS',
        number: '564',
        level: 'advanced'
      },
      {
        code: 'STAT 340',
        title: 'Data Science Modeling I',
        description: 'Introduction to statistical modeling, machine learning, and data science techniques.',
        credits: 3,
        prerequisites: ['MATH 221', 'CS 220'],
        subject: 'STAT',
        number: '340',
        level: 'intermediate'
      },
      {
        code: 'ECE 532',
        title: 'Matrix Methods in Machine Learning',
        description: 'Linear algebra and optimization methods for machine learning applications.',
        credits: 3,
        prerequisites: ['MATH 340'],
        subject: 'ECE',
        number: '532',
        level: 'advanced'
      }
    ];
  }
}

module.exports = new CourseService();
