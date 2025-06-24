<script setup>
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import AccountTable from '../common/AccountTable.vue'
import { fetchAccounts } from '../../queries/accounts.js' // Assuming this is correct for initial fetch
import { fetchUsers } from '../../queries/users.js'
import AccountService from '../../service/AccountService.js'; // Import the AccountService
import { useToast } from "vue-toastification";
const toast = useToast();


// Fetch accounts and users
const { data: accountsData, isLoading: loadingAccounts, refetch: refetchAccounts } = useQuery({
  queryKey: ['accounts'],
  queryFn: () => fetchAccounts()
})

const { data: usersArray, isLoading: loadingUsers } = useQuery({
  queryKey: ['users'],
  queryFn: () => fetchUsers()
})

// Build a map from user ID to email
const ownerEmailMap = computed(() => {
  const map = {}
  if (usersArray.value) {
    usersArray.value.forEach(user => {
      map[user.id] = user.email
    })
  }
  return map
})

// --- Filter State ---
const filterIban = ref('')
const filterOwnerEmail = ref('')
const filterType = ref('') // 'SAVINGS', 'CHECKING', or '' for all
const filterMinBalance = ref(null)
const filterMaxBalance = ref(null)
const filterActive = ref(null) // null for all, true for active, false for inactive

// --- Edit Account Modal State ---
const showEditAccountModal = ref(false);
const selectedAccount = ref(null); // To hold the account being edited
const isUpdatingAccount = ref(false); // Loading state for update operation

// --- Filtered Accounts Computed Property ---
const filteredAccounts = computed(() => {
  if (!accountsData.value?.items) {
    return []
  }

  let filtered = accountsData.value.items

  // 1. Filter by IBAN
  if (filterIban.value) {
    const searchIban = filterIban.value.toLowerCase()
    filtered = filtered.filter(account =>
      account.iban.toLowerCase().includes(searchIban)
    )
  }

  // 2. Filter by Owner Email
  if (filterOwnerEmail.value) {
    const searchEmail = filterOwnerEmail.value.toLowerCase()
    filtered = filtered.filter(account => {
      const ownerEmail = ownerEmailMap.value[account.owner] || ''
      return ownerEmail.toLowerCase().includes(searchEmail)
    })
  }

  // 3. Filter by Account Type
  if (filterType.value) {
    filtered = filtered.filter(account => account.type === filterType.value)
  }

  // 4. Filter by Minimum Balance
  if (filterMinBalance.value !== null && filterMinBalance.value !== '') {
    const min = parseFloat(filterMinBalance.value)
    if (!isNaN(min)) {
      filtered = filtered.filter(account => account.balance >= min)
    }
  }

  // 5. Filter by Maximum Balance
  if (filterMaxBalance.value !== null && filterMaxBalance.value !== '') {
    const max = parseFloat(filterMaxBalance.value)
    if (!isNaN(max)) {
      filtered = filtered.filter(account => account.balance <= max)
    }
  }

  // 6. Filter by Active Status
  if (filterActive.value !== null) { // Only filter if explicitly true or false
    filtered = filtered.filter(account => account.active === filterActive.value)
  }

  return filtered
})

// --- Handle Edit Account ---
function handleEditAccount(account) {
  // Create a deep copy to ensure the modal doesn't directly mutate the table data
  selectedAccount.value = JSON.parse(JSON.stringify(account));
  showEditAccountModal.value = true;
}

function handleCloseEditModal() {
  showEditAccountModal.value = false;
  selectedAccount.value = null;
}

// --- Handle Account Update (Transaction Limit) ---
async function handleUpdateAccount(updatedAccountData) {
  isUpdatingAccount.value = true;
  try {
    // Call the service function to update the transaction limit
    await AccountService.updateAccountTransactionLimit(
      updatedAccountData.iban,
      updatedAccountData.transactionLimit
    );

    showEditAccountModal.value = false; // Close the modal on success
    await refetchAccounts(); // Refetch accounts to see the updated limit in the table
    toast.success("Account transaction limit updated successfully!"); // Provide feedback
  } catch (error) {
    console.error("Error updating account transaction limit:", error);
    toast.error("Failed to update account: " + error.message); // Provide error feedback
  } finally {
    isUpdatingAccount.value = false;
  }
}
</script>

<template>
  <div class="p-4 bg-gray-50 min-h-screen font-inter">
    <span v-if="loadingAccounts || loadingUsers" class="flex justify-center items-center h-full text-gray-700">Loading accounts and user data...</span>

    <div v-else-if="accountsData?.items && Object.keys(ownerEmailMap).length > 0">
      <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Filter Accounts</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label for="filterIban" class="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
            <input id="filterIban" type="text" v-model="filterIban" placeholder="e.g., NLXXKRCHXXXXXXXXXX"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" />
          </div>

          <div>
            <label for="filterOwnerEmail" class="block text-sm font-medium text-gray-700 mb-1">Owner Email</label>
            <input id="filterOwnerEmail" type="text" v-model="filterOwnerEmail" placeholder="e.g., example@email.com"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" />
          </div>

          <div>
            <label for="filterType" class="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <select id="filterType" v-model="filterType"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
              <option value="">All Types</option>
              <option value="SAVINGS">SAVINGS</option>
              <option value="CHECKING">CHECKING</option>
            </select>
          </div>

          <div>
            <label for="filterMinBalance" class="block text-sm font-medium text-gray-700 mb-1">Min Balance</label>
            <input id="filterMinBalance" type="number" v-model.number="filterMinBalance" placeholder="e.g., 0.00" step="0.01"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" />
          </div>

          <div>
            <label for="filterMaxBalance" class="block text-sm font-medium text-gray-700 mb-1">Max Balance</label>
            <input id="filterMaxBalance" type="number" v-model.number="filterMaxBalance" placeholder="e.g., 1000.00" step="0.01"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" />
          </div>
        </div>
      </div>

      <AccountTable
        :accounts="filteredAccounts"
        :ownerEmailMap="ownerEmailMap"
        @editAccount="handleEditAccount" />
    </div>
    <span v-else class="flex justify-center items-center h-full text-gray-700">No accounts or user data available.</span>

    <div v-if="showEditAccountModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative">
        <button @click="handleCloseEditModal" class="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold">&times;</button>
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Edit Account Transaction Limit</h3>
        <p v-if="selectedAccount">
          Editing limit for IBAN: <strong>{{ selectedAccount.iban }}</strong><br>
          Current Limit: <strong>{{ selectedAccount.transactionLimit }}</strong>
        </p>
        <div class="mt-4">
          <label class="block text-sm font-medium mb-1">New Transaction Limit</label>
          <input type="number" v-model.number="selectedAccount.transactionLimit"
                 class="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div class="flex justify-end space-x-2 mt-6">
          <button @click="handleCloseEditModal" class="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition">
            Cancel
          </button>
          <button @click="handleUpdateAccount(selectedAccount)" :disabled="isUpdatingAccount"
                  class="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed">
            {{ isUpdatingAccount ? 'Updating...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* You might keep global styles here if necessary, but no filter-specific styles are needed anymore */
.font-inter {
  font-family: 'Inter', sans-serif; /* Ensure Inter font is loaded and applied */
}
</style>