const pdf = require('pdf-parse');

class TranscriptService {
  /**
   * Parse a PDF transcript to extract courses
   * @param {Buffer} pdfBuffer - PDF file buffer
   * @returns {Array} Array of course objects
   */
  async parseTranscript(pdfBuffer) {
    try {
      const data = await pdf(pdfBuffer);
      const text = data.text;

      // Extract courses using regex patterns
      const courses = this.extractCoursesFromText(text);

      return courses;
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error('Failed to parse transcript PDF');
    }
  }

  /**
   * Extract course information from transcript text
   * @param {string} text - Transcript text
   * @returns {Array} Array of course objects
   */
  extractCoursesFromText(text) {
    const courses = [];

    // Common patterns for UW Madison transcripts
    // Pattern: SUBJECT CODE - TITLE - CREDITS - GRADE
    // Example: "CS 400    Programming III    3.00    A"
    // or "COMP SCI 400" or "CS-400" variations

    const patterns = [
      // Pattern 1: SUBJECT NUMBER
      /([A-Z][A-Z\s&]+)\s+(\d{3})\s+([A-Za-z\s\-,&:]+?)\s+(\d+\.?\d*)\s+([A-F][+-]?|P|S|U|CR)/gm,
      // Pattern 2: SUBJECT-NUMBER
      /([A-Z][A-Z\s&]+)-(\d{3})\s+([A-Za-z\s\-,&:]+?)\s+(\d+\.?\d*)\s+([A-F][+-]?|P|S|U|CR)/gm,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const subject = match[1].trim();
        const number = match[2].trim();
        const title = match[3].trim();
        const credits = parseFloat(match[4]);
        const grade = match[5].trim();

        // Only include courses with passing grades
        if (this.isPassingGrade(grade)) {
          courses.push({
            code: `${subject} ${number}`,
            subject,
            number,
            title,
            credits,
            grade
          });
        }
      }
    }

    // Fallback: Simple pattern for course codes
    if (courses.length === 0) {
      const simpleCodes = text.match(/([A-Z][A-Z\s&]+)\s+(\d{3})/g);
      if (simpleCodes) {
        simpleCodes.forEach(code => {
          const parts = code.trim().split(/\s+/);
          if (parts.length >= 2) {
            const number = parts[parts.length - 1];
            const subject = parts.slice(0, -1).join(' ');
            courses.push({
              code: `${subject} ${number}`,
              subject,
              number,
              credits: 3 // Default
            });
          }
        });
      }
    }

    // Remove duplicates
    const unique = [];
    const seen = new Set();

    courses.forEach(course => {
      if (!seen.has(course.code)) {
        seen.add(course.code);
        unique.push(course);
      }
    });

    return unique;
  }

  /**
   * Check if a grade is passing
   * @param {string} grade - Grade letter
   * @returns {boolean}
   */
  isPassingGrade(grade) {
    const passingGrades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'P', 'S', 'CR'];
    return passingGrades.includes(grade);
  }

  /**
   * Parse manually entered course list
   * @param {string} courseText - Text with course codes
   * @returns {Array} Array of course objects
   */
  parseManualInput(courseText) {
    const courses = [];
    const lines = courseText.split('\n');

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Try to extract course code
      const match = trimmed.match(/([A-Z][A-Z\s&]+)\s+(\d{3})/);
      if (match) {
        const subject = match[1].trim();
        const number = match[2].trim();
        courses.push({
          code: `${subject} ${number}`,
          subject,
          number,
          credits: 3 // Default
        });
      }
    });

    return courses;
  }
}

module.exports = new TranscriptService();
