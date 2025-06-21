<template>
  <details class="dropdown" @click="getAccounts">
    <summary class="dropdown-header">
      <!-- <SmallUser class="dropdown-account" :account="SelectedAccount" /> -->
      {{ name.firstName }} {{ name.lastName }}
    </summary>
    <ul class="dropdown-body">
      <input
        type="text"
        class="dropdown-search"
        placeholder="Search accounts"
        aria-label="Search accounts"
        v-model="userName"
        @oninput="getUser(userName)"
        @keyup="getUser(userName)"
      />
      <li
        v-for="transaction in filterdTransactions"
        :key="transaction.Id"
        class="dropdown-item"
        @click="setSelectedAccount(account)"
      >
        <SmallAccount class="selectableAccount" :account="account" />
      </li>
    </ul>
  </details>
</template>

<script setup>
import { ref, watch } from "vue";
// import SmallAccount from "@/components/containers/SmallAccountContainer.vue";
import UserService from "@/service/UserService.js";

const props = defineProps({
  userId: {
    type: String,
    required: false,
  },
});
const filteredTransactions = ref([]);
const userName = ref("John Doe");
const name = {
  firstName: "John",
  lastName: "Doe",
};

watch(userName, (newValue) => {
  if (newValue) {
    name.firstName = newValue.split(" ")[0] || "firstName";

    name.lastName = newValue.split(" ")[1] || null;
  } else {
    filteredTransactions.value = [];
  }
});



async function getUser(Name) {
  UserService.getUserByName(Name)
    .then((response) => {
      if (response.data) {
        selectedUser.value = response.data;
        name.firstName = response.data.firstName || "firstName";
        name.lastName = response.data.lastName || "lastName";
      } else {
        console.warn("No user data found for ID:", props.userId);
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
}

const selectedUser = ref({
  id: 0,
  name: "placeholderUserName",
  firstName: "placeholder",
  lastName: "placeholder",
});

function setSelectedAccount(account) {
  console.log("Selected account:", account);
  if (account && account.IBAN) {
    Selece.value = account;
    emit("update:modelValue", account); // Emit the selected account
  } else {
    console.warn("Invalid account selected:", account);
  }
}
</script>

<style lang="css" scoped></style>
