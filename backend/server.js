import Anthropic from '@anthropic-ai/sdk';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Define tools for the Claude agent
const tools = [
  {
    name: 'search_courses',
    description: 'Search UW-Madison courses by various filters including breadth requirements, subject, credits, level, and time preferences.',
    input_schema: {
      type: 'object',
      properties: {
        breadth_req: {
          type: 'string',
          description: 'Breadth requirement (e.g., "Comm B", "Comm A", "Ethnic Studies", "Quantitative Reasoning A", "Quantitative Reasoning B", "Biological Science", "Physical Science", "Literature", "Humanities", "Social Science", "Natural Science")',
        },
        subject: {
          type: 'string',
          description: 'Course subject/department (e.g., "COMP SCI", "MATH", "ENGLISH")',
        },
        credits: {
          type: 'number',
          description: 'Number of credits (e.g., 3, 4)',
        },
        level: {
          type: 'string',
          description: 'Course level range (e.g., "100-299" for intro, "300-699" for advanced)',
        },
        time_preference: {
          type: 'string',
          description: 'Preferred time of day (e.g., "morning", "afternoon", "evening")',
        },
      },
    },
  },
  {
    name: 'get_grades',
    description: 'Get grade distribution data for a specific UW-Madison course from madgrades.com or similar sources.',
    input_schema: {
      type: 'object',
      properties: {
        course_code: {
          type: 'string',
          description: 'Full course code (e.g., "COMP SCI 200", "MATH 221")',
        },
      },
      required: ['course_code'],
    },
  },
  {
    name: 'rank_courses',
    description: 'Rank a list of courses based on how well they match the user\'s criteria. Returns ranked list with match scores.',
    input_schema: {
      type: 'object',
      properties: {
        courses: {
          type: 'array',
          description: 'Array of course objects to rank',
          items: {
            type: 'object',
          },
        },
        required_criteria: {
          type: 'array',
          description: 'Array of criteria that must be met',
          items: {
            type: 'string',
          },
        },
      },
      required: ['courses', 'required_criteria'],
    },
  },
];

// Tool execution handlers
async function searchCourses(params) {
  // Mock data for demo - in production, this would query UWCourses.com API or scrape course guide
  const mockCourses = [
    {
      code: 'COMP SCI 200',
      title: 'Programming I',
      subject: 'COMP SCI',
      number: '200',
      credits: 3,
      breadth_reqs: ['Quantitative Reasoning B'],
      description: 'Introduction to computer programming',
      level: 'intro',
    },
    {
      code: 'ENGLISH 100',
      title: 'Introduction to College Composition',
      subject: 'ENGLISH',
      number: '100',
      credits: 3,
      breadth_reqs: ['Comm B'],
      description: 'Fundamentals of college writing',
      level: 'intro',
    },
    {
      code: 'MATH 221',
      title: 'Calculus and Analytic Geometry 1',
      subject: 'MATH',
      number: '221',
      credits: 5,
      breadth_reqs: ['Quantitative Reasoning A'],
      description: 'First semester calculus',
      level: 'intro',
    },
    {
      code: 'PSYCH 202',
      title: 'Introduction to Psychology',
      subject: 'PSYCH',
      number: '202',
      credits: 3,
      breadth_reqs: ['Social Science'],
      description: 'Survey of psychology',
      level: 'intro',
    },
    {
      code: 'AFRICAN 210',
      title: 'Introduction to African Cultures',
      subject: 'AFRICAN',
      number: '210',
      credits: 3,
      breadth_reqs: ['Comm B', 'Ethnic Studies'],
      description: 'Introduction to African cultures and societies',
      level: 'intro',
    },
    {
      code: 'ENGLISH 207',
      title: 'Introduction to Creative Writing',
      subject: 'ENGLISH',
      number: '207',
      credits: 3,
      breadth_reqs: ['Comm B', 'Literature'],
      description: 'Creative writing workshop',
      level: 'intro',
    },
    {
      code: 'COMM ARTS 250',
      title: 'Introduction to Communication Arts',
      subject: 'COMM ARTS',
      number: '250',
      credits: 3,
      breadth_reqs: ['Comm B', 'Social Science'],
      description: 'Overview of communication theory',
      level: 'intro',
    },
  ];

  // Filter courses based on parameters
  let filtered = mockCourses;

  if (params.breadth_req) {
    filtered = filtered.filter((course) =>
      course.breadth_reqs.some((req) =>
        req.toLowerCase().includes(params.breadth_req.toLowerCase())
      )
    );
  }

  if (params.subject) {
    filtered = filtered.filter((course) =>
      course.subject.toLowerCase().includes(params.subject.toLowerCase())
    );
  }

  if (params.credits) {
    filtered = filtered.filter((course) => course.credits === params.credits);
  }

  if (params.level) {
    const isIntro = params.level.includes('100') || params.level.includes('200');
    filtered = filtered.filter((course) =>
      isIntro ? course.level === 'intro' : course.level === 'advanced'
    );
  }

  return {
    success: true,
    courses: filtered,
    count: filtered.length,
  };
}

