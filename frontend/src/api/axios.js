import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ascend-backend.onrender.com/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ascend_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
