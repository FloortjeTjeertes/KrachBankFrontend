import accounts from "../queries/accounts"; // This import is correct
import UserService from "./UserService"; // Assuming this service exists and works
//TODO: maybe this should be moved to a store or a separate transaction service

/**
 * Retrieves a list of accounts for a given user, with optional filtering and pagination.
 *
 * @async
 * @function getAccounts
 * @param {number|string} userId - The unique identifier of the user whose accounts are to be fetched.
 * @param {Object} [filter] - Optional filter criteria to apply (e.g., account type, status).
 * @param {Object} [pagination] - Optional pagination settings.
 * @param {number} [pagination.page] - The page number to retrieve.
 * @param {number} [pagination.limit] - The number of accounts per page.
 * @returns {Promise<Array>} A promise that resolves to an array of account objects.
 * @throws {Error} If no userId is provided or if an error occurs during fetching.
 *
 * @example
 * // Fetch all accounts for user 123, first page, 10 per page
 * * const accounts = await getAccounts(123, {}, { page: 1, limit: 10 });
 */
async function getAccounts(userId, filter, pagination) {
  if (userId == null || userId <= 0) {
    throw new Error("No userId provided, returning empty array"); // Changed from throwing a raw string
  }
  // const validatedFilter = ValidateFilter(filter); TODO: implement filter validation
  const validatedPagination = validatePagination(pagination);
  const response = await accounts.fetchAccountsForUser(
    userId,
    filter,
    validatedPagination.page,
    validatedPagination.limit
  );
  if (!response || response.length <= 0) { // Check response.items or response.content if it's paginated
    throw new Error("No accounts found for userId:", userId);
  }

  const fullAccounts = await enrichAccountsWithOwners(response.items); // Assuming response.items contains the account array
  response.items = fullAccounts; // Reassign the enriched items

  return response;
}

/**
 * Retrieves an account by its IBAN and fetches the owner's user details.
 *
 * @async
 * @function
 * @param {string} iban - The International Bank Account Number (IBAN) of the account to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the account object with the owner's details included.
 * @throws {Error} If the IBAN is not provided, the account is not found, or the owner is not found.
 */
async function getAccountByIban(iban) {
  try {
    if (!iban) {
      throw new Error("IBAN is required");
    }
    const response = await accounts.fetchAccountByIban(iban);
    if (!response) {
      throw new Error("No account found for the provided IBAN");
    }

    const fullAccounts = await enrichAccountsWithOwners([response]);

    response.items = fullAccounts[0]; // Assuming response is an object with items property
    return response;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error for further handling
  }
}

/**
 * Retrieves all accounts based on the provided filter and pagination options.
 * Enriches each account with its owner information.
 *
 * @async
 * @param {Object} filter - The filter criteria for fetching accounts.
 * @param {Object} pagination - The pagination options.
 * @param {number} pagination.page - The page number to retrieve.
 * @param {number} pagination.limit - The number of accounts per page.
 * @returns {Promise<Object>} The paginated response containing enriched account items.
 * @throws {Error} If no accounts are found.
 */
async function getAllAccounts(filter, pagination) {
  // const validatedFilter = ValidateFilter(filter); TODO: implement filter validation
  const validatedPagination = validatePagination(pagination);
  const response = await accounts.fetchAccounts(
    filter,
    validatedPagination.page,
    validatedPagination.limit
  );
  if (!response || response.items.length === 0) { // Check response.items for length
    throw new Error("No accounts found");
  }
  const fullAccounts = await enrichAccountsWithOwners(response.items);

  response.items = fullAccounts;
  return response;
}

/**
 * Validates and formats a pagination object.
 *
 * @param {Object} pagination - The pagination object to validate.
 * @param {number} pagination.page - The current page number.
 * @param {number} pagination.limit - The number of items per page.
 * @returns {Object} An object containing the page and limit properties if pagination is provided, otherwise an empty object.
 */
function validatePagination(pagination) {
  if (!pagination) {
    return {};
  }
  return {
    page: pagination.page,
    limit: pagination.limit,
  };
}

/**
 * Enriches an array of account objects by replacing the `owner` property (user ID)
 * with the corresponding user object fetched from the UserService.
 *
 * @async
 * @function
 * @param {Array<Object>} accountObject - Array of account objects, each containing an `owner` property (user ID).
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of account objects with the `owner` property replaced by the user object or `null` if not found.
 */
async function enrichAccountsWithOwners(accountObject) {
  if (!Array.isArray(accountObject) || accountObject.length === 0) {
    return [];
  }

  return Promise.all(
    accountObject.map(async (account) => {
      const owner = await UserService.getUserById(account.owner);

      account.owner = owner || null; // Ensure owner is set to null if not found
      return account;
    })
  );
}

/**
 * Updates the transaction limit and/or absolute limit for an account.
 * This function now accepts an object with limitsData.
 * @param {string} iban - The IBAN of the account to update.
 * @param {object} limitsData - An object containing the limits to update (e.g., { transactionLimit: 1000, absoluteLimit: 5000 }).
 * @returns {Promise<object>} The updated account data.
 */
async function updateAccountLimits(iban, limitsData) {
  try {
    if (!iban) {
      throw new Error("IBAN is required to update the account.");
    }
    // Validate transactionLimit if provided
    if (limitsData.transactionLimit !== undefined && (typeof limitsData.transactionLimit !== 'number' || limitsData.transactionLimit < 0)) {
      throw new Error("New transaction limit must be a non-negative number.");
    }

    // Validate absoluteLimit if provided: must be a number and 0 or lower.
    if (limitsData.absoluteLimit !== undefined && (typeof limitsData.absoluteLimit !== 'number' || limitsData.absoluteLimit > 0)) {
      throw new Error("New absolute limit must be 0 or lower.");
    }

    // Call the updated accounts.updateAccount which now sends POST to /accounts/{iban}
    const updatedAccount = await accounts.updateAccount(iban, limitsData); // Pass the limitsData object directly

    if (!updatedAccount) {
      throw new Error("Failed to update account limits.");
    }
    return updatedAccount;
  } catch (error) {
    console.error("Error updating account limits in service:", error);
    // Re-throw a generic error message if the specific error message is not helpful
    throw new Error(error.message || "Failed to update account limits.");
  }
}

export default {
  getAccounts,
  getAccountByIban,
  getAllAccounts,
  updateAccountLimits, // Export the renamed and updated function
};
