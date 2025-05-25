<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label>Name:</label>
      <input v-model="name" required />
    </div>
    <div>
      <label>Email:</label>
      <input v-model="email" type="email" required />
    </div>
    <button type="submit">Create</button>
    <button type="button" @click="handleCancel">Cancel</button>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useMutation } from "@tanstack/vue-query";
import { createUser } from "../../queries/users";

const emit = defineEmits(["success", "cancel"]);

const name = ref("");
const email = ref("");

// Create user mutation
const createUserMutation = useMutation({
  mutationFn: (userData) => createUser(userData),
  onSuccess: () => {
    emit("success");
  },
});

function handleSubmit() {
  createUserMutation.mutate({ name: name.value, email: email.value });
}

function handleCancel() {
  emit("cancel");
}
</script>
