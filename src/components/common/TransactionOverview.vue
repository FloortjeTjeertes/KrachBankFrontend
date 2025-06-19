<template>
  <div>
    <section class="transactionOverview">
      <h2>Transactions</h2>
      <TransactionFilterMenu
        @filter="handleFilter"
        class="transactionFilterMenu"
      />
      <TransactionsTable
        v-if="transactionList && transactionList.length > 0"
        :transactions="transactionList"
        class="transactionTable"
      />
      <p v-else class="noTransactionsMessage">No transactions found.</p>
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
import TransactionFilterMenu from "@/components/menus/TransactionFilterMenu.vue";
import { mapToTransaction } from "@/utils/mappers";
import { useToast } from "vue-toastification";
import { useUserStore } from "@/stores/userStore";
import { createPaginationFilter } from "@/filters/paginationFilter";
import { toTransactionFilter, createTransactionFilter } from "@/filters/transactionFilter";

const toast = useToast();
const userStore = useUserStore();

var accountId = userStore.getUser?.id;

let transactionList = ref([]);
let currentPage = ref(1);
let totalPages = ref(1);
let AmountPerPage = ref(5);

onMounted(async () => {
  try {
    const paginationFilter = createPaginationFilter(
      currentPage.value,
      AmountPerPage.value
    );
    transactionList.value = await getTransactionsForUser(
      accountId,
      paginationFilter
    );
  } catch (error) {
    console.error("Error during component mount:", error);
  }
});

async function nextPage() {
  console.log("nextPage called");
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    transactionList.value = await getTransactionsForUser(
      accountId,
      createPaginationFilter(currentPage.value, AmountPerPage.value)
    );
  }
}

async function prevPage() {
  console.log("prevPage called");
  if (currentPage.value > 1) {
    currentPage.value--;
    transactionList.value = await getTransactionsForUser(
      accountId,
      createPaginationFilter(currentPage.value, AmountPerPage.value)
    );
  }
}

async function getTransactionsForUser(userId, paginationFilter) {
  try {
    if (!userId) {
      console.warn("userId is undefined or null");
      toast.error("User ID is required.");
      return [];
    }
    const transactions = await transactionService.getTransactionsByUserId(
      userId,
      paginationFilter
    );

    if (!transactions || transactions.items.length <= 0) {
      return [];
    }
    const items = transactions.items; // Handle both cases where items is an array or the response is directly an array
    if (!items) {
      throw new Error("No items found in the response.");
    }
    totalPages.value = transactions.totalPages;
    currentPage.value = transactions.currentPage + 1;

    return items.map((transaction) => mapToTransaction(transaction));
  } catch (error) {
    console.error("Error fetching transactions for user:", error);
    toast.error(error.message);
  }
}

async function handleFilter(filterData) {
  try {
 
    filterData.date.dateFrom = filterData.date.after;
    const filter = makeFilterData(filterData);
    const Transactions = await transactionService.getTransactionsByUserId(
      accountId,
      createPaginationFilter(currentPage.value, AmountPerPage.value),
      filter
    );
    if (!Transactions || Transactions.items.length <= 0) {
      console.warn("No transactions found or error fetching transactions.");
    }

    transactionList.value = Transactions.items.map((transaction) =>
      mapToTransaction(transaction)
    );
    totalPages.value = Transactions.totalPages;
    currentPage.value = Transactions.currentPage + 1;

    toast.success("Transactions fetched successfully with filter");
  } catch (error) {
    console.error("Error fetching transactions for user:", error);
    toast.error(error.message);
  }
}

function makeFilterData(filterData) {
  console.log("makeFilterData called with:", filterData);
  var filter = createTransactionFilter();
  filter.sender = filterData.iban.sender;
  filter.receiver = filterData.iban.receiver;
  filter.amount.min = filterData.amount.min;
  filter.amount.max = filterData.amount.max;
  filter.date.before = filterData.date.after;
  filter.date.after = filterData.date.before;



  return toTransactionFilter(filter);

  
  
}


</script>

<style lang="css" scoped>
.transactionOverview {
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 75vh;
  max-height: 75vh;
}

.paginationGroup {
  margin-top: auto;
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
}

.transactionFilterMenu {
   box-sizing: border-box;
   margin-bottom: 0;
}
</style>
