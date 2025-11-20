"""
Flask Web Application for UW-Madison Course Recommender
"""
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv
import os
from course_agent import CourseRecommendationAgent

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Initialize the course recommendation agent
try:
    agent = CourseRecommendationAgent()
    print("✓ Course Recommendation Agent initialized successfully")
except Exception as e:
    print(f"✗ Error initializing agent: {e}")
    agent = None


@app.route('/')
def index():
    """Serve the main page"""
    return render_template('minimal.html')


@app.route('/fancy')
def fancy():
    """Serve the fancy page"""
    return render_template('index.html')


@app.route('/test')
def test():
    """Simple test page"""
    return render_template('test.html')


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'agent_ready': agent is not None
    })


@app.route('/api/recommend', methods=['POST'])
def recommend_courses():
    """
    Main endpoint for course recommendations
    Expects JSON: {"query": "user's course request"}
    """
    if not agent:
        return jsonify({
            'error': 'Course recommendation agent not initialized. Check API key.'
        }), 500

    try:
        data = request.get_json()

        if not data or 'query' not in data:
            return jsonify({
                'error': 'Missing "query" field in request'
            }), 400

        user_query = data['query']

        if not user_query.strip():
            return jsonify({
                'error': 'Query cannot be empty'
            }), 400

        # Generate recommendations
        result = agent.generate_recommendation(user_query)

        return jsonify({
            'success': True,
            'query': user_query,
            'requirements': result['requirements'],
            'recommendation': result['recommendation'],
            'courses': result['courses']
        })

    except Exception as e:
        print(f"Error in recommend_courses: {e}")
        return jsonify({
            'error': f'An error occurred: {str(e)}'
        }), 500


@app.route('/api/parse-query', methods=['POST'])
def parse_query():
    """
    Parse a user query to extract requirements
    Expects JSON: {"query": "user's course request"}
    """
    if not agent:
        return jsonify({
            'error': 'Course recommendation agent not initialized'
        }), 500

    try:
        data = request.get_json()
        user_query = data.get('query', '')

        if not user_query:
            return jsonify({'error': 'Query is required'}), 400

        requirements = agent.parse_user_request(user_query)

        return jsonify({
            'success': True,
            'query': user_query,
            'requirements': requirements
        })

    except Exception as e:
        return jsonify({
            'error': f'Error parsing query: {str(e)}'
        }), 500


@app.route('/api/courses/search', methods=['GET'])
def search_courses():
    """
    Search courses by attributes or keywords
    Query params: ?attributes=Comm%20B&min_a_rate=60
    """
    if not agent:
        return jsonify({
            'error': 'Course recommendation agent not initialized'
        }), 500

    try:
        attributes = request.args.getlist('attributes')
        min_a_rate = request.args.get('min_a_rate', type=float)
        min_gpa = request.args.get('min_gpa', type=float)

        requirements = {
            'attributes': attributes,
            'min_a_rate': min_a_rate,
            'min_gpa': min_gpa,
            'subjects': [],
            'keywords': []
        }

        courses = agent.find_matching_courses(requirements)

        return jsonify({
            'success': True,
            'count': len(courses),
            'courses': courses
        })

    except Exception as e:
        return jsonify({
            'error': f'Error searching courses: {str(e)}'
        }), 500


@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    # Check if API key is set
    if not os.getenv('ANTHROPIC_API_KEY'):
        print("\n" + "="*60)
        print("⚠️  WARNING: ANTHROPIC_API_KEY not found!")
        print("="*60)
        print("\nPlease set your API key:")
        print("1. Copy .env.example to .env")
        print("2. Add your API key to the .env file")
        print("3. Restart the application\n")
    else:
        print("\n" + "="*60)
        print("🎓 UW-Madison Course Recommender")
        print("="*60)
        print("\n✓ API Key found")
        print("✓ Server starting...\n")

    # Run the Flask app
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
