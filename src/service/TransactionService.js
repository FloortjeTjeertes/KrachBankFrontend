import transaction from "../queries/transactions";

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
    return transactions;
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


export default {
  getTransactionsForAccount,
  sendTransaction,
};
