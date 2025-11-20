const express = require('express');
const router = express.Router();
const multer = require('multer');
const transcriptService = require('../services/transcriptService');

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * POST /api/transcript/upload
 * Upload and parse a transcript PDF
 */
router.post('/upload', upload.single('transcript'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Parsing transcript PDF...');
    const courses = await transcriptService.parseTranscript(req.file.buffer);

    res.json({
      success: true,
      coursesFound: courses.length,
      courses
    });
  } catch (error) {
    console.error('Error parsing transcript:', error);
    res.status(500).json({
      error: 'Failed to parse transcript',
      message: error.message
    });
  }
});

/**
 * POST /api/transcript/parse-manual
 * Parse manually entered course list
 */
router.post('/parse-manual', (req, res) => {
  try {
    const { courseText } = req.body;

    if (!courseText) {
      return res.status(400).json({ error: 'courseText is required' });
    }

    const courses = transcriptService.parseManualInput(courseText);

    res.json({
      success: true,
      coursesFound: courses.length,
      courses
    });
  } catch (error) {
    console.error('Error parsing manual input:', error);
    res.status(500).json({
      error: 'Failed to parse course list',
      message: error.message
    });
  }
});

module.exports = router;
