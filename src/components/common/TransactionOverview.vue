<template>
  <div>
    transaction overview
    <TransactionsTable
      v-if="transactionList && transactionList.length > 0"
      :transactions="transactionList"
    />
    <PaginationGroup
      :current-page="1"
      :total-pages="1"
      @prev="getTransactionsForUser(accountId)"
      @next="getTransactionsForUser(accountId)"/>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TransactionsTable from "./TransactionsTable.vue";
import PaginationGroup from "./PaginationGroup.vue";
import transactionService from "@/service/TransactionService";
import { mapToTransaction } from "@/utils/mappers";
import { useToast } from "vue-toastification";
import { useUserStore } from "@/stores/userStore";
const toast = useToast();
const userStore = useUserStore();

var accountId = userStore.getUser?.id; 

let transactionList = ref([]);

onMounted(async () => {
  try {
    // Fetch transactions for the current user or a default user
    transactionList.value = await getTransactionsForUser(accountId);
  } catch (error) {
    console.error("Error during component mount:", error);
  }
});

async function getTransactionsForUser(userId) {
  try {
    if (!Number.isInteger(userId)) {
      console.warn("userId is not an integer:", userId);
      toast.error("Invalid user ID.");
      return [];
    }
    const transactions = await transactionService.getTransactionsByUserId(
      userId
    );

    if (!transactions || transactions.length === 0) {
      console.warn("No transactions found for user:", userId);
      return [];
    }

    return transactions.map((transaction) => mapToTransaction(transaction));
  } catch (e) {
    console.error("Error fetching transactions for user:", e);
    toast.error("Error fetching transactions for user: " + e.message);
  }
}
</script>

<style lang="css" scoped></style>
