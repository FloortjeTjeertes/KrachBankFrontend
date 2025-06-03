<template>
  <div class="atm-page">
    <h1>ATM Page</h1>
    <p>Please login</p>
    <label for="username">Username</label>
      <input
        type="text"
        id="username"
        v-model="username"
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
import { useUserStore } from "@/stores/UserStore";

const toast = useToast();
export default {
  name: "LoginForm",
  emits: ["login-submitted", "switch-to-signup"],
  data() {
    return {
      username: "",
      password: "",
      rememberMe: false,
    };
  },
  methods: {
    async submitLogin() {
      try {
        const response = await login({
          username: this.username,
          password: this.password,
        });

        console.log(
          "Full login response object from login function:",
          response
        ); // Keep this for debugging
        console.log("Login successful:", response);
        toast.success("Login successful!");

        // Move authentication logic to AuthenticateUser
        this.AuthenticateUser(response);
        let userStore = useUserStore();

        if (userStore.getUser.isVerified) {
          this.$router.push("/atmoverview");
        } else {
          this.$router.push("/atmoverview");
        }
        this.$emit("login-submitted", response);
      } catch (error) {
        const msg = error.response?.data?.message || "Login failed";
        toast.error(msg);
        console.error("Login error:", error);
      }
    },

    AuthenticateUser(userResponse) {
      // Use UserStore to store user info and token
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