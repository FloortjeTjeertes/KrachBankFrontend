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
      // In a real application, you would emit an event or call a Vuex action
      // to handle the actual signup process.
      console.log('Sign-up form submitted:', {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        bsn: this.bsn,
        password: this.password,
        phoneNumber: this.phoneNumber,
      });

      // Example of emitting an event to the parent.
      this.$emit('signup-submitted', {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        bsn: this.bsn,
        password: this.password,
        phoneNumber: this.phoneNumber,
      });

      alert('Sign-up logic would be handled by the parent component or a store!');
    },
  },
};
</script>

<style scoped>
.signup-card {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 350px;
  text-align: center;
}

.signup-card h2 {
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

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="password"],
.form-group input[type="tel"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1em;
}

.signup-button {
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

.signup-button:hover {
  background-color: #0056b3;
}

.login-link {
  margin-top: 25px;
  font-size: 0.9em;
}

.login-link a {
  color: #007bff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>