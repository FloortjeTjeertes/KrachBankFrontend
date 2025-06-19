import transaction from "../queries/transactions";
import UserService from "./UserService";
import { toPaginationFilter } from "@/filters/paginationFilter";



/**
 * Retrieves and enriches transactions for a specific account.
 *
 * @async
 * @function
 * @param {string} accountId - The ID of the account to fetch transactions for.
 * @returns {Promise<Object>} A promise that resolves to the transactions object with enriched transaction items.
 * @throws {Error} If no accountId is provided, if no transactions are found, or if an error occurs during fetching.
 */
async function getTransactionsForAccount(accountId) {
  try {
    if (!accountId) {
      throw Error("No accountId provided, returning empty array.");
    }
    const transactions = await transaction.fetchTransactionsForAccount(
      accountId
    );
    if (!transactions || transactions.length <= 0) {
      throw new Error("No transactions found for account");
    }
    const fullTransactions = await enrichTransactionsWithOwners(
      transactions.items
    );
    transactions.items = fullTransactions;
    return transactions;
  } catch (e) {
    throw new Error(e);
  }
}

/**
 * Sends a transaction after validating the provided transaction data.
 *
 * @async
 * @function
 * @param {Object} transactionData - The data for the transaction to be sent.
 * @throws {Error} If transactionData is not provided, validation fails, or the transaction fails to send.
 * @returns {Promise<Object>} The result of the transaction operation.
 */
async function sendTransaction(transactionData) {
  try {
    if (!transactionData) {
      throw new Error("transactionData is required.");
    }

    transactionData = validateNewTransaction(transactionData);

    const result = await transaction.addTransaction(transactionData);
    if (!result) {
      throw new Error(
        "Failed to send transaction"
      );
    }

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}
/**
 * Validates the data for creating a new transaction.
 *
 * @param {Object} transactionData - The transaction data to validate.
 * @param {number|string} transactionData.amount - The amount to be transferred. Must be a positive number.
 * @param {string} transactionData.senderIBAN - The IBAN of the sender.
 * @param {string} transactionData.receiverIBAN - The IBAN of the receiver.
 * @param {string} [transactionData.description] - Optional description for the transaction.
 * @throws {Error} If any required field is missing or invalid.
 * @returns {Object} The validated transaction data with keys: amount, sender, receiver, and description.
 */
function validateNewTransaction(transactionData) {
  if (
    !transactionData ||
    !transactionData.amount ||
    !transactionData.senderIBAN ||
    !transactionData.receiverIBAN
  ) {
    throw new Error("Invalid transaction data provided.");
  }

  if (isNaN(transactionData.amount) || transactionData.amount <= 0) {
    throw new Error("Transaction amount must be a positive number.");
  }
  if (transactionData.amount <= 0) {
    throw new Error("Transaction amount exceeds the limit of 1,000,000.");
  }
  //IBAN validation (tnx COPILOT)
  validateIban(transactionData.senderIBAN);
  validateIban(transactionData.receiverIBAN);
  return {
    amount: transactionData.amount,
    sender: transactionData.senderIBAN,
    receiver: transactionData.receiverIBAN,
    description: transactionData.description || "",
  };
}

/**
 * Validates the provided IBAN (International Bank Account Number) string.
 * Throws an error if the IBAN is invalid or does not match the expected format.
 *
 * @param {string} iban - The IBAN to validate.
 * @returns {string} The validated IBAN.
 * @throws {Error} If the IBAN is not a string or does not match the IBAN format.
 */
function validateIban(iban) {
  if (!iban || typeof iban !== "string") {
    throw new Error("Invalid IBAN provided.");
  }
  // Basic IBAN format validation
  const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;
  if (!ibanRegex.test(iban)) {
    throw new Error("Invalid IBAN format.");
  }
  return iban;
}

/**
 * Retrieves transactions for a specific user, applies pagination, and enriches each transaction with owner information.
 *
 * @async
 * @function
 * @param {string} userId - The ID of the user whose transactions are to be fetched.
 * @param {Object} pagination - Pagination options to filter the transactions.
 * @returns {Promise<Object>} The paginated transactions object with enriched transaction items.
 * @throws {Error} If no userId is provided, if no transactions are found, or if an error occurs during fetching.
 */
async function getTransactionsByUserId(userId, pagination,filter) {
  try {
    if (!userId) {
      throw new Error("No userId provided, returning empty array.");
    }    

    const validatedPagination = toPaginationFilter(pagination);
    
      const transactions = await transaction.fetchUserTransactions(
        userId,
        filter,
        validatedPagination.page,
        validatedPagination.limit
      );
      if (!transactions || transactions.length <= 0) {
        throw new Error("No transactions found", userId);
      }
      const fullTransactions = await enrichTransactionsWithOwners(transactions.items);
      transactions.items = fullTransactions;
      return transactions;
    
  } catch (e) {
    throw new Error(e);
  }
}

/**
 * Enriches an array of transaction objects by replacing the `initiator` field
 * with the corresponding user object fetched by ID.
 *
 * @async
 * @function
 * @param {Array<Object>} transactions - The array of transaction objects to enrich. Each transaction should have an `initiator` property containing a user ID.
 * @returns {Promise<Array<Object>>} A promise that resolves to a new array of transactions with the `initiator` property replaced by the user object.
 */
async function enrichTransactionsWithOwners(transactions) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return [];
  }
  return Promise.all(
    transactions.map(async (transaction) => {
      const owner = await UserService.getUserById(transaction.initiator);
      if (!owner) {
        console.warn("User not found for transaction");
      }
      transaction.initiator = owner;
      return transaction;
    })
  );
}

export default {
  getTransactionsForAccount,
  sendTransaction,
  getTransactionsByUserId,
};
