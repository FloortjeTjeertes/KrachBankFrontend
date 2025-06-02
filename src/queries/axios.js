import axios from "axios";

const api = axios.create({
  // baseURL: "https://virtserver.swaggerhub.com/floorje/Krachbank/1.0.0", // Change to your backend URL
  baseURL: "http://localhost:8080/api", // Change to your backend URL

  // You can add headers or interceptors here if needed
});

export default api;