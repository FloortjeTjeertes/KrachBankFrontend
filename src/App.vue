<script setup>
import { RouterView } from "vue-router";
import AppHeader from "@/components/common/AppHeader.vue";
</script>

<template>
  <main class="container">
    <AppHeader></AppHeader>
    <RouterView></RouterView>
  </main>
</template>

<style scoped>


</style>
