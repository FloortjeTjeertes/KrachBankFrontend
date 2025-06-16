<template>
  <div>
    <h1>account page</h1>
    <section class="row">
      <section class="col-md-5">
        <BankAccount :bankAccount="bankAccount"></BankAccount>
      </section>
      <section class="col-md TransactionsTable">
        <TransactionsTable :transactions="transactionList" />
        <button class="btn btn-primary" @click="makeNewTransaction()">
          Create Transaction
        </button>
      </section>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BankAccount from "@/components/containers/BankAccountContainer.vue";
import TransactionsTable from "@/components/common/TransactionsTable.vue";
import { mapToTransaction } from "@/utils/mappers";
import { useRoute, useRouter } from "vue-router";
import { mapToAccount } from "@/utils/mappers.js";

import { createPaginationFilter } from "@/filters/paginationFilter";
import AccountService from "@/service/AccountService";
import TransactionService from "@/service/TransactionService";
const router = useRouter();
const route = useRoute();
const accountId = route.params.iban;
const bankAccount = ref({
  name: "Default Bank Account",
  owner: {
    id: 0,
    name: "placeholderUserName",
    firstName: "placeholder",
    lastName: "placeholder",
  },
  balance: 0,
  IBAN: "DE00000000000000000000",
  createdAt: new Date().toISOString(),
  absoluteLimit: 0,
  type: {
    name: "Checking",
    img: "https://example.com/checking-icon.png", // Placeholder image URL
  },
});

let transactionList = ref([]);

onMounted(async () => {
  try {
    console.log(
      "AccountPage mounted, fetching account and transactions for accountId:",
      accountId
    );

    bankAccount.value = await getAccountByIban(accountId);
    console.log("Fetched bank account:", bankAccount.value);
    // Fetch transactions for the account
    transactionList.value = await getTransactionsForAccount(accountId);
  } catch (error) {
    console.error("Error during component mount:", error);
  }
});

async function getAccountByIban(iban) {
  try {
    const account = await AccountService.getAccountByIban(iban);
    if (!account) {
      console.warn("No account found for the given IBAN.");
      return null;
    }

    return mapToAccount(account);
  } catch (error) {
    throw new Error("Error fetching account: " + error.message);
  }
}

async function getTransactionsForAccount(accountId, filter) {
  try {
    if (!accountId) {
      console.warn("Invalid account ID:", accountId);
      return [];
    }
    if (!filter) {
      // filter = createPaginationFilter(1, 10); // Default to page 1 with 10 items per page
      filter = null;
    }
    const transactions = await TransactionService.getTransactionsForAccount(
      accountId,
      // filter
    );
        console.log("Fetched transactions:", transactions);
    if (!transactions || transactions.items.length <= 0) {
      throw new Error("No transactions found for account: " + accountId);
    }
    const items = transactions.items; // Handle both cases where items is an array or the response is directly an array
    if (!items) {
      throw new Error("No items found in the response.");
    }
    return items.map((transaction) => mapToTransaction(transaction));
  } catch (error) {
    throw new Error(error.message);
  }
}

function makeNewTransaction() {
  router.push({
    name: "NewAccountTransaction",
    params: { iban: bankAccount.value.IBAN },
  });
}
</script>

<style lang="css" scoped>
.TransactionsTable {
  max-width: 20%;
  height: 10vh !important;
  font-size: medium;
}
</style>
