const puppeteer = require('puppeteer');
const NodeCache = require('node-cache');

// Cache job results for 24 hours
const cache = new NodeCache({ stdTTL: 86400 });

class JobScraperService {
  /**
   * Scrape job postings for a given career field
   * @param {string} careerField - The career/job title to search
   * @returns {Array} Array of job posting text
   */
  async scrapeJobs(careerField) {
    const cacheKey = `jobs_${careerField.toLowerCase().replace(/\s+/g, '_')}`;

    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log(`Returning cached jobs for ${careerField}`);
      return cached;
    }

    console.log(`Scraping jobs for ${careerField}...`);

    const jobs = [];

    try {
      // Scrape from Indeed
      const indeedJobs = await this.scrapeIndeed(careerField);
      jobs.push(...indeedJobs);
    } catch (error) {
      console.error('Error scraping Indeed:', error.message);
    }

    try {
      // Scrape from LinkedIn (if time permits, can be challenging)
      // const linkedinJobs = await this.scrapeLinkedIn(careerField);
      // jobs.push(...linkedinJobs);
    } catch (error) {
      console.error('Error scraping LinkedIn:', error.message);
    }

    // Fallback to mock data if scraping fails
    if (jobs.length === 0) {
      console.log('Using mock job data');
      jobs.push(...this.getMockJobs(careerField));
    }

    // Cache the results
    cache.set(cacheKey, jobs);

    return jobs;
  }

  /**
   * Scrape Indeed for job postings
   * @param {string} careerField - Career field to search
   * @returns {Array} Job descriptions
   */
  async scrapeIndeed(careerField) {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

      const searchQuery = encodeURIComponent(careerField);
      const url = `https://www.indeed.com/jobs?q=${searchQuery}&l=Madison%2C+WI`;

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });

      // Extract job descriptions
      const jobs = await page.evaluate(() => {
        const jobCards = document.querySelectorAll('.job_seen_beacon');
        const descriptions = [];

        jobCards.forEach((card, index) => {
          if (index < 10) { // Limit to 10 jobs
            const titleEl = card.querySelector('.jobTitle');
            const descEl = card.querySelector('.job-snippet');

            if (titleEl && descEl) {
              descriptions.push({
                title: titleEl.innerText,
                description: descEl.innerText
              });
            }
          }
        });

        return descriptions;
      });

      await browser.close();

      return jobs.map(j => `Title: ${j.title}\n\nDescription: ${j.description}`);
    } catch (error) {
      if (browser) await browser.close();
      console.error('Indeed scraping error:', error.message);
      return [];
    }
  }

  /**
   * Get mock job data for testing
   * @param {string} careerField - Career field
   * @returns {Array} Mock job postings
   */
  getMockJobs(careerField) {
    const mockJobs = {
      'software engineer': [
        `Title: Software Engineer

Description: We are seeking a talented Software Engineer to join our team.

Requirements:
- Bachelor's degree in Computer Science or related field
- Proficiency in programming languages such as Java, Python, or JavaScript
- Experience with web development frameworks (React, Node.js, Django)
- Understanding of data structures and algorithms
- Knowledge of SQL and database design
- Familiarity with version control systems (Git)
- Strong problem-solving and analytical skills
- Excellent communication and teamwork abilities

Preferred:
- Experience with cloud platforms (AWS, Azure, GCP)
- Knowledge of containerization (Docker, Kubernetes)
- Understanding of CI/CD pipelines
- Experience with agile development methodologies`,

        `Title: Full Stack Software Developer

Description: Join our innovative team as a Full Stack Developer!

Requirements:
- 2+ years of software development experience
- Strong skills in JavaScript/TypeScript, React, and Node.js
- Experience with RESTful API design and development
- Proficiency in SQL and NoSQL databases
- Understanding of software design patterns and best practices
- Experience with testing frameworks (Jest, Mocha)
- Knowledge of HTML5, CSS3, and responsive design
- Familiarity with agile methodologies

Nice to have:
- Experience with Python or Java
- Knowledge of machine learning concepts
- Understanding of DevOps practices
- Experience with microservices architecture`,

        `Title: Backend Software Engineer

Description: We're looking for a Backend Engineer to build scalable systems.

Requirements:
- Strong programming skills in Python, Java, or Go
- Experience designing and implementing RESTful APIs
- Deep understanding of databases (PostgreSQL, MongoDB)
- Knowledge of distributed systems and microservices
- Experience with message queues (RabbitMQ, Kafka)
- Understanding of caching strategies (Redis, Memcached)
- Proficiency in writing unit and integration tests
- Experience with cloud infrastructure (AWS preferred)

Preferred:
- Knowledge of GraphQL
- Experience with performance optimization
- Understanding of security best practices
- Contributions to open-source projects`
      ],

      'data scientist': [
        `Title: Data Scientist

Description: Seeking a Data Scientist to drive insights from data.

Requirements:
- Master's degree in Statistics, Computer Science, or related field
- Strong programming skills in Python and R
- Experience with machine learning frameworks (scikit-learn, TensorFlow, PyTorch)
- Proficiency in SQL and data manipulation
- Knowledge of statistical analysis and hypothesis testing
- Experience with data visualization tools (Matplotlib, Plotly, Tableau)
- Understanding of deep learning and neural networks
- Strong mathematical and analytical skills

Preferred:
- PhD in quantitative field
- Experience with big data technologies (Spark, Hadoop)
- Knowledge of natural language processing
- Experience deploying ML models to production`,

        `Title: Machine Learning Engineer

Description: Build and deploy machine learning models at scale.

Requirements:
- Bachelor's degree in Computer Science or related field
- Strong programming skills in Python
- Experience with ML frameworks (TensorFlow, PyTorch, scikit-learn)
- Knowledge of machine learning algorithms and theory
- Experience with data preprocessing and feature engineering
- Understanding of model evaluation and optimization
- Proficiency in SQL and data manipulation
- Experience with version control and collaborative development

Nice to have:
- Experience with MLOps and model deployment
- Knowledge of cloud platforms (AWS SageMaker, GCP AI Platform)
- Understanding of distributed computing
- Experience with computer vision or NLP`
      ]
    };

    const normalizedField = careerField.toLowerCase();
    for (const key in mockJobs) {
      if (normalizedField.includes(key) || key.includes(normalizedField)) {
        return mockJobs[key];
      }
    }

    // Generic fallback
    return [
      `Title: ${careerField}

Description: We are seeking a talented professional for this role.

Requirements:
- Bachelor's degree in relevant field
- Strong analytical and problem-solving skills
- Excellent communication abilities
- Ability to work in a team environment
- Attention to detail and organizational skills

Preferred:
- Advanced degree
- Industry certifications
- Previous experience in the field`
    ];
  }
}

module.exports = new JobScraperService();
