import api from "../queries/axios";
// fetch all users, with optional filters as query params
export const fetchUsers = async (filters = {}) => {
    // filters is an object, e.g. { email: 'test@example.com', firstName: 'John' }
    const response = await api.get("/users", { params: filters });
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