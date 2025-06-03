<script setup>
import Loading from "../common/Loading.vue";
import UsersTable from "../common/UsersTable.vue";
import VerificationTable from "../common/VerificationTable.vue";
import { ref, watch } from "vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { useRouter } from "vue-router";
import {
  fetchUsers,
  verifyUser,
  deleteUser,
  // You may want to implement/createUser in users.js if not present
} from "../../queries/users.js";

const queryClient = useQueryClient();
const showCreateForm = ref(false);
const showUpdateForm = ref(false);
const userToUpdate = ref(null);

// State for showing verification table instead of users table
const showVerificationTable = ref(false);

const filterText = ref("");
const filterDebounced = ref("");

// Add router instance
const router = useRouter();

// Debounce filterText to filterDebounced (simple debounce)
let debounceTimeout;
watch(filterText, (val) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    filterDebounced.value = val;
  }, 400);
});

// Use filterDebounced in the query
const { isLoading, isError, data, error } = useQuery({
  queryKey: ["users", filterDebounced],
  queryFn: () => fetchUsers(filterDebounced.value ? { search: filterDebounced.value } : {}),
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

// Example handlers
function onUpdateUser(user) {
  // Route to FormPage for update using object syntax for dynamic params
  router.push({ path: `/admin/users/form/${user.id}` });
}

function onDeleteUser(user) {
  if (confirm(`Delete user ${user.name || user.firstname}?`)) {
    deleteUserMutation.mutate(user.id);
  }
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
  // Route to FormPage for update, with verify query param
  router.push({ path: `/admin/users/form/${user.id}`, query: { verify: "1" } });
}

function onCloseVerificationTable() {
  showVerificationTable.value = false;
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
      <textarea
        v-model="filterText"
        rows="2"
        cols="40"
        placeholder="Type to filter users by any field..."
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
    v-else-if="data && data.length && !showCreateForm && !showUpdateForm && !showVerificationTable"
    :users="data"
    @update="onUpdateUser"
    @delete="onDeleteUser"
  />
  <div v-else-if="!showCreateForm && !showUpdateForm && !showVerificationTable">No users found!</div>
</template>
