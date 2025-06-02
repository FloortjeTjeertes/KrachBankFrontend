
import api from "./axios";

// Fetch all transactions
export const fetchTransactions = async () => {
  const response = await api.get("/transactions");
  return response.data;
};

// Add a new transaction
export const addTransaction = async (transaction) => {
  const response = await api.post("/transactions", transaction);
  return response.data;
};

// fetch user transactions
export const fetchUserTransactions = async (userId) => {
  const response = await api.get(`/users/${userId}/transactions`);
  return response.data;
};

export const fetchUserTransactionsForAccount = async (userId,Iban) => {
  const response = await api.get(`/users/${userId}/transactions`, {
    params: {IBAN: Iban}
  });
  return response.data;
};

export const fetchTransactionsForAccount = async (Iban) => {
  const response = await api.get(`/transactions`, {
    params: {IBAN: Iban}
  });
  return response.data;
};

export default {
  fetchTransactions,
  addTransaction,
  fetchUserTransactions,
};