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
    <button type="submit">Update</button>
    <button type="button" @click="handleCancel">Cancel</button>
  </form>
</template>

<script setup>
import { ref, watch, toRefs } from "vue";
import { useMutation } from "@tanstack/vue-query";
import { updateUser } from "../../queries/users";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["success", "cancel"]);

const { user } = toRefs(props);

const firstname = ref("");
const lastname = ref("");
const email = ref("");
const phonenumber = ref("");
const bsn = ref("");
const transferLimit = ref("");

// Populate form when user prop changes
watch(
  user,
  (val) => {
    if (val) {
      firstname.value = val.firstname || "";
      lastname.value = val.lastname || "";
      email.value = val.email || "";
      phonenumber.value = val.phonenumber || "";
      bsn.value = val.bsn || "";
      transferLimit.value = val.transferLimit || "";
    }
  },
  { immediate: true }
);

const updateUserMutation = useMutation({
  mutationFn: ({ userId, userData }) => updateUser(userId, userData),
  onSuccess: () => {
    emit("success");
  },
});

function handleSubmit() {
  updateUserMutation.mutate({
    userId: user.value.id,
    userData: {
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      phonenumber: phonenumber.value,
      bsn: bsn.value,
      transferLimit: transferLimit.value,
    },
  });
}

function handleCancel() {
  emit("cancel");
}
</script>
