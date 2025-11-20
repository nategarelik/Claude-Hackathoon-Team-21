"""
UW-Madison Course Catalog Scraper
Fetches course information from guide.wisc.edu
"""
import requests
from bs4 import BeautifulSoup
import re
import time
from typing import List, Dict, Optional


class CourseScraperUW:
    def __init__(self):
        self.base_url = "https://guide.wisc.edu/courses/"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }

    def get_all_subjects(self) -> List[Dict[str, str]]:
        """Fetch all available subject codes and names"""
        try:
            response = requests.get(self.base_url, headers=self.headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')

            subjects = []
            # Find all subject links
            subject_links = soup.find_all('a', href=re.compile(r'/courses/[a-z_]+/?$'))

            for link in subject_links:
                subject_code = link['href'].split('/')[-2] if link['href'].endswith('/') else link['href'].split('/')[-1]
                subject_name = link.text.strip()
                subjects.append({
                    'code': subject_code.upper(),
                    'name': subject_name,
                    'url': f"{self.base_url}{subject_code}/"
                })

            return subjects
        except Exception as e:
            print(f"Error fetching subjects: {e}")
            return []

    def get_courses_by_subject(self, subject_code: str) -> List[Dict[str, any]]:
        """Fetch all courses for a given subject"""
        try:
            url = f"{self.base_url}{subject_code.lower()}/"
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')

            courses = []
            course_blocks = soup.find_all('div', class_='courseblock')

            for block in course_blocks:
                try:
                    # Extract course title and number
                    title_elem = block.find('p', class_='courseblocktitle')
                    if not title_elem:
                        continue

                    title_text = title_elem.get_text(strip=True)
                    # Parse "SUBJECT ### — Title (# Credits)"
                    match = re.match(r'([A-Z]+)\s+(\d+)\s*[—-]\s*(.+?)(?:\((\d+(?:-\d+)?)\s*[Cc]redits?\))?$', title_text)

                    if not match:
                        continue

                    subject, number, title, credits = match.groups()

                    # Extract description
                    desc_elem = block.find('p', class_='courseblockdesc')
                    description = desc_elem.get_text(strip=True) if desc_elem else ""

                    # Extract requisites and attributes
                    requisites = ""
                    attributes = []

                    # Look for requisites
                    req_elem = block.find('p', class_='courseblockrequisite')
                    if req_elem:
                        requisites = req_elem.get_text(strip=True)

                    # Look for course attributes (like Comm A, Comm B, etc.)
                    extra_elem = block.find('p', class_='courseblockextra')
                    if extra_elem:
                        extra_text = extra_elem.get_text(strip=True)
                        # Common UW attributes
                        attr_patterns = [
                            r'Comm [AB]', r'Ethnic Studies', r'L&S Credit',
                            r'Natural Science', r'Social Science', r'Humanities',
                            r'Biological Sci', r'Physical Sci', r'Elementary',
                            r'Intermediate', r'Advanced'
                        ]
                        for pattern in attr_patterns:
                            if re.search(pattern, extra_text, re.IGNORECASE):
                                attributes.append(re.search(pattern, extra_text, re.IGNORECASE).group())

                    # Also check in description for attributes
                    if description:
                        if re.search(r'Comm[- ]?B', description, re.IGNORECASE):
                            if 'Comm B' not in attributes:
                                attributes.append('Comm B')
                        if re.search(r'Comm[- ]?A', description, re.IGNORECASE):
                            if 'Comm A' not in attributes:
                                attributes.append('Comm A')

                    course_info = {
                        'subject': subject,
                        'number': number,
                        'code': f"{subject} {number}",
                        'title': title.strip(),
                        'credits': credits if credits else "Variable",
                        'description': description,
                        'requisites': requisites,
                        'attributes': attributes
                    }

                    courses.append(course_info)

                except Exception as e:
                    print(f"Error parsing course block: {e}")
                    continue

            return courses

        except Exception as e:
            print(f"Error fetching courses for {subject_code}: {e}")
            return []

    def search_courses(self, query: str = "", attributes: List[str] = None) -> List[Dict[str, any]]:
        """
        Search courses by query and/or attributes
        Example attributes: ['Comm B', 'Comm A', 'Natural Science']
        """
        if attributes is None:
            attributes = []

        # For demo purposes, search a few common subjects
        # In production, you might want to cache this or search specific subjects
        common_subjects = ['COMP SCI', 'MATH', 'ENGLISH', 'HISTORY', 'BIOLOGY',
                          'CHEMISTRY', 'PHYSICS', 'PSYCH', 'ECON', 'COMM ARTS',
                          'PHILOSOPHY', 'POLI SCI', 'SOCIOLOGY']

        all_courses = []
        for subject in common_subjects[:5]:  # Limit for performance
            courses = self.get_courses_by_subject(subject)
            all_courses.extend(courses)
            time.sleep(0.5)  # Be nice to the server

        # Filter by attributes if specified
        if attributes:
            filtered = []
            for course in all_courses:
                if any(attr in course.get('attributes', []) for attr in attributes):
                    filtered.append(course)
            all_courses = filtered

        # Filter by query if specified
        if query:
            query_lower = query.lower()
            filtered = []
            for course in all_courses:
                if (query_lower in course['title'].lower() or
                    query_lower in course['description'].lower() or
                    query_lower in course['code'].lower()):
                    filtered.append(course)
            all_courses = filtered

        return all_courses


if __name__ == "__main__":
    # Test the scraper
    scraper = CourseScraperUW()
    print("Testing course scraper...")

    # Test getting subjects
    subjects = scraper.get_all_subjects()
    print(f"Found {len(subjects)} subjects")

    # Test getting courses for Computer Science
    courses = scraper.get_courses_by_subject("comp_sci")
    print(f"Found {len(courses)} Computer Science courses")
    if courses:
        print(f"Example course: {courses[0]}")
