const express = require('express');
const router = express.Router();
const courseService = require('../services/courseService');
const degreeRequirements = require('../data/degreeRequirements');

/**
 * GET /api/courses
 * Get all courses or search with filters
 */
router.get('/', async (req, res) => {
  try {
    const { subject, level, search } = req.query;

    const courses = await courseService.searchCourses({
      subject,
      level,
      search
    });

    res.json({
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses', message: error.message });
  }
});

/**
 * GET /api/courses/subjects
 * Get all available subjects/departments
 */
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await courseService.getSubjects();
    res.json({ subjects });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects', message: error.message });
  }
});

/**
 * GET /api/courses/majors
 * Get available majors with degree requirements
 */
router.get('/majors', (req, res) => {
  try {
    const majors = degreeRequirements.getAvailableMajors();
    res.json({ majors });
  } catch (error) {
    console.error('Error fetching majors:', error);
    res.status(500).json({ error: 'Failed to fetch majors', message: error.message });
  }
});

/**
 * GET /api/courses/majors/:major/requirements
 * Get degree requirements for a specific major
 */
router.get('/majors/:major/requirements', (req, res) => {
  try {
    const { major } = req.params;
    const requirements = degreeRequirements.getRequirements(major);
    res.json(requirements);
  } catch (error) {
    console.error('Error fetching requirements:', error);
    res.status(500).json({ error: 'Failed to fetch requirements', message: error.message });
  }
});

module.exports = router;