async function getGrades(params) {
  // Mock grade data - in production, query madgrades.com API
  const mockGrades = {
    'COMP SCI 200': { a_rate: 45, avg_gpa: 3.1, distribution: { A: 45, AB: 25, B: 20, BC: 7, C: 3 } },
    'ENGLISH 100': { a_rate: 65, avg_gpa: 3.5, distribution: { A: 65, AB: 20, B: 10, BC: 3, C: 2 } },
    'MATH 221': { a_rate: 38, avg_gpa: 2.9, distribution: { A: 38, AB: 22, B: 18, BC: 12, C: 10 } },
    'PSYCH 202': { a_rate: 55, avg_gpa: 3.3, distribution: { A: 55, AB: 25, B: 12, BC: 5, C: 3 } },
    'AFRICAN 210': { a_rate: 72, avg_gpa: 3.7, distribution: { A: 72, AB: 18, B: 7, BC: 2, C: 1 } },
    'ENGLISH 207': { a_rate: 68, avg_gpa: 3.6, distribution: { A: 68, AB: 20, B: 8, BC: 3, C: 1 } },
    'COMM ARTS 250': { a_rate: 62, avg_gpa: 3.5, distribution: { A: 62, AB: 23, B: 10, BC: 4, C: 1 } },
  };

  const gradeData = mockGrades[params.course_code] || {
    a_rate: null,
    avg_gpa: null,
    distribution: null,
    error: 'Grade data not available for this course',
  };

  return {
    success: true,
    course_code: params.course_code,
    ...gradeData,
  };
}

async function rankCourses(params) {
  const { courses, required_criteria } = params;

  // Calculate match score for each course
  const rankedCourses = courses.map((course) => {
    let matchScore = 0;
    const matchedCriteria = [];
    const missedCriteria = [];

    required_criteria.forEach((criterion) => {
      const criterionLower = criterion.toLowerCase();

      // Check various matching conditions
      let matches = false;

      if (criterionLower.includes('comm b') && course.breadth_reqs?.some((req) => req.toLowerCase().includes('comm b'))) {
        matches = true;
      } else if (criterionLower.includes('a rate') || criterionLower.includes('grade')) {
        // This would be checked after getting grade data
        matches = true; // Placeholder
      } else if (criterionLower.includes('credit') && course.credits) {
        matches = true;
      } else if (criterionLower.includes('morning') || criterionLower.includes('time')) {
        matches = true; // Placeholder for schedule matching
      }

      if (matches) {
        matchScore++;
        matchedCriteria.push(criterion);
      } else {
        missedCriteria.push(criterion);
      }
    });

    return {
      ...course,
      matchScore,
      matchPercentage: Math.round((matchScore / required_criteria.length) * 100),
      matchedCriteria,
      missedCriteria,
    };
  });

  // Sort by match score (highest first)
  rankedCourses.sort((a, b) => b.matchScore - a.matchScore);

  return {
    success: true,
    ranked_courses: rankedCourses,
    total_criteria: required_criteria.length,
  };
}

// Process tool calls
async function processToolCall(toolName, toolInput) {
  switch (toolName) {
    case 'search_courses':
      return await searchCourses(toolInput);
    case 'get_grades':
      return await getGrades(toolInput);
    case 'rank_courses':
      return await rankCourses(toolInput);
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const messages = [
      {
        role: 'user',
        content: message,
      },
    ];

    // Initial request to Claude
    let response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      tools: tools,
      messages: messages,
    });

    // Handle tool use in a loop
    while (response.stop_reason === 'tool_use') {
      // Find ALL tool_use blocks in the response
      const toolUseBlocks = response.content.filter((block) => block.type === 'tool_use');

      if (toolUseBlocks.length === 0) break;

      // Execute all tools
      const toolResults = await Promise.all(
        toolUseBlocks.map(async (toolUse) => {
          const result = await processToolCall(toolUse.name, toolUse.input);
          return {
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: JSON.stringify(result),
          };
        })
      );

      // Add assistant's response and all tool results to messages
      messages.push({
        role: 'assistant',
        content: response.content,
      });

      messages.push({
        role: 'user',
        content: toolResults,
      });

      // Continue the conversation
      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        tools: tools,
        messages: messages,
      });
    }

    // Extract final text response
    const textContent = response.content.find((block) => block.type === 'text');
    const finalResponse = textContent ? textContent.text : 'No response generated';

    res.json({
      response: finalResponse,
      usage: response.usage,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'UW Course Assistant API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 UW-Madison Course Assistant API ready`);
});
