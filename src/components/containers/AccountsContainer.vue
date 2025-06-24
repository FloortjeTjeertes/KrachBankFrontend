<script setup>
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import AccountTable from '../common/AccountTable.vue'
import { fetchAccounts } from '../../queries/accounts.js'
import { fetchUsers } from '../../queries/users.js'
import AccountService from '../../service/AccountService.js'
import { useToast } from 'vue-toastification'
import EditAccountModal from '../common/EditAccountModal.vue'

const toast = useToast()

// Fetch accounts and users
const { data: accountsData, isLoading: loadingAccounts, refetch: refetchAccounts } = useQuery({
  queryKey: ['accounts'],
  queryFn: () => fetchAccounts()
})

const { data: usersArray, isLoading: loadingUsers } = useQuery({
  queryKey: ['users'],
  queryFn: () => fetchUsers()
})

// Build email map
const ownerEmailMap = computed(() => {
  const map = {}
  if (usersArray.value) {
    usersArray.value.forEach(user => {
      map[user.id] = user.email
    })
  }
  return map
})

// --- Filter State ---
const filterIban = ref('')
const filterOwnerEmail = ref('')
const filterType = ref('')
const filterMinBalance = ref(null)
const filterMaxBalance = ref(null)
const filterActive = ref(null)

// --- Edit Modal State ---
const selectedAccount = ref(null)
const isUpdatingAccount = ref(false)
const showEditModal = ref(false)

// --- Filtered Accounts ---
const filteredAccounts = computed(() => {
  if (!accountsData.value?.items) return []
  let filtered = accountsData.value.items

  if (filterIban.value) {
    const search = filterIban.value.toLowerCase()
    filtered = filtered.filter(acc => acc.iban.toLowerCase().includes(search))
  }

  if (filterOwnerEmail.value) {
    const search = filterOwnerEmail.value.toLowerCase()
    filtered = filtered.filter(acc => {
      const email = ownerEmailMap.value[acc.owner] || ''
      return email.toLowerCase().includes(search)
    })
  }

  if (filterType.value) {
    filtered = filtered.filter(acc => acc.type === filterType.value)
  }

  if (filterMinBalance.value !== null && filterMinBalance.value !== '') {
    const min = parseFloat(filterMinBalance.value)
    if (!isNaN(min)) {
      filtered = filtered.filter(acc => acc.balance >= min)
    }
  }

  if (filterMaxBalance.value !== null && filterMaxBalance.value !== '') {
    const max = parseFloat(filterMaxBalance.value)
    if (!isNaN(max)) {
      filtered = filtered.filter(acc => acc.balance <= max)
    }
  }

  if (filterActive.value !== null) {
    filtered = filtered.filter(acc => acc.active === filterActive.value)
  }

  return filtered
})

// --- Edit Modal Actions ---
function handleEditAccount(account) {
  selectedAccount.value = JSON.parse(JSON.stringify(account))
  showEditModal.value = true
}

function handleCloseEditModal() {
  showEditModal.value = false
  selectedAccount.value = null
}

async function handleUpdateAccount(updatedAccountData) {
  isUpdatingAccount.value = true
  try {
    if (updatedAccountData.absoluteLimit !== null && updatedAccountData.absoluteLimit > 0) {
      toast.error("Absolute limit must be 0 or lower.")
      isUpdatingAccount.value = false
      return
    }

    const payload = {
      transactionLimit: updatedAccountData.transactionLimit,
      absoluteLimit: updatedAccountData.absoluteLimit,
    }

    await AccountService.updateAccountLimits(updatedAccountData.iban, payload)
    await refetchAccounts()
    handleCloseEditModal()
    toast.success("Account limits updated successfully!")
  } catch (error) {
    console.error("Error updating account:", error)
    toast.error("Failed to update account: " + (error.response?.data?.message || error.message))
  } finally {
    isUpdatingAccount.value = false
  }
}
</script>

<template>
  <main class="container">
    <section v-if="loadingAccounts || loadingUsers">
      <p>Loading accounts and users...</p>
    </section>

    <section v-else-if="accountsData?.items && Object.keys(ownerEmailMap).length > 0">
      <h2>Filter Accounts</h2>
      <div class="grid">
        <label>
          IBAN
          <input type="text" v-model="filterIban" placeholder="e.g. NLXX..." />
        </label>

        <label>
          Owner Email
          <input type="text" v-model="filterOwnerEmail" placeholder="e.g. user@mail.com" />
        </label>

        <label>
          Account Type
          <select v-model="filterType">
            <option value="">All</option>
            <option value="SAVINGS">SAVINGS</option>
            <option value="CHECKING">CHECKING</option>
          </select>
        </label>

        <label>
          Min Balance
          <input type="number" v-model.number="filterMinBalance" placeholder="0.00" step="0.01" />
        </label>

        <label>
          Max Balance
          <input type="number" v-model.number="filterMaxBalance" placeholder="1000.00" step="0.01" />
        </label>
      </div>

      <AccountTable
        :accounts="filteredAccounts"
        :ownerEmailMap="ownerEmailMap"
        @editAccount="handleEditAccount" />
    </section>

    <p v-else>No account data found.</p>

    <!-- Use new EditAccountModal component -->
    <EditAccountModal
      :show="showEditModal"
      :accountData="selectedAccount"
      :loading="isUpdatingAccount"
      @close="handleCloseEditModal"
      @submit="handleUpdateAccount"
    />
  </main>
</template>
