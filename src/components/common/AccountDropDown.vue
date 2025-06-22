<template>
  <details class="dropdown" @click="handleClick">
    <summary class="dropdown-header">
      <SmallAccount class="dropdown-account" :account="SelectedAccount" />
    </summary>
    {{ userId }}
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
        v-for="account in FilteredAccounts"
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
const placeholderAccount = {
  owner: {
    id: 0,
    name: "placeholderUserName",
    firstName: "placeholder",
    lastName: "placeholder",
  },
  balance: 0,
  iban: "0000000000000000000000",
  type: "CHECKING",
};

const SelectedAccount = ref(placeholderAccount);
const FilteredAccounts = ref([
  {
    owner: {
      id: 0,
      name: "placeholderUserName",
      firstName: "placeholder",
      lastName: "placeholder",
    },
    balance: 0,
    iban: "0000000000000000000000",
    type: {
      name: "CHECKING",
      img: "",
    },
  },
]);

onMounted(async () => {
  SelectedIban.value = props.iban;
  FilteredAccounts.value = await getAccounts();
  if (!FilteredAccounts.value) {
    console.warn("No accounts found for the given user or IBAN.");
    return;
  }
  // setSelectedAccount(FilteredAccounts.value[0]);
});

async function getAccounts() {
  try {
    if (
      !props.userId &&
      props.userId < 0 &&
      !props.iban &&
      props.iban.trim() === ""
    ) {
      throw new Error("Invalid user ID or IBAN provided.");
    }
    console.log("Fetching accounts for userId:", props.userId, "and IBAN:", props.iban);
    const accounts = await getFilteredAccountsForUser(props.userId, props.iban);
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
  FilteredAccounts.value = await getAccounts();
}

//tODO: maybe combine behavior of getFilteredAccountsForUser and getAllAccounts
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
watch(
  () => props.modelValue,
  (newVal) => {
    SelectedAccount.value = newVal;
  }
);

function setSelectedAccount(account) {
  if (account && account.IBAN) {
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
