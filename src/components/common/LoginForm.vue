<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="submitLogin">
      <label for="username">Username</label>
      <input type="text" id="username" v-model="username" placeholder="Enter your username" required />

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
import { useToast } from "vue-toastification";
const toast = useToast();
export default {
  name: 'LoginForm',
  emits: ['login-submitted', 'switch-to-signup'],
  data() {
    return {
      username: '',
      password: '',
      rememberMe: false,
    };
  },
  methods: {
    async submitLogin() {
      try {
        const response = await login({
          username: this.username,
          password: this.password,
        });

        console.log('Full login response object from login function:', response); // Keep this for debugging
        console.log('Login successful:', response);
        toast.success('Login successful!');
        // --- ADJUSTED ACCESS TO RESPONSE PROPERTIES ---
        const token = response.token; // Access 'token' instead of 'jwtToken'
        const isUserVerified = response.userDetails.verified; // Access 'userDetails.verified'
        // --- END ADJUSTED ACCESS ---

        // Store token
        if (this.rememberMe) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }

        if (isUserVerified) {
          this.$router.push('/dummy');
        } else {
          this.$router.push('/notverified');
        }

        this.$emit('login-submitted', response);

      } catch (error) {
        const msg = error.response?.data?.message || 'Login failed';
        toast.error(msg );
        console.error('Login error:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Your existing styles */
h2 {
  margin-bottom: 1rem;
}
label:has(input[type="checkbox"]) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.signup-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9em;
}
.signup-link a {
  color: var(--pico-primary);
  text-decoration: none;
  cursor: pointer;
}
.signup-link a:hover {
  text-decoration: underline;
}
</style>