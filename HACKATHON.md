# 🦡 BadgerPlan AI - Hackathon Submission

## 🚀 Project Overview

**BadgerPlan AI** is an AI-powered course planning assistant for UW-Madison students that transforms course discovery into an intelligent, conversational experience. Built on top of the robust UW CourseMap data infrastructure, we've added a game-changing AI layer that helps students navigate 10,000+ courses while connecting them to career opportunities, student clubs, and real-world outcomes.

### 🎯 The Problem We Solve

UW-Madison students face overwhelming choices:
- **10,000+ courses** across 190+ departments
- Complex prerequisite chains
- Uncertainty about which courses lead to internships and jobs
- Difficulty finding courses that align with career goals
- Missing connections between academics and extracurriculars

### ✨ Our Solution

An AI assistant that:
- **Understands natural language** - Ask "What courses should I take to work at Google?" instead of browsing catalogs
- **Connects courses to careers** - Direct mappings to companies, internships, and job roles
- **Recommends student organizations** - Links courses to relevant clubs (AI Club, Badger Blockchain, etc.)
- **Provides real-time course data** - Weekly-updated information on 10,000+ courses
- **Delivers personalized guidance** - Tailored recommendations based on major and career goals

---

## 🎨 Key Features

### 1. **AI-Powered Conversational Interface**
- Beautiful sliding sidebar with gradient design
- Natural language course queries
- Context-aware responses using Claude 3.5 Sonnet
- Real-time streaming responses

### 2. **Career Path Intelligence**
Built-in knowledge of career paths:
- **Software Engineering** → CS 540, CS 577, CS 564 + Google, Meta, Microsoft
- **Data Science** → CS 540, STAT 340, CS 544 + Netflix, Spotify, LinkedIn
- **Product Management** → CS 540, ECON 101, COMM 275 + Stripe, Amazon
- **Consulting** → ECON 101, STAT 371, ACCT 100 + McKinsey, BCG, Bain
- **Machine Learning** → CS 540, CS 577, CS 760 + OpenAI, NVIDIA

### 3. **Student Organization Connections**
Automatically suggests relevant clubs:
- CS courses → Badger Blockchain, AI Club, Google Developer Student Club
- Business courses → Wisconsin Business Alliance, Consulting Club
- Research interests → Undergraduate Research Symposium

### 4. **Live Course Data Integration**
- Pulls from UW CourseMap's 10,000+ course database
- Weekly data updates for fresh information
- Real prerequisite and corequisite data
- Instructor ratings integration ready

### 5. **Modern, Playful UI**
- Colorful gradients (purple, pink, orange)
- Smooth animations and transitions
- Mobile-responsive design
- Dark mode support

---

## 🏗️ Technical Architecture

### Frontend
- **Framework:** SvelteKit 5 (latest runes system)
- **Styling:** TailwindCSS 4 with custom animations
- **Components:** Reusable UI components with Svelte 5 patterns
- **Icons:** Lucide Svelte

### Backend
- **AI:** Anthropic Claude 3.5 Sonnet API
- **Server:** SvelteKit server endpoints (+server.ts)
- **Data Source:** UW CourseMap static API (static.uwcourses.com)
- **Deployment Ready:** Vercel, Netlify, or Node.js

### Data Pipeline
- **Course Catalog:** 10,000+ courses from UW-Madison
- **Career Mappings:** Curated company & club connections
- **Real-time Fetching:** Dynamic course data on query
- **Context Injection:** AI receives relevant course info for each conversation

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+
npm or pnpm
Anthropic API key
```

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/badgerplan-ai
cd badgerplan-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### Environment Variables
Create a `.env` file:
```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
PUBLIC_API_URL=https://static.uwcourses.com
```

### Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` and click the AI sparkle button in the bottom-right corner!

---

## 💡 Usage Examples

### Example Queries

**Career-Focused:**
```
"What courses should I take to work at Google?"
"I want to be a data scientist, what should I study?"
"Best courses for machine learning roles?"
```

**Course Discovery:**
```
"What are good CS electives?"
"Easy gen ed courses that are actually interesting?"
"Prerequisites for CS 540?"
```

**Clubs & Opportunities:**
```
"What clubs should I join as a CS major?"
"How do I get involved in AI research?"
```

**Company-Specific:**
```
"What courses do Meta recruiters look for?"
"Prepare me for consulting interviews"
```

---

## 🎬 Demo Workflow

1. **Launch the app** - `npm run dev`
2. **Click the sparkle button** - Opens AI chat sidebar
3. **Ask a career question** - "What courses for Google?"
4. **Get intelligent response** - AI suggests CS 540, CS 577, CS 564 with explanations
5. **Discover clubs** - Learn about AI Club, Badger Blockchain
6. **Explore courses** - Click through to detailed course pages
7. **Plan your path** - Build a roadmap to your dream job

---

## 🌟 What Makes This Special

### 1. **Real Data, Real Impact**
Unlike generic AI chatbots, BadgerPlan AI uses actual UW-Madison course data updated weekly.

### 2. **Career-First Approach**
We connect academics to outcomes - every course recommendation links to real companies and opportunities.

### 3. **Community Integration**
Surface student organizations and clubs that complement coursework.

### 4. **Production-Ready Foundation**
Built on UW CourseMap's battle-tested infrastructure (600+ daily users, 150K+ requests/day).

### 5. **Extensible Architecture**
Easy to add:
- DARS integration for degree tracking
- Professor ratings
- Schedule conflict detection
- Peer course reviews
- LinkedIn job matching

---

## 🔮 Future Enhancements

### Phase 1 (Immediate)
- ✅ AI conversational interface
- ✅ Career path recommendations
- ✅ Club connections
- ⬜ User authentication
- ⬜ Conversation history

### Phase 2 (Next Sprint)
- ⬜ DARS integration (degree audit)
- ⬜ LinkedIn API for real job postings
- ⬜ RateMyProfessors integration
- ⬜ Schedule builder with conflict detection
- ⬜ Course waitlist notifications

### Phase 3 (Advanced)
- ⬜ Peer course reviews
- ⬜ Grade prediction based on history
- ⬜ Study group matching
- ⬜ Internship application tracking
- ⬜ Alumni career path analysis

---

## 🏆 Hackathon Value Proposition

### Innovation
- **First** AI-powered course planner for UW-Madison
- Bridges the gap between academics and career outcomes
- Novel career path mapping system

### Impact
- Helps 47,000+ UW students make better course decisions
- Reduces decision paralysis with intelligent guidance
- Increases awareness of campus opportunities

### Technical Excellence
- Modern Svelte 5 with latest patterns
- Production-ready architecture
- Scalable serverless design
- Clean, maintainable codebase

### Business Potential
- Subscription model for premium features
- University licensing opportunities
- Expandable to other universities
- Partnership potential with companies for recruiting

---

## 👥 Team

Built with ❤️ for UW-Madison students

### Tech Stack Credits
- **UW CourseMap** - Original data infrastructure
- **Anthropic Claude** - AI capabilities
- **SvelteKit** - Framework
- **TailwindCSS** - Styling

---

## 📄 License

Built on top of UW CourseMap (AGPL-3.0)
AI enhancements and new components: MIT License

---

## 🙏 Acknowledgments

- UW CourseMap for the amazing course data infrastructure
- Anthropic for Claude AI
- UW-Madison students for inspiration

---

## 🚀 Try It Now!

```bash
npm run dev
```

Click the sparkle ✨ button and ask:
**"What courses should I take to work at my dream company?"**

Let BadgerPlan AI guide your academic journey! 🦡
