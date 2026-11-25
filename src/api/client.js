import axios from 'axios';

// Transactional/application data remains on the NEXORA JSON REST backend.
// Product catalogue data is fetched separately through productApi.js.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export default API_URL;
