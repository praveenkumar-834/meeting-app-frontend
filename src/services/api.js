import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:5000/api"
baseURL: "https://meeting-app-backend-beta.vercel.app/api"
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("meetingUser"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;
