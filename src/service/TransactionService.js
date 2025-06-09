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
    console.log("Fetched transactions for account:", accountId, transactions);
    return transactions;
  } catch (e) {
    console.error("Error fetching transactions for account:", e);
    throw new Error("Error fetching transactions for account: " + accountId, e);
  }
}

async function sendTransaction(transactionData) {
  try {
    if (!transactionData || !transactionData.accountId) {
      throw new Error("Invalid transaction data provided.");
    }
    if(!validateNewTransaction(transactionData))
    {
      throw new Error("Transaction data validation failed.");
    }

    const result = await transaction.sendTransaction(transactionData);

    if (!result || !result.success) {
      throw new Error("Failed to send transaction: " + result.message);
    }

    console.log("Transaction sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending transaction:", error);
    throw error;
  }
}
function validateNewTransaction(transactionData) {
    if (
      !transactionData ||
      !transactionData.amount ||
      !transactionData.type ||
      !transactionData.sender ||
      !transactionData.receiver
    ) {
      return false;
    }
    return true;
 
}
export default {
  getTransactionsForAccount,
  sendTransaction,
};
