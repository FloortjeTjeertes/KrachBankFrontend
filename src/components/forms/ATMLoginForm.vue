<template>
  <div>
    <h2>ATM Login</h2>
    <form @submit.prevent="submitAtmLogin">
      <label for="email">Email</label>
      <input
        type="text"
        id="email"
        v-model="email"
        placeholder="Enter your email"
        required
      />

      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        v-model="password"
        placeholder="Enter your password"
        required
      />

      <button type="submit">Login to ATM</button>
    </form>
    <p class="back-link">
      <a href="#" @click.prevent="$emit('switch-to-normal-login')">Back to normal login</a>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");

const emit = defineEmits(["atm-login-submitted", "switch-to-normal-login"]);

function submitAtmLogin() {
  emit("atm-login-submitted", { email: email.value, password: password.value });
}
</script>

<style scoped>
h2 {
  margin-bottom: 1rem;
}
.back-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9em;
}
.back-link a {
  color: var(--pico-primary);
  text-decoration: none;
  cursor: pointer;
}
.back-link a:hover {
  text-decoration: underline;
}
</style>
