<template>
  <div class="dark">
    <h2>Sign up</h2>
    <form @submit.prevent="submitSignup">
      <div class="grid">
        <div class="col-6">
          <label for="firstName">First Name</label>
          <input type="text" id="firstName" v-model="form.firstName" placeholder="Enter your first name" required />
        </div>
        <div class="col-6">
          <label for="lastName">Last Name</label>
          <input type="text" id="lastName" v-model="form.lastName" placeholder="Enter your last name" required />
        </div>
      </div>

      <div class="grid">
        <div class="col-6">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="form.email" placeholder="Enter your email" required
            pattern="^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
            title="Please enter a valid email address (e.g., example@domain.com)" />
          <small v-if="emailError" class="error-message">{{ emailError }}</small>
        </div>
        <div class="col-6">
          <label for="bsn">BSN</label>
          <input type="text" id="bsn" v-model="form.bsn" placeholder="Enter your BSN" required pattern="[0-9]{9}"
            title="BSN must be exactly 9 digits" @input="validateBSNFrontend"
            :aria-invalid="bsnError ? 'true' : 'false'" />
          <small v-if="bsnError" class="error-message">{{ bsnError }}</small>
        </div>
      </div>
      <div class="grid">
        <div class="col-12">
          <label for="phoneNumberInput">Phone Number</label>
          <MazPhoneNumberInput v-model="form.phoneNumber" :preferred-countries="['NL', 'BE', 'DE']" :no-example="true"
            @update="onPhoneNumberUpdate" :aria-invalid="phoneNumberError ? 'true' : 'false'" />
          <small v-if="phoneNumberError" class="error-message">{{ phoneNumberError }}</small>
        </div>
      </div>
      <div class="grid">
        <div class="col-6">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="form.password" placeholder="Enter your password" required
            pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':&quot;\\|,.<>\/?]).{8,}"
            title="Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character."
            @input="validatePasswordFrontend" :aria-invalid="passwordError ? 'true' : 'false'" />
          <small v-if="passwordError" class="error-message">{{ passwordError }}</small>
        </div>
        <div class="col-6">
          <label for="repeatPassword">Repeat Password</label>
          <input type="password" id="repeatPassword" v-model="form.repeatPassword" placeholder="Repeat your password"
            required @input="validatePasswordMatch" :aria-invalid="passwordMatchError ? 'true' : 'false'" />
          <small v-if="passwordMatchError" class="error-message">{{ passwordMatchError }}</small>
        </div>
      </div>

      <button type="submit">Sign up</button>
    </form>

    <p class="login-link">
      Already have an account?
      <a href="#" @click.prevent="$emit('switch-to-login')">Log in</a>
    </p>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script>
import { createUser } from "@/queries/users";
import { useToast } from "vue-toastification";
import MazPhoneNumberInput from 'maz-ui/components/MazPhoneNumberInput';
import 'maz-ui/css/main.css'; // Import Maz-UI CSS

export default {
  name: "SignUpForm",
  components: {
    MazPhoneNumberInput
  },
  emits: ["signup-submitted", "switch-to-login"],
  data() {
    return {
      form: {
        firstName: "",
        lastName: "",
        email: "",
        bsn: "",
        password: "",
        phoneNumber: "", // This will hold the full international number
        repeatPassword: "",
      },
      errorMessage: "",
      successMessage: "",
      bsnError: "",
      passwordError: "",
      passwordMatchError: "",
      emailError: "",
      phoneNumberError: "",
      phoneNumberResults: null, // To store the results from MazPhoneNumberInput's @update event
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  watch: {
    'form.bsn': 'validateBSNFrontend',
    'form.password': 'validatePasswordFrontend',
    'form.repeatPassword': 'validatePasswordMatch',
    'form.email': 'validateEmailFrontend',
  },
  methods: {
    onPhoneNumberUpdate(results) {
      this.phoneNumberResults = results;
      // MazPhoneNumberInput handles its own internal validation,
      // but we'll use its 'isValid' property for our form validation.
      if (results.isValid) {
        this.phoneNumberError = "";
      }
    },
    validateEmailFrontend() {
      const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!this.form.email) {
        this.emailError = "Email is required.";
      } else if (!this.form.email.match(emailRegex)) {
        this.emailError = "Invalid email format.";
      } else {
        this.emailError = "";
      }
    },
    validateBSNFrontend() {
      const bsnValue = this.form.bsn;
      if (!bsnValue) {
        this.bsnError = "BSN is required.";
      } else if (!bsnValue.match(/^[0-9]{9}$/)) {
        this.bsnError = "BSN must be exactly 9 digits.";
      } else {
        if (!this.checkBSN11Proof(bsnValue)) {
          this.bsnError = "Invalid BSN (11-proof failed).";
        } else {
          this.bsnError = "";
        }
      }
    },
    checkBSN11Proof(bsn) {
      if (bsn.length !== 9 || isNaN(bsn)) {
        return false;
      }
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        const digit = parseInt(bsn.charAt(i));
        if (i < 8) {
          sum += digit * (9 - i);
        } else {
          sum += digit * -1;
        }
      }
      return sum !== 0 && sum % 11 === 0;
    },
    validatePasswordFrontend() {
      const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;
      if (!this.form.password) {
        this.passwordError = "Password is required.";
      } else if (!this.form.password.match(passwordRegex)) {
        this.passwordError = "Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.";
      } else {
        this.passwordError = "";
      }
      this.validatePasswordMatch();
    },
    validatePasswordMatch() {
      if (!this.form.repeatPassword) {
        this.passwordMatchError = "Repeat password is required.";
      } else if (this.form.password !== this.form.repeatPassword) {
        this.passwordMatchError = "Passwords do not match.";
      } else {
        this.passwordMatchError = "";
      }
    },
    isFormValidFrontend() {
      this.validateEmailFrontend();
      this.validateBSNFrontend();
      this.validatePasswordFrontend();
      this.validatePasswordMatch();

      // Validate phone number using the results from MazPhoneNumberInput
      if (!this.form.phoneNumber) {
        this.phoneNumberError = "Phone number is required.";
      } else if (!this.phoneNumberResults || !this.phoneNumberResults.isValid) {
        this.phoneNumberError = "Invalid phone number format.";
      } else {
        this.phoneNumberError = "";
      }

      return !(this.emailError || this.bsnError || this.phoneNumberError || this.passwordError || this.passwordMatchError);
    },
    async submitSignup() {
      this.errorMessage = "";
      this.successMessage = "";

      if (!this.isFormValidFrontend()) {
        this.toast.error("Please correct the form errors.");
        return;
      }

      try {
        const response = await createUser(this.form);
        this.successMessage = "Signup successful!";
        this.toast.success("Signup successful! You can now log in.");
        this.$emit("signup-submitted", response);
      } catch (error) {
        console.error("Signup failed:", error);
        this.emailError = "";
        this.bsnError = "";
        this.phoneNumberError = "";
        this.passwordError = "";
        this.passwordMatchError = "";


        if (error.response && error.response.data) {
          const backendErrors = error.response.data;
          if (typeof backendErrors === 'object' && !Array.isArray(backendErrors)) {
            for (const field in backendErrors) {
              if (Object.prototype.hasOwnProperty.call(backendErrors, field)) {
                if (field === 'email') this.emailError = backendErrors[field];
                else if (field === 'BSN') this.bsnError = backendErrors[field];
                else if (field === 'phoneNumber') this.phoneNumberError = backendErrors[field];
                else if (field === 'password') this.passwordError = backendErrors[field];

                this.toast.error(`${field}: ${backendErrors[field]}`);
              }
            }
            if (backendErrors.message && Object.keys(backendErrors).length === 1) {
              this.errorMessage = backendErrors.message;
              this.toast.error(this.errorMessage);
            }
          } else if (typeof backendErrors === 'string') {
            this.errorMessage = backendErrors;
            this.toast.error(this.errorMessage);
          } else {
            this.errorMessage = "Signup failed. Please try again.";
            this.toast.error(this.errorMessage);
          }
        } else {
          this.errorMessage = "Signup failed. Please try again.";
          this.toast.error(this.errorMessage);
        }
      }
    },
  },
};
</script>

<style scoped>
h2 {
  margin-bottom: 1rem;
  text-align: center;
}

.login-link {
  margin-top: 1.5rem;
  text-align: center;
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

.error {
  color: var(--pico-danger);
  margin-top: 1rem;
  text-align: center;
}

.success {
  color: var(--pico-success);
  margin-top: 1rem;
  text-align: center;
}

.error-message {
  color: var(--pico-danger);
  font-size: 0.85em;
  margin-top: 0.25rem;
  display: block;
}

input[aria-invalid="true"] {
  border-color: var(--pico-danger);
  box-shadow: 0 0 0 0.125rem var(--pico-danger-light);
}


.grid>div {
  padding: 0 0.5rem;
}

button {
  margin-top: 1rem;
  width: 100%;
}
</style>