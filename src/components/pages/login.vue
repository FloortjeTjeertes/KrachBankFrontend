<template>
  <div class="login-page">
    <div class="left-section">
      <img :src="backgroundImage" alt="Login Background" class="background-image" />
      <div class="overlay">
        <h1>KrachBank</h1>
        <p>Make everything possible with a little krach.</p>
      </div>
    </div>
    <div class="right-section">
      <LoginForm />
    </div>
  </div>
</template>

<script>
import LoginForm from '../common/loginForm.vue';
// Import the image using the alias '@' which points to your 'src' directory
import blueTrumpBackground from '@/assets/bluetrump.png';

export default {
  name: 'LoginPage',
  components: {
    LoginForm,
  },
  data() {
    return {
      // Assign the imported image to your data property
      backgroundImage: blueTrumpBackground,
    };
  },
};
</script>

<style scoped>
/* Your CSS styles here */
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