<template>
  <div class="login-page">
    <div class="left-section">
      <img :src="backgroundImage" alt="Background Image" class="background-image" />
      <div class="overlay">
        <h1>KrachBank</h1>
        <p>Make everything possible with a little krach.</p>
      </div>
    </div>
    <div class="right-section">
      <article class="pico-form-card">
        <LoginForm v-if="showLogin" @login-submitted="handleLogin" @switch-to-signup="showLogin = false" />
        <SignUpForm v-else @signup-submitted="handleSignup" @switch-to-login="showLogin = true" />
      </article>
    </div>
  </div>
</template>

<script>
import LoginForm from '../common/LoginForm.vue';
import SignUpForm from '../common/SignUpForm.vue';
import blueTrumpBackground from '@/assets/bluetrump.png'; 

export default {
  name: 'LoginContainer',
  components: {
    LoginForm,
    SignUpForm,
  },
  data() {
    return {
      showLogin: true,
      backgroundImage: blueTrumpBackground,
    };
  },
  methods: {
    handleLogin(formData) {
      console.log('Login data received in LoginContainer:', formData);
      // Implement your actual login API call here
    },
    handleSignup(formData) {
      console.log('Sign-up data received in LoginContainer:', formData);
      // Implement your actual signup API call here
    },
  },
};
</script>

<style scoped>
/* These styles remain for the overall layout, Pico doesn't dictate flexbox on this scale */
.login-page {
  display: flex;
  height: 100vh;
  font-family: sans-serif; /* Keep your font if desired, or let Pico's default apply */
}

.left-section {
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.overlay h1 {
  font-size: 3em;
  margin-bottom: 10px;
}

.overlay p {
  font-size: 1.2em;
}

.right-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--pico-background-color); /* Use Pico's background color variable */
}

/* Custom width for the form card to match previous design */
.pico-form-card {
  width: 350px;
  max-width: 90%; /* Responsive fallback */
  padding: 40px; /* Adjust padding if Pico's default article padding isn't enough */
  /* Pico's article already has background, border-radius, and box-shadow */
}
</style>