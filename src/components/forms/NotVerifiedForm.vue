<template>
  <div class="verification-form">
    <article>
      <h2>Account Not Verified</h2>
      <p>Your account needs to be verified before you can access all features.</p>
      <p>Please check your email for a verification link.</p>

      <form @submit.prevent="resendVerification">
        <label for="resendEmail">Email Address</label>
        <input type="email" id="resendEmail" v-model="email" placeholder="Enter your email" required />

        <button type="submit">Resend Verification Email</button>
      </form>

      <p class="login-link">
        Already verified? <a href="#" @click.prevent="$emit('switch-to-login')">Go to Login</a>
      </p>
    </article>
  </div>
</template>

<script>
// import { resendVerification } from '@/queries/users'; // You would implement this query later

export default {
  name: 'VerificationForm',
  emits: ['switch-to-login'], // Emit an event if they want to go back to login
  data() {
    return {
      email: '', // User's email to resend the link
    };
  },
  methods: {
    async resendVerification() {
      try {
        // --- Placeholder for actual API call ---
        // You would call your backend API here to resend the verification email.
        // const response = await resendVerification({ email: this.email });
        // console.log('Resend verification successful:', response);
        alert(`Verification email sent to ${this.email} (simulated)`);
        // --- End Placeholder ---

        // You might want to provide feedback to the user, e.g., a success message
      } catch (error) {
        const msg = error.response?.data?.message || 'Failed to resend verification email.';
        alert(msg);
        console.error('Resend verification error:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Basic styling using PicoCSS conventions if applicable */
.verification-form {
  display: flex; /* Use flexbox to center content */
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Make it full viewport height */
  background-color: var(--pico-background-color); /* Match your theme */
}

article {
  max-width: 400px; /* Adjust width as needed */
  margin: 2rem auto; /* Center the form if flexbox isn't full screen */
  padding: 1.5rem;
  background-color: var(--pico-card-background-color); /* Use Pico's card background */
  border-radius: var(--pico-border-radius);
  box-shadow: var(--pico-box-shadow);
  text-align: center; /* Center text within the article */
}

h2 {
  margin-bottom: 1rem;
}

p {
  margin-bottom: 1rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-weight: bold;
  text-align: left; /* Align labels left within the form */
}

input[type="email"],
input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--pico-form-element-border-color);
  border-radius: var(--pico-border-radius);
  box-sizing: border-box;
}

button[type="submit"] {
  padding: 0.8rem 1.2rem;
  background-color: var(--pico-primary);
  color: var(--pico-primary-inverse);
  border: none;
  border-radius: var(--pico-border-radius);
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

button[type="submit"]:hover {
  background-color: var(--pico-primary-hover);
}

.login-link {
  margin-top: 1.5rem;
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