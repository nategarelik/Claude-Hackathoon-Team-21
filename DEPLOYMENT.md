# 🚀 BadgerPlan AI - Deployment Instructions

## ✅ What We Built

**BadgerPlan AI** is now ready for your hackathon submission! Here's what's complete:

### Features Implemented ✨
- ✅ AI chat sidebar with beautiful gradient design
- ✅ Claude 3.5 Sonnet integration for intelligent responses
- ✅ Career path recommendations (Software Engineer, Data Scientist, ML Engineer, etc.)
- ✅ Company-specific guidance (Google, Meta, Microsoft, etc.)
- ✅ Student club connections (AI Club, Badger Blockchain, etc.)
- ✅ Real-time UW course data integration (10,000+ courses)
- ✅ Natural language course queries
- ✅ Playful, Gen Z-friendly UI

### Tech Stack 🛠️
- SvelteKit 5 (latest runes system)
- Anthropic Claude API
- TailwindCSS 4
- UW CourseMap data infrastructure
- Node.js backend

---

## 🎯 Current Status

**Server Running:** ✅ `http://localhost:5174`

The app is currently running and functional. You can:
1. Open `http://localhost:5174` in your browser
2. Click the sparkle ✨ button in the bottom-right
3. Ask questions like:
   - "What courses should I take to work at Google?"
   - "Best CS electives for machine learning?"
   - "What clubs should I join as a CS major?"

---

## 📦 To Create Your Own Repository

Since this is forked from UW CourseMap, you should create a new repository:

### Option 1: GitHub Web UI (Easiest)
1. Go to https://github.com/new
2. Name it: `badgerplan-ai`
3. Make it **Public** (for hackathon visibility)
4. Don't initialize with README (we have files already)
5. Click "Create repository"

### Option 2: GitHub CLI
```bash
cd badgerplan-ai
gh repo create badgerplan-ai --public --source=. --remote=origin
```

### Then Push Your Code
```bash
cd badgerplan-ai

# Update remote to your new repo
git remote set-url origin https://github.com/YOUR_USERNAME/badgerplan-ai.git

# Push to your repository
git push -u origin main
```

---

## 🌐 Deploy to Vercel (Recommended)

### Prerequisites
- Vercel account (free): https://vercel.com/signup
- Your Anthropic API key

### Steps
1. **Push to GitHub** (see above)

2. **Import to Vercel:**
   - Go to https://vercel.com/new
   - Import your `badgerplan-ai` repository
   - Click "Deploy"

3. **Add Environment Variables:**
   In Vercel dashboard → Settings → Environment Variables:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE
   PUBLIC_API_URL=https://static.uwcourses.com
   ```

4. **Redeploy:**
   - After adding env vars, trigger a new deployment
   - Your app will be live at `https://badgerplan-ai.vercel.app`

### One-Click Deploy Button (Add to README)
```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/badgerplan-ai&env=ANTHROPIC_API_KEY,PUBLIC_API_URL)
```

---

## 🎬 Demo for Hackathon Judges

### Live Demo Flow
1. **Show the UI**
   - Beautiful gradient design
   - Smooth sidebar animations
   - Mobile-responsive

2. **Test Career Queries**
   ```
   "What courses should I take to work at Google?"
   → AI recommends CS 540, CS 577, CS 564 + explains why
   ```

3. **Test Club Discovery**
   ```
   "What clubs should I join for AI?"
   → AI suggests AI Club, Badger Blockchain, Google DSC
   ```

4. **Test Company-Specific**
   ```
   "Prepare me for Meta interviews"
   → AI gives course recommendations + interview prep advice
   ```

5. **Show Course Integration**
   - Mention a specific course code
   - AI fetches real data from UW CourseMap API
   - Shows prerequisites, descriptions, etc.

---

## 📊 Hackathon Pitch Points

### Problem
- 47,000 UW students overwhelmed by 10,000+ course choices
- No connection between academics and career outcomes
- Students don't know which courses lead to internships

### Solution
- AI-powered conversational course planning
- Direct career path mapping (courses → companies → clubs)
- Built on proven infrastructure (UW CourseMap)

### Innovation
- **First** AI assistant specifically for UW-Madison courses
- Novel career path integration
- Bridges academics and extracurriculars

### Impact
- Helps students make better course decisions
- Increases awareness of opportunities
- Reduces decision paralysis

### Technical Excellence
- Modern Svelte 5 architecture
- Production-ready codebase
- Scalable serverless design
- Real-time data integration

---

## 🐛 Troubleshooting

### App won't load
```bash
cd badgerplan-ai
npm install
npm run dev
```

### TypeScript errors
```bash
npx svelte-kit sync
```

### Port already in use
The app will automatically use the next available port (5174, 5175, etc.)

### API errors
- Check `.env` has valid `ANTHROPIC_API_KEY`
- Verify the key starts with `sk-ant-`

---

## 📝 Environment Variables

Create `.env` file:
```env
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE
PUBLIC_API_URL=https://static.uwcourses.com
```

**Never commit `.env` to git!** (It's already in `.gitignore`)

---

## 🏆 Submission Checklist

- [x] Code committed to git
- [ ] Push to GitHub repository
- [ ] Deploy to Vercel (optional but recommended)
- [ ] Record demo video showing:
  - AI chat interface
  - Career recommendations
  - Club suggestions
  - Course data integration
- [ ] Prepare pitch deck highlighting:
  - Problem/Solution
  - Technical architecture
  - Impact potential
  - Future roadmap

---

## 🚀 Future Enhancements (Mention in Pitch)

### Phase 2
- User authentication & profiles
- DARS integration for degree tracking
- Schedule conflict detection
- LinkedIn job API integration

### Phase 3
- Waitlist notifications
- Peer course reviews
- Study group matching
- Alumni career tracking

---

## 💡 Key Features for Demo

1. **Smart Conversational AI**
   - Natural language understanding
   - Context-aware responses
   - Friendly, encouraging tone

2. **Career-First Approach**
   - Every recommendation links to outcomes
   - Company-specific guidance
   - Internship preparation

3. **Community Integration**
   - Student club recommendations
   - Extracurricular connections
   - Peer learning opportunities

4. **Real Data**
   - 10,000+ courses updated weekly
   - Actual UW prerequisite chains
   - Live course availability

---

## 📞 Support

- **Documentation:** See `HACKATHON.md` for full project details
- **Tech Issues:** Check server logs with `npm run dev`
- **API Issues:** Verify Anthropic API key is valid

---

## 🎉 You're Ready!

Your BadgerPlan AI hackathon submission is complete and running!

**Server:** http://localhost:5174
**Next Step:** Push to GitHub and optionally deploy to Vercel

Good luck with your submission! 🦡✨
