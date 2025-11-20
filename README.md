# 🎓 Badger Course Finder

An AI-powered course recommendation system for UW-Madison students built with the Claude SDK.

## Overview

Badger Course Finder helps UW-Madison students find the perfect courses based on their specific requirements. Using Claude AI, the system intelligently parses student requests and recommends courses by analyzing:

- UW-Madison course catalog data
- Grade distributions from MadGrades
- Course attributes (Comm A/B, requirements, etc.)
- Student preferences and criteria

## Features

- **Natural Language Queries**: Ask for courses in plain English
- **Intelligent Filtering**: Automatically filters by grade requirements, course attributes, and more
- **Grade Distribution Data**: Integrates with MadGrades to show A rates and GPAs
- **AI-Powered Recommendations**: Claude provides personalized course suggestions with explanations
- **Beautiful Web Interface**: Modern, responsive design in UW-Madison colors

## Example Queries

- "I need a Comm B class with above 60% A rate"
- "Find me easy Comm A courses with high GPAs"
- "Show me computer science courses with good grade distributions"

## Architecture

```
┌─────────────────┐
│  Web Frontend   │
│   (HTML/JS)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Flask Backend  │
│   API Server    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│     Course Recommendation Agent     │
│         (Claude SDK)                │
└──────┬──────────────────┬───────────┘
       │                  │
       ▼                  ▼
┌─────────────┐    ┌──────────────┐
│   UW Course │    │  MadGrades   │
│   Catalog   │    │   Scraper    │
│   Scraper   │    │              │
└─────────────┘    └──────────────┘
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Anthropic API Key (Claude)
- Internet connection (for course catalog access)

### Installation

1. **Clone the repository**
   ```bash
   cd Claude-Hackathoon-Team-21
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up your API key**
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Open your browser**
   Navigate to: `http://localhost:5000`

## Project Structure

```
Claude-Hackathoon-Team-21/
├── app.py                    # Flask web server
├── course_agent.py           # Claude-powered recommendation agent
├── course_scraper.py         # UW course catalog scraper
├── madgrades_scraper.py      # MadGrades grade distribution scraper
├── requirements.txt          # Python dependencies
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore file
├── templates/
│   └── index.html           # Web interface
└── README.md                # This file
```

## API Endpoints

### `POST /api/recommend`
Get course recommendations based on a natural language query.

**Request:**
```json
{
  "query": "I need a Comm B class with above 60% A rate"
}
```

**Response:**
```json
{
  "success": true,
  "query": "I need a Comm B class with above 60% A rate",
  "requirements": {
    "attributes": ["Comm B"],
    "min_a_rate": 60,
    "min_gpa": null,
    "subjects": [],
    "keywords": []
  },
  "recommendation": "Claude's personalized recommendation...",
  "courses": [...]
}
```

### `POST /api/parse-query`
Parse a query to extract requirements without getting recommendations.

### `GET /api/courses/search`
Search courses with query parameters.

**Example:**
```
GET /api/courses/search?attributes=Comm%20B&min_a_rate=60
```

### `GET /api/health`
Check if the API is running and the agent is initialized.

## How It Works

1. **User Input**: Student enters a course request in natural language
2. **Query Parsing**: Claude analyzes the request to extract requirements
3. **Course Search**: System searches UW course catalog for matching courses
4. **Grade Enrichment**: Fetches grade distribution data from MadGrades
5. **Filtering**: Applies student's criteria (A rate, GPA, attributes)
6. **Recommendation**: Claude generates personalized recommendations
7. **Display**: Results shown in an attractive, easy-to-read format

## Technologies Used

- **Backend**: Python, Flask
- **AI**: Anthropic Claude SDK (Sonnet 4.5)
- **Web Scraping**: BeautifulSoup, Requests
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Styling**: Custom CSS with UW-Madison branding

## Demo Data Note

For hackathon demonstration purposes, the system uses sample course data. In a production environment, you would:

1. Cache course catalog data in a database
2. Implement rate limiting for web scraping
3. Use official UW APIs if available
4. Store grade distributions locally to reduce scraping

## Future Enhancements

- [ ] Add user authentication and saved preferences
- [ ] Implement course comparison feature
- [ ] Add professor ratings integration
- [ ] Include course schedule/time information
- [ ] Export recommendations to calendar
- [ ] Add course reviews and student feedback
- [ ] Implement course prerequisite tracking
- [ ] Add email notifications for new matching courses

## Hackathon Notes

This project was built for a UW-Madison hackathon to help students make better course selection decisions by combining:
- AI-powered natural language understanding
- Real course catalog data
- Grade distribution statistics
- Personalized recommendations

## Contributing

This is a hackathon project, but contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## License

MIT License - Feel free to use this project for educational purposes.

## Acknowledgments

- UW-Madison for course catalog data
- MadGrades for grade distribution statistics
- Anthropic for the Claude API
- All hackathon participants and organizers

---

Built with ❤️ by Team 21 at UW-Madison Hackathon
