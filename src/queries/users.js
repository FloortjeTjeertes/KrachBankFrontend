import api from './axios';

// fetch all users, with optional search/filter params
// params can include: email, firstName, lastName, createdBefore, createdAfter, active, verified, etc.
export const fetchUsers = async (params = {}) => {
    // Only send keys that are defined (not undefined/null)
    const filteredParams = {};
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
            filteredParams[key] = params[key];
        }
    });
    const response = await api.get("/users", { params: filteredParams });
    return response.data;
  };

// create a new user
export const createUser = async (userData) => {
    // Ensure dailyLimit is set
    if (!userData.dailyLimit) userData.dailyLimit = userData.transferLimit;
    console.log("Creating user with data:", userData);
    const response = await api.post("/auth/register", userData);
    return response.data;
  };

export const login = async (credentials) => {
  console.log("Logging in with credentials:", credentials);
  const response = await api.post('/auth/login', credentials);
  if (
    typeof response.data !== "object" ||
    !response.data.token
  ) {
    throw new Error(
      typeof response.data === "string"
        ? "Login failed: " + response.data
        : "Login failed: Invalid response from server"
    );
  }
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

export default {
  fetchUsers,
  createUser,
  fetchUserById,
  updateUser,
  deleteUser,
  verifyUser
};