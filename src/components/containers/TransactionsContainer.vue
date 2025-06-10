<script setup>
import Loading from "../common/Loading.vue";
import TransactionsTable from "../common/TransactionsTable.vue";
import { useQueryClient, useQuery, useMutation } from "@tanstack/vue-query";
import { fetchTransactions, addTransaction } from "../../queries/transactions";

/**
 * IMPORTANT! This is a demo file to show the basic pattern of using
 *  Vue Query to make requests to your API. You likely want to organzie
 *  these better, i.e. putting queries and mutations in their own
 *  files inside a /query directory so that they can potentially
 *  be reused between different components.
 */

// Access QueryClient instance
const queryClient = useQueryClient();

// Query
const { isLoading, isError, data, error } = useQuery({
  queryKey: ["transactions"],
  queryFn: fetchTransactions,
});

// Mutation
const { mutate, isPending } = useMutation({
  mutationFn: addTransaction,
  onSuccess: () => {
    // Invalidate the query so data gets refetched
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
  <span v-if="isLoading || isPending"><Loading /></span>
  <span v-else-if="isError">Error: {{ error.message }}</span>
  <!-- We can assume by this point that `isSuccess === true` -->
  <ul v-else-if="data.length">
    <TransactionsTable :transactions="data" />
    <button @click="onButtonClick">Add Transaction</button>
  </ul>
  <div v-else>There are no transactions!</div>
</template>
