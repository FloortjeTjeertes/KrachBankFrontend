<template>
  <h2>Overview</h2>

  <ActionMenu @filter="handleFilter" class="box" />
  <section v-if="bankAccounts.length === 0 || !bankAccounts">
    <p>No bank accounts found.</p>
  </section>
  <section class="accountList" v-else>
    <BankAccount
      @click="handleClick(account)"
      v-for="account in bankAccounts"
      :key="account"
      :bankAccount="account"
      class="bank-account"
    />
  </section>
  <!-- TODO: make pagination -->
</template>
<script setup>
import ActionMenu from "../menus/ActionMenu.vue";
import BankAccount from "../containers/BankAccountContainer.vue";

import { ref, onMounted, toRaw } from "vue";
import { useUserStore } from "../../stores/userStore";
import { useToast } from "vue-toastification";
import { mapToAccount } from "../../utils/mappers.js";
import { useRouter } from "vue-router";
import AccountService from "../../service/AccountService.js";

const router = useRouter();
const toast = useToast();
const userStore = useUserStore();
const bankAccounts = ref([]);

//TODO: move this to the router

const currentUser = userStore.getUser?.id;

onMounted(async () => {
  try {
    const accounts = await AccountService.getAccounts(currentUser);

    console.log("Accounts fetched successfully:", accounts);
    if (!accounts || accounts.items.length <= 0) {
      toast.warning("No accounts found or error fetching accounts.");
      console.warn("No accounts found or error fetching accounts.");
      return;
    }
    const items = accounts.items; // Handle both cases where items is an array or the response is directly an array
    if (!items) {
      throw new Error("No items found in the response.");
    }

    bankAccounts.value = items.map((account) => mapToAccount(account));
  } catch (error) {
    toast.error(error.message || "Error fetching accounts");
    console.error("Error during account fetch:", error);
  }
});

async function handleFilter(filterData) {
  let filter = toRaw(filterData);
  console.log("Filter data received:", filter);
  try {
    const accounts = await AccountService.getAccounts(currentUser, filter);
    console.log("Accounts fetched with filter:", accounts);
    if (!accounts && accounts.items.length < 0) {
      console.warn("No accounts found or error fetching accounts with filter.");
    }

    const items = accounts.items; 
    if (!items) {
      throw new Error("No items found in the response.");
    }
    bankAccounts.value = items.map((account) => mapToAccount(account));
    toast.success("Accounts fetched successfully with filter");
  } catch (error) {
    toast.error(error.message || "Error fetching accounts with filter");
    console.error("Error during account fetch with filter:", error);
  }
}

function handleClick(account) {
  console.log("Account clicked:", account);
  router.push({
    name: "AccountDetails",
    params: { iban: account.IBAN },
  });
}
</script>

<style lang="css" scoped>
.accountList {
  /* display:grid;
  grid-template-columns: 1fr 1fr ; */
  /* grid-gap: 1%; */
}
.bank-account {
  width: 50% !important;
}
.bank-account:hover {
  background-color: var(--pico-secondary-background);
  cursor: pointer;
}
</style>
