<script setup>
defineProps({
  transactions: Array,
});
</script>

<template>
  <table>
    <thead>
      <tr>
        <th scope="col">Created At</th>
        <th scope="col">Initiator</th>
        <th scope="col">From</th>
        <th scope="col">To</th>
        <th scope="col">Description</th>
        <th scope="col">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="transaction in transactions" v-bind:key="transaction">
        <td>{{ new Date(transaction.createdAt).toLocaleString() }}</td>
        <td>{{ transaction.initiator.firstName}} {{ transaction.initiator.lastName }}</td>
        <td>{{ transaction.from }}</td>
        <td>{{ transaction.to }}</td>
        <td>{{ transaction.description}}</td>
        <td>{{ transaction.amount }}</td>

      </tr>
    </tbody>
  </table>
</template>
