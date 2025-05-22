<template>
  <form @submit.prevent="handleLogin">
    <div>
      <label for="username">Username:</label>
      <input id="username" v-model="username" required />
    </div>
    <div>
      <label for="password">Password:</label>
      <input id="password" type="password" v-model="password" required />
    </div>
    <button type="submit">Login</button>

    <p v-if="error" style="color: red;">{{ error }}</p>
  </form>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    handleLogin() {
      if (this.username === 'admin' && this.password === '1234') {
        alert('Login successful!')
        this.error = ''
      } else {
        this.error = 'Invalid username or password'
      }
    }
  }
}
</script>

<style scoped>
form {
  max-width: 300px;
  margin: auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
div {
  margin-bottom: 0.5rem;
}
label {
  display: block;
  margin-bottom: 0.25rem;
}
input {
  width: 100%;
  padding: 0.25rem;
}
button {
  width: 100%;
  padding: 0.5rem;
  cursor: pointer;
}
</style>
