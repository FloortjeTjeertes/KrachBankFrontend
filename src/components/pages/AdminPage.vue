<template>
  <div>
    <nav>
      <button @click="activeTab = 'users'">Users</button>
      <button @click="activeTab = 'transactions'">Transactions</button>
      <button @click="activeTab = 'accounts'">Accounts</button>
      <!-- Add more buttons for other containers if needed -->
    </nav>
    <div style="padding-top: 24px;">
      <div v-if="activeTab === 'users'">
        <UserContainer />
      </div>
      <div v-else-if="activeTab === 'transactions'">
        <TransactionsContainer />
      </div>
      <div v-else-if="activeTab === 'accounts'">
        <AccountsContainer />
      </div>
      <!-- Add more containers here as needed -->
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import UserContainer from "../containers/UserContainer.vue";
import TransactionsContainer from "../containers/TransactionsContainer.vue";
import AccountsContainer from "../containers/AccountsContainer.vue";

const activeTab = ref("users");
</script>
