import { json } from "@sveltejs/kit";
import Anthropic from "@anthropic-ai/sdk";
import { ANTHROPIC_API_KEY } from "$env/static/private";
import { PUBLIC_API_URL } from "$env/static/public";
import type { RequestHandler } from "./$types";

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are BadgerPlan AI, a friendly and enthusiastic course assistant for University of Wisconsin-Madison students! 🦡

Your personality:
- Upbeat, supportive, and genuinely excited about helping students
- Use emojis to keep things fun and engaging (but not excessively)
- Speak like a knowledgeable upperclassman, not a formal advisor
- Keep responses concise but helpful (2-4 paragraphs max)

Your knowledge:
- You have access to UW-Madison's course catalog with 10,000+ courses across 190+ departments
- You can suggest specific courses by their codes (e.g., CS 540, MATH 340)
- You understand prerequisites, career paths, and major requirements
- You know which courses lead to great opportunities at companies like Google, Meta, Microsoft, etc.

When students ask about:
1. **Course recommendations** - Suggest 3-5 specific courses with codes and WHY they're great
2. **Career paths** - Connect courses to real-world jobs, internships, and skills
   - For tech/CS: Recommend CS 540 (AI), CS 577 (Algorithms), CS 564 (Databases), CS 639 (Security)
   - For data science: CS 540, STAT 340, CS 544 (Big Data), CS 435 (ML)
   - For consulting: Economics, Statistics, Business courses
3. **Major requirements** - Help understand what courses they need
4. **"Easy" courses** - Suggest interesting gen eds that are engaging but manageable
5. **Clubs & opportunities** - Connect courses to student orgs:
   - CS courses → Badger Blockchain, AI Club, Google Developer Student Club
   - Business courses → Wisconsin Business Alliance, consulting clubs
   - Research courses → Undergraduate Research Symposium

**Important tips:**
- Always mention specific course codes when possible
- Connect courses to real outcomes (internships, jobs, graduate school)
- Be encouraging and make students feel confident
- Suggest checking RateMyProfessors for instructor ratings
- Mention that course data updates weekly so info is fresh!

Example style: "CS 540 (Intro to AI) is amazing if you want to work in machine learning! 🚀 Pairs perfectly with CS 577 for algorithm skills that companies like Google love. Plus, you could join the AI Club on campus to work on projects!"`;

async function getCourseContext(message: string): Promise<string> {
  try {
    // Extract potential course codes from message
    const courseCodePattern = /[A-Z]{2,}\s*\d{3}/gi;
    const matches = message.match(courseCodePattern);

    if (!matches || matches.length === 0) {
      return "";
    }

    // Fetch course data for mentioned courses
    const coursePromises = matches.slice(0, 3).map(async (code) => {
      try {
        const cleanCode = code.replace(/\s+/g, " ").toUpperCase();
        const response = await fetch(`${PUBLIC_API_URL}/course/${cleanCode}.json`);
        if (response.ok) {
          return await response.json();
        }
      } catch (e) {
        return null;
      }
      return null;
    });

    const courses = (await Promise.all(coursePromises)).filter(Boolean);

    if (courses.length === 0) {
      return "";
    }

    return `\n\nRelevant course data:\n${JSON.stringify(courses, null, 2)}`;
  } catch (e) {
    return "";
  }
}

const CAREER_PATHS = {
  "software engineer": {
    courses: ["CS 400", "CS 540", "CS 577", "CS 564", "CS 407"],
    companies: ["Google", "Meta", "Microsoft", "Amazon", "Apple"],
    clubs: ["Badger Blockchain", "Google Developer Student Club", "AI Club"],
  },
  "data scientist": {
    courses: ["CS 540", "STAT 340", "CS 544", "CS 435", "MATH 340"],
    companies: ["Netflix", "Spotify", "LinkedIn", "Airbnb"],
    clubs: ["Data Science Club", "Statistics Club"],
  },
  "product manager": {
    courses: ["CS 540", "ECON 101", "COMM 275", "PSYCH 202"],
    companies: ["Google", "Meta", "Amazon", "Stripe"],
    clubs: ["Product Management Club", "Entrepreneurship Club"],
  },
  "consultant": {
    courses: ["ECON 101", "STAT 371", "ACCT 100", "COMM 275"],
    companies: ["McKinsey", "BCG", "Bain", "Deloitte"],
    clubs: ["Wisconsin Business Alliance", "Consulting Club"],
  },
  "machine learning": {
    courses: ["CS 540", "CS 577", "CS 760", "STAT 340", "MATH 340"],
    companies: ["OpenAI", "Google Brain", "Meta AI", "NVIDIA"],
    clubs: ["AI Club", "Badger Blockchain", "Machine Learning Club"],
  },
};

function getCareerRecommendations(message: string): string {
  const lowerMessage = message.toLowerCase();

  for (const [career, data] of Object.entries(CAREER_PATHS)) {
    if (lowerMessage.includes(career) || lowerMessage.includes(career.split(" ")[0])) {
      return `\n\nCareer Path Context for ${career}:
Recommended courses: ${data.courses.join(", ")}
Top companies: ${data.companies.join(", ")}
Related clubs: ${data.clubs.join(", ")}`;
    }
  }

  // Check for company mentions
  const companies = ["google", "meta", "facebook", "microsoft", "amazon", "apple", "netflix", "openai"];
  for (const company of companies) {
    if (lowerMessage.includes(company)) {
      return `\n\nFor ${company.charAt(0).toUpperCase() + company.slice(1)} roles, focus on: CS 540 (AI), CS 577 (Algorithms), CS 564 (Databases), and personal projects!`;
    }
  }

  return "";
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { message, history } = await request.json();

    // Get course and career context
    const courseContext = await getCourseContext(message);
    const careerContext = getCareerRecommendations(message);
    const contextualPrompt = courseContext || careerContext;

    // Build conversation with context
    const userMessageWithContext = contextualPrompt
      ? `${message}${contextualPrompt}`
      : message;

    const messages = [
      ...history.slice(-6),
      { role: "user", content: userMessageWithContext },
    ];

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages as Anthropic.MessageParam[],
    });

    const aiResponse =
      response.content[0].type === "text"
        ? response.content[0].text
        : "Sorry, I couldn't process that.";

    return json({ response: aiResponse });
  } catch (error) {
    console.error("Chat API error:", error);
    return json({ error: "Failed to get AI response" }, { status: 500 });
  }
};
