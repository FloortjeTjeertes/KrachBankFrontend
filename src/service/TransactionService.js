import transaction from "../queries/transactions";
import UserService from "./UserService";

async function getTransactionsForAccount(accountId) {
  try {
    if (!accountId) {
      throw Error("No accountId provided,returning empty array.");
    }
    const transactions = await transaction.fetchTransactionsForAccount(
      accountId
    );
    if (!transactions || transactions.length <= 0) {
      throw new Error("No transactions found for account: " + accountId);
    }
    const fullTransactions = await enrichTransactionsWithOwners(transactions);
    return fullTransactions;
  } catch (e) {
    throw new Error("Error fetching transactions for account: " + accountId, e);
  }
}

async function sendTransaction(transactionData) {
  try {
    if (!transactionData ) { 
      throw new Error("transactionData is required.");
    }
   
     transactionData = validateNewTransaction(transactionData);

    const result = await transaction.addTransaction(transactionData);
    console.log("Transaction result:", result);
    if (!result ) {
      throw new Error("Failed to send transaction no value received: " + result.data);
    }

    return result;
  } catch (error) {
    throw new Error( error.message);
  }
}
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
  if(transactionData.amount <= 0) {
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



async function getTransactionsByUserId(userId, pagination) {
  try {
    if (!userId) {
      throw new Error("No userId provided, returning empty array.");
    }
    const validatedPagination = validatePagination(pagination);
    const transactions = await transaction.fetchUserTransactions(userId);
    if (!transactions || transactions.length <= 0) {
      throw new Error("No transactions found for user: " + userId);
    }
    const fullTransactions =  await enrichTransactionsWithOwners(transactions);
    return fullTransactions;
  } catch (e) {
    throw new Error("Error fetching transactions for user: " + userId, e);
  }
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

async function enrichTransactionsWithOwners(transactions){
    if (!Array.isArray(transactions) || transactions.length === 0) {
    return [];
  }
  return Promise.all(
    transactions.map(async (transaction) => {
        const owner = await UserService.getUserById(transaction.initiator);
        if (!owner) {
          console.warn("User not found for transaction:", transaction.id);
        }
        transaction.initiator = owner;
        return transaction ;
    
    })
  );


}

export default {
  getTransactionsForAccount,
  sendTransaction,
  getTransactionsByUserId,

};
