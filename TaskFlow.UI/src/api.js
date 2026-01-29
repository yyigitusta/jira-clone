import axios from 'axios';

// DİKKAT: Buradaki adresi kendi Swagger adresinle değiştir!
// Sonuna "/api" eklemeyi unutma.
const BASE_URL = 'https://localhost:32769/api'; 

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;