<template>
  <div>
    <h2>Sign up</h2>
    <form @submit.prevent="submitSignup">
      <label for="firstName">First Name</label>
      <input
        type="text"
        id="firstName"
        v-model="form.firstName"
        placeholder="Enter your first name"
        required
      />

      <label for="lastName">Last Name</label>
      <input
        type="text"
        id="lastName"
        v-model="form.lastName"
        placeholder="Enter your last name"
        required
      />

      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        v-model="form.email"
        placeholder="Enter your email"
        required
      />

      <label for="bsn">BSN</label>
      <input
        type="text"
        id="bsn"
        v-model="form.bsn"
        placeholder="Enter your BSN"
        required
      />

      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        v-model="form.password"
        placeholder="Enter your password"
        required
      />

      <label for="phoneNumber">Phone Number</label>
      <input
        type="tel"
        id="phoneNumber"
        v-model="form.phoneNumber"
        placeholder="Enter your phone number"
        required
      />

      <button type="submit">Sign up</button>
    </form>

    <p class="login-link">
      Already have an account?
      <a href="#" @click.prevent="$emit('switch-to-login')">Log in</a>
    </p>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script>
import { createUser } from "@/queries/users";

export default {
  name: "SignUpForm",
  emits: ["signup-submitted", "switch-to-login"],
  data() {
    return {
      form: {
        firstName: "",
        lastName: "",
        email: "",
        bsn: "",
        password: "",
        phoneNumber: "",
      },
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    async submitSignup() {
      this.errorMessage = "";
      this.successMessage = "";
      try {
        const response = await createUser(this.form);
        this.successMessage = "Signup successful!";
        this.$emit("signup-submitted", response);
      } catch (error) {
        console.error("Signup failed:", error);
        this.errorMessage =
          error.response?.data?.message || "Signup failed. Please try again.";
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

.error {
  color: red;
  margin-top: 1rem;
  text-align: center;
}

.success {
  color: green;
  margin-top: 1rem;
  text-align: center;
}
</style>
