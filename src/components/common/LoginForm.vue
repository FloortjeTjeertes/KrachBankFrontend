<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="submitLogin">
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

      <label for="rememberMe">
        <input type="checkbox" id="rememberMe" v-model="rememberMe" />
        Remember Me
      </label>

      <button type="submit">Login</button>
      <button type="button" style="margin-left: 1em;" @click="$emit('switch-to-atm')">Login to ATM</button>
    </form>
    <p class="signup-link">
      Don't have an account?
      <a href="#" @click.prevent="$emit('switch-to-signup')">Sign up</a>
    </p>
  </div>
</template>

<script>
import { login } from "@/queries/users";
import { useToast } from "vue-toastification";
import { useUserStore } from "@/stores/userStore"; // fixed casing

const toast = useToast();
export default {
  name: "LoginForm",
  emits: ["login-submitted", "switch-to-signup", "switch-to-atm"],
  data() {
    return {
      username: "",
      password: "",
      rememberMe: false,
    };
  },
  methods: {
    async submitLogin() {
      // Prevent empty username/password
      if (!this.username || !this.password) {
        toast.error("Username and password are required.");
        return;
      }
      try {
        const response = await login({
          username: this.username,
          password: this.password,
        });

        // Only proceed if token is present
        if (!response || !response.token) {
          toast.error("Login failed: No token received.");
          return;
        }

        toast.success("Login successful!");
        this.AuthenticateUser(response);
        let userStore = useUserStore();

        if (userStore.getUser.isVerified) {
          this.$router.push("/");
        } else {
          this.$router.push("/notverified");
        }
        this.$emit("login-submitted", response);
      } catch (error) {
        // Avoid storing any token on error
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        const msg = error.response?.data?.message || "Login failed";
        toast.error(msg);
        console.error("Login error:", error);
      }
    },

    AuthenticateUser(userResponse) {
      const userStore = useUserStore();
      const token = userResponse.token;
      const userDetails = userResponse.userDetails;

      userStore.setUser(userDetails);

      // Store token only if present
      if (token) {
        if (this.rememberMe) {
          localStorage.setItem("token", token);
        } else {
          sessionStorage.setItem("token", token);
        }
      }
    },
  },
};
</script>

<style scoped>
/* Your existing styles */
h2 {
  margin-bottom: 1rem;
}

label:has(input[type="checkbox"]) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.signup-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9em;
}

.signup-link a {
  color: var(--pico-primary);
  text-decoration: none;
  cursor: pointer;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>
