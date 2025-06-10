<script setup>
import { ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import AccountTable from '../common/AccountTable.vue'
import { fetchAccounts } from '../../queries/accounts.js'

const { isLoading, isError, data, error } = useQuery({
  queryKey: ['accounts'],
  queryFn: () => fetchAccounts()
})
</script>

<template>
  <span v-if="isLoading">Loading...</span>
  <span v-else-if="isError">Error: {{ error.message }}</span>
  <AccountTable v-else :accounts="data" />
</template>
