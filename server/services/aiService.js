const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

class AIService {
  /**
   * Extract skills from job postings
   * @param {Array} jobPostings - Array of job posting text
   * @param {string} careerField - The career field (e.g., "Software Engineer")
   * @returns {Object} Structured skills data
   */
  async extractSkillsFromJobs(jobPostings, careerField) {
    const jobText = jobPostings.join('\n\n---\n\n');

    const prompt = `Analyze these job postings for ${careerField} positions. Extract:
1. Required technical skills (tools, languages, frameworks, technologies)
2. Soft skills and competencies
3. Knowledge domains
4. Common responsibilities

Job Postings:
${jobText}

Return a JSON object with this structure:
{
  "technical_skills": [
    {"skill": "skill name", "frequency": number, "importance": "high|medium|low"}
  ],
  "soft_skills": [
    {"skill": "skill name", "frequency": number}
  ],
  "knowledge_domains": [
    {"domain": "domain name", "frequency": number}
  ],
  "responsibilities": [
    {"responsibility": "description", "frequency": number}
  ]
}

Only return valid JSON, no other text.`;

    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const responseText = message.content[0].text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('Error extracting skills:', error);
      throw error;
    }
  }

  /**
   * Match a course to target skills
   * @param {Object} course - Course object with title and description
   * @param {Object} skills - Skills object from extractSkillsFromJobs
   * @returns {Object} Match result with score and reasoning
   */
  async matchCourseToSkills(course, skills) {
    const technicalSkills = skills.technical_skills.map(s => s.skill).join(', ');
    const knowledgeDomains = skills.knowledge_domains.map(d => d.domain).join(', ');

    const prompt = `Course Title: ${course.title}
Course Description: ${course.description}

Target Technical Skills: ${technicalSkills}
Target Knowledge Domains: ${knowledgeDomains}

Analyze how well this course prepares students for these skills and domains.

Return a JSON object with this structure:
{
  "relevance_score": number (0-100),
  "matched_skills": ["skill1", "skill2"],
  "matched_domains": ["domain1"],
  "reasoning": "Brief explanation of why this course is relevant",
  "unique_value": "What unique skills or knowledge this course provides"
}

Only return valid JSON, no other text.`;

    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const responseText = message.content[0].text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('Error matching course:', error);
      throw error;
    }
  }

  /**
   * Batch match multiple courses to skills (with caching)
   * @param {Array} courses - Array of course objects
   * @param {Object} skills - Skills object
   * @returns {Array} Array of courses with match results
   */
  async batchMatchCourses(courses, skills) {
    const results = [];

    // Process in batches of 5 to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < courses.length; i += batchSize) {
      const batch = courses.slice(i, i + batchSize);
      const batchPromises = batch.map(course =>
        this.matchCourseToSkills(course, skills)
          .then(result => ({ ...course, matchResult: result }))
          .catch(error => {
            console.error(`Error matching course ${course.code}:`, error);
            return { ...course, matchResult: { relevance_score: 0, error: true } };
          })
      );

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Small delay between batches
      if (i + batchSize < courses.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }
}

module.exports = new AIService();
