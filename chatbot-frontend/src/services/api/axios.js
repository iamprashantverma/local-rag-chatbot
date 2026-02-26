import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error("Server is unavailable. Please try again later.");
    } else {
      const message = error.response.data?.detail ||error.response.data?.message || "Something went wrong.";
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default api;