import accounts from "../queries/accounts";
import UserService from "./UserService";
//TODO: maybe this should be moved to a store or a separate transaction service

async function getAccounts(userId, filter, pagination) {
  if (userId == null || userId <= 0) {
    throw new "No userId provided, returning empty array"();
  }

  try {
    const validatedFilter = ValidateFilter(filter);
    const validatedPagination = validatePagination(pagination);
    const response = await accounts.fetchAccountsForUser(
      userId,
      validatedFilter,
      validatedPagination.page,
      validatedPagination.limit
    );
    if (!response || response.length === 0) {
      throw new ("No accounts found for userId:", userId)();
    }

    const fullAccounts = enrichAccountsWithOwners(response);

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

async function getAllAccounts(filter, pagination) {
  try {
    const validatedFilter = ValidateFilter(filter);
    const validatedPagination = validatePagination(pagination);
    const response = await accounts.fetchAccounts(validatedFilter, validatedPagination.page, validatedPagination.limit);
    if (!response || response.length === 0) {
      throw new Error("No accounts found");
    }
    console.log("Accounts fetched successfully:", response);
    const fullAccounts = enrichAccountsWithOwners(response);
    return fullAccounts;

  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
}

function ValidateFilter(filter) {
  if (!filter) {
    return {};
  }
  return {
    id: filter.id || null,
    iban: filter.iban || null,
    balanceMin: filter.balance?.min || null,
    balanceMax: filter.balance?.max || null,
    accountType: filter.accountType || null,
  };
}

function validatePagination(pagination) {
  if (!pagination) {
    return { };
  }
  return {
    page: pagination.page,
    limit: pagination.limit,
  };
}


async function enrichAccountsWithOwners(accountsList) {
  if (!Array.isArray(accountsList) || accountsList.length === 0) {
    return [];
  }

  return Promise.all(
    accountsList.map(async (account) => {
      const owner = await UserService.getUserById(account.owner);
      if (!owner) {
        console.warn("User not found for account:", account.id);
      }
      return { ...account, owner };
    })
  );
}


export default {
  getAccounts,
  getAccountByIban,
  getAllAccounts,
};
