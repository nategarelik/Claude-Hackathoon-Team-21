import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const careerAPI = {
  analyzeCareer: async (careerField) => {
    const response = await api.post('/career/analyze', { careerField });
    return response.data;
  },
};

export const courseAPI = {
  getAllCourses: async (params = {}) => {
    const response = await api.get('/courses', { params });
    return response.data;
  },

  getSubjects: async () => {
    const response = await api.get('/courses/subjects');
    return response.data;
  },

  getMajors: async () => {
    const response = await api.get('/courses/majors');
    return response.data;
  },

  getMajorRequirements: async (major) => {
    const response = await api.get(`/courses/majors/${encodeURIComponent(major)}/requirements`);
    return response.data;
  },
};

export const recommendationAPI = {
  generateRecommendations: async (data) => {
    const response = await api.post('/recommendations/generate', data);
    return response.data;
  },
};

export const transcriptAPI = {
  uploadTranscript: async (file) => {
    const formData = new FormData();
    formData.append('transcript', file);

    const response = await api.post('/transcript/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  parseManualInput: async (courseText) => {
    const response = await api.post('/transcript/parse-manual', { courseText });
    return response.data;
  },
};

export default api;
