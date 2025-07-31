import axios from "axios";

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

console.log("🔗 API Base URL:", API_BASE_URL);

const instance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000, // 30 second timeout for Render cold starts
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );

    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
instance.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      timeout: error.code === "ECONNABORTED",
    });

    // Handle different error types
    if (error.code === "ECONNABORTED") {
      console.error("⏰ Request timeout - server may be starting up");
    }

    if (error.response?.status === 401) {
      console.log("🔒 Unauthorized - clearing user data");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default instance;
