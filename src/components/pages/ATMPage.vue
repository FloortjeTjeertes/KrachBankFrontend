<template>
  <div class="atm-page">
    <h1>ATM Page</h1>
    <p>Please login</p>
    <label for="username">Username</label>
      <input
        type="text"
        id="email"
        v-model="email"
        placeholder="Enter your username"
        required
      />

      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        v-model="password"
        placeholder="Enter your password"
        required
      />    
    <button @click="submitLogin">Login</button>
    
  </div>
</template>
<script>
import { login } from "@/queries/users";
import { useToast } from "vue-toastification";
import { useUserStore } from "@/stores/userStore";

const toast = useToast();
export default {
  name: "LoginForm",
  emits: ["login-submitted", "switch-to-signup"],
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async submitLogin() {
      try {
        const response = await login({
          email: this.email,
          password: this.password,
        });
        if (!response || !response.token) {
          toast.error("Login failed: No token received.");
          return;
        }

        toast.success("Login successful!");
        this.AuthenticateUser(response);
        let userStore = useUserStore();

        if (userStore.getUser.verified) {
          this.$router.push("/atmoverview");
        } else {
          this.$router.push("/notverified");
        }
        this.$emit("login-submitted", response);
      } catch (error) {
        console.error("Login error:", error);
      }
    },

    AuthenticateUser(userResponse) {
      const userStore = useUserStore();

      const token = userResponse.token;
      const userDetails = userResponse.userDetails;

      userStore.setUser(userDetails);

      // Store token
      if (this.rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }
    },
  },
};
</script> 