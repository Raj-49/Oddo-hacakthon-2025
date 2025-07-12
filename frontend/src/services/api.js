import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

export const questionsAPI = {
  getAll: (params = {}) => api.get('/questions', { params }),
  getById: (id) => api.get(`/questions/${id}`),
  create: (question) => api.post('/questions', question),
  update: (id, question) => api.put(`/questions/${id}`, question),
  delete: (id) => api.delete(`/questions/${id}`),
  vote: (id, vote) => api.post(`/questions/${id}/vote`, { vote }),
  search: (query) => api.get(`/questions/search?q=${query}`),
};

export const answersAPI = {
  getByQuestionId: (questionId) => api.get(`/questions/${questionId}/answers`),
  create: (questionId, answer) => api.post(`/questions/${questionId}/answers`, answer),
  update: (id, answer) => api.put(`/answers/${id}`, answer),
  delete: (id) => api.delete(`/answers/${id}`),
  vote: (id, vote) => api.post(`/answers/${id}/vote`, { vote }),
  markAsAccepted: (id) => api.patch(`/answers/${id}/accept`),
};

export const tagsAPI = {
  getAll: () => api.get('/tags'),
  getPopular: () => api.get('/tags/popular'),
  search: (query) => api.get(`/tags/search?q=${query}`),
};

export default api;
