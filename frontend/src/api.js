
// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://mern-authentication-backend-ma24.onrender.com/api", // change to your backend URL
  withCredentials: true // ✅ ensures cookies/session are sent
});

export default api;
