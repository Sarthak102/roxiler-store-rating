import axios from "axios";

// Prefer env, but ALWAYS fall back to Render backend (NOT /api)
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://roxiler-store-rating-ruki.onrender.com/api";

console.log("API_BASE =>", API_BASE); // temporary debug

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor - read token from localStorage each time (robust across reloads)
api.interceptors.request.use((config) => {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

// Response interceptor - pass through; consumer handles errors
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default api;
