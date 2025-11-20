# UW Madison Course Recommendation System - Design Document

**Date:** November 19, 2025
**Project:** Career-Driven Course Recommendation & Degree Planning Tool
**Target Users:** UW Madison Students

## Product Vision

A web application that helps UW Madison students make strategic course selections by analyzing their career goals against real job market data. Students input their desired career field, upload/enter their completed courses, and receive AI-powered recommendations showing which courses will best prepare them for their target jobs, organized into a semester-by-semester plan.

## System Architecture

### Frontend (React)
- Single-page application with components for career input, transcript upload, course completion tracking, and recommendation display
- Session-based state management (React Context API)
- Responsive design for desktop/mobile
- Tailwind CSS for styling

### Backend (Node.js/Express)
- RESTful API endpoints for course data, job scraping, AI analysis, and recommendations
- Course data fetcher/parser for UW Coursemap GitHub repo
- Job posting scrapers for LinkedIn and Indeed
- Claude API integration for skill matching and analysis
- PDF parsing service for transcript upload
- Degree requirement parser for major requirements

### Data Flow
Student inputs career → Backend scrapes job postings → AI analyzes required skills → Matches against UW course catalog → Filters by incomplete courses → Generates semester plan considering prerequisites → Returns ranked recommendations with reasoning

## Data Sources & Integration

### UW Course Data
- **Source:** https://github.com/twangodev/uw-coursemap
- **Strategy:** Fetch course data at server startup or cache and refresh periodically
- **Data Extracted:** Course codes, titles, descriptions, credits, prerequisites, terms offered
- **Storage:** In-memory or JSON cache for fast querying

### Job Posting Data
- **LinkedIn Scraper:** Puppeteer to search "{career_field} jobs" and extract descriptions, skills, qualifications
- **Indeed Scraper:** Similar approach for job listings
- **Volume:** 10-20 recent postings per source to identify common skill patterns
- **Caching:** 24-hour TTL to avoid excessive scraping
- **Extraction:** Skills sections, required qualifications, preferred qualifications

### Degree Requirements
- **Source:** UW Madison Guide (https://guide.wisc.edu/)
- **Approach:** Manually compile or scrape major requirement sheets
- **Initial Scope:** 5-10 most common majors (CS, Engineering, Business, etc.)
- **Format:** JSON with required courses, elective categories, credit requirements, breadth requirements

### Transcript Parsing
- **Technology:** pdf-parse library
- **Method:** Extract text, use regex to identify course codes and grades
- **Fallback:** Manual course entry if parsing fails

## User Flow

### 1. Landing Page
Student arrives, sees value proposition and "Get Started" button

### 2. Career Input
- Simple text input: "What career are you interested in?"
- Examples: "Software Engineer", "Data Scientist", "Investment Banker"
- Submit triggers job posting analysis

### 3. Academic Profile Setup
- **Major Selection:** Dropdown of supported majors
- **Course Completion:** Two options:
  - Upload Transcript (PDF) - Drag & drop or file picker
  - Manual Entry - Search/select from course catalog
- Display parsed/entered courses for review/editing

### 4. Processing & Analysis
Loading screen with progress:
- "Analyzing job market for [career field]..."
- "Extracting required skills..."
- "Matching courses to skills..."
- "Building your personalized plan..."

### 5. Recommendations Dashboard
- **Top:** Career overview with aggregated skills from job postings
- **Middle:** Detailed course recommendations with match scores
- **Bottom:** Semester-by-semester timeline plan

### 6. Interactive Refinement
- Mark courses as "interested" or "not interested"
- Regenerate plan button
- Export plan as PDF

## AI Matching Engine

### Job Analysis Pipeline

**1. Skill Extraction (Claude API)**
- Send aggregated job postings to Claude
- Extract: Required technical skills, soft skills, knowledge domains, responsibilities
- Return structured JSON with skills ranked by frequency and importance

**2. Course-to-Skill Matching (Claude API)**
- For each UW course, analyze course description against extracted skills
- Rate relevance (0-100) for teaching target skills
- Explain which specific skills it addresses
- Identify unique value
- Cache results to minimize API calls

**3. Intelligent Filtering**
- Remove already-completed courses
- Check prerequisites (don't recommend if prereqs not met)
- Filter by courses that fulfill degree requirements when possible
- Prioritize courses with high skill-match scores (>70)

**4. Reasoning Generation**
For each recommended course, include AI-generated explanation:
- Which job skills it teaches
- How it prepares them for the career
- Whether it's required, elective, or purely skill-building

## Course Recommendation Algorithm

### Scoring System
Each course receives a composite score:
- **Skill Match Score (50%):** AI-determined relevance to career skills
- **Degree Requirement Score (30%):** Fulfills required/elective slot?
- **Prerequisite Efficiency (10%):** Unlocks other valuable courses?
- **Career Priority (10%):** Essential skills weighted higher

### Semester Plan Generation

**1. Calculate Remaining Requirements**
- Total credits needed to graduate
- Specific required courses not yet completed
- Elective categories and credits needed
- Breadth/general education gaps

**2. Course Prioritization Tiers**
- **Tier 1:** Required major courses + high skill-match (score >80)
- **Tier 2:** Electives with strong skill-match (score 60-80)
- **Tier 3:** Breadth requirements that align with career
- **Tier 4:** Additional skill-building courses

**3. Timeline Algorithm**
- Assume 15 credits per semester (adjustable)
- For each semester:
  - Add Tier 1 courses if prerequisites met
  - Fill remaining credits with highest-scored available courses
  - Respect prerequisite chains
  - Balance course load
- Generate 4-8 semester plan

**4. Output Format**
- Semester grid view (Fall 2025, Spring 2026, etc.)
- Each course card: code, title, credits, skill-match score, reasoning
- Visual indicators for required vs. elective vs. skill-building

## Technical Implementation

### Tech Stack
- **Frontend:** React 18, React Router, Tailwind CSS
- **State Management:** React Context API (session-based)
- **Backend:** Node.js + Express
- **AI:** Anthropic Claude API (claude-3-5-sonnet)
- **Job Scraping:** Puppeteer
- **PDF Parsing:** pdf-parse
- **Data Storage:** In-memory + JSON file cache

### Key Dependencies
```json
{
  "frontend": [
    "react",
    "react-router-dom",
    "axios",
    "tailwindcss"
  ],
  "backend": [
    "express",
    "cors",
    "@anthropic-ai/sdk",
    "puppeteer",
    "pdf-parse",
    "node-cache"
  ]
}
```

### API Endpoints
- `POST /api/analyze-career` - Takes career field, returns job skills
- `POST /api/upload-transcript` - Parses PDF, returns courses
- `GET /api/courses` - Returns UW course catalog
- `GET /api/majors/:major/requirements` - Returns degree requirements
- `POST /api/recommendations` - Takes profile, returns ranked courses + timeline

### Project Structure
```
/client           - React frontend
  /src
    /components   - React components
    /context      - State management
    /pages        - Page components
    /services     - API calls
/server           - Node backend
  /services
    - courseService.js        - Fetch UW courses
    - jobScraperService.js    - LinkedIn/Indeed
    - aiService.js            - Claude API calls
    - transcriptService.js    - PDF parsing
    - recommendationService.js - Core algorithm
  /routes         - API routes
  /cache          - Cached data
  /data           - Degree requirements JSON
/docs/plans       - Design documents
```

## MVP Scope for Hackathon

### Must Have
- Career text input and job skill extraction
- Manual course entry (transcript upload nice-to-have)
- AI-powered course recommendations with reasoning
- Basic semester timeline plan
- 2-3 major degree requirements pre-loaded
- React frontend with core UI

### Nice to Have
- PDF transcript parsing
- LinkedIn + Indeed scraping (start with one)
- Export to PDF
- Mobile responsive design
- Course "interested/not interested" refinement

### Future Enhancements
- User accounts and persistence
- More majors and degree programs
- Real-time prerequisite validation
- Course reviews and difficulty ratings
- Integration with actual UW enrollment systems
- Graduate program recommendations

## Success Metrics

### For Hackathon Demo
- Student can input career and get relevant course recommendations
- Recommendations include clear explanations of skill alignment
- Semester plan respects prerequisites and degree requirements
- Demo shows end-to-end flow in under 2 minutes

### For Real-World Use
- Students find at least 3 new relevant courses they hadn't considered
- Recommendations align with actual job market demands
- Semester plans are feasible and balanced
- Students feel more confident in course selection decisions
