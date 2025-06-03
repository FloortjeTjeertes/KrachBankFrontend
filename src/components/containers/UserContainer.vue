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
} from "../../queries/users.js";

const queryClient = useQueryClient();
const showCreateForm = ref(false);
const showUpdateForm = ref(false);
const userToUpdate = ref(null);
const showVerificationTable = ref(false);

// --- Filter state ---
const filterKey = ref("email");
const filterValue = ref("");
const filterDebouncedKey = ref("email");
const filterDebouncedValue = ref("");

// Debounce filterValue to filterDebouncedValue
let debounceTimeout;
watch([filterKey, filterValue], ([key, val]) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    filterDebouncedKey.value = key;
    filterDebouncedValue.value = val;
  }, 400);
});

// Use filterDebouncedKey/Value in the query
const { isLoading, isError, data, error } = useQuery({
  queryKey: ["users", filterDebouncedKey, filterDebouncedValue],
  queryFn: () =>
    filterDebouncedValue.value
      ? fetchUsers({ [filterDebouncedKey.value]: filterDebouncedValue.value })
      : fetchUsers(),
});

const router = useRouter();

const verifyUserMutation = useMutation({
  mutationFn: (user) => verifyUser(user.id, { verified: true }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
    showVerificationTable.value = false;
  },
});
const deleteUserMutation = useMutation({
  mutationFn: (userId) => deleteUser(userId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  },
});
function onUpdateUser(user) {
  router.push({ path: `/admin/users/form/${user.id}` });
}
function onDeleteUser(user) {
  if (confirm(`Delete user ${user.name || user.firstname}?`)) {
    deleteUserMutation.mutate(user.id);
  }
}
function onCreateUserClick() {
  router.push("/admin/users/form");
}
function onOpenVerificationTable() {
  showVerificationTable.value = true;
}
function onVerifyUser(user) {
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
      <select v-model="filterKey" :disabled="showCreateForm || showUpdateForm || showVerificationTable">
        <option value="email">Email</option>
        <option value="firstName">First Name</option>
        <option value="lastName">Last Name</option>
        <!-- Add more keys as needed -->
      </select>
      <input
        v-model="filterValue"
        :type="filterKey === 'active' || filterKey === 'verified' ? 'checkbox' : 'text'"
        :checked="filterKey === 'active' || filterKey === 'verified' ? filterValue : undefined"
        @change="filterKey === 'active' || filterKey === 'verified' ? filterValue = $event.target.checked : null"
        :placeholder="`Type to filter by ${filterKey}...`"
        :disabled="showCreateForm || showUpdateForm || showVerificationTable"
        style="margin-left:0.5em;"
      />
    </label>
  </div>
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
