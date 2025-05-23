<script setup>
import Loading from "../common/Loading.vue";
import UserCreateForm from "../common/UserCreateForm.vue";
import UserUpdateForm from "../common/UserUpdateForm.vue";
import { ref } from "vue";
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

const { isLoading, isError, data, error } = useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
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
  <UserCreateForm v-if="showCreateForm" @success="onCreateUserSuccess" @cancel="onCreateUserCancel" />
  <UserUpdateForm
    v-if="showUpdateForm"
    :user="userToUpdate"
    @success="onUpdateUserSuccess"
    @cancel="onUpdateUserCancel"
  />
  <span v-if="isLoading"><Loading /></span>
  <span v-else-if="isError">Error: {{ error.message }}</span>
  <ul v-else-if="data && data.length">
    <li v-for="user in data" :key="user.id">
      {{ user.name || (user.firstname + ' ' + user.lastname) }} ({{ user.email }})
      <button @click="onUpdateUser(user)">Update</button>
      <button @click="onDeleteUser(user)">Delete</button>
    </li>
  </ul>
  <div v-else>No users found!</div>
</template>
