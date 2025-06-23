<template>
  <div>
    <h2>Sign up</h2>
    <form @submit.prevent="submitSignup">
      <div class="grid">
        <div class="col-6">
          <label for="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            v-model="form.firstName"
            placeholder="Enter your first name"
            required
          />
        </div>
        <div class="col-6">
          <label for="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            v-model="form.lastName"
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>

      <div class="grid">
        <div class="col-6">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            placeholder="Enter your email"
            required
            pattern="^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
            title="Please enter a valid email address (e.g., example@domain.com)"
          />
          <small v-if="emailError" class="error-message">{{ emailError }}</small>
        </div>
        <div class="col-6">
          <label for="bsn">BSN</label>
          <input
            type="text"
            id="bsn"
            v-model="form.bsn"
            placeholder="Enter your BSN"
            required
            pattern="[0-9]{9}"
            title="BSN must be exactly 9 digits"
            @input="validateBSNFrontend"
            :aria-invalid="bsnError ? 'true' : 'false'"
          />
          <small v-if="bsnError" class="error-message">{{ bsnError }}</small>
        </div>
      </div>

      <label for="phoneNumber">Phone Number</label>
      <input
        type="tel"
        id="phoneNumber"
        v-model="form.phoneNumber"
        placeholder="Enter your phone number"
        required
        pattern="[0-9]{10,15}"
        title="Phone number must be between 10 and 15 digits"
      />
      <small v-if="phoneNumberError" class="error-message">{{ phoneNumberError }}</small>

      <div class="grid">
        <div class="col-6">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            placeholder="Enter your password"
            required
            pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':&quot;\\|,.<>\/?]).{8,}"
            title="Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character."
            @input="validatePasswordFrontend"
            :aria-invalid="passwordError ? 'true' : 'false'"
          />
          <small v-if="passwordError" class="error-message">{{ passwordError }}</small>
        </div>
        <div class="col-6">
          <label for="repeatPassword">Repeat Password</label>
          <input
            type="password"
            id="repeatPassword"
            v-model="form.repeatPassword"
            placeholder="Repeat your password"
            required
            @input="validatePasswordMatch"
            :aria-invalid="passwordMatchError ? 'true' : 'false'"
          />
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
const toast = useToast();

export default {
  name: "SignUpForm",
  emits: ["signup-submitted", "switch-to-login"],
  data() {
    return {
      form: {
        firstName: "",
        lastName: "",
        email: "",
        bsn: "",
        password: "",
        phoneNumber: "",
        repeatPassword: "",
      },
      errorMessage: "",
      successMessage: "",
      // Frontend validation error messages
      bsnError: "",
      passwordError: "",
      passwordMatchError: "",
      emailError: "",
      phoneNumberError: "" // Added for phone number
    };
  },
  watch: {
    // Watchers to clear errors and re-validate when input changes
    'form.bsn': 'validateBSNFrontend',
    'form.password': 'validatePasswordFrontend',
    'form.repeatPassword': 'validatePasswordMatch',
    'form.email': 'validateEmailFrontend',
    'form.phoneNumber': 'validatePhoneNumberFrontend'
  },
  methods: {
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
        // Perform 11-proof validation
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
                sum += digit * -1; // Last digit is multiplied by -1
            }
        }
        return sum !== 0 && sum % 11 === 0;
    },
    validatePhoneNumberFrontend() {
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!this.form.phoneNumber) {
            this.phoneNumberError = "Phone number is required.";
        } else if (!this.form.phoneNumber.match(phoneRegex)) {
            this.phoneNumberError = "Phone number must be between 10 and 15 digits.";
        } else {
            this.phoneNumberError = "";
        }
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
      this.validatePasswordMatch(); // Always check match when password changes
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
        // Run all validations to populate error messages
        this.validateEmailFrontend();
        this.validateBSNFrontend();
        this.validatePhoneNumberFrontend();
        this.validatePasswordFrontend();
        this.validatePasswordMatch();

        // Check if any error message is present
        return !(this.emailError || this.bsnError || this.phoneNumberError || this.passwordError || this.passwordMatchError);
    },
    async submitSignup() {
      this.errorMessage = "";
      this.successMessage = "";

      // Perform frontend validation before sending to backend
      if (!this.isFormValidFrontend()) {
        toast.error("Please correct the form errors.");
        return;
      }

      try {
        const response = await createUser(this.form);
        this.successMessage = "Signup successful!";
        toast.success("Signup successful! You can now log in."); // More informative toast
        this.$emit("signup-submitted", response);
      } catch (error) {
        console.error("Signup failed:", error);
        // Clear previous backend errors from fields
        this.emailError = "";
        this.bsnError = "";
        this.phoneNumberError = "";
        this.passwordError = "";
        this.passwordMatchError = "";


        if (error.response && error.response.data) {
            const backendErrors = error.response.data;
            if (typeof backendErrors === 'object' && !Array.isArray(backendErrors)) {
                // Assuming backend sends a map of fieldName: errorMessage
                for (const field in backendErrors) {
                    if (Object.prototype.hasOwnProperty.call(backendErrors, field)) {
                        // Map backend field names to frontend error data properties
                        if (field === 'email') this.emailError = backendErrors[field];
                        else if (field === 'BSN') this.bsnError = backendErrors[field]; // BSN case-sensitive
                        else if (field === 'phoneNumber') this.phoneNumberError = backendErrors[field];
                        else if (field === 'password') this.passwordError = backendErrors[field];
                        // Add more mappings if needed for firstName, lastName etc.

                        toast.error(`${field}: ${backendErrors[field]}`);
                    }
                }
                // If there's a general message outside specific fields, handle it
                if (backendErrors.message && Object.keys(backendErrors).length === 1) {
                    this.errorMessage = backendErrors.message;
                    toast.error(this.errorMessage);
                }
            } else if (typeof backendErrors === 'string') {
                 // For generic error messages (like UserAlreadyExistsException)
                this.errorMessage = backendErrors;
                toast.error(this.errorMessage);
            } else {
                this.errorMessage = "Signup failed. Please try again.";
                toast.error(this.errorMessage);
            }
        } else {
            this.errorMessage = "Signup failed. Please try again.";
            toast.error(this.errorMessage);
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

/* Pico's grid classes already handle much of the layout */
/* .grid and .col-6 are part of Pico.css */

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
  color: var(--pico-danger); /* Pico's red color for validation messages */
  font-size: 0.85em;
  margin-top: 0.25rem;
  display: block; /* Ensures it takes its own line */
}

/* Style for invalid input fields using Pico's styling hooks */
/* Pico automatically applies red border for :invalid elements if its CSS is active */
input[aria-invalid="true"] {
    border-color: var(--pico-danger);
    box-shadow: 0 0 0 0.125rem var(--pico-danger-light); /* Adds a subtle red glow */
}

/* Ensure the form elements correctly fit within their columns */
.grid > div {
    /* Adding some padding/margin if default Pico spacing isn't enough */
    padding: 0 0.5rem; /* Adjust as needed */
}

/* Ensure buttons and other elements are styled nicely by Pico */
button {
    margin-top: 1rem;
    width: 100%; /* Make button full width within its container */
}

/* Override Pico's default article padding if you need more space */
/* This is likely applied in the parent component (LoginContainer) */
/*
article.pico-form-card {
    padding: 40px;
}
*/
</style>