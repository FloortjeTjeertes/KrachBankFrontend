import accounts from "../queries/accounts";
import UserService from "./UserService";
//TODO: maybe this should be moved to a store or a separate transaction service

async function getAccounts(userId, filter) {
  console.log("getAccounts called with userId:", userId, "and filter:", filter);
  if (userId == null || userId <= 0) {
    console.warn("No userId provided, returning empty array");
    return [];
  }

  try {
    const response = await accounts.fetchAccountsForUser(userId, filter);
    if (!response || response.length === 0) {
      console.warn("No accounts found for userId:", userId);
      return [];
    }

    const fullAccounts = await Promise.all(
      response.map(async (account) => {
        const owner = await UserService.getUserById(account.owner);
        if (!owner) {
          console.warn("User not found for account:", account.id);
        }
        return { ...account, owner };
      })
    );

    return fullAccounts;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error; // Re-throw the error for further handling
  }
}

async function getAccountByIban(iban) {
  try {
    console.log("getAccountByIban called with iban:", iban);
    if (!iban) {
      throw new Error("IBAN is required");
    }
    const response = await accounts.fetchAccountByIban(iban);
    if (!response) {
        throw new Error("No account found for the provided IBAN");
    }

    const owner = await UserService.getUserById(response.owner);
    if (!owner) {
        throw new Error("Owner not found for the account");
    }

    return { ...response, owner };
  } catch (error) {
    console.error("Error fetching account by IBAN:", error);
    throw error; // Re-throw the error for further handling
}
}

export default {
  getAccounts,
  getAccountByIban,
};
