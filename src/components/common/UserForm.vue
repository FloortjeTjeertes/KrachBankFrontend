<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label>First name:</label>
      <input v-model="firstname" required />
    </div>
    <div>
      <label>Last name:</label>
      <input v-model="lastname" required />
    </div>
    <div>
      <label>Email:</label>
      <input v-model="email" type="email" required />
    </div>
    <div>
      <label>Phone number:</label>
      <input v-model="phonenumber" required />
    </div>
    <div>
      <label>BSN:</label>
      <input v-model="bsn" required />
    </div>
    <div>
      <label>Transfer Limit:</label>
      <input v-model="transferLimit" type="number" required />
    </div>
    <button type="submit">{{ mode === 'create' ? 'Create' : 'Update' }}</button>
    <button type="button" @click="handleCancel">Cancel</button>
  </form>
</template>

<script setup>
import { ref, watch, toRefs } from "vue";
import { useMutation } from "@tanstack/vue-query";
import { register } from "../../queries/authentication";
import { updateUser } from "../../queries/users";

const props = defineProps({
  user: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  isUpdate: {
    type: Boolean,
    default: "true", // or "create"
  },
});
const emit = defineEmits(["success", "cancel"]);

const { user, isUpdate } = toRefs(props);

const firstname = ref("");
const lastname = ref("");
const email = ref("");
const phonenumber = ref("");
const bsn = ref("");
const transferLimit = ref("");

// Populate form when user prop changes (only for update mode)
watch(
  [user, isUpdate],
  ([val, currentMode]) => {
    if (currentMode && val) {
      firstname.value = val.firstname || "";
      lastname.value = val.lastname || "";
      email.value = val.email || "";
      phonenumber.value = val.phonenumber || "";
      bsn.value = val.bsn || "";
      transferLimit.value = val.transferLimit || "";
    }
    if (!currentMode) {
      firstname.value = "";
      lastname.value = "";
      email.value = "";
      phonenumber.value = "";
      bsn.value = "";
      transferLimit.value = "";
    }
  },
  { immediate: true }
);

const createUserMutation = useMutation({
  mutationFn: (userData) => register(userData),
  onSuccess: () => {
    emit("success");
  },
});

const updateUserMutation = useMutation({
  mutationFn: ({ userId, userData }) => updateUser(userId, userData),
  onSuccess: () => {
    emit("success");
  },
});

function handleSubmit() {
  const userData = {
    firstname: firstname.value,
    lastname: lastname.value,
    email: email.value,
    phonenumber: phonenumber.value,
    bsn: bsn.value,
    transferLimit: transferLimit.value,
  };
  if (!isUpdate.value) {
    createUserMutation.mutate(userData);
  } else {
    updateUserMutation.mutate({
      userId: user.value.id,
      userData,
    });
  }
}

function handleCancel() {
  emit("cancel");
}
</script>
