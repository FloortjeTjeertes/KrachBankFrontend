<template>
  <div class="login-card">
    <h2>Login</h2>
    <form @submit.prevent="submitLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" placeholder="Enter your email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" placeholder="Enter your password" required />
      </div>
      <div class="form-group checkbox-group">
        <input type="checkbox" id="rememberMe" v-model="rememberMe" />
        <label for="rememberMe">Remember Me</label>
      </div>
      <button type="submit" class="login-button">Login</button>
    </form>
    <p class="signup-link">
      Don't have an account? <a href="#" @click.prevent="$emit('switch-to-signup')">Sign up</a>
    </p>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  emits: ['login-submitted', 'switch-to-signup'], // Declare emitted events for Vue 3 (good practice)
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
    };
  },
  methods: {
    submitLogin() {
      console.log('Login form submitted:', {
        email: this.email,
        password: this.password,
        rememberMe: this.rememberMe,
      });
      this.$emit('login-submitted', {
        email: this.email,
        password: this.password,
        rememberMe: this.rememberMe,
      });
    },
  },
};
</script>

<style scoped>
/* (Your existing LoginForm styles remain the same) */
.login-card {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 350px;
  text-align: center;
}

.signup-link {
  margin-top: 25px;
  font-size: 0.9em;
}
.signup-link a {
  color: #007bff;
  text-decoration: none;
  cursor: pointer; /* Makes it clear it's clickable */
}
.signup-link a:hover {
  text-decoration: underline;
}
/* ... other LoginForm styles ... */
</style>