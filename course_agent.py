"""
Claude-Powered Course Recommendation Agent
Uses Claude API to provide intelligent course recommendations
"""
import os
from anthropic import Anthropic
from typing import List, Dict, Optional
import json
from course_scraper import CourseScraperUW
from madgrades_scraper import MadGradesScraper, generate_mock_grade_data


class CourseRecommendationAgent:
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the course recommendation agent
        """
        self.api_key = api_key or os.getenv('ANTHROPIC_API_KEY')
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY not found in environment variables")

        self.client = Anthropic(api_key=self.api_key)
        self.course_scraper = CourseScraperUW()
        self.grade_scraper = MadGradesScraper()

    def parse_user_request(self, user_query: str) -> Dict[str, any]:
        """
        Use Claude to parse and understand the user's course request
        """
        parsing_prompt = f"""You are a course recommendation assistant for UW-Madison students.
Parse the following student request and extract:
1. Required course attributes (e.g., "Comm B", "Comm A", "Natural Science")
2. Grade requirements (e.g., "above 60% A rate", "high GPA")
3. Subject preferences (e.g., "computer science", "history")
4. Any other specific requirements

Student request: "{user_query}"

Respond in JSON format with:
{{
    "attributes": ["list of required attributes"],
    "min_a_rate": <number or null>,
    "min_gpa": <number or null>,
    "subjects": ["list of preferred subjects"],
    "keywords": ["other relevant keywords"],
    "summary": "brief summary of requirements"
}}"""

        try:
            message = self.client.messages.create(
                model="claude-sonnet-4-5-20250929",
                max_tokens=1024,
                messages=[
                    {"role": "user", "content": parsing_prompt}
                ]
            )

            response_text = message.content[0].text
            # Extract JSON from response
            json_match = response_text.find('{')
            if json_match != -1:
                json_end = response_text.rfind('}') + 1
                parsed_requirements = json.loads(response_text[json_match:json_end])
                return parsed_requirements
            else:
                # Fallback to basic parsing
                return self._fallback_parse(user_query)

        except Exception as e:
            print(f"Error parsing request with Claude: {e}")
            return self._fallback_parse(user_query)

    def _fallback_parse(self, user_query: str) -> Dict[str, any]:
        """
        Fallback parsing if Claude API fails
        """
        query_lower = user_query.lower()
        attributes = []

        if 'comm b' in query_lower or 'communication b' in query_lower:
            attributes.append('Comm B')
        if 'comm a' in query_lower or 'communication a' in query_lower:
            attributes.append('Comm A')

        # Extract A rate requirement
        import re
        a_rate_match = re.search(r'(\d+)%?\s*(?:a|A)\s*rate', user_query)
        min_a_rate = int(a_rate_match.group(1)) if a_rate_match else None

        return {
            "attributes": attributes,
            "min_a_rate": min_a_rate,
            "min_gpa": None,
            "subjects": [],
            "keywords": [],
            "summary": user_query
        }

    def find_matching_courses(self, requirements: Dict[str, any], limit: int = 20) -> List[Dict[str, any]]:
        """
        Find courses matching the requirements
        """
        # Search for courses with required attributes
        attributes = requirements.get('attributes', [])
        courses = []

        # For demo, we'll use mock data, but this can be replaced with real scraping
        # In production, you'd want to cache course data
        print(f"Searching for courses with attributes: {attributes}")

        # For hackathon demo, let's create sample courses
        sample_courses = self._get_sample_courses(attributes)

        # Add grade data to each course
        for course in sample_courses:
            # For demo purposes, use mock grade data
            # In production, this would fetch from madgrades.com
            grade_data = generate_mock_grade_data(course['code'])
            course['grade_data'] = grade_data

        # Filter by grade requirements
        min_a_rate = requirements.get('min_a_rate')
        if min_a_rate is not None:
            courses = [c for c in sample_courses
                      if c.get('grade_data', {}).get('a_rate', 0) >= min_a_rate]
        else:
            courses = sample_courses

        # Sort by A rate (highest first)
        courses.sort(key=lambda x: x.get('grade_data', {}).get('a_rate', 0), reverse=True)

        return courses[:limit]

    def _get_sample_courses(self, attributes: List[str]) -> List[Dict[str, any]]:
        """
        Get sample courses for demonstration
        In production, this would use the actual course scraper
        """
        sample_data = [
            {
                'subject': 'COMM ARTS',
                'number': '250',
                'code': 'COMM ARTS 250',
                'title': 'Public Speaking',
                'credits': '3',
                'description': 'Introduction to public speaking with emphasis on speech preparation and delivery.',
                'attributes': ['Comm B']
            },
            {
                'subject': 'ENGLISH',
                'number': '100',
                'code': 'ENGLISH 100',
                'title': 'Introduction to College Composition',
                'credits': '3',
                'description': 'Practice in reading, writing, and critical thinking.',
                'attributes': ['Comm B']
            },
            {
                'subject': 'ENGLISH',
                'number': '205',
                'code': 'ENGLISH 205',
                'title': 'Technical Writing',
                'credits': '3',
                'description': 'Writing for technical and professional audiences.',
                'attributes': ['Comm B']
            },
            {
                'subject': 'JOURNALISM',
                'number': '202',
                'code': 'JOURNALISM 202',
                'title': 'Mass Media and Society',
                'credits': '3',
                'description': 'Introduction to mass media and its role in society.',
                'attributes': ['Comm B']
            },
            {
                'subject': 'COMP SCI',
                'number': '200',
                'code': 'COMP SCI 200',
                'title': 'Programming I',
                'credits': '3',
                'description': 'Introduction to computer programming using Java.',
                'attributes': ['Comm B']
            },
            {
                'subject': 'PHILOS',
                'number': '241',
                'code': 'PHILOS 241',
                'title': 'Introductory Logic',
                'credits': '3',
                'description': 'Introduction to formal logic and reasoning.',
                'attributes': ['Comm B']
            },
            {
                'subject': 'COMM ARTS',
                'number': '155',
                'code': 'COMM ARTS 155',
                'title': 'Introduction to Media Production',
                'credits': '3',
                'description': 'Hands-on introduction to media production.',
                'attributes': ['Comm A']
            },
            {
                'subject': 'ART',
                'number': '101',
                'code': 'ART 101',
                'title': 'Introduction to Art',
                'credits': '3',
                'description': 'Survey of art history and techniques.',
                'attributes': ['Comm A']
            }
        ]

        # Filter by attributes if specified
        if attributes:
            filtered = [c for c in sample_data
                       if any(attr in c.get('attributes', []) for attr in attributes)]
            return filtered

        return sample_data

    def generate_recommendation(self, user_query: str) -> Dict[str, any]:
        """
        Main method to generate course recommendations
        """
        # Parse the user's request
        requirements = self.parse_user_request(user_query)

        # Find matching courses
        matching_courses = self.find_matching_courses(requirements)

        # Use Claude to generate a personalized recommendation
        recommendation_text = self._generate_recommendation_text(
            user_query, requirements, matching_courses
        )

        return {
            'query': user_query,
            'requirements': requirements,
            'courses': matching_courses,
            'recommendation': recommendation_text
        }

    def _generate_recommendation_text(self, user_query: str,
                                     requirements: Dict[str, any],
                                     courses: List[Dict[str, any]]) -> str:
        """
        Use Claude to generate a friendly, personalized recommendation
        """
        courses_summary = "\n".join([
            f"- {c['code']}: {c['title']} (A Rate: {c.get('grade_data', {}).get('a_rate', 'N/A')}%, "
            f"GPA: {c.get('grade_data', {}).get('gpa', 'N/A')})"
            for c in courses[:10]
        ])

        prompt = f"""You are a friendly academic advisor for UW-Madison students.

Student's request: "{user_query}"

Parsed requirements: {json.dumps(requirements, indent=2)}

Matching courses found:
{courses_summary}

Provide a helpful, encouraging response that:
1. Acknowledges their requirements
2. Recommends the top 3-5 courses from the list
3. Explains why each course is a good fit
4. Provides any helpful tips about these courses

Keep your response conversational and supportive!"""

        try:
            message = self.client.messages.create(
                model="claude-sonnet-4-5-20250929",
                max_tokens=2048,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )

            return message.content[0].text

        except Exception as e:
            print(f"Error generating recommendation: {e}")
            return f"I found {len(courses)} courses matching your criteria. Check out the list below!"


if __name__ == "__main__":
    # Test the agent
    import sys
    from dotenv import load_dotenv

    load_dotenv()

    agent = CourseRecommendationAgent()

    test_query = "I need a Comm B class with above 60% A rate"
    print(f"Test query: {test_query}\n")

    result = agent.generate_recommendation(test_query)

    print("=== Requirements ===")
    print(json.dumps(result['requirements'], indent=2))

    print("\n=== Recommendation ===")
    print(result['recommendation'])

    print(f"\n=== Found {len(result['courses'])} matching courses ===")
    for course in result['courses'][:5]:
        print(f"{course['code']}: {course['title']} - A Rate: {course.get('grade_data', {}).get('a_rate')}%")
