<script setup>
import { RouterView, RouterLink } from "vue-router";


</script>

<template>
  <main class="container">
    <nav>
      <ul>
        <li><strong>Krach Bank</strong></li>
      </ul>
      <ul>
        <li>
          <RouterLink to="/">Home</RouterLink>
        </li>
        
        <li>
          <RouterLink to="/admin">Admin</RouterLink>
        </li>
        <li>
          <RouterLink to="/login">login</RouterLink>
        </li>
        <li>
          <RouterLink to="/atm">ATM</RouterLink>
        </li>
        
      </ul>
    </nav>
    <RouterView></RouterView>
  </main>
</template>

<style scoped></style>
