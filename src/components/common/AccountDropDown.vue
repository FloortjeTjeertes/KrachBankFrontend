<template>
  <details class="dropdown" @click="handleClick">
    <summary class="dropdown-header">
      <template v-if="!SelectedAccount">
        <span>No account of selected</span>
      </template>
      <template v-else>
        <SmallAccount class="dropdown-account" :account="SelectedAccount" />
      </template>
    </summary>
    <ul class="dropdown-body">
      <!-- <input
        type="text"
        class="dropdown-search"
        placeholder="Search accounts"
        aria-label="Search accounts"
        v-model="SelectedIban"
        @oninput="getAccounts(props.userId, props.iban)"
        @keyup="getAccounts(props.userId, props.iban)"
      /> -->
      <li class="dropdown-item" @click="setSelectedAccount(null)">
        No account
      </li>
      <li
        v-for="account in FilteredAccounts"
        :key="account.IBAN"
        class="dropdown-item"
        @click="setSelectedAccount(account)"
      >
        <SmallAccount class="selectableAccount" :account="account" />
      </li>
    </ul>
  </details>
</template>

<script setup>
import SmallAccount from "@/components/containers/SmallAccountContainer.vue";
import AccountService from "@/service/AccountService.js";
import { ref, onMounted, watch, defineEmits, defineProps } from "vue";
import { mapToAccount } from "../../utils/mappers.js";

const SelectedIban = ref("");
const emit = defineEmits(["update:modelValue"]); // Emit event to update modelValue
const props = defineProps({
  modelValue: Object, // The selected account object
  iban: {
    type: String,
    required: false,
    default: "",
  },
  userId: {
    type: Number,
    required: false,
    default: 0,
  },
});

const SelectedAccount = ref(props.modelValue);
const FilteredAccounts = ref([]);

onMounted(async () => {
  SelectedIban.value = props.iban;
  FilteredAccounts.value = await getAccounts(props.userId, props.iban);
  if (!FilteredAccounts.value) {
    console.warn("No accounts found for the given user or IBAN.");
    return;
  }
});
watch(
  () => props.modelValue,
  (newVal) => {
    SelectedAccount.value = newVal;
  }
);
watch(
  () => props.userId,
  (newVal) => {
    console.log("User ID changed:", newVal);
    SelectedAccount.value = null; // Reset selected account when searching
    emit("update:modelValue", null); // Emit null to clear the selected account
  }
);
async function getAccounts(userId, iban) {
  try {
    var accounts = null;
    console.log(userId, iban);
    if ((userId && userId > 0) || iban) {
      accounts = await getFilteredAccountsForUser(userId, iban);
    } else {
      accounts = await getAllAccounts(); // Fetch all accounts if no userId or iban is provided
    }
    return accounts || [];
  } catch (error) {
    console.error("Error in getAccounts:", error);
    return [];
  }
}
async function getAllAccounts() {
  try {
    const accounts = await AccountService.getAllAccounts(); //TODO: make a method to get all accounts for a user
    if (!accounts || accounts.length === 0) {
      console.warn("No accounts found.");
      return [];
    }
    const items = accounts.items;
    if (!items) {
      throw new Error("No items found in the response.");
    }
    console.log("all Accounts fetched successfully:", items);
    return items.map((account) => mapToAccount(account));
  } catch (error) {
    console.error("Error fetching accounts:", error);
  }
}
async function handleClick() {
  FilteredAccounts.value = await getAccounts(props.userId, props.iban);
}

async function getFilteredAccountsForUser(userId, Iban) {
  try {
    if (!userId || userId <= 0) {
      throw new Error("Invalid user ID provided.");
    }
    const accounts = await AccountService.getAccounts(userId, Iban);
    if (!accounts || accounts.length === 0) {
      return [];
    }
    const items = accounts.items;
    if (!items) {
      throw new Error("No items found in the response.");
    }
    return items.map((account) => mapToAccount(account));
  } catch (error) {
    console.error("Error fetching accounts:", error);
  }
}

function setSelectedAccount(account) {
  if (account && account.IBAN) {
    SelectedAccount.value = account;
    emit("update:modelValue", account); // Emit the selected account
  } else {
    SelectedAccount.value = null;
    emit("update:modelValue", null);
  }
}
</script>

<style lang="css" scoped>
input.dropdown-search {
  height: 100% !important;
  font-size: 0.9rem; /* Optional: make text smaller */
  padding: 0.25em 0.5em; /* Optional: reduce padding */
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}
.dropdown button {
  width: 100% !important;
}

.dropdown-account {
  width: 100% !important;
  display: flex;
  align-items: center;
}
.dropdown-item:hover {
  background-color: var(
    --pico-secondary-background
  ); /* Optional: highlight on hover */
  cursor: pointer; /* Optional: change cursor to pointer */
}
</style>
