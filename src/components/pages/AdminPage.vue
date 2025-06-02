<template>
  <div>
    <nav>
      <RouterLink to="/admin/users"><button :class="{active: isActive('users')}">Users</button></RouterLink>
      <RouterLink to="/admin/transactions"><button :class="{active: isActive('transactions')}">Transactions</button></RouterLink>
      <RouterLink to="/admin/accounts"><button :class="{active: isActive('accounts')}">Accounts</button></RouterLink>
    </nav>
    <div style="padding-top: 24px;">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
function isActive(tab) {
  return route.path.includes(tab);
}
</script>
