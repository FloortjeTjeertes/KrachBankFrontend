<template>
  <div>
    <h2>Sign up</h2>
    <form @submit.prevent="submitSignup">
      <label for="firstName">First Name</label>
      <input type="text" id="firstName" v-model="firstName" placeholder="Enter your first name" required />

      <label for="lastName">Last Name</label>
      <input type="text" id="lastName" v-model="lastName" placeholder="Enter your last name" required />

      <label for="email">Email</label>
      <input type="email" id="email" v-model="email" placeholder="Enter your email" required />

      <label for="bsn">BSN</label>
      <input type="text" id="bsn" v-model="bsn" placeholder="Enter your BSN" required />

      <label for="password">Password</label>
      <input type="password" id="password" v-model="password" placeholder="Enter your password" required />

      <label for="phoneNumber">Phone Number</label>
      <input type="tel" id="phoneNumber" v-model="phoneNumber" placeholder="Enter your phone number" required />

      <button type="submit">Sign up</button>
    </form>

    <p class="login-link">
      Already have an account?
      <a href="#" @click.prevent="$emit('switch-to-login')">Log in</a>
    </p>
  </div>
</template>

<script>
import { createUser } from '@/queries/users';

export default {
  name: 'SignUpForm',
  emits: ['signup-submitted', 'switch-to-login'],
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
    async submitSignup() {
      const userData = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        bsn: this.bsn,
        password: this.password,
        phoneNumber: this.phoneNumber,
      };

      try {
        const createdUser = await createUser(userData);
        console.log('Signup successful:', createdUser);
        this.$emit('signup-submitted', createdUser);
      } catch (error) {
        const message =
          error.response?.data?.message || error.message || 'Signup failed';
        alert(message);
      }
    },
  },
};
</script>

<style scoped>
h2 {
  margin-bottom: 1rem;
}

.login-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9em;
}
.login-link a {
  color: var(--pico-primary);
  text-decoration: none;
  cursor: pointer;
}
.login-link a:hover {
  text-decoration: underline;
}
</style>
