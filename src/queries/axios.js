import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // Change to your backend URL
  // You can add headers or interceptors here if needed
});

export default api;