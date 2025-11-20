const express = require('express');
const router = express.Router();
const recommendationService = require('../services/recommendationService');

/**
 * POST /api/recommendations/generate
 * Generate course recommendations
 */
router.post('/generate', async (req, res) => {
  try {
    const {
      careerField,
      extractedSkills,
      completedCourses,
      major,
      totalCreditsCompleted
    } = req.body;

    if (!careerField || !extractedSkills) {
      return res.status(400).json({
        error: 'careerField and extractedSkills are required'
      });
    }

    console.log(`Generating recommendations for ${careerField}, major: ${major}`);

    const recommendations = await recommendationService.generateRecommendations({
      careerField,
      extractedSkills,
      completedCourses: completedCourses || [],
      major: major || 'Computer Science',
      totalCreditsCompleted: totalCreditsCompleted || 0
    });

    res.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      error: 'Failed to generate recommendations',
      message: error.message
    });
  }
});

module.exports = router;
