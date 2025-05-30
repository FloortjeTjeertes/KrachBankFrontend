<script setup>
import Loading from "../common/Loading.vue";
import UserCreateForm from "../common/UserCreateForm.vue";
import UserUpdateForm from "../common/UserForm.vue";
import UsersTable from "../common/UsersTable.vue";
import { ref, watch } from "vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import {
  fetchUsers,
  updateUser,
  deleteUser,
  // You may want to implement/createUser in users.js if not present
} from "../../queries/users.js";

const queryClient = useQueryClient();
const showCreateForm = ref(false);
const showUpdateForm = ref(false);
const userToUpdate = ref(null);

const filterText = ref("");
const filterDebounced = ref("");

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

// Update user mutation
const updateUserMutation = useMutation({
  mutationFn: ({ userId, userData }) => updateUser(userId, userData),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
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
  userToUpdate.value = { ...user };
  showUpdateForm.value = true;
}

function onDeleteUser(user) {
  if (confirm(`Delete user ${user.name || user.firstname}?`)) {
    deleteUserMutation.mutate(user.id);
  }
}

function onCreateUserClick() {
  showCreateForm.value = true;
}

function onCreateUserSuccess() {
  showCreateForm.value = false;
  queryClient.invalidateQueries({ queryKey: ["users"] });
}

function onCreateUserCancel() {
  showCreateForm.value = false;
}

function onUpdateUserSuccess() {
  showUpdateForm.value = false;
  userToUpdate.value = null;
  queryClient.invalidateQueries({ queryKey: ["users"] });
}

function onUpdateUserCancel() {
  showUpdateForm.value = false;
  userToUpdate.value = null;
}
</script>

<template>
  <button @click="onCreateUserClick">Create User</button>
  <div style="margin: 1em 0;">
    <label>
      Filter users:
      <textarea
        v-model="filterText"
        rows="2"
        cols="40"
        placeholder="Type to filter users by any field..."
        :disabled="showCreateForm || showUpdateForm"
      ></textarea>
    </label>
  </div>
  <UserCreateForm v-if="showCreateForm" @success="onCreateUserSuccess" @cancel="onCreateUserCancel" />
  <UserUpdateForm
    v-if="showUpdateForm"
    :user="userToUpdate"
    @success="onUpdateUserSuccess"
    @cancel="onUpdateUserCancel"
  />
  <span v-if="isLoading"><Loading /></span>
  <span v-else-if="isError">Error: {{ error.message }}</span>
  <UsersTable
    v-else-if="data && data.length && !showCreateForm && !showUpdateForm"
    :users="data"
    @update="onUpdateUser"
    @delete="onDeleteUser"
  />
  <div v-else-if="!showCreateForm && !showUpdateForm">No users found!</div>
</template>
