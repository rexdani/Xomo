import axios from "axios";

// Auto-detect current host (local PC LAN IP)
const host = window.location.hostname;

// Your Spring Boot port
const backendPort = 8081;

// Build backend URL dynamically
const baseURL = `${BASE_URL}`;

console.log("🔗 Backend Connected:", baseURL);

const API = axios.create({
  baseURL: baseURL,
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("xomo_token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
