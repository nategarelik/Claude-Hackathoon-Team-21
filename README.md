# UW Madison Course Recommender

An AI-powered course recommendation system that helps UW Madison students find courses aligned with their career goals by analyzing real job postings and matching them to university courses.

## Features

- **Career-Driven Recommendations**: Enter your target career and get courses matched to real job market requirements
- **AI-Powered Analysis**: Uses Claude AI to analyze job postings and match courses to required skills
- **Smart Course Matching**: Intelligent scoring based on skill alignment, degree requirements, and prerequisites
- **Semester Planning**: Automatic generation of semester-by-semester course plans
- **Transcript Parsing**: Upload PDF transcripts or manually enter completed courses
- **Degree Progress Tracking**: Track progress toward degree requirements and graduation
- **Job Market Integration**: Real-time scraping of Indeed and LinkedIn for current job requirements

## Tech Stack

### Backend
- Node.js + Express
- Anthropic Claude API (claude-3-5-sonnet)
- Puppeteer (job scraping)
- PDF parsing for transcripts

### Frontend
- React 18
- Tailwind CSS
- Axios for API calls

## Project Structure

```
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── services/   # API service layer
│   │   └── App.js
│   └── public/
├── server/              # Node.js backend
│   ├── services/       # Business logic
│   │   ├── aiService.js
│   │   ├── courseService.js
│   │   ├── jobScraperService.js
│   │   ├── recommendationService.js
│   │   └── transcriptService.js
│   ├── routes/         # API routes
│   ├── data/           # Degree requirements
│   └── index.js
└── docs/               # Documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Anthropic API key

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```bash
cp .env.example .env
```

4. Add your Anthropic API key to `.env`:
```
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
NODE_ENV=development
```

5. Start the backend server:
```bash
npm run dev
```

The server will start on http://localhost:3001

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at http://localhost:3000

## Usage

1. **Enter Career Goal**: Start by entering your target career field (e.g., "Software Engineer", "Data Scientist")

2. **Set Up Profile**: Select your major and add completed courses via:
   - PDF transcript upload
   - Manual course entry

3. **Get Recommendations**: The system will:
   - Scrape current job postings for your career field
   - Extract required skills using AI
   - Match UW courses to those skills
   - Generate a personalized semester plan

4. **Review Results**: View:
   - Ranked course recommendations with skill explanations
   - Semester-by-semester timeline
   - Degree progress tracking
   - Skill coverage analysis

## API Endpoints

### Career Analysis
- `POST /api/career/analyze` - Analyze career field and extract skills

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/subjects` - Get available subjects
- `GET /api/courses/majors` - Get available majors
- `GET /api/courses/majors/:major/requirements` - Get degree requirements

### Recommendations
- `POST /api/recommendations/generate` - Generate course recommendations

### Transcript
- `POST /api/transcript/upload` - Upload and parse PDF transcript
- `POST /api/transcript/parse-manual` - Parse manually entered courses

## Data Sources

- **Course Data**: [UW Coursemap](https://github.com/twangodev/uw-coursemap)
- **Job Postings**: Indeed and LinkedIn (scraped in real-time)
- **Degree Requirements**: UW Madison Guide (pre-compiled for major majors)

## How It Works

### Recommendation Algorithm

Each course receives a composite score based on:
1. **Skill Match (50%)**: AI-determined relevance to career skills
2. **Degree Requirement (30%)**: Fulfills required/elective requirements
3. **Prerequisite Efficiency (10%)**: Unlocks other valuable courses
4. **Career Priority (10%)**: Essential skills weighted higher

### Semester Planning

The timeline generator:
- Respects prerequisite chains
- Balances course load (default 15 credits/semester)
- Prioritizes required courses and high-skill matches
- Plans 4-8 semesters ahead

## Supported Majors

- Computer Science
- Data Science
- Electrical Engineering
- Business
- Mathematics

More majors can be added in `server/data/degreeRequirements.js`

## Development

### Running Tests
```bash
# Backend
cd server
npm test

# Frontend
cd client
npm test
```

### Building for Production
```bash
# Frontend
cd client
npm run build

# Backend
cd server
npm start
```

## Future Enhancements

- User accounts with persistent data
- More comprehensive major coverage
- Real-time course availability checking
- Professor ratings integration
- Course difficulty predictions
- Mobile app
- Export to PDF/calendar integration

## Contributing

This is a hackathon project. Contributions welcome!

## License

MIT

## Team

Claude Hackathon Team 21