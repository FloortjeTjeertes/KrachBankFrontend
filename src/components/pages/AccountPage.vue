<template>
  <div>
    <h1>account page</h1>
    <section class="row">
      <section class="col-md-5">
        <BankAccount :bankAccount="bankAccount"></BankAccount>
        <button
          class="btn btn-primary"
          @click="makeNewTransaction()"
        >
          Create Transaction
        </button>
      </section>
      <section class="col-md">
        <TransactionsTable
          class="TransactionsTable"
          :transactions="transactionList"
        />
      </section>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BankAccount from "../common/BankAccount.vue";
import TransactionsTable from "../common/TransactionsTable.vue";
import transaction from "../../queries/transactions";
import { mapToTransaction } from "../../utils/mappers";
import { useToast } from "vue-toastification";
import { useRoute,useRouter } from "vue-router";
import { mapToAccount } from "../../utils/mappers.js";

import AccountService from "../../service/AccountService";
import TransactionService from "../../service/TransactionService";
const toast = useToast();
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
// const userStore = useUserStore();

let transactionList = ref([]);

onMounted(() => {
  try {
    console.log(
      "AccountPage mounted, fetching account and transactions for accountId:",
      accountId
    );
   
    AccountService.getAccountByIban(accountId)
      .then((account) => {
        if (!account) {
          console.warn("No account found for the given accountId.");
          return;
        }
        console.log("Account fetched successfully:", account);
        let sanitizedAccount = mapToAccount(account);
        if (!sanitizedAccount) {
          console.warn("Sanitized account is null or undefined.");
          return;
        }

        bankAccount.value = sanitizedAccount;
      })
      .catch((error) => {
        toast.error("Error fetching account: " + error.message);
        console.error("Error fetching account:", error);
      });

    TransactionService.getTransactionsForAccount(accountId)
      .then((transactions) => {
        if (!transactions || transactions.length <= 0) {
          console.warn("No transactions found for account.");
          return;
        }
        console.log("Transactions fetched for account:", transactions);
        transactionList.value = transactions.map((transaction) =>
          mapToTransaction(transaction)
        );

        console.log(
          "Transactions fetched successfully for account.",
          transactionList.value
        );
      })
      .catch((error) => {
        toast.error("Error fetching transactions: " + error.message);
        console.error("Error fetching transactions:", error);
      });
  } catch (error) {
    console.error("Error during component mount:", error);
  }
});

function makeNewTransaction() {
  console.log("Navigating to transaction creation page with IBAN:", bankAccount.value.IBAN);
  router.push({
    name: "NewAccountTransaction",
    params: { iban: bankAccount.value.IBAN },
  });
}
</script>

<style lang="css" scoped>
.TransactionsTable {
  max-width: 20vw;
}
</style>
