import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use(
  (config) => {
    try {
      const auth = JSON.parse(localStorage.getItem('auth'));
      if (auth?.token) {
        // Log the actual header being sent
        console.log('Sending request with token:', auth.token.substring(0, 20) + '...');
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// Don't immediately clear auth on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message,
      headers: error.config?.headers
    });
    return Promise.reject(error);
  }
);

export default api;