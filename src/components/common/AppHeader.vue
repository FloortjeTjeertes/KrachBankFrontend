<template>
  <nav>
    <ul>
      <li><strong>Krach Bank</strong></li>
    </ul>
    <ul v-if="userStore.isAuthenticated">
      <li v-if="!userStore.getUser?.admin">
        <RouterLink   :key="'home'" to="/">Home</RouterLink>
      </li>
      <!-- <li v-else>
        <RouterLink  to="/admin" :key="'admin-home'">Home admin</RouterLink>
      </li> -->
   
      <!-- TODO:make this dynamic whit a switch at the login page instead of a button or dont use an extra signeup -->
      <li>
        <RouterLink to="/atm">ATM</RouterLink>
      </li>

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
