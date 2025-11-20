const express = require('express');
const router = express.Router();
const jobScraperService = require('../services/jobScraperService');
const aiService = require('../services/aiService');

/**
 * POST /api/career/analyze
 * Analyze a career field and extract required skills
 */
router.post('/analyze', async (req, res) => {
  try {
    const { careerField } = req.body;

    if (!careerField) {
      return res.status(400).json({ error: 'careerField is required' });
    }

    console.log(`Analyzing career: ${careerField}`);

    // Scrape job postings
    const jobPostings = await jobScraperService.scrapeJobs(careerField);

    // Extract skills using AI
    const skills = await aiService.extractSkillsFromJobs(jobPostings, careerField);

    res.json({
      careerField,
      jobCount: jobPostings.length,
      skills,
      rawJobs: jobPostings.slice(0, 3) // Return sample for debugging
    });
  } catch (error) {
    console.error('Error analyzing career:', error);
    res.status(500).json({ error: 'Failed to analyze career', message: error.message });
  }
});

module.exports = router;
