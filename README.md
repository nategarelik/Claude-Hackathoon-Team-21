# UW-Madison Course Assistant 🎓

An AI-powered course recommendation assistant for UW-Madison students, built with Claude AI and the Anthropic SDK.

## 🎯 Overview

This application helps UW-Madison students find courses that match their specific criteria using natural language queries. It combines course catalog data with grade distributions to provide intelligent, ranked course recommendations.

### Features

- 🤖 **Natural Language Queries**: Ask questions in plain English about courses you need
- 📊 **Grade Distribution Data**: See A-rates and GPA averages from madgrades.com
- 🎯 **Multi-Criteria Filtering**: Search by breadth requirements, credits, course level, schedule, and more
- 🏆 **Ranked Results**: Courses are ranked by how well they match your criteria
- 💬 **Interactive Chat Interface**: Clean, modern UI built with Next.js and Tailwind CSS

## 🏗️ Architecture

### Backend (Node.js + Express)
- **Claude SDK Integration**: Uses Anthropic's Claude 3.5 Sonnet model with tool calling
- **REST API**: Express server with `/api/chat` endpoint
- **Three Core Tools**:
  - `search_courses`: Filters courses by breadth requirements, subject, credits, level, time
  - `get_grades`: Fetches grade distribution data for specific courses
  - `rank_courses`: Scores and ranks courses based on criteria match percentage

### Frontend (Next.js + TypeScript + Tailwind)
- **React Chat Interface**: Real-time conversation with the AI assistant
- **Responsive Design**: Works on desktop and mobile
- **Example Queries**: Pre-built examples to help users get started

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Claude-Hackathoon-Team-21
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**

   Edit `backend/.env` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_actual_api_key_here
   PORT=3001
   ```

4. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

You need to run both the backend and frontend servers:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
The backend will start on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:3000`

Open your browser and navigate to `http://localhost:3000`

## 💡 Example Queries

Try asking the assistant:

- "Find me a Comm B class with above 60% A rate"
- "I need a 3-credit intro course in Computer Science"
- "Show me Ethnic Studies courses with high grade distributions"
- "What are some morning classes that fulfill Quantitative Reasoning requirements?"
- "Find 4-credit advanced courses in the humanities"

## 🛠️ Technical Details

### Backend API

**Endpoint:** `POST /api/chat`

**Request:**
```json
{
  "message": "Find me a Comm B class with above 60% A rate"
}
```

**Response:**
```json
{
  "response": "I found several Comm B classes with A-rates above 60%...",
  "usage": {
    "input_tokens": 1234,
    "output_tokens": 567
  }
}
```

### Agent Tools

**1. search_courses**
- Filters: `breadth_req`, `subject`, `credits`, `level`, `time_preference`
- Returns: Array of matching courses

**2. get_grades**
- Input: `course_code` (e.g., "COMP SCI 200")
- Returns: `a_rate`, `avg_gpa`, `distribution`

**3. rank_courses**
- Input: Array of courses and required criteria
- Returns: Ranked list with match scores and explanations

## 📊 Data Sources

Currently using mock data for the hackathon demo. In production, this would integrate with:

- **UW Course Guide**: https://guide.wisc.edu/courses/
- **UWCourses.com**: https://uwcourses.com (aggregates course + grade data)
- **Madgrades**: https://madgrades.com (grade distributions)

## 🎨 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Anthropic SDK
- **AI Model**: Claude 3.5 Sonnet (claude-3-5-sonnet-20241022)

## 📝 Project Structure

```
Claude-Hackathoon-Team-21/
├── backend/
│   ├── server.js          # Main Express server with Claude SDK
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables (API keys)
├── frontend/
│   ├── app/
│   │   ├── page.tsx      # Main chat interface
│   │   ├── layout.tsx    # Root layout
│   │   └── globals.css   # Tailwind styles
│   ├── package.json      # Frontend dependencies
│   └── next.config.js    # Next.js configuration
└── README.md
```

## 🔧 Development

### Adding New Courses
Edit the `mockCourses` array in `backend/server.js` to add more course data.

### Adding New Grade Data
Edit the `mockGrades` object in `backend/server.js` to add grade distributions for more courses.

### Customizing the UI
Modify `frontend/app/page.tsx` to change the chat interface design and colors.

## 🐛 Troubleshooting

**Backend won't start:**
- Make sure you've added your API key to `backend/.env`
- Check that port 3001 is not already in use

**Frontend can't connect to backend:**
- Ensure backend is running on port 3001
- Check browser console for CORS errors

**"API key not found" error:**
- Verify your `.env` file has `ANTHROPIC_API_KEY=your_key`
- Restart the backend server after changing `.env`

## 📄 License

MIT License - feel free to use this for your own projects!

## 🙏 Acknowledgments

- Built at the UW-Madison Hackathon
- Powered by Anthropic's Claude AI
- Data sources: UW-Madison Course Guide, UWCourses.com, Madgrades.com

## 👥 Team

Team 21 - UW-Madison Hackathon

---

**Happy Course Hunting!** 🦡
