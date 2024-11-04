import axios from 'axios';

const baseURL =
  `${process.env.API_URL || ''}${process.env.BASE_URL || ''}` ||
  'http://localhost:4000/api/v1';

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export default api;
