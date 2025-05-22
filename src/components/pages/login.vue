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
      <LoginForm v-if="showLogin" @login-submitted="handleLogin" @switch-to-signup="showLogin = false" />
      <SignUpForm v-else @signup-submitted="handleSignup" @switch-to-login="showLogin = true" />
    </div>
  </div>
</template>

<script>
import LoginForm from '../common/loginForm.vue';
import SignUpForm from '../common/signUpForm.vue';
// Assuming your image is at src/assets/bluetrump.png
import blueTrumpBackground from '@/assets/bluetrump.png';

export default {
  name: 'LoginPage',
  components: {
    LoginForm,
    SignUpForm,
  },
  data() {
    return {
      showLogin: true, // true to show login form by default, false for signup
      backgroundImage: blueTrumpBackground,
    };
  },
  methods: {
    handleLogin(formData) {
      console.log('Login data received in LoginPage:', formData);
      // Implement your actual login API call here
      // e.g., axios.post('/api/login', formData)
    },
    handleSignup(formData) {
      console.log('Sign-up data received in LoginPage:', formData);
      // Implement your actual signup API call here
      // e.g., axios.post('/api/register', formData)
      // After successful signup, you might want to automatically switch back to the login form:
      // this.showLogin = true;
    },
  },
};
</script>

<style scoped>
/* These styles remain the same as your previous `Login.vue` for the overall layout */
.login-page {
  display: flex;
  height: 100vh;
  font-family: sans-serif;
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
  background-color: #f0f2f5;
}
</style>