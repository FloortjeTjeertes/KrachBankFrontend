<template>
  <div class="notverifiedpage">
    <article>
      <h2>Welcome! Your Account is not Verified!</h2>
      <p>Please wait for full access on the pages</p>
      <nav>
        <ul>
          <li><a role="button" @click.prevent="logout">Logout</a></li>
        </ul>
      </nav>
    </article>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore"; // Ensure correct import path
const userStore = useUserStore();
const router = useRouter();

function logout() {
  console.log("Logging out...");
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  userStore.resetUser();
  router.push("/login"); // Redirect to login after logout
}
</script>

<style scoped>
.verified-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--pico-background-color);
  text-align: center;
}

article {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: var(--pico-card-background-color);
  border-radius: var(--pico-border-radius);
  box-shadow: var(--pico-box-shadow);
}
</style>
