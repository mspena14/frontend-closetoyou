import axios from 'axios';

const api = axios.create({
  baseURL: 'https://close-to-you-backend-ox91.onrender.com/api',
});

export default api;
