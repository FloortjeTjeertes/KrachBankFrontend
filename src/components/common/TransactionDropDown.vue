<template>
  <details class="dropdown" @click="getAccounts">
    <summary class="dropdown-header">
      <SmallAccount class="dropdown-account" :account="SelectedAccount" />
    </summary>
    <ul class="dropdown-body">
      <input
        type="text"
        class="dropdown-search"
        placeholder="Search accounts"
        aria-label="Search accounts"
        v-model="SelectedIban"
        @oninput="getAccounts"
        @keyup="getAccounts"
      />
      <li
        v-for="account in FilterdAccounts"
        :key="account.iban"
        class="dropdown-item"
        @click="setSelectedAccount(account)"
      >
        <SmallAccount class="selectableAccount" :account="account" />
      </li>
    </ul>
  </details>
</template>

<script setup>
import SmallAccount from "@/components/common/SmallAccount.vue";
import AccountService from "@/service/AccountService.js";
import { ref, onMounted, watch, defineEmits, defineProps } from "vue";
const SelectedIban = ref("");
const emit = defineEmits(["update:modelValue"]); // Emit event to update modelValue
const props = defineProps({
  modelValue: Object, // The selected account object
  iban: {
    type: String,
    required: true,
    default: "",
  },
  userId: {
    type: Number,
    required: false,
    default: 0,
  },
});

const SelectedAccount = ref({
  owner: {
    id: 0,
    name: "none",
    firstName: "none",
    lastName: "none",
  },
  balance: 0,
  iban: "0000000000000000000000",
  type: {
    name: "NONE",
    img: "https://cdn4.iconfinder.com/data/icons/48-bubbles/48/07.Wallet-256.png",
  },
});
const FilterdAccounts = ref([
  {
    owner: {
      id: 0,
      name: "placeholderUserName",
      firstName: "placeholder",
      lastName: "placeholder",
    },
    balance: 0,
    iban: "DE00000000000000000000",
    type: {
      name: "CHECKING",
      img: "https://cdn4.iconfinder.com/data/icons/48-bubbles/48/07.Wallet-256.png",
    },
  },
]);

onMounted(async () => {
  SelectedIban.value = props.iban || ""; // Default IBAN if not provided
  FilterdAccounts.value = await getAccounts();
  if ((!props.modelValue || !props.modelValue.iban) &&FilterdAccounts.value.length > 0) {
    setSelectedAccount(FilterdAccounts.value[0]);
  }
});

async function getAccounts() {
  if (props.userId && props.userId > 0) {
    console.log("Fetching accounts for userId:", props.userId);
    return getFilteredAccountsForUser(props.userId, props.iban);
  } else {
    return getAllAccounts();
  }
}
async function getAllAccounts() {
  try {
    if (!SelectedIban.value || SelectedIban.value.trim() === "") {
      throw new Error("IBAN is required to fetch accounts.");
    }
    const filter = {
      iban: SelectedIban.value,
      // accountType: "CHECKING"  //TODO: make a toggle that allows admins to filter by account type
    };
    const accounts = await AccountService.getAllAccounts(filter); //TODO: make a method to get all accounts for a user
    console.log("Fetched accounts:", accounts);
    return accounts;
  } catch (error) {
    console.error("Error fetching accounts:", error);
  }
}

async function getFilteredAccountsForUser(userId, Iban) {
  try {
    if (!userId || userId <= 0) {
      throw new Error("Invalid user ID provided.");
    }
    const accounts = await AccountService.getAccounts(userId, Iban);
    console.log("Fetched accounts for userId:", userId, accounts);
    if (!accounts || accounts.length === 0) {
      return []; // Return an empty array if no accounts found
    }
    return accounts.filter((account) => account.owner.id === userId);
  } catch (error) {
    console.error("Error fetching accounts:", error);
  }
}
watch(
  () => props.modelValue,
  (newVal) => {
    SelectedAccount.value = newVal;
  }
);
function setSelectedAccount(account) {
  if (account && account.iban) {
    SelectedAccount.value = account;
    emit("update:modelValue", account); // Emit the selected account
  } else {
    console.warn("Invalid account selected:", account);
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
  width: auto !important;
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
