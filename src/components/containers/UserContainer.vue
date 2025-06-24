<script setup>
import Loading from "../common/Loading.vue";
import UsersTable from "../common/UsersTable.vue";
import VerificationTable from "../common/VerificationTable.vue";
import TransactionsTable from "../common/TransactionsTable.vue";
import { ref, watch } from "vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { useRouter } from "vue-router";
import {
  fetchUsers,
  verifyUser,
  deleteUser,
  updateUser,
  // You may want to implement/createUser in users.js if not present
} from "../../queries/users.js";
// Removed direct import of fetchUserTransactions as we will use the service
// import { fetchUserTransactions } from "../../queries/transactions"; 
import transactionService from "@/service/TransactionService"; // Import the transactionService
import { mapToTransaction } from "@/utils/mappers";
import { createPaginationFilter } from "@/filters/paginationFilter"; // Needed for default pagination

const queryClient = useQueryClient();
const showCreateForm = ref(false); // This seems to be deprecated by routing
const showUpdateForm = ref(false); // This seems to be deprecated by routing

// State for showing verification table instead of users table
const showVerificationTable = ref(false);

const filterText = ref("");
const filterDebounced = ref("");

// Nieuwe filter state voor key/value filtering
const filterKey = ref("firstName"); // standaard 'firstName'

// Add router instance
const router = useRouter();

// Debounce filterText to filterDebounced (simple debounce)
let debounceTimeout;
watch([filterText, filterKey], ([val, key]) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    filterDebounced.value = val;
  }, 400);
});

// Use filterDebounced in the query
const { isLoading, isError, data, error } = useQuery({
  queryKey: ["users", filterKey, filterDebounced, showVerificationTable],
  queryFn: () => {
    let params = {};
    if (showVerificationTable.value) {
      params.verified = false;
    } else if (filterDebounced.value && filterKey.value) {
      params[filterKey.value] = filterDebounced.value;
    }
    return fetchUsers(params);
  },
});

// Verify user mutation
const verifyUserMutation = useMutation({
  mutationFn: (user) => verifyUser(user.id, { verified: true }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
    showVerificationTable.value = false; // Close the verification table
  },
});

// Delete user mutation
const deleteUserMutation = useMutation({
  mutationFn: (userId) => deleteUser(userId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  },
});

// Reactivate user mutation
const reactivateUserMutation = useMutation({
  mutationFn: (user) => {
    // Stuur de volledige user data mee, maar forceer active: true
    return updateUser(user.id, { ...user, active: true });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  },
});

// Local state for delete/reactivate confirmation dialogs
const showDeleteDialog = ref(false);
const userToDelete = ref(null);
const showReactivateDialog = ref(false);
const userToReactivate = ref(null);

// State for transactions dialog
const showTransactionsDialog = ref(false);
const transactionsUser = ref(null);
const transactionsList = ref([]); // This should hold the array of mapped transactions

// Example handlers
function onUpdateUser(user) {
  // Route to FormPage for update
  router.push(`/admin/users/form/${user.id}`);
}

function onDeleteUser(user) {
  userToDelete.value = user;
  showDeleteDialog.value = true;
}

// New confirm and cancel handlers for delete dialog
function confirmDeleteUser() {
  if (userToDelete.value) {
    deleteUserMutation.mutate(userToDelete.value.id);
    showDeleteDialog.value = false;
    userToDelete.value = null;
  }
}

function cancelDeleteUser() {
  showDeleteDialog.value = false;
  userToDelete.value = null;
}

// Route to FormPage for create
function onCreateUserClick() {
  router.push("/admin/users/form");
}

// Handler to switch to verification table
function onOpenVerificationTable() {
  showVerificationTable.value = true;
}

// Handler for verifying a user
function onVerifyUser(user) {
  verifyUserMutation.mutate(user, {
    onSuccess: () => {
      // Na verificatie, route naar update form met verify=1 query param
      router.push({ path: `/admin/users/form/${user.id}`, query: { verify: "1" } });
    }
  });
}

function onCloseVerificationTable() {
  showVerificationTable.value = false;
}

function onReactivateUser(user) {
  userToReactivate.value = user;
  showReactivateDialog.value = true;
}

function confirmReactivateUser() {
  if (userToReactivate.value) {
    reactivateUserMutation.mutate(userToReactivate.value);
    showReactivateDialog.value = false;
    userToReactivate.value = null;
  }
}

function cancelReactivateUser() {
  showReactivateDialog.value = false;
  userToReactivate.value = null;
}

// Handler to view transactions - UPDATED TO USE transactionService
async function onViewTransactions(user) {
  transactionsUser.value = user;
  showTransactionsDialog.value = true;
  transactionsList.value = []; // Clear previous transactions

  try {
    // Define pagination for fetching all transactions for the user
    // currentPage: 0, limit: 1000 to fetch a reasonable amount, or adjust as needed
    const pagination = createPaginationFilter(0, 1000); 

    // Calling the service method: transactionService.getTransactionsByUserId
    const txsResponse = await transactionService.getTransactionsByUserId(user.id, pagination);
    
    // Ensure the response has an 'items' array
    if (txsResponse && txsResponse.items) {
      transactionsList.value = { items: txsResponse.items.map(mapToTransaction) };
    } else {
      console.warn("transactionService.getTransactionsByUserId did not return data in expected { items: [] } format or no items found.");
      transactionsList.value = { items: [] }; // Ensure it's always an object with an items array
    }
  } catch (e) {
    console.error("Failed to fetch or map transactions for user:", e);
    transactionsList.value = { items: [] }; // Ensure transactionsList.items is always an array on error
  }
}

