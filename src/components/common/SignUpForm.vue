<template>
  <div class="signup-card">
    <h2>Sign up</h2>
    <form @submit.prevent="submitSignup">
      <div class="form-group">
        <label for="firstName">First Name</label>
        <input type="text" id="firstName" v-model="firstName" placeholder="Enter your first name" required />
      </div>
      <div class="form-group">
        <label for="lastName">Last Name</label>
        <input type="text" id="lastName" v-model="lastName" placeholder="Enter your last name" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" placeholder="Enter your email" required />
      </div>
      <div class="form-group">
        <label for="bsn">BSN</label>
        <input type="text" id="bsn" v-model="bsn" placeholder="Enter your BSN" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" placeholder="Enter your password" required />
      </div>
      <div class="form-group">
        <label for="phoneNumber">Phone Number</label>
        <input type="tel" id="phoneNumber" v-model="phoneNumber" placeholder="Enter your phone number" required />
      </div>
      <button type="submit" class="signup-button">Sign up</button>
    </form>
    <p class="login-link">
      Already have an account? <a href="#" @click.prevent="$emit('switch-to-login')">Log in</a>
    </p>
  </div>
</template>

<script>
export default {
  name: 'SignUpForm',
  emits: ['signup-submitted', 'switch-to-login'], // Declare emitted events
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      bsn: '',
      password: '',
      phoneNumber: '',
    };
  },
  methods: {
    submitSignup() {
      console.log('Sign-up form submitted:', {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        bsn: this.bsn,
        password: this.password,
        phoneNumber: this.phoneNumber,
      });
      this.$emit('signup-submitted', {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        bsn: this.bsn,
        password: this.password,
        phoneNumber: this.phoneNumber,
      });
    },
  },
};
</script>

<style scoped>
/* (Your existing SignUpForm styles remain the same) */
.signup-card {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 350px;
  text-align: center;
}

.login-link {
  margin-top: 25px;
  font-size: 0.9em;
}
.login-link a {
  color: #007bff;
  text-decoration: none;
  cursor: pointer;
}
.login-link a:hover {
  text-decoration: underline;
}
/* ... other SignUpForm styles ... */
</style>