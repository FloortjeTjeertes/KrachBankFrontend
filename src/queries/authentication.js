

import api from "./axios";

// fetch login details
export const login = async () => {
    const response = await api.post("/authenticate/login");
    return response.data;
  };

// register a new user
export const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  };