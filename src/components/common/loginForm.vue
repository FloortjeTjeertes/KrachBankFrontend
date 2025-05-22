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
      <a href="#">Sign up</a>
    </p>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
    };
  },
  methods: {
    submitLogin() {
      // In a real application, you would emit an event or call a Vuex action
      // to handle the actual login process.
      console.log('Login form submitted:', {
        email: this.email,
        password: this.password,
        rememberMe: this.rememberMe,
      });

      // Example of emitting an event to the parent (Login.vue or App.vue)
      // The parent can then handle the login API call.
      this.$emit('login-submitted', {
        email: this.email,
        password: this.password,
        rememberMe: this.rememberMe,
      });

      alert('Login logic would be handled by the parent component or a store!');
    },
  },
};
</script>

<style scoped>
.login-card {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 350px; /* Fixed width for the card */
  text-align: center;
}

.login-card h2 {
  margin-bottom: 30px;
  font-size: 2em;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

.form-group input[type="email"],
.form-group input[type="password"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box; /* Include padding in width */
  font-size: 1em;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}

.checkbox-group input[type="checkbox"] {
  margin-right: 10px;
  transform: scale(1.2); /* Make checkbox slightly larger */
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #0056b3;
}

.signup-link {
  margin-top: 25px;
  font-size: 0.9em;
}

.signup-link a {
  color: #007bff;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>