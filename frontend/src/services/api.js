import axios from "axios";


const rawBackendUrl =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.BACKEND_URL ||
  (import.meta.env.DEV ? "http://localhost:3000" : "");

const cleanUrl = rawBackendUrl ? rawBackendUrl.trim().replace(/\/+$/, "") : "";
const baseURL = cleanUrl
  ? cleanUrl.endsWith("/api")
    ? cleanUrl
    : `${cleanUrl}/api`
  : "/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
