import axios from 'axios';

const api = axios.create({
  baseURL: 'https://portal.flaneurglobal.com/api/index.php',
  headers: {
    'Content-Type': 'application/json',
  },
});

// For cross-compatibility with your existing PHP which handles both JSON and POST
api.interceptors.request.use((config) => {
    // If it's a GET request, we append the pin and timestamp as query params
    // If it's a POST, we send as JSON (which your php://input handles)
    return config;
});

export default api;
