import api from "../queries/axios";
// fetch all users
export const fetchUsers = async () => {
    const response = await api.get("/users");
    return response.data;
  };

// create a new user
export const createUser = async (userData) => {
    const response = await api.post("/users", userData);
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