<script setup>
import Loading from "../common/Loading.vue";
import TransactionsTable from "../common/TransactionsTable.vue";
import { useQueryClient, useQuery, useMutation } from "@tanstack/vue-query";
import { fetchTransactions, addTransaction } from "../../queries/transactions";
import { ref, computed } from "vue";

const queryClient = useQueryClient();

// Pagination state
const currentPage = ref(0);
const itemsPerPage = ref(10);

// Filter states
const filterSenderIban = ref("");
const filterReceiverIban = ref("");
const filterMinAmount = ref(null);
const filterMaxAmount = ref(null);
const filterBeforeDate = ref("");
const filterAfterDate = ref("");

// Computed active filters (not used directly in query but for your logic)
const activeFilters = computed(() => {
  const filters = {};
  if (filterSenderIban.value.trim() !== "") filters.senderIban = filterSenderIban.value.trim();
  if (filterReceiverIban.value.trim() !== "") filters.receiverIban = filterReceiverIban.value.trim();
  if (filterMinAmount.value !== null && filterMinAmount.value !== "") {
    const val = parseFloat(filterMinAmount.value);
    if (!isNaN(val)) filters.minAmount = val;
  }
  if (filterMaxAmount.value !== null && filterMaxAmount.value !== "") {
    const val = parseFloat(filterMaxAmount.value);
    if (!isNaN(val)) filters.maxAmount = val;
  }
  if (filterBeforeDate.value.trim() !== "") filters.beforeDate = filterBeforeDate.value.trim();
  if (filterAfterDate.value.trim() !== "") filters.afterDate = filterAfterDate.value.trim();
  return filters;
});

// Reset to page 0 when filters apply
const applyFilters = () => {
  currentPage.value = 0;
};

// Fetch transactions with queryKey based on current state
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
    return fetchTransactions(params, params.page, params.limit);
  },
});

// Mutation to add transaction
const queryClient2 = queryClient; // workaround if needed
const { mutate, isPending } = useMutation({
  mutationFn: addTransaction,
  onSuccess: () => {
    queryClient2.invalidateQueries({ queryKey: ["transactions"] });
    closeModal();
  },
});

// Modal state
const showModal = ref(false);

// Form inputs for new transaction
const newFrom = ref("");
const newTo = ref("");
const newAmount = ref(null);

function openModal() {
  showModal.value = true;
  // Reset form fields on open
  newFrom.value = "";
  newTo.value = "";
  newAmount.value = null;
}

function closeModal() {
  showModal.value = false;
}

function submitTransaction() {
  if (!newFrom.value || !newTo.value || !newAmount.value) {
    alert("Please fill all fields");
    return;
  }
  mutate({
    sender: newFrom.value,
    receiver: newTo.value,
    amount: parseFloat(newAmount.value),
  });
}

</script>

<template>
  <div class="p-4 bg-gray-50 min-h-screen font-inter">
    <!-- Filters -->
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

    <!-- Loading/Error -->
    <span v-if="isLoading || isPending" class="flex justify-center items-center h-full">
      <Loading />
    </span>
    <span v-else-if="isError" class="text-red-600 font-bold text-center p-4">
      Error: {{ error.message }}
    </span>

    <!-- Transactions list or no data -->
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
        @click="openModal"
        class="mt-6 w-full md:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-md shadow-lg hover:bg-green-700 transition duration-200 ease-in-out"
      >
        Add Transaction
      </button>
    </div>

    <div v-else class="text-center text-gray-600 p-4">
      <p class="mb-4">There are no transactions matching your criteria!</p>
      <button
        @click="openModal"
        class="mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-md shadow-lg hover:bg-green-700 transition duration-200 ease-in-out"
      >
        Add First Transaction
      </button>
    </div>

    <!-- Modal Overlay -->
    <transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto"
        >
          <button
            @click="closeModal"
            class="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
            aria-label="Close modal"
          >
            &times;
          </button>

          <h3 class="text-xl font-semibold mb-4 text-gray-800">Add New Transaction</h3>

          <form
            @submit.prevent="submitTransaction"
            class="space-y-4"
          >
            <div>
              <label for="fromIban" class="block text-sm font-medium text-gray-700 mb-1">From IBAN</label>
              <input
                type="text"
                id="fromIban"
                v-model="newFrom"
                placeholder="Sender IBAN"
                required
                class="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label for="toIban" class="block text-sm font-medium text-gray-700 mb-1">To IBAN</label>
              <input
                type="text"
                id="toIban"
                v-model="newTo"
                placeholder="Receiver IBAN"
                required
                class="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                id="amount"
                v-model.number="newAmount"
                placeholder="Amount"
                required
                step="0.01"
                min="0.01"
                class="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isPending"
                class="px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {{ isPending ? "Adding..." : "Add Transaction" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<style>
/* Optional fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
