import accounts from '../queries/accounts'; // Assuming this fetches user accounts
import { addTransaction } from '../queries/transactions'; // Assuming this sends transactions to API
import { useUserStore } from '../stores/userStore'; // To get the user ID if needed by the service

// --- Define the standard ATM IBAN (keep it here as well for consistency) ---
const ATM_IBAN = "NL46KRCH9824532406";

export function useAtmService() {
  const userStore = useUserStore(); // Access user store inside the service

  /**
   * Fetches the checking account balance and IBAN for the current user.
   * @returns {Promise<{balance: number, iban: string|null}>} Object containing balance and iban, or throws an error.
   */
  async function fetchUserCheckingAccountDetails() {
    if (!userStore.getUser || !userStore.getUser.id) {
      throw new Error("User not logged in or ID not available.");
    }

    try {
      const userId = userStore.getUser.id;
      const currentFilter = { 'id': userId };
      const accountsArray = await accounts.fetchAccountsForUser(userId, currentFilter);

      if (!accountsArray || !Array.isArray(accountsArray)) {
        throw new Error("Invalid response format from API: Expected an array of accounts.");
      }

      const checkingAccount = accountsArray.find(account => account.type === "CHECKING");

      if (checkingAccount) {
        return {
          balance: checkingAccount.balance,
          iban: checkingAccount.iban
        };
      } else {
        throw new Error("Checking account not found for this user.");
      }
    } catch (error) {
      console.error("Error in atmService.fetchUserCheckingAccountDetails:", error);
      throw error; // Re-throw to be handled by the component
    }
  }

  /**
   * Handles the withdrawal transaction.
   * @param {number} amount - The amount to withdraw.
   * @param {string} userCheckingIban - The IBAN of the user's checking account.
   * @returns {Promise<void>} Resolves on success, rejects on failure.
   */
  async function processWithdrawal(amount, userCheckingIban) {
    if (amount <= 0) {
      throw new Error("Withdrawal amount must be positive.");
    }
    // You might add more validation here if needed, like max withdrawal per transaction

    const transactionPayload = {
      amount: amount,
      sender: userCheckingIban,
      receiver: ATM_IBAN,
      description: "ATM Cash Withdrawal"
    };

    try {
      await addTransaction(transactionPayload);
    } catch (error) {
      console.error("Error in atmService.processWithdrawal:", error);
      throw error; // Re-throw for component to handle error message and toast
    }
  }

  /**
   * Handles the deposit transaction.
   * @param {number} amount - The amount to deposit.
   * @param {string} userCheckingIban - The IBAN of the user's checking account.
   * @returns {Promise<void>} Resolves on success, rejects on failure.
   */
  async function processDeposit(amount, userCheckingIban) {
    if (amount <= 0) {
      throw new Error("Deposit amount must be positive.");
    }
    // You might add more validation here

    const transactionPayload = {
      amount: amount,
      sender: ATM_IBAN,
      receiver: userCheckingIban,
      description: "ATM Cash Deposit"
    };

    try {
      await addTransaction(transactionPayload);
    } catch (error) {
      console.error("Error in atmService.processDeposit:", error);
      throw error; // Re-throw for component to handle
    }
  }

  // Return the functions to be used by the component
  return {
    fetchUserCheckingAccountDetails,
    processWithdrawal,
    processDeposit
  };
}