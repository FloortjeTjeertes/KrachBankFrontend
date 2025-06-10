<template>
  <form @submit.prevent="handleSubmit">
    <div v-if="disableCancel" style="background: #fff3cd; color: #856404; border: 1px solid #ffeeba; padding: 1em; margin-bottom: 1em; border-radius: 4px;">
      <strong>Actie vereist:</strong> Deze gebruiker is zojuist geverifieerd.<br>
      Vul hieronder de <b>Absolute Limiet</b> (Transfer Limit) en <b>Dagelijkse Limiet</b> (Daily Limit) in.<br>
      <span style="font-size:0.95em;">
        De absolute limiet bepaalt het minimale saldo dat deze gebruiker mag hebben (mag niet onder deze waarde komen).<br>
        De dagelijkse limiet bepaalt hoeveel deze gebruiker maximaal per dag mag overboeken.
      </span>
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
    <div>
      <label>Password:</label>
      <input v-if="!isUpdate" v-model="password" type="password" required />
    </div>
    <button type="submit">{{ !isUpdate ? 'Create' : 'Update' }}</button>
    <button type="button" @click="handleCancel" :disabled="disableCancel">Cancel</button>
  </form>
</template>

<script setup>
import { ref, watch, toRefs } from "vue";
import { useMutation } from "@tanstack/vue-query";
import { register } from "../../queries/authentication";
import { updateUser, verifyUser } from "../../queries/users";
import { createAccount } from "../../queries/accounts"; // importeer createAccount

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
const password = ref("");

// Populate form when user prop changes (only for update mode)
watch(
  [user, isUpdate],
  ([val, currentMode]) => {
    if (currentMode && val) {
      firstname.value = val.firstName || "";
      lastname.value = val.lastName || "";
      email.value = val.email || "";
      phonenumber.value = val.phoneNumber || "";
      bsn.value = val.bsn || "";
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
      password.value = "";
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
  onSuccess: async (_, variables) => {
    // Als disableCancel true is, voer dan ook verifyUser uit na update
    if (disableCancel.value) {
      await verifyUser(variables.userId);
      // Maak direct na verificatie de accounts aan
      // Je kunt hier meerdere accounts aanmaken indien gewenst
      await createAccount({
        ownerId: variables.userId,
        type: "CHECKING",
        absoluteLimit: Number(transferLimit.value),
      });
      await createAccount({
        ownerId: variables.userId,
        type: "SAVINGS",
        absoluteLimit: 0,
      });
    }
    emit("success");
  },
});

function handleSubmit() {
  const userData = {
    firstName: firstname.value,
    lastName: lastname.value,
    email: email.value,
    phoneNumber: phonenumber.value,
    bsn: bsn.value,
    transferLimit: Number(transferLimit.value),
    dailyLimit: Number(dailyLimit.value),
    // Voeg deze regel toe:
    active: user.value?.active !== undefined ? user.value.active : true,
    ...(isUpdate.value ? {} : { password: password.value }),
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
