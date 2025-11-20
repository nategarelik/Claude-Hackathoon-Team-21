# Quick Start Guide - Badger Course Finder

## Fastest Way to Get Running

### 1. Set Up Your Environment

```bash
# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

### 2. Add Your API Key

Edit `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-...your-key-here
```

Get your API key from: https://console.anthropic.com/

### 3. Run the App

```bash
python app.py
```

### 4. Open Your Browser

Visit: **http://localhost:5000**

## Demo Queries to Try

Copy and paste these into the search box:

1. `I need a Comm B class with above 60% A rate`
2. `Find me easy Comm A courses with high GPAs`
3. `Show me computer science courses with good grade distributions`

## Architecture Overview

```
User Query → Claude AI (parses request) → Find Courses → Add Grades → Claude AI (recommends) → Display Results
```

## Troubleshooting

### "API Key not found"
- Make sure `.env` file exists
- Check that `ANTHROPIC_API_KEY` is set correctly
- Restart the app after adding the key

### "Module not found"
```bash
pip install -r requirements.txt
```

### Port already in use
Change port in `app.py`:
```python
app.run(port=5001)  # Use different port
```

## Project Files

- `app.py` - Flask server and API endpoints
- `course_agent.py` - Claude AI recommendation engine
- `course_scraper.py` - UW course catalog scraper
- `madgrades_scraper.py` - Grade distribution scraper
- `templates/index.html` - Web interface

## API Testing (Optional)

Test the API directly:

```bash
curl -X POST http://localhost:5000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"query": "I need a Comm B class with above 60% A rate"}'
```

## Presenting Your Demo

1. Start the server: `python app.py`
2. Open browser to `http://localhost:5000`
3. Show example query: "I need a Comm B class with above 60% A rate"
4. Highlight:
   - Natural language processing
   - Claude AI recommendations
   - Grade distribution integration
   - Clean, branded interface

## Need Help?

Check the full README.md for detailed documentation!

---

Built for UW-Madison Hackathon - Team 21
