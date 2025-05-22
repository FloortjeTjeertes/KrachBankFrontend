<template>
  <div id="app">
    <LoginPage />
  </div>
</template>

<script>
import LoginPage from './components/pages/login.vue'; // Adjust path based on your actual structure

export default {
  name: 'App',
  components: {
    LoginPage,
  },
  methods: {
    // This method could be called if LoginForm emits an event
    // For example, if you listened to it directly on LoginPage:
    // <LoginForm @login-submitted="handleLoginFormSubmission" />
    // handleLoginFormSubmission(formData) {
    //   console.log('Login data received in App.vue:', formData);
    //   // Here you would typically dispatch a Vuex action or call an auth service
    //   // For now, let's just log it.
    // }
  }
};
</script>

<style>
/* Global styles for the entire application */
body, html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>