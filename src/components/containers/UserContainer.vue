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
  updateUser, // <-- voeg deze import toe!
  // You may want to implement/createUser in users.js if not present
} from "../../queries/users.js";
import { fetchUserTransactions } from "../../queries/transactions";

const queryClient = useQueryClient();
const showCreateForm = ref(false);
const showUpdateForm = ref(false);

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
const transactionsList = ref([]);

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

// Handler to view transactions
async function onViewTransactions(user) {
  transactionsUser.value = user;
  showTransactionsDialog.value = true;
  transactionsList.value = [];
  try {
    const txs = await fetchUserTransactions(user.id);
    transactionsList.value = txs;
  } catch (e) {
    transactionsList.value = [];
  }
}

function closeTransactionsDialog() {
  showTransactionsDialog.value = false;
  transactionsUser.value = null;
  transactionsList.value = [];
}

</script>

<template>
  <button @click="onCreateUserClick">Create User</button>
  <span style="display:inline-block;width:1em;"></span>
  <button @click="onOpenVerificationTable" :disabled="showCreateForm || showUpdateForm || showVerificationTable">
    Verify users
  </button>
  <div style="margin: 1em 0;">
    <label>
      Filter users:
      <select v-model="filterKey" :disabled="showCreateForm || showUpdateForm || showVerificationTable" style="margin-right:0.5em;">
        <option value="firstName">First name</option>
        <option value="lastName">Last name</option>
        <option value="email">Email</option>
      </select>
      <textarea
        v-model="filterText"
        rows="2"
        cols="40"
        placeholder="Type to filter users by selected field..."
        :disabled="showCreateForm || showUpdateForm || showVerificationTable"
      ></textarea>
    </label>
  </div>
  <!-- Remove inline forms, routing is now used -->
  <span v-if="isLoading"><Loading /></span>
  <span v-else-if="isError">Error: {{ error.message }}</span>
  <VerificationTable
    v-else-if="showVerificationTable && data && data.length && !showCreateForm && !showUpdateForm"
    :users="data"
    @verify="onVerifyUser"
  />
  <div v-if="showVerificationTable && !showCreateForm && !showUpdateForm">
    <button @click="onCloseVerificationTable" style="margin-top:1em;">Close Verification Table</button>
  </div>
  <UsersTable
    v-else-if="data && data.length > 0 && !showCreateForm && !showUpdateForm && !showVerificationTable"
    :users="data"
    @update="onUpdateUser"
    @delete="onDeleteUser"
    @reactivate="onReactivateUser"
    @view-transactions="onViewTransactions"
  />
  <!-- Custom Delete Dialog -->
  <div v-if="showDeleteDialog" class="modal-overlay">
    <div class="modal-dialog">
      <h3>Bevestig verwijderen gebruiker</h3>
      <p>
        Weet je zeker dat je deze gebruiker wilt verwijderen?<br>
        <b>Naam:</b> {{ userToDelete?.firstName }} {{ userToDelete?.lastName }}<br>
        <b>Email:</b> {{ userToDelete?.email }}<br>
        <b>ID:</b> {{ userToDelete?.id }}
      </p>
      <div class="modal-actions">
        <button @click="confirmDeleteUser" class="danger">Verwijderen</button>
        <button @click="cancelDeleteUser">Annuleren</button>
      </div>
    </div>
  </div>
  <!-- Custom Reactivate Dialog -->
  <div v-if="showReactivateDialog" class="modal-overlay">
    <div class="modal-dialog">
      <h3>Bevestig reactivatie gebruiker</h3>
      <p>
        Weet je zeker dat je deze gebruiker wilt heractiveren?<br>
        <b>Naam:</b> {{ userToReactivate?.firstName }} {{ userToReactivate?.lastName }}<br>
        <b>Email:</b> {{ userToReactivate?.email }}<br>
        <b>ID:</b> {{ userToReactivate?.id }}
      </p>
      <div class="modal-actions">
        <button @click="confirmReactivateUser" class="danger" style="background:#388e3c;">Heractiveren</button>
        <button @click="cancelReactivateUser">Annuleren</button>
      </div>
    </div>
  </div>
  <!-- Transactions Modal -->
  <div v-if="showTransactionsDialog" class="modal-overlay">
    <div class="modal-dialog" style="min-width:600px;max-width:90vw;">
      <h3>Transactions for {{ transactionsUser?.firstName }} {{ transactionsUser?.lastName }} (ID: {{ transactionsUser?.id }})</h3>
      <TransactionsTable :transactions="transactionsList" />
      <div class="modal-actions">
        <button @click="closeTransactionsDialog">Close</button>
      </div>
    </div>
  </div>
  <div v-else-if="!showCreateForm && !showUpdateForm && !showVerificationTable && data && data.length === 0">
    No users found!
  </div>
</template>

<style scoped>
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
  background: #fff;
  border-radius: 8px;
  padding: 2em 2.5em;
  box-shadow: 0 4px 32px rgba(0,0,0,0.25);
  min-width: 320px;
  max-width: 90vw;
  text-align: center;
}
.modal-actions {
  margin-top: 1.5em;
  display: flex;
  justify-content: center;
  gap: 1.5em;
}
button.danger {
  background: #d32f2f;
  color: #fff;
  border: none;
  padding: 0.7em 1.5em;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
button.danger:hover {
  background: #b71c1c;
}
</style>
