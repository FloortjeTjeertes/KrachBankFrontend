// fetch accounts
export const fetchAccounts = async () => {
    const response = await api.get("/accounts");
    return response.data;
  }
// fetch a single account by ID
export const fetchAccountById = async (Iban) => {
    const response = await api.get(`/accounts/${Iban}`);
    return response.data;
  }

// create a new account
export const createAccount = async (accountData) => {
    const response = await api.post("/accounts", accountData);
    return response.data;
  };