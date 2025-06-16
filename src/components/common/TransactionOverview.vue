<template>
  <div>
    transaction overview
    <TransactionsTable
      v-if="transactionList && transactionList.length > 0"
      :transactions="transactionList"
    />
    <PaginationGroup
      :current-page="currentPage"
      :total-pages="totalPages"
      @prev="prevPage()"
      @next="nextPage()"
      v-model:currentPageProp="currentPage"
      v-model:total-pages="totalPage"
    />
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
import { createPaginationFilter } from "@/filters/paginationFilter";
const toast = useToast();
const userStore = useUserStore();

var accountId = userStore.getUser?.id;

let transactionList = ref([]);
let currentPage = ref(1);
let totalPages = ref(1);
let AmmountPerPage = ref(10);

onMounted(async () => {
  try {
    transactionList.value = await getTransactionsForUser(accountId);
  } catch (error) {
    console.error("Error during component mount:", error);
  }
});


function nextPage() {
  console.log("nextPage called");
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    getTransactionsForUser(accountId, createPaginationFilter(currentPage.value, AmmountPerPage.value));
    console.log("Current Page:", currentPage.value);
  }
  
}

function prevPage() {
  console.log("prevPage called");
  if (currentPage.value > 1) {
    currentPage.value--;
    getTransactionsForUser(accountId, createPaginationFilter(currentPage.value, AmmountPerPage.value));
    console.log("Current Page:", currentPage.value);
  }
}


async function getTransactionsForUser(userId,filter) {
  try {
   
    if (!userId) {
      console.warn("userId is undefined or null");
      toast.error("User ID is required.");
      return [];
    }
    
    if (!filter) {
      filter = createPaginationFilter(currentPage.value, AmmountPerPage); // Default to page 1 with 10 items per page
    }


    const transactions = await transactionService.getTransactionsByUserId(userId, filter); 

    if (!transactions || transactions.items.length <= 0) {
      throw new Error("No transactions found for user: " + userId);   
    }
    const items = transactions.items; // Handle both cases where items is an array or the response is directly an array
    if (!items) {
      throw new Error("No items found in the response.");
    }

    return items.map((transaction) => mapToTransaction(transaction));
  } catch (error) {
    console.error("Error fetching transactions for user:", error);
    toast.error(error.message);
  }
}
</script>

<style lang="css" scoped></style>
