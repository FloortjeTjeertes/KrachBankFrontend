import { toAccountFilter } from "../filters/accountFilter";
import api from "./axios";



// fetch accounts

export const fetchAccounts = async (filter) => {
  if (!filter) {
    filter = {};
  }
  const response = await api.get("/accounts");
  return response.data;
};
// fetch a single account by ID
export const fetchAccountByIban = async (Iban) => {
  const response = await api.get(`/accounts/${Iban}`);
  return response.data;
};

// create a new account (single or batch)
export const createAccount = async (accountData) => {
  // accountData can be a single object or an array of objects
  const response = await api.post("/accounts", accountData);
  return response.data;
};

export const fetchAccountsForUser = async (userId, filter) => {
  if (!filter) {
    filter = {};
  }
  filter = toAccountFilter(filter); // Validate the filter
  const response = await api.get(`/users/${userId}/accounts`,
    {
      params: filter, // Pass the filter as query parameters
    }
  );
  return response.data;
};






export default {
  fetchAccounts,
  fetchAccountByIban,
  createAccount,
  fetchAccountsForUser,
};
