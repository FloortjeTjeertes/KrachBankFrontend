<template>
  <div class="login-page">
    <div class="left-section">
      <img :src="backgroundImage" alt="Background Image" class="background-image" />
      <div class="overlay">
        <h1>KrachBank</h1>
        <p>Your money is between somewhat and reasonably safe with us!</p>
      </div>
    </div>
    <div class="right-section">
      <article class="pico-form-card">
        <LoginForm
          v-if="showLogin && !showAtmLogin"
          @login-submitted="handleLogin"
          @switch-to-signup="showLogin = false"
          @switch-to-atm="switchToAtmLogin"
        />
        <SignUpForm
          v-else-if="!showLogin && !showAtmLogin"
          @signup-submitted="handleSignup"
          @switch-to-login="showLogin = true"
        />
        <ATMLoginForm
          v-else
          @atm-login-submitted="handleAtmLogin"
          @switch-to-normal-login="switchToNormalLogin"
        />
      </article>
    </div>
  </div>
</template>

<script>
import LoginForm from '../common/LoginForm.vue';
import SignUpForm from '../common/SignUpForm.vue';
import ATMLoginForm from '../common/ATMLoginForm.vue';
import blueTrumpBackground from '@/assets/bluetrump.png'; 
import { login as userLogin } from '@/queries/users';
import { register as userRegister } from '@/queries/authentication';
export default {
  name: 'LoginContainer',
  components: {
    LoginForm,
    SignUpForm,
    ATMLoginForm,
  },
  data() {
    return {
      showLogin: true,
      showAtmLogin: false,
      backgroundImage: blueTrumpBackground,
    };
  },
};
</script>

<style scoped>
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