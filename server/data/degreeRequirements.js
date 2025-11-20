/**
 * Degree requirements for various UW Madison majors
 * Data structure based on UW Madison Guide requirements
 */

const requirements = {
  'Computer Science': {
    major: 'Computer Science',
    total_credits: 120,
    required: [
      'CS 200', 'CS 220', 'CS 300', 'CS 400', 'CS 354', 'CS 367',
      'CS 540', 'CS 564', 'CS 577',
      'MATH 221', 'MATH 222', 'MATH 234', 'MATH 340',
      'STAT 340'
    ],
    electives: {
      categories: [
        {
          name: 'CS Electives',
          subjects: ['CS'],
          credits_needed: 15,
          level: 'advanced'
        }
      ]
    },
    breadth: [
      { name: 'Humanities', subjects: ['ENGLISH', 'HISTORY', 'PHILOSOPHY'], credits: 6 },
      { name: 'Social Science', subjects: ['ECON', 'PSYCH', 'SOC'], credits: 6 },
      { name: 'Natural Science', subjects: ['PHYSICS', 'CHEM', 'BIOLOGY'], credits: 6 }
    ]
  },

  'Data Science': {
    major: 'Data Science',
    total_credits: 120,
    required: [
      'CS 220', 'CS 300', 'CS 400',
      'STAT 240', 'STAT 340', 'STAT 341', 'STAT 451',
      'MATH 221', 'MATH 222', 'MATH 234', 'MATH 340',
      'COMP SCI 540', 'COMP SCI 560'
    ],
    electives: {
      categories: [
        {
          name: 'Data Science Electives',
          subjects: ['STAT', 'CS', 'MATH'],
          credits_needed: 12
        }
      ]
    },
    breadth: [
      { name: 'Humanities', subjects: ['ENGLISH', 'HISTORY', 'PHILOSOPHY'], credits: 6 },
      { name: 'Social Science', subjects: ['ECON', 'PSYCH', 'SOC'], credits: 6 }
    ]
  },

  'Electrical Engineering': {
    major: 'Electrical Engineering',
    total_credits: 128,
    required: [
      'ECE 203', 'ECE 230', 'ECE 320', 'ECE 330', 'ECE 352',
      'MATH 221', 'MATH 222', 'MATH 234', 'MATH 320',
      'PHYSICS 201', 'PHYSICS 202',
      'CHEM 103'
    ],
    electives: {
      categories: [
        {
          name: 'ECE Electives',
          subjects: ['ECE'],
          credits_needed: 18
        }
      ]
    },
    breadth: [
      { name: 'Humanities', subjects: ['ENGLISH', 'HISTORY', 'PHILOSOPHY'], credits: 6 },
      { name: 'Social Science', subjects: ['ECON', 'PSYCH'], credits: 6 }
    ]
  },

  'Business': {
    major: 'Business',
    total_credits: 120,
    required: [
      'ECON 101', 'ECON 102',
      'MATH 211', 'MATH 221',
      'STAT 301',
      'ACCT 100', 'ACCT 211',
      'FIN 300', 'FIN 320',
      'MKTG 300',
      'OTM 210', 'OTM 335'
    ],
    electives: {
      categories: [
        {
          name: 'Business Electives',
          subjects: ['FIN', 'MKTG', 'ACCT', 'OTM', 'MGMT'],
          credits_needed: 24
        }
      ]
    },
    breadth: [
      { name: 'Humanities', subjects: ['ENGLISH', 'HISTORY', 'PHILOSOPHY'], credits: 9 },
      { name: 'Natural Science', subjects: ['PHYSICS', 'CHEM', 'BIOLOGY'], credits: 6 }
    ]
  },

  'Mathematics': {
    major: 'Mathematics',
    total_credits: 120,
    required: [
      'MATH 221', 'MATH 222', 'MATH 234',
      'MATH 320', 'MATH 340', 'MATH 341',
      'MATH 375', 'MATH 421', 'MATH 521',
      'CS 220'
    ],
    electives: {
      categories: [
        {
          name: 'Math Electives',
          subjects: ['MATH'],
          credits_needed: 18,
          level: 'advanced'
        }
      ]
    },
    breadth: [
      { name: 'Humanities', subjects: ['ENGLISH', 'HISTORY', 'PHILOSOPHY'], credits: 6 },
      { name: 'Social Science', subjects: ['ECON', 'PSYCH', 'SOC'], credits: 6 },
      { name: 'Natural Science', subjects: ['PHYSICS', 'CHEM'], credits: 6 }
    ]
  }
};

class DegreeRequirements {
  /**
   * Get requirements for a specific major
   * @param {string} major - Major name
   * @returns {Object} Requirements object
   */
  getRequirements(major) {
    return requirements[major] || this.getDefaultRequirements(major);
  }

  /**
   * Get default requirements for unknown majors
   * @param {string} major - Major name
   * @returns {Object} Default requirements
   */
  getDefaultRequirements(major) {
    return {
      major,
      total_credits: 120,
      required: [],
      electives: {
        categories: [
          { name: 'Major Electives', subjects: [], credits_needed: 30 }
        ]
      },
      breadth: [
        { name: 'Humanities', subjects: ['ENGLISH', 'HISTORY', 'PHILOSOPHY'], credits: 6 },
        { name: 'Social Science', subjects: ['ECON', 'PSYCH', 'SOC'], credits: 6 },
        { name: 'Natural Science', subjects: ['PHYSICS', 'CHEM', 'BIOLOGY'], credits: 6 }
      ]
    };
  }

  /**
   * Get list of available majors
   * @returns {Array} Major names
   */
  getAvailableMajors() {
    return Object.keys(requirements);
  }
}

module.exports = new DegreeRequirements();
