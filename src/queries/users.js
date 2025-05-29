import api from 'axios';
// fetch all users
export const fetchUsers = async () => {
    const response = await api.get("/users");
    return response.data;
  };

// create a new user
export const createUser = async (userData) => {
    console.log("Creating user with data:", userData);
    const response = await api.post("/users", userData);
    return response.data;
  };

export const login = async (credentials) => {
  console.log("Logging in with credentials:", credentials);
  const response = await api.post('/auth/login', credentials);
  return response.data;
};
  

// fetch a single user by ID
export const fetchUserById = async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  };

// update a user
export const updateUser = async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  };

// delete a user
export const deleteUser = async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  };

  // verify user
export const verifyUser = async (userId) => {
    const response = await api.post(`/users/${userId}/verify`);
    return response.data;
  };