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
import { useToast } from "vue-toastification";
import { useAtmService } from '../../service/AtmService.js'; 

const toast = useToast();
const userStore = useUserStore();
const { fetchUserCheckingAccountDetails, processWithdrawal, processDeposit } = useAtmService(); // Use the service

// Store and reactive states
const balance = ref(0);
const checkingAccountIban = ref(null);
const showWithdrawOptions = ref(false);
const showDepositOptions = ref(false);
const withdrawAmount = ref(null);
const depositAmount = ref(null);
const loadingBalance = ref(true);
const balanceError = ref(null);
const processingTransaction = ref(false);
const transactionError = ref(null);


// Computed properties (remain largely the same, as they are UI-related validations)
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
async function loadBalanceAndIban() {
  loadingBalance.value = true;
  balanceError.value = null;
  try {
    const { balance: fetchedBalance, iban: fetchedIban } = await fetchUserCheckingAccountDetails();
    balance.value = fetchedBalance;
    checkingAccountIban.value = fetchedIban;
  } catch (error) {
    console.error("Error loading balance in component:", error);
    balanceError.value = error.message || 'Failed to load balance.';
    balance.value = 0; // Reset balance on error
    checkingAccountIban.value = null;
  } finally {
    loadingBalance.value = false;
  }
}

function openWithdrawOptions() {
  showWithdrawOptions.value = true;
  showDepositOptions.value = false;
  withdrawAmount.value = null;
  depositAmount.value = null;
  transactionError.value = null;
}

function openDepositOptions() {
  showDepositOptions.value = true;
  showWithdrawOptions.value = false;
  withdrawAmount.value = null;
  depositAmount.value = null;
  transactionError.value = null;
}

function cancelOptions() {
  showWithdrawOptions.value = false;
  showDepositOptions.value = false;
  withdrawAmount.value = null;
  depositAmount.value = null;
  transactionError.value = null;
}

async function handleWithdraw() {
  if (!isWithdrawAmountValid.value) {
    transactionError.value = "Please enter a valid amount to withdraw.";
    return;
  }
  if (!checkingAccountIban.value) {
    transactionError.value = "Checking account IBAN not found. Cannot process withdrawal.";
    return;
  }

  processingTransaction.value = true;
  transactionError.value = null;
  try {
    await processWithdrawal(withdrawAmount.value, checkingAccountIban.value); // Call the service function

    await loadBalanceAndIban(); // Reload balance after successful transaction
    toast.success(`Successfully withdrew $${withdrawAmount.value.toFixed(2)}.`); // Correct toast message
    cancelOptions();
  } catch (error) {
    console.error("Error during withdrawal:", error.response?.data || error.message);
    transactionError.value = error.response?.data?.message || 'Withdrawal failed. Please try again.';
  } finally {
    processingTransaction.value = false;
  }
}

async function handleDeposit() {
  if (!isDepositAmountValid.value) {
    transactionError.value = "Please enter a positive amount to deposit.";
    return;
  }
  if (!checkingAccountIban.value) {
    transactionError.value = "Checking account IBAN not found. Cannot process deposit.";
    return;
  }

  processingTransaction.value = true;
  transactionError.value = null;
  try {
    await processDeposit(depositAmount.value, checkingAccountIban.value); // Call the service function

    await loadBalanceAndIban(); // Reload balance after successful transaction
    toast.success(`Successfully deposited $${depositAmount.value.toFixed(2)}.`);
    cancelOptions();
  } catch (error) {
    console.error("Error during deposit:", error.response?.data || error.message);
    transactionError.value = error.response?.data?.message || 'Deposit failed. Please try again.';
  } finally {
    processingTransaction.value = false;
  }
}

// --- Lifecycle and data fetching ---
watch(() => userStore.getUser, (newUser) => {
  if (newUser && newUser.id) {
    loadBalanceAndIban(); // Use the refactored load function
  } else if (!newUser && !loadingBalance.value) {
    balance.value = 0;
    checkingAccountIban.value = null;
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
  border: 1px solid #444;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
  text-align: center;
  background-color: #2c2c2c;
  color: #e0e0e0;
}

h1 {
  color: #f0f0f0;
  margin-bottom: 15px;
}

.balance-display {
  background-color: #404040;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 25px;
  border: 1px solid #555;
  color: #81c784;
}

h2 {
  color: #81c784;
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
  background-color: #64b5f6;
  color: #222;
}

.main-actions button:hover:not(:disabled) {
  background-color: #42a5f5;
}

.main-actions button:disabled {
  background-color: #757575;
  color: #c0c0c0;
  cursor: not-allowed;
}

.transaction-options {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #555;
  border-radius: 8px;
  background-color: #3a3a3a;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
}

.transaction-options label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #c0c0c0;
}

.transaction-options input[type="number"] {
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #666;
  border-radius: 4px;
  font-size: 1em;
  background-color: #4a4a4a;
  color: #e0e0e0;
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
  background-color: #a5d6a7;
  color: #222;
}

.button-group button:not(.cancel-button):hover:not(:disabled) {
  background-color: #81c784;
}

.button-group button:not(.cancel-button):disabled {
  background-color: #757575;
  color: #c0c0c0;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #ef9a9a;
  color: #222;
}

.cancel-button:hover:not(:disabled) {
  background-color: #e57373;
}

.error-message {
  color: #ffb74d;
  font-size: 0.9em;
  margin-top: 10px;
}
</style>