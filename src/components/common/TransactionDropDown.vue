<template>
  <article class="dropdown">
    <header class="dropdown-header">
      <SmallAccount
        class="dropdown-account col-md"
        :account="SelectedAccount"
      />
      <button class="col-md-1" @click="toggleDropdown">V</button>
    </header>
    <section v-if="isOpen" class="dropdown-body">
      <input
        type="text"
        class="dropdown-search"
        placeholder="Search accounts"
        aria-label="Search accounts"
      />
      <div class="dropdown-list">
        <div v-for="account in FilterdAccounts" :key="account.iban" class="dropdown-item">
          <SmallAccount :account="account" />
        </div>

        <!-- Add more accounts as needed -->
      </div>
    </section>
  </article>
</template>

<script setup>
import SmallAccount from "@/components/common/SmallAccount.vue";
import { ref } from "vue";
const isOpen = ref(false);
const SelectedAccount = ref({
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

defineProps({
  iban: {
    type: String,
    required: true,
    default: "DE00000000000000000000",
  },
});
function toggleDropdown() {
  isOpen.value = !isOpen.value;
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
  /* height: 100%; */
}
.dropdown-list {
  list-style: none !important;

  padding: 0;
  margin: 0;
}
</style>
