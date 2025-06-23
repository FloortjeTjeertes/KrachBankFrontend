import { toAccountFilter } from "../filters/accountFilter";
import api from "./axios";

// fetch accounts

export const fetchAccounts = async (filter, page, limit) => {
  if (!filter) {
    filter = {};
  }
  if (page && limit) {
    filter.page = page; // Add pagination parameters
    filter.limit = limit;
  }
  const response = await api.get("/accounts", {
    params: filter, // Pass the filter as query parameters
  });
  return response.data;
};
// fetch a single account by ID
export const fetchAccountByIban = async (Iban) => {
  try{
  const response = await api.get(`/accounts/${Iban}`);
      }
      catch{
        console.error(`Error fetching account with IBAN ${iban}:`, error);
        throw error;
      }
  return response.data;
};

// create a new account (single or batch)
export const createAccount = async (accountData) => {
  // accountData can be a single object or an array of objects
  const response = await api.post("/accounts", accountData);
  return response.data;
};

export const fetchAccountsForUser = async (userId, filter, page, limit) => {
  if (!filter) {
    filter = {};
  }
  filter = toAccountFilter(filter); // Validate the filter
  if (page && limit) {
    filter.page = page; // Add pagination parameters
    filter.limit = limit;
  }
  const response = await api.get(`/users/${userId}/accounts`, {
    params: filter, // Pass the filter as query parameters
  });
  return response.data;
};

export default {
  fetchAccounts,
  fetchAccountByIban,
  createAccount,
  fetchAccountsForUser
};
