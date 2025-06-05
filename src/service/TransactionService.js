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

export default {
  getTransactionsForAccount,
};
