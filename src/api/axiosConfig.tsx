// services/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    // "ngrok-skip-browser-warning": "true",
  },
  withCredentials: false,
  timeout: 30000, // 30 seconds timeout
});

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🚀 Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("❌ Axios Error:", error?.response?.data || error.message);

    // Handle 401 Unauthorized
    if (error?.response?.status === 401) {
      console.warn("⚠️ Token expired or invalid. Redirecting to login...");
      localStorage.clear();

      // ✅ Check if we're in browser environment
      if (typeof window !== "undefined") {
        // Avoid redirect loop if already on login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }

    // Handle 403 Forbidden
    if (error?.response?.status === 403) {
      console.warn("⚠️ Access forbidden");
      if (typeof window !== "undefined") {
        // window.location.href = '/unauthorized';
      }
    }

    // Handle 500 Server Error
    if (error?.response?.status >= 500) {
      console.error("🔥 Server error:", error.response.status);
      // يمكن إضافة toast notification هنا
    }

    // Handle Network Error (no connection)
    if (error.message === "Network Error") {
      console.error("🌐 Network Error: Check your internet connection");
      if (typeof window !== "undefined") {
        // يمكن إضافة toast notification للمستخدم
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
