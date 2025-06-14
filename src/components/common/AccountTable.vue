<template>
  <table>
    <thead>
      <tr>
        <th>IBAN</th>
        <th>Owner</th>
        <th>Balance</th>
        <th>Absolute Limit</th>
        <th>Type</th>
        <th>Transaction Limit</th>
        <th>Created At</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="account in accounts" :key="account.iban">
        <td>{{ account.iban }}</td>
        <td>{{ account.owner }}</td>
        <td>{{ account.balance }}</td>
        <td>{{ account.absoluteLimit }}</td>
        <td>{{ account.type }}</td>
        <td>{{ account.transactionLimit }}</td>
        <td>{{ formatDate(account.createdAt) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'AccountTable',
  props: {
    accounts: {
      type: Array,
      required: true
    }
  },
  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleString();
    }
  }
}
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background: #f4f4f4;
  text-align: left;
}
</style>