function closeTransactionsDialog() {
  showTransactionsDialog.value = false;
  transactionsUser.value = null;
  transactionsList.value = [];
}
</script>

<template>
  <div class="p-4 bg-gray-50 min-h-screen font-inter">
    <div class="flex space-x-4 mb-6">
      <button @click="onCreateUserClick"
        class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-200 ease-in-out"
      >
        Create User
      </button>
      <button @click="onOpenVerificationTable"
        :disabled="showCreateForm || showUpdateForm || showVerificationTable"
        class="px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Verify Users
      </button>
    </div>
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 class="text-xl font-semibold mb-4 text-gray-800">Filter Users</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label for="filterKey" class="block text-sm font-medium text-gray-700 mb-1">Filter by</label>
          <select id="filterKey" v-model="filterKey" :disabled="showCreateForm || showUpdateForm || showVerificationTable"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
            <option value="firstName">First name</option>
            <option value="lastName">Last name</option>
            <option value="email">Email</option>
          </select>
        </div>
        <div class="lg:col-span-2"> <label for="filterText" class="block text-sm font-medium text-gray-700 mb-1">Search term</label>
          <textarea
            id="filterText"
            v-model="filterText"
            rows="1" placeholder="Type to filter users by selected field..."
            :disabled="showCreateForm || showUpdateForm || showVerificationTable"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          ></textarea>
        </div>
      </div>
    </div>
    <span v-if="isLoading" class="flex justify-center items-center h-full text-gray-700"><Loading /></span>
    <span v-else-if="isError" class="text-red-600 font-bold text-center p-4">Error: {{ error.message }}</span>

    <VerificationTable
      v-else-if="showVerificationTable && data && data.length && !showCreateForm && !showUpdateForm"
      :users="data"
      @verify="onVerifyUser"
    />
    <div v-if="showVerificationTable && !showCreateForm && !showUpdateForm" class="flex justify-end mt-4">
      <button @click="onCloseVerificationTable"
              class="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md shadow-md hover:bg-gray-400 transition duration-200 ease-in-out">
        Close Verification Table
      </button>
    </div>

    <UsersTable
      v-else-if="data && data.length > 0 && !showCreateForm && !showUpdateForm && !showVerificationTable"
      :users="data"
      @update="onUpdateUser"
      @delete="onDeleteUser"
      @reactivate="onReactivateUser"
      @view-transactions="onViewTransactions"
    />
    <div v-else-if="!showCreateForm && !showUpdateForm && !showVerificationTable && data && data.length === 0" class="text-center text-gray-600 p-4">
      No users found!
    </div>


    <div v-if="showDeleteDialog" class="modal-overlay">
      <div class="modal-dialog">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Confirm User Deletion</h3>
        <p class="text-gray-700 mb-4">
          Are you sure you want to delete this user?<br>
          <b>Name:</b> {{ userToDelete?.firstName }} {{ userToDelete?.lastName }}<br>
          <b>Email:</b> {{ userToDelete?.email }}<br>
          <b>ID:</b> {{ userToDelete?.id }}
        </p>
        <div class="modal-actions">
          <button @click="confirmDeleteUser" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 ease-in-out">Delete</button>
          <button @click="cancelDeleteUser" class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200 ease-in-out">Cancel</button>
        </div>
      </div>
    </div>
    <div v-if="showReactivateDialog" class="modal-overlay">
      <div class="modal-dialog">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Confirm User Reactivation</h3>
        <p class="text-gray-700 mb-4">
          Are you sure you want to reactivate this user?<br>
          <b>Name:</b> {{ userToReactivate?.firstName }} {{ userToReactivate?.lastName }}<br>
          <b>Email:</b> {{ userToReactivate?.email }}<br>
          <b>ID:</b> {{ userToReactivate?.id }}
        </p>
        <div class="modal-actions">
          <button @click="confirmReactivateUser" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 ease-in-out">Reactivate</button>
          <button @click="cancelReactivateUser" class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200 ease-in-out">Cancel</button>
        </div>
      </div>
    </div>
    <div v-if="showTransactionsDialog" class="modal-overlay">
      <div class="modal-dialog" style="min-width:600px;max-width:90vw;">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Transactions for {{ transactionsUser?.firstName }} {{ transactionsUser?.lastName }} (ID: {{ transactionsUser?.id }})</h3>
        <TransactionsTable :transactions="transactionsList.items || []" />
        <div class="modal-actions">
          <button @click="closeTransactionsDialog" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 ease-in-out">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Modal styles remain, adjusted to fit Tailwind's color scheme and sizing if possible */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-dialog {
  background: #1e1e31; /* Changed back to white, was #242331 in your last message but usually modals are light */
  border-radius: 8px;
  padding: 2em 2.5em; /* Tailwind p-8 or p-10 would be close */
  box-shadow: 0 4px 32px rgba(0,0,0,0.25); /* Tailwind shadow-xl or shadow-2xl */
  min-width: 320px;
  max-width: 90vw;
  text-align: center;
}
.modal-actions {
  margin-top: 1.5em; /* Tailwind mt-6 */
  display: flex;
  justify-content: center;
  gap: 1.5em; /* Tailwind gap-6 */
}

/* Original custom button styles are replaced with Tailwind classes in template */
/* .danger, etc. are now px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 */
</style>