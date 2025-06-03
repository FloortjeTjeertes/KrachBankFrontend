<template>
  <form @submit.prevent="handleSubmit">
    <div v-if="disableCancel" style="background: #fff3cd; color: #856404; border: 1px solid #ffeeba; padding: 1em; margin-bottom: 1em; border-radius: 4px;">
      <strong>Action required:</strong> Please set the <b>Transfer Limit</b> and <b>Daily Limit</b> for this user before verifying.
    </div>
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
      <input v-model="transferLimit" type="number" required @input="syncDailyLimit" />
    </div>
    <div>
      <label>Daily Limit:</label>
      <input v-model="dailyLimit" type="number" required />
    </div>
    <button type="submit">{{ !isUpdate ? 'Create' : 'Update' }}</button>
    <button type="button" @click="handleCancel" :disabled="disableCancel">Cancel</button>
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
  disableCancel: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["success", "cancel"]);

const { user, isUpdate, disableCancel } = toRefs(props);

const firstname = ref("");
const lastname = ref("");
const email = ref("");
const phonenumber = ref("");
const bsn = ref("");
const transferLimit = ref("");
const dailyLimit = ref("");

// Populate form when user prop changes (only for update mode)
watch(
  [user, isUpdate],
  ([val, currentMode]) => {
    if (currentMode && val) {
      firstname.value = val.firstName || "";
      lastname.value = val.lastName || "";
      email.value = val.email || "";
      phonenumber.value = val.phoneNumber || "";
      bsn.value = val.BSN || "";
      transferLimit.value = val.transferLimit || "";
      dailyLimit.value = val.dailyLimit !== undefined ? val.dailyLimit : val.transferLimit || "";
    }
    if (!currentMode) {
      firstname.value = "";
      lastname.value = "";
      email.value = "";
      phonenumber.value = "";
      bsn.value = "";
      transferLimit.value = "";
      dailyLimit.value = "";
    }
  },
  { immediate: true }
);

// Keep dailyLimit in sync with transferLimit if dailyLimit is empty or equal to transferLimit
function syncDailyLimit() {
  if (!isUpdate.value || dailyLimit.value === "" || dailyLimit.value === user.value?.transferLimit) {
    dailyLimit.value = transferLimit.value;
  }
}

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
    dailyLimit: dailyLimit.value,
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
