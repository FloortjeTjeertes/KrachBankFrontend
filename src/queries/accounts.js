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

// fetch a single account by IBAN
export const fetchAccountByIban = async (Iban) => {
  try {
    const response = await api.get(`/accounts/${Iban}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching account with IBAN ${Iban}:`, error);
    throw error;
  }
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

/**
 * Updates specified fields for an account.
 * This method now uses POST and targets the new /accounts/{iban}/limits endpoint.
 * Your backend must be configured to handle POST requests to this endpoint for updates.
 * @param {string} iban - The IBAN of the account to update.
 * @param {object} data - An object containing the fields to update (e.g., { transactionLimit: 1000, absoluteLimit: 5000 }).
 * @returns {Promise<object>} The updated account data.
 */
export const updateAccount = async (iban, data) => {
  // Endpoint path to match the new backend controller mapping.
  // Ensure your backend's /accounts/{iban}/limits endpoint expects a POST for updates.
  const response = await api.post(`/accounts/${iban}/limits`, data);
  return response.data;
};

export default {
  fetchAccounts,
  fetchAccountByIban,
  createAccount,
  fetchAccountsForUser,
  updateAccount, // Export the updated updateAccount
};
