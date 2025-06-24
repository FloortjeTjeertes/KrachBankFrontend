import api from "./axios";

// Fetch all transactions
export const fetchTransactions = async (filter, page, limit) => {
  if (!filter) {
    filter = {};
  }

  if (page != null && limit != null) {
    filter.page = page;
    filter.limit = limit;
  }

  // Remove keys with empty string values
  const cleanedFilter = Object.fromEntries(
    Object.entries(filter).filter(
      ([_, value]) => value !== "" && value !== null && value !== undefined
    )
  );

  const response = await api.get("/transactions", {
    params: cleanedFilter,
  });

  return validateResponse(response);
};

// Add a new transaction
export const addTransaction = async (transaction) => {
  try{
  const response = await api.post("/transactions", transaction);

  return validateResponse(response);
  }
  catch (error) {
    throw new Error(error.response.data.message);
  }
};

// fetch user transactions
export const fetchUserTransactions = async (userId,filter,page,limit) => {

  try {
      console.log("filter",filter);

    if (!filter) {
    filter = {};
  }
  if (page && limit) {
    filter.page = page; 
    filter.limit = limit;
  }
  const response = await api.get(`/users/${userId}/transactions`,
    {
      params: filter, 
    }
  );

  return validateResponse(response);
  } catch (error) {
    throw new Error(error.response.data.message);
  }
  
};

export const fetchUserTransactionsForAccount = async (userId,filter,Iban,page,limit) => {
    if (!filter) {
    filter = {};
  }
  if(page && limit) {
    filter.page = page; 
    filter.limit = limit;
  }
  filter.IBAN = Iban; 
  const response = await api.get(`/users/${userId}/transactions`, {
    params: filter 
  });
  return response.data;
};

export const fetchTransactionsForAccount = async (Iban,filter,page,limit) => {
  if (!filter) {
    filter = {};
  }
  if (page && limit) {
    filter.page = page; 
    filter.limit = limit;
  }
  const response = await api.get(`/accounts/${Iban}/transactions`, {
    params: filter 
  });
  return validateResponse(response);
};

function validateResponse(response) {
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