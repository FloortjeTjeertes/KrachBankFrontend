<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="submitLogin">
      <label for="email">Email</label>
      <input type="email" id="email" v-model="email" placeholder="Enter your email" required />

      <label for="password">Password</label>
      <input type="password" id="password" v-model="password" placeholder="Enter your password" required />

      <label for="rememberMe">
        <input type="checkbox" id="rememberMe" v-model="rememberMe" />
        Remember Me
      </label>

      <button type="submit">Login</button>
    </form>
    <p class="signup-link">
      Don't have an account? <a href="#" @click.prevent="$emit('switch-to-signup')">Sign up</a>
    </p>
  </div>
</template>

<script>
import { login } from '@/queries/users';

export default {
  name: 'LoginForm',
  emits: ['login-submitted', 'switch-to-signup'],
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
    };
  },
  methods: {
    async submitLogin() {
      try {
        const response = await login({
          email: this.email,
          password: this.password,
        });

        console.log('Login successful:', response);

        // Optionally store token
        if (this.rememberMe) {
          localStorage.setItem('token', response.token);
        } else {
          sessionStorage.setItem('token', response.token);
        }

        this.$emit('login-submitted', response);
      } catch (error) {
        const msg = error.response?.data?.message || 'Login failed';
        alert(msg);
      }
    },
  },
};
</script>

<style scoped>
/* Remove styles that Pico handles (background, border, padding, shadow, input widths, etc.) */
/* Keep styles for specific layout adjustments or link styling */
h2 {
  margin-bottom: 1rem; /* Adjust if Pico's h2 margin is different than desired */
}

/* Pico's label for checkboxes works slightly differently, no custom styling needed for alignment */
label:has(input[type="checkbox"]) {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* Space between checkbox and text */
}

.signup-link {
  margin-top: 1.5rem; /* Adjust spacing as needed */
  text-align: center;
  font-size: 0.9em;
}
.signup-link a {
  color: var(--pico-primary); /* Use Pico's primary color variable for links */
  text-decoration: none;
  cursor: pointer;
}
.signup-link a:hover {
  text-decoration: underline;
}
</style>