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
import LoginForm from '@/components/forms/LoginForm.vue';
import SignUpForm from '@/components/forms/SignUpForm.vue';
import ATMLoginForm from '@/components/forms/ATMLoginForm.vue';
import blueTrumpBackground from '@/assets/bluetrump.png'; 
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

.pico-form-card {
  /* Increase width here */
  width: 800px; /* Example: make it wider */
  max-width: 90%; /* Ensure it's still responsive on smaller screens */
  padding: 40px;
}

</style>