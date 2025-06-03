<template>
  <div class="atm-overview">
    <h1>ATM Overview</h1>
    <p>Welcome to the ATM Overview page!</p>

    <div class="balance-display">
      <h2 v-if="loadingBalance">Loading Balance...</h2>
      <h2 v-else-if="balanceError" class="error-message">Error: {{ balanceError }}</h2>
      <h2 v-else>Current Balance: ${{ formattedBalance }}</h2>
    </div>

    <div class="main-actions" v-if="!showWithdrawOptions && !showDepositOptions">
      <button @click="openWithdrawOptions" :disabled="loadingBalance || !!balanceError">Withdraw</button>
      <button @click="openDepositOptions" :disabled="loadingBalance || !!balanceError">Deposit</button>
    </div>

    <div v-if="showWithdrawOptions" class="transaction-options">
      <h2>Withdraw Funds</h2>
      <label for="withdraw-amount">Amount:</label>
      <input
        type="number"
        id="withdraw-amount"
        v-model.number="withdrawAmount"
        min="1"
        :max="balance"
        placeholder="Enter amount"
      />
      <div class="button-group">
        <button @click="handleWithdraw" :disabled="!isWithdrawAmountValid || processingTransaction">
          {{ processingTransaction ? 'Processing...' : 'Confirm Withdraw' }}
        </button>
        <button @click="cancelOptions" class="cancel-button" :disabled="processingTransaction">Cancel</button>
      </div>
      <p v-if="withdrawAmount > balance && withdrawAmount !== null && withdrawAmount !== 0" class="error-message">Insufficient funds!</p>
      <p v-if="withdrawAmount <= 0 && withdrawAmount !== null && withdrawAmount !== 0" class="error-message">Amount must be positive.</p>
      <p v-if="transactionError" class="error-message">{{ transactionError }}</p>
    </div>

    <div v-if="showDepositOptions" class="transaction-options">
      <h2>Deposit Funds</h2>
      <label for="deposit-amount">Amount:</label>
      <input
        type="number"
        id="deposit-amount"
        v-model.number="depositAmount"
        min="1"
        placeholder="Enter amount"
      />
      <div class="button-group">
        <button @click="handleDeposit" :disabled="!isDepositAmountValid || processingTransaction">
          {{ processingTransaction ? 'Processing...' : 'Confirm Deposit' }}
        </button>
        <button @click="cancelOptions" class="cancel-button" :disabled="processingTransaction">Cancel</button>
      </div>
      <p v-if="depositAmount <= 0 && depositAmount !== null && depositAmount !== 0" class="error-message">Amount must be positive.</p>
      <p v-if="transactionError" class="error-message">{{ transactionError }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useUserStore } from '../../stores/userStore';
import accounts from '../../queries/accounts'; // Assuming this correctly points to your API service

// Store and reactive states
const userStore = useUserStore();
const balance = ref(0); // Reactive balance state, as the component now fetches it
const showWithdrawOptions = ref(false);
const showDepositOptions = ref(false);
const withdrawAmount = ref(null);
const depositAmount = ref(null);
const loadingBalance = ref(true); // New loading state for balance
const balanceError = ref(null); // New error state for balance fetch
const processingTransaction = ref(false); // New loading state for transactions
const transactionError = ref(null); // New error state for transactions


// Computed properties
const formattedBalance = computed(() => {
  return balance.value.toFixed(2);
});

const isWithdrawAmountValid = computed(() => {
  return withdrawAmount.value > 0 && withdrawAmount.value <= balance.value;
});

const isDepositAmountValid = computed(() => {
  return depositAmount.value > 0;
});


// Functions
async function getAccountsById(id) {
  loadingBalance.value = true;
  balanceError.value = null;
  try {
    const currentFilter = { 'id': id };
    const accountsArray = await accounts.fetchAccountsForUser(id, currentFilter);

    if (!accountsArray || !Array.isArray(accountsArray)) {
      throw new Error("Invalid response format from API: Expected an array of accounts.");
    }
    
    const checkingAccount = accountsArray.find(account => account.type === "CHECKING");

    if (checkingAccount) {
      balance.value = checkingAccount.balance; 
    } else {
      balance.value = 0;
      balanceError.value = "Checking account not found for this user.";
      console.warn("No 'CHECKING' account found in the response for user ID:", id);
    }

  } catch (error) {
    console.error("Error fetching account balance:", error);
    balanceError.value = error.message || 'Failed to load balance.';
  } finally {
    loadingBalance.value = false;
  }
}

function openWithdrawOptions() {
  showWithdrawOptions.value = true;
  showDepositOptions.value = false;
  withdrawAmount.value = null; // Clear previous input
  depositAmount.value = null; // Clear other input
  transactionError.value = null; // Clear previous transaction errors
}

function openDepositOptions() {
  showDepositOptions.value = true;
  showWithdrawOptions.value = false;
  withdrawAmount.value = null; // Clear previous input
  depositAmount.value = null; // Clear other input
  transactionError.value = null; // Clear previous transaction errors
}

function cancelOptions() {
  showWithdrawOptions.value = false;
  showDepositOptions.value = false;
  withdrawAmount.value = null;
  depositAmount.value = null;
  transactionError.value = null; // Clear errors
}

async function handleWithdraw() {
  if (!isWithdrawAmountValid.value) {
    transactionError.value = "Please enter a valid amount to withdraw.";
    return;
  }
  processingTransaction.value = true;
  transactionError.value = null;
  try {
    const userId = userStore.getUser?.id;
    if (!userId) {
        throw new Error("User ID not available for withdrawal.");
    }
    // You will need to ensure accounts.withdraw takes the account IBAN or ID, not just userId
    // For now, assuming your backend withdraws from the checking account
    await accounts.withdraw(userId, withdrawAmount.value); 
    
    // After successful transaction, re-fetch the balance to get the updated value
    await getAccountsById(userId);
    alert(`Successfully withdrew $${withdrawAmount.value.toFixed(2)}.`);
    cancelOptions();
  } catch (error) {
    console.error("Error during withdrawal:", error);
    transactionError.value = error.message || 'Withdrawal failed. Please try again.';
  } finally {
    processingTransaction.value = false;
  }
}

async function handleDeposit() {
  if (!isDepositAmountValid.value) {
    transactionError.value = "Please enter a positive amount to deposit.";
    return;
  }
  processingTransaction.value = true;
  transactionError.value = null;
  try {
    const userId = userStore.getUser?.id;
    if (!userId) {
        throw new Error("User ID not available for deposit.");
    }
    // You will need to ensure accounts.deposit takes the account IBAN or ID, not just userId
    // For now, assuming your backend deposits to the checking account
    await accounts.deposit(userId, depositAmount.value); 
    
    // After successful transaction, re-fetch the balance to get the updated value
    await getAccountsById(userId);
    alert(`Successfully deposited $${depositAmount.value.toFixed(2)}.`);
    cancelOptions();
  } catch (error) {
    console.error("Error during deposit:", error);
    transactionError.value = error.message || 'Deposit failed. Please try again.';
  } finally {
    processingTransaction.value = false;
  }
}

// --- Lifecycle and data fetching ---
watch(() => userStore.getUser, (newUser) => {
  if (newUser && newUser.id) {
    getAccountsById(newUser.id);
  } else if (!newUser && !loadingBalance.value) {
    balance.value = 0;
    balanceError.value = "User not logged in or ID not available.";
    loadingBalance.value = false;
  }
}, { immediate: true });
</script>

<style scoped>
/* Your existing dark mode styles remain unchanged */
.atm-overview {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 500px;
  margin: 50px auto;
  border: 1px solid #444; /* Darker border */
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
  text-align: center;
  background-color: #2c2c2c; /* Dark background */
  color: #e0e0e0; /* Light text */
}

h1 {
  color: #f0f0f0; /* Lighter heading text */
  margin-bottom: 15px;
}

.balance-display {
  background-color: #404040; /* Darker background for balance */
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 25px;
  border: 1px solid #555; /* Darker border */
  color: #81c784; /* Light green for balance text */
}

h2 {
  color: #81c784; /* Match balance text */
  margin: 0;
}

.main-actions button {
  padding: 12px 25px;
  font-size: 1.1em;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  margin: 0 10px;
  background-color: #64b5f6; /* Lighter blue for main buttons */
  color: #222; /* Dark text for contrast */
}

.main-actions button:hover:not(:disabled) {
  background-color: #42a5f5;
}

.main-actions button:disabled {
  background-color: #757575; /* Darker disabled state */
  color: #c0c0c0;
  cursor: not-allowed;
}

.transaction-options {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #555; /* Darker border */
  border-radius: 8px;
  background-color: #3a3a3a; /* Darker background for options */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
}

.transaction-options label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #c0c0c0; /* Lighter label text */
}

.transaction-options input[type="number"] {
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #666; /* Darker input border */
  border-radius: 4px;
  font-size: 1em;
  background-color: #4a4a4a; /* Darker input background */
  color: #e0e0e0; /* Light input text */
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 15px;
}

.button-group button {
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease, opacity 0.3s ease;
}

.button-group button:not(.cancel-button) {
  background-color: #a5d6a7; /* Lighter green for confirm */
  color: #222; /* Dark text for confirm button */
}

.button-group button:not(.cancel-button):hover:not(:disabled) {
  background-color: #81c784;
}

.button-group button:not(.cancel-button):disabled {
  background-color: #757575; /* Darker disabled state */
  color: #c0c0c0;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #ef9a9a; /* Lighter red for cancel */
  color: #222; /* Dark text for cancel button */
}

.cancel-button:hover:not(:disabled) {
  background-color: #e57373;
}

.error-message {
  color: #ffb74d; /* Softer warning color for dark mode errors */
  font-size: 0.9em;
  margin-top: 10px;
}
</style>