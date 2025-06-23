<script setup>
import Loading from "../common/Loading.vue";
import TransactionsTable from "../common/TransactionsTable.vue";
import { useQueryClient, useQuery, useMutation } from "@tanstack/vue-query";
import { fetchTransactions, addTransaction } from "../../queries/transactions";
import { ref, computed, watch } from 'vue'; // Make sure 'watch' is imported here!

// Access QueryClient instance
const queryClient = useQueryClient();

// Reactive state for pagination
const currentPage = ref(0); // Backend often uses 0-indexed pages
const itemsPerPage = ref(10);

// Reactive state for filter options
const filterSenderIban = ref('');
const filterReceiverIban = ref('');
const filterMinAmount = ref(null); // Use null for empty number inputs
const filterMaxAmount = ref(null); // Use null for empty number inputs
const filterBeforeDate = ref(''); // For date inputs (YYYY-MM-DD string)
const filterAfterDate = ref('');  // For date inputs (YYYY-MM-DD string)

// Computed property for active filters
const activeFilters = computed(() => {
  const filters = {};
  if (filterSenderIban.value && filterSenderIban.value.trim() !== '') {
    filters.senderIban = filterSenderIban.value.trim();
  }
  if (filterReceiverIban.value && filterReceiverIban.value.trim() !== '') {
    filters.receiverIban = filterReceiverIban.value.trim(); // Corrected typo here!
  }
  if (filterMinAmount.value !== null && filterMinAmount.value !== '') {
    const val = parseFloat(filterMinAmount.value);
    if (!isNaN(val)) filters.minAmount = val;
  }
  if (filterMaxAmount.value !== null && filterMaxAmount.value !== '') {
    const val = parseFloat(filterMaxAmount.value);
    if (!isNaN(val)) filters.maxAmount = val;
  }
  if (filterBeforeDate.value && filterBeforeDate.value.trim() !== '') {
    filters.beforeDate = filterBeforeDate.value.trim();
  }
  if (filterAfterDate.value && filterAfterDate.value.trim() !== '') {
    filters.afterDate = filterAfterDate.value.trim();
  }
  console.log('Computed activeFilters:', filters); // Debugging Log 1
  return filters;
});

// Function to apply filters
const applyFilters = () => {
  console.log('Apply Filters button clicked!'); // Debugging Log 2
  // Reset to the first page when filters are applied
  // This will cause a queryKey change and trigger a refetch if currentPage was not 0
  currentPage.value = 0;

  // IMPORTANT: REMOVED queryClient.invalidateQueries({ queryKey: ["transactions"] });
  // This was causing the activeFilters to become empty due to a race condition/unintended re-evaluation.
  // Vue Query will automatically re-fetch because `currentPage.value` changes and `activeFilters.value` is reactive in `queryKey`.

  console.log('currentPage after applyFilters:', currentPage.value); // Debugging Log 3
};

// --- Debugging Watchers (Keep these for now, they are helpful) ---
watch(activeFilters, (newFilters, oldFilters) => {
  console.log('WATCHER: activeFilters changed. Old:', oldFilters, 'New:', newFilters); // Debugging Log 4
}, { deep: true }); // 'deep: true' is important for objects

watch(currentPage, (newPage, oldPage) => {
  console.log('WATCHER: currentPage changed. Old:', oldPage, 'New:', newPage); // Debugging Log 5
});
// --- End Debugging Watchers ---

// Query for fetching transactions
const { isLoading, isError, data, error, refetch } = useQuery({
  queryKey: () => [
    "transactions",
    {
      page: currentPage.value,
      limit: itemsPerPage.value,
      senderIban: filterSenderIban.value,
      receiverIban: filterReceiverIban.value,
      minAmount: filterMinAmount.value,
      maxAmount: filterMaxAmount.value,
      beforeDate: filterBeforeDate.value,
      afterDate: filterAfterDate.value,
    },
  ],
  queryFn: ({ queryKey }) => {
    const params = queryKey[1];
    console.log("Calling fetchTransactions with query params:", params); // Debugging
    return fetchTransactions(params, params.page, params.limit);
  },
});
// Mutation for adding a transaction
const { mutate, isPending } = useMutation({
  mutationFn: addTransaction,
  onSuccess: () => {
    // Invalidate the query so data gets refetched after a successful add
    // This is correct here as you want to refetch ALL transactions after adding one.
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  },
});

function onButtonClick() {
  mutate({
    to: "AZ77VTBA00000000001234567890",
    from: "BY86AKBB10100000002966000000",
    amount: 5.55,
  });
}
</script>

<template>
  <div class="p-4 bg-gray-50 min-h-screen font-inter">
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 class="text-xl font-semibold mb-4 text-gray-800">Filter Transactions</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label for="filterSenderIban" class="block text-sm font-medium text-gray-700 mb-1">Sender IBAN</label>
          <input
            type="text"
            id="filterSenderIban"
            v-model="filterSenderIban"
            @keyup.enter="applyFilters"
            placeholder="e.g., NLXXKRCHXXXXXXXXXX"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label for="filterReceiverIban" class="block text-sm font-medium text-gray-700 mb-1">Receiver IBAN</label>
          <input
            type="text"
            id="filterReceiverIban"
            v-model="filterReceiverIban"
            @keyup.enter="applyFilters"
            placeholder="e.g., NLXXKRCHXXXXXXXXXX"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label for="filterMinAmount" class="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
          <input
            type="number"
            id="filterMinAmount"
            v-model="filterMinAmount"
            @keyup.enter="applyFilters"
            placeholder="e.g., 50.00"
            step="0.01"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label for="filterMaxAmount" class="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
          <input
            type="number"
            id="filterMaxAmount"
            v-model="filterMaxAmount"
            @keyup.enter="applyFilters"
            placeholder="e.g., 500.00"
            step="0.01"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label for="filterAfterDate" class="block text-sm font-medium text-gray-700 mb-1">After Date</label>
          <input
            type="date"
            id="filterAfterDate"
            v-model="filterAfterDate"
            @keyup.enter="applyFilters"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label for="filterBeforeDate" class="block text-sm font-medium text-gray-700 mb-1">Before Date</label>
          <input
            type="date"
            id="filterBeforeDate"
            v-model="filterBeforeDate"
            @keyup.enter="applyFilters"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          />
        </div>
      </div>
      <button
        @click="applyFilters"
        class="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-lg hover:bg-indigo-700 transition duration-200 ease-in-out w-full"
      >
        Apply Filters
      </button>
    </div>

    <span v-if="isLoading || isPending" class="flex justify-center items-center h-full">
      <Loading />
    </span>
    <span v-else-if="isError" class="text-red-600 font-bold text-center p-4">
      Error: {{ error.message }}
    </span>

    <div v-else-if="data && data.items && data.items.length">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">Transactions List</h2>
      <TransactionsTable :transactions="data.items" />
      
      <div class="flex justify-between items-center mt-4">
        <button
          @click="currentPage--"
          :disabled="currentPage.value === 0"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out"
        >
          Previous Page
        </button>
        <span class="text-gray-700">Page {{ data.currentPage + 1 }} of {{ data.totalPages }}</span>
        <button
          @click="currentPage++"
          :disabled="currentPage.value >= data.totalPages - 1"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out"
        >
          Next Page
        </button>
      </div>

      <button
        @click="onButtonClick"
        class="mt-6 w-full md:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-md shadow-lg hover:bg-green-700 transition duration-200 ease-in-out"
      >
        Add Transaction
      </button>
    </div>
    <div v-else class="text-center text-gray-600 p-4">
      <p class="mb-4">There are no transactions matching your criteria!</p>
      <button
        @click="onButtonClick"
        class="mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-md shadow-lg hover:bg-green-700 transition duration-200 ease-in-out"
      >
        Add First Transaction
      </button>
    </div>
  </div>
</template>

<style>
/* Basic Tailwind setup assumed to be loaded via CDN or PostCSS */
/* You might want to add custom styles for button animations or specific layout adjustments */
</style>