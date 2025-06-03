
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
export const fetchAccountById = async (Iban) => {
  const response = await api.get(`/accounts/${Iban}`);
  return response.data;
};

// create a new account
export const createAccount = async (accountData) => {
  const response = await api.post("/accounts", accountData);
  return response.data;
};

export const fetchAccountsForUser = async (userId, filter) => {
  if (!filter) {
    filter = {};
  }
  filter = filterIsValid(filter); // Validate the filter
  filter.userId = userId; // Ensure the filter includes the userId
  const response = await api.get(`/users/${userId}/accounts`,
    {
      params: filter, // Pass the filter as query parameters
    }
  );
  return response.data;
};

function filterIsValid(filter) {

  if(!filter.Iban || typeof filter.Iban !== 'string') {
   delete filter.Iban;
  }
  if(!filter.userId || typeof filter.userId !== 'int') {
    delete filter.userId;
  }
  if(!filter.balance || typeof filter.balance !== 'number') {
    delete filter.balance;
  }
  
  return filter;
}


export default {
  fetchAccounts,
  fetchAccountById,
  createAccount,
  fetchAccountsForUser,
};
