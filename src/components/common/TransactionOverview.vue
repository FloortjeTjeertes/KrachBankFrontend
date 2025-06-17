<template>
  <div>
    transaction overview
    <section class="transactionOverview">
      
    <TransactionsTable
      v-if="transactionList && transactionList.length > 0"
      :transactions="transactionList"
      class="transactionTable"
    />
    
    </section>
    <PaginationGroup
      :currentPage="currentPage.value"
      :totalPages="totalPages.value"
      @prev="prevPage()"
      @next="nextPage()"
      v-model:currentPageProp="currentPage"
      v-model:totalPagesProp="totalPages"
      class="paginationGroup"
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
let AmountPerPage = ref(10);

onMounted(async () => {
  try {
    transactionList.value = await getTransactionsForUser(accountId);
  } catch (error) {
    console.error("Error during component mount:", error);
  }
});




async function nextPage() {
  console.log("nextPage called");
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    transactionList.value = await getTransactionsForUser(accountId, createPaginationFilter(currentPage.value, AmountPerPage.value));
    console.log("Current Page:", currentPage.value);
  }
  
}

async function prevPage() {
  console.log("prevPage called");
  if (currentPage.value > 1) {
    currentPage.value--;
    transactionList.value = await getTransactionsForUser(accountId, createPaginationFilter(currentPage.value, AmountPerPage.value));
    console.log("Current Page:", transactionList.value);
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
      filter = createPaginationFilter(currentPage.value, AmountPerPage.value); // Default to page 1 with 10 items per page
    }


    const transactions = await transactionService.getTransactionsByUserId(userId, filter); 

    if (!transactions || transactions.items.length <= 0) {
      throw new Error("No transactions found for user: " + userId);   
    }
    const items = transactions.items; // Handle both cases where items is an array or the response is directly an array
    if (!items) {
      throw new Error("No items found in the response.");
    }
    totalPages.value = transactions.totalPages ; 
    currentPage.value = transactions.currentPage+1 ; 
    console.log("Total Pages:", totalPages.value);
    console.log("Current Page:", currentPage.value);
    return items.map((transaction) => mapToTransaction(transaction));
  } catch (error) {
    console.error("Error fetching transactions for user:", error);
    toast.error(error.message);
  }
}
</script>

<style lang="css" scoped>
.transactionOverview {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  min-height: 75vh;
  max-height: 75vh;
}
.paginationGroup {
  margin-top: auto;
  display: flex;
  align-items: center;
}
</style>
