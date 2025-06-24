<script>
export default {
  name: 'AccountTable',
  props: {
    accounts: {
      type: Array,
      required: true
    },
    ownerEmailMap: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return date.toLocaleString()
    },
    // New method to emit event when edit button is clicked
    editAccount(account) {
      this.$emit('editAccount', account);
    }
  }
}
</script>

<template>
  <div class="overflow-x-auto bg-white rounded-lg shadow-md">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IBAN</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner Email</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absolute Limit</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Limit</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
          <th scope="col" class="relative px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="account in accounts" :key="account.iban">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ account.iban }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ ownerEmailMap[account.owner] || 'Unknown' }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ account.balance }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ account.absoluteLimit }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ account.type }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ account.transactionLimit }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(account.createdAt) }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button @click="editAccount(account)" class="text-blue-600 hover:text-blue-900 ml-4">
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* Add some basic table styling if not handled by Tailwind globally */
table {
  width: 100%;
  border-collapse: collapse;
}
</style>