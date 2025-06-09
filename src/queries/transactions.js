
import api from "./axios";

// Fetch all transactions
export const fetchTransactions = async () => {
  const response = await api.get("/transactions");
 
  return validateResponse(response);
};

// Add a new transaction
export const addTransaction = async (transaction) => {
  console.log("Adding transaction:", transaction);
  const response = await api.post("/transactions", transaction);

  return validateResponse(response);
};

// fetch user transactions
export const fetchUserTransactions = async (userId) => {
  const response = await api.get(`/users/${userId}/transactions`);

  return validateResponse(response);
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
  return validateResponse(response);
};

function validateResponse(response) {
  console.log("Validating response:", response.status);
  if (!response || !response.data) {
    throw new Error("Invalid response from server.");
  }
  if (response.status !== 200 && response.status !== 201) {
    throw new Error(`Error: ${response.status} - ${response.data}`);
  }
  
  return response.data;
}


export default {
  fetchTransactions,
  addTransaction,
  fetchUserTransactions,
  fetchTransactionsForAccount

};