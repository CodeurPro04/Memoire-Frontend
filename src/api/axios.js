// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // ← /api ajouté
  withCredentials: false, // pas besoin si tu n’utilises pas les cookies
});


export default api;
