import axios from "axios";


const api = axios.create({
  // baseURL: "https://virtserver.swaggerhub.com/floorje/Krachbank/1.0.0", // Change to your backend URL
  baseURL: "http://localhost:8080/api", // Change to your backend URL
  // You can add headers or interceptors here if needed
  headers: {
    "Content-Type": "application/json",
  },
  //baseURL: "https://virtserver.swaggerhub.com/floorje/Krachbank/1.0.0", // Change to your backend URL
  // baseURL: "http://localhost:8080", // Change to your backend URL

  // You can add headers or interceptors here if needed
});

//get the token from local storage and add it to the request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")||sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default api;