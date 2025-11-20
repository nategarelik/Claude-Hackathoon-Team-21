# 🚀 Quick Start Guide

## Before You Start

1. **Get your Anthropic API Key**
   - Go to https://console.anthropic.com
   - Sign up or log in
   - Navigate to API Keys
   - Create a new key and copy it

2. **Add API Key to Backend**
   ```bash
   # Open the file backend/.env in a text editor
   # Replace 'your_anthropic_api_key_here' with your actual API key
   ```

## Running the Application

### Option 1: Using Two Terminals (Recommended)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
```
Wait until you see: `🚀 Server running on port 3001`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Wait until you see: `Ready on http://localhost:3000`

Then open your browser to: **http://localhost:3000**

### Option 2: Install and Run (If you haven't installed dependencies yet)

**First time setup:**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

Then follow Option 1 above.

## Testing the Application

Once both servers are running, try these example queries in the chat:

1. **"Find me a Comm B class with above 60% A rate"**
   - Tests breadth requirement + grade filtering

2. **"I need a 3-credit intro course in Computer Science"**
   - Tests credit and level filtering

3. **"Show me Ethnic Studies courses"**
   - Tests breadth requirement search

## Troubleshooting

### Backend won't start
- Check that you added your API key to `backend/.env`
- Make sure port 3001 is available

### Frontend can't connect
- Verify backend is running (check Terminal 1)
- Look for errors in the browser console (F12)

### Need help?
Check the main README.md for detailed troubleshooting steps!

---

**Ready to demo? Open http://localhost:3000 and start asking about courses!** 🎓
