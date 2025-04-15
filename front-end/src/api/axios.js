import axios from "axios";
import { baseURL } from "./Api";
import Cookies from "js-cookie";

// Create Axios instance
export const Axios = axios.create({
  baseURL: baseURL,
});

// Add a request interceptor
Axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
