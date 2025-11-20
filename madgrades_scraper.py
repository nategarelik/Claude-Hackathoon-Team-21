"""
MadGrades Scraper
Fetches grade distribution data from madgrades.com
"""
import requests
from bs4 import BeautifulSoup
import re
from typing import Dict, Optional, List


class MadGradesScraper:
    def __init__(self):
        self.base_url = "https://madgrades.com"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }

    def format_course_code(self, course_code: str) -> str:
        """
        Convert 'COMP SCI 200' to 'comp-sci-200' format for URL
        """
        parts = course_code.upper().split()
        if len(parts) >= 2:
            subject = '-'.join(parts[:-1]).lower()
            number = parts[-1]
            return f"{subject}-{number}"
        return course_code.lower().replace(' ', '-')

    def get_grade_distribution(self, course_code: str) -> Optional[Dict[str, any]]:
        """
        Fetch grade distribution for a course
        Returns dict with A_rate, B_rate, etc.
        """
        try:
            formatted_code = self.format_course_code(course_code)
            url = f"{self.base_url}/courses/{formatted_code}"

            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')

            # MadGrades shows aggregate grade distribution
            # We need to parse the grade data from the page
            grade_data = {
                'course_code': course_code,
                'url': url,
                'grades': {},
                'total_students': 0,
                'a_rate': 0.0,
                'ab_rate': 0.0,
                'gpa': 0.0
            }

            # Look for grade statistics in the page
            # Note: MadGrades structure may vary, this is a general approach

            # Try to find overall statistics
            stats_divs = soup.find_all('div', class_=re.compile(r'.*stat.*', re.IGNORECASE))

            # Look for text patterns indicating grades
            page_text = soup.get_text()

            # Try to extract GPA if available
            gpa_match = re.search(r'GPA[:\s]+(\d+\.\d+)', page_text, re.IGNORECASE)
            if gpa_match:
                grade_data['gpa'] = float(gpa_match.group(1))

            # Try to extract percentage of A grades
            a_match = re.search(r'A[:\s]+(\d+(?:\.\d+)?)\s*%', page_text)
            if a_match:
                grade_data['a_rate'] = float(a_match.group(1))

            # Try to extract AB rate
            ab_match = re.search(r'AB[:\s]+(\d+(?:\.\d+)?)\s*%', page_text)
            if ab_match:
                grade_data['ab_rate'] = float(ab_match.group(1))

            # Alternative: Look for data in script tags or JSON
            scripts = soup.find_all('script')
            for script in scripts:
                if script.string and 'grade' in script.string.lower():
                    # Try to extract grade data from JavaScript
                    # This is a simplified version
                    a_grades = re.search(r'"A"[:\s]+(\d+)', script.string)
                    if a_grades:
                        total_match = re.search(r'total["\']?[:\s]+(\d+)', script.string, re.IGNORECASE)
                        if total_match:
                            total = int(total_match.group(1))
                            a_count = int(a_grades.group(1))
                            grade_data['a_rate'] = (a_count / total * 100) if total > 0 else 0
                            grade_data['total_students'] = total

            return grade_data

        except requests.exceptions.RequestException as e:
            print(f"Error fetching grade data for {course_code}: {e}")
            return None
        except Exception as e:
            print(f"Error parsing grade data for {course_code}: {e}")
            return None

    def get_simplified_grades(self, course_code: str) -> Optional[Dict[str, any]]:
        """
        Get simplified grade information
        Returns estimated A rate based on available data
        """
        grade_data = self.get_grade_distribution(course_code)

        if not grade_data:
            # Return mock data for demo purposes
            # In production, you'd want to handle this differently
            return {
                'course_code': course_code,
                'a_rate': None,
                'gpa': None,
                'available': False,
                'note': 'Grade data not available'
            }

        return {
            'course_code': course_code,
            'a_rate': grade_data.get('a_rate', 0.0),
            'gpa': grade_data.get('gpa', 0.0),
            'available': True,
            'url': grade_data.get('url', '')
        }

    def estimate_a_rate_from_gpa(self, gpa: float) -> float:
        """
        Rough estimation of A rate from GPA
        This is an approximation for when exact grade distributions aren't available
        """
        if gpa >= 3.8:
            return 70.0
        elif gpa >= 3.5:
            return 50.0
        elif gpa >= 3.2:
            return 35.0
        elif gpa >= 3.0:
            return 25.0
        elif gpa >= 2.7:
            return 15.0
        else:
            return 10.0


def generate_mock_grade_data(course_code: str) -> Dict[str, any]:
    """
    Generate mock grade data for testing
    In production, this would be replaced with actual API calls
    """
    import random

    # Generate realistic-looking grade distributions
    a_rate = random.uniform(15, 75)
    gpa = 2.0 + (a_rate / 100) * 1.8

    return {
        'course_code': course_code,
        'a_rate': round(a_rate, 1),
        'gpa': round(gpa, 2),
        'available': True,
        'note': 'Mock data for demonstration',
        'url': f"https://madgrades.com/courses/{course_code.lower().replace(' ', '-')}"
    }


if __name__ == "__main__":
    # Test the scraper
    scraper = MadGradesScraper()
    print("Testing MadGrades scraper...")

    # Test with a common course
    test_courses = ["COMP SCI 200", "MATH 221", "ENGLISH 100"]

    for course in test_courses:
        grades = scraper.get_simplified_grades(course)
        print(f"\n{course}: {grades}")
