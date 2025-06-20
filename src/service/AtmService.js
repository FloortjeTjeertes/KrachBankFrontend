import accounts from '../queries/accounts'; // Assuming this fetches user accounts
import { addTransaction } from '../queries/transactions'; // Assuming this sends transactions to API
import { useUserStore } from '../stores/userStore'; // To get the user ID if needed by the service
import { ref } from 'vue'; // Import ref from Vue if this is a Vue 3 setup

export function useAtmService() {
  const userStore = useUserStore();
  const ATM_IBAN = ref(null); // Use ref to make ATM_IBAN reactive and initially null

  // Function to fetch the ATM account IBAN
  async function fetchAtmIban() {
    if (ATM_IBAN.value) {
      return ATM_IBAN.value; // Already fetched
    }
    try {
      // Assuming ATM account always has ID 3 or is identifiable
      const atmAccountArray = await accounts.fetchAccountsForUser(3);
      if (atmAccountArray && Array.isArray(atmAccountArray) && atmAccountArray.length > 0) {
        // Find the specific ATM account, if there are multiple accounts for user ID 3
        // Or assume the first one is the ATM account
        const atmCheckingAccount = atmAccountArray.find(account => account.type === "CHECKING"); // Assuming ATM also has a CHECKING type
        if (atmCheckingAccount) {
          ATM_IBAN.value = atmCheckingAccount.iban;
          return ATM_IBAN.value;
        } else {
          throw new Error("ATM checking account not found.");
        }
      } else {
        throw new Error("ATM account not found or invalid response.");
      }
    } catch (error) {
      console.error("Error fetching ATM IBAN:", error);
      throw error; // Re-throw to propagate the error
    }
  }

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
      // The currentFilter with 'id': userId might be redundant if fetchAccountsForUser already filters by userId
      // based on its first argument. Review your accounts.fetchAccountsForUser implementation.
      const accountsArray = await accounts.fetchAccountsForUser(userId);

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

    // Ensure ATM_IBAN is fetched before proceeding
    const atmIbanValue = await fetchAtmIban();
    if (!atmIbanValue) {
      throw new Error("ATM IBAN not available for withdrawal.");
    }

    const transactionPayload = {
      amount: amount,
      sender: userCheckingIban,
      receiver: atmIbanValue, // Use the fetched ATM IBAN
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

    // Ensure ATM_IBAN is fetched before proceeding
    const atmIbanValue = await fetchAtmIban();
    if (!atmIbanValue) {
      throw new Error("ATM IBAN not available for deposit.");
    }

    const transactionPayload = {
      amount: amount,
      sender: atmIbanValue, // Use the fetched ATM IBAN
      receiver: userCheckingIban,
      description: "ATM Cash Deposit"
    };

    try {
      await addTransaction(transactionPayload);
    } catch (error) {
      console.error("Error in atmService.processDeposit:", error);
      throw error;
    }
  }

  // Return the functions to be used by the component
  return {
    fetchUserCheckingAccountDetails,
    processWithdrawal,
    processDeposit,
  };
}