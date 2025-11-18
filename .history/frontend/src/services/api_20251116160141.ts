// frontend/src/services/api.ts
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// A simple in-memory reference to the auth token (keeps header during initial load)
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

// request interceptor to attach token
api.interceptors.request.use((config) => {
  const token = accessToken ?? localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// response interceptor: on 401, just throw — let consumer handle logout flow
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // optionally attach more global logic (refresh tokens) here
    return Promise.reject(err);
  }
);

export default api;
