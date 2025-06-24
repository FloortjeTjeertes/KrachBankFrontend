<script setup>
import { ref, watch, computed } from 'vue';
import TransactionsTable from '../common/TransactionsTable.vue';
import PaginationGroup from '../common/PaginationGroup.vue';
import transactionService from '@/service/TransactionService';
import { mapToTransaction } from '@/utils/mappers';
import { useToast } from 'vue-toastification';
import { createPaginationFilter } from '@/filters/paginationFilter';
import { toTransactionFilter, createTransactionFilter } from '@/filters/transactionFilter';
import Loading from '../common/Loading.vue';
import AddTransactionModal from '../common/AddTransactionModal.vue';

const toast = useToast();

let transactionList = ref([]);
let currentPage = ref(1);
let totalPages = ref(1);
let amountPerPage = ref(10);
const isLoading = ref(false);

// Filter State
const filterSenderIban = ref('');
const filterReceiverIban = ref('');
const filterMinAmount = ref(null);
const filterMaxAmount = ref(null);
const filterBeforeDate = ref('');
const filterAfterDate = ref('');

// --- Modal State ---
const showAddTransactionModal = ref(false);
const isSubmitting = ref(false);

// Watch filters and currentPage for live update
watch(
  [filterSenderIban, filterReceiverIban, filterMinAmount, filterMaxAmount, filterBeforeDate, filterAfterDate, currentPage],
  async () => {
    await loadTransactions(
      createPaginationFilter(currentPage.value, amountPerPage.value),
      getCombinedFilterData()
    );
  },
  { immediate: true }
);

async function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

async function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function getCombinedFilterData() {
  const rawFilterData = {
    iban: {
      sender: filterSenderIban.value,
      receiver: filterReceiverIban.value,
    },
    amount: {
      min: filterMinAmount.value,
      max: filterMaxAmount.value,
    },
    date: {
      before: filterBeforeDate.value,
      after: filterAfterDate.value,
    },
  };
  return makeFilterData(rawFilterData);
}

async function loadTransactions(paginationFilter, filter = null) {
  isLoading.value = true;
  try {
    const transactions = await transactionService.getAllTransactions(paginationFilter, filter);

    if (!transactions || !transactions.items || transactions.items.length <= 0) {
      transactionList.value = [];
      totalPages.value = 1;
      currentPage.value = 1;
      return [];
    }

    totalPages.value = transactions.totalPages;
    currentPage.value = transactions.currentPage + 1;
    transactionList.value = transactions.items.map(mapToTransaction);
    return transactionList.value;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    toast.error(error.message || 'Failed to fetch transactions.');
    transactionList.value = [];
    totalPages.value = 1;
    currentPage.value = 1;
    return [];
  } finally {
    isLoading.value = false;
  }
}

function makeFilterData(filterData) {
  let filter = createTransactionFilter();

  filter.sender = filterData.iban.sender || undefined;
  filter.receiver = filterData.iban.receiver || undefined;
  filter.amount.min = filterData.amount.min !== null && filterData.amount.min !== '' ? filterData.amount.min : undefined;
  filter.amount.max = filterData.amount.max !== null && filterData.amount.max !== '' ? filterData.amount.max : undefined;

  let tempFilter = createTransactionFilter();
  tempFilter.sender = filterData.iban.sender;
  tempFilter.receiver = filterData.iban.receiver;
  tempFilter.amount.min = filterData.amount.min;
  tempFilter.amount.max = filterData.amount.max;
  tempFilter.date.before = filterData.date.after;
  tempFilter.date.after = filterData.date.before;

  return toTransactionFilter(tempFilter);
}

// --- Modal Handlers ---
function handleAddTransaction() {
  showAddTransactionModal.value = true;
}

function handleCloseModal() {
  showAddTransactionModal.value = false;
}

// New method to handle the 'submit' event from the modal
async function handleTransactionSubmit(transactionData) {
  isSubmitting.value = true;
  try {
    // Correctly pass the entire transactionData object
    await transactionService.sendTransaction(transactionData);
    toast.success("Transaction added successfully!");
    showAddTransactionModal.value = false;
    currentPage.value = 1;
  } catch (error) {
    console.error('Error sending transaction:', error);
    toast.error(error.message || 'Failed to add transaction.');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="p-4 bg-gray-50 min-h-screen font-inter">
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 class="text-xl font-semibold mb-4 text-gray-800">Filter Transactions</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Sender IBAN</label>
          <input type="text" v-model="filterSenderIban" placeholder="e.g., NLXXKRCHXXXXXXXXXX"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Receiver IBAN</label>
          <input type="text" v-model="filterReceiverIban" placeholder="e.g., NLXXKRCHXXXXXXXXXX"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
          <input type="number" v-model="filterMinAmount" placeholder="e.g., 50.00" step="0.01"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
          <input type="number" v-model="filterMaxAmount" placeholder="e.g., 500.00" step="0.01"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">After Date</label>
          <input type="date" v-model="filterAfterDate"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Before Date</label>
          <input type="date" v-model="filterBeforeDate"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" />
        </div>
      </div>
    </div>
    <div class="flex justify-end mb-4">
      <button @click="handleAddTransaction"
        class="px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow hover:bg-green-700 transition">
        + Add Transaction
      </button>
    </div>
    <span v-if="isLoading" class="flex justify-center items-center h-full">
      <Loading />
    </span>
    <span v-else-if="transactionList && transactionList.length > 0">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Transactions List</h2>
      <TransactionsTable :transactions="transactionList" />
    </span>
    <p v-else class="text-center text-gray-600 p-4">No transactions found matching your criteria.</p>

    <PaginationGroup v-if="transactionList && transactionList.length > 0" :currentPage="currentPage"
      :totalPages="totalPages" @prev="prevPage()" @next="nextPage()" v-model:currentPageProp="currentPage"
      v-model:totalPagesProp="totalPages" class="paginationGroup" />

    <AddTransactionModal
      :show="showAddTransactionModal"
      :loading="isSubmitting"
      @close="handleCloseModal"
      @submit="handleTransactionSubmit"
    />
  </div>
</template>

<style scoped>
.paginationGroup {
  margin-top: auto;
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
}
</style>