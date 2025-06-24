<template>
  <nav>
    <ul>
      <li><strong>Krach Bank</strong></li>
    </ul>
    <ul v-if="userStore.isAuthenticated">
      

      <details class="dropdown">
        <summary>
          {{ userStore.getUser?.username  }}
        </summary>
        <ul dir="rtl">
          <li @click="logout">Logout</li>
        </ul>
      </details>

    </ul>
  </nav> 
</template>

<script setup>
import { RouterLink } from "vue-router";
import { useUserStore } from "@/stores/userStore"; // Ensure correct import path
import { useRouter } from 'vue-router';

const userStore = useUserStore();
  const router = useRouter();

function logout() {

      console.log('Logging out...');
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      userStore.resetUser();
      router.push('/login'); 
};
</script>

<style lang="css" scoped></style>
