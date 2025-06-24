<template>
  <details class="dropdown" @click="getAccounts">
    <summary class="dropdown-header">
      <span v-if="selectedUser == null">No user selected</span>
      <span v-else
        >{{ selectedUser.firstName }} {{ selectedUser.lastName }}</span
      >
    </summary>
     
    <ul class="dropdown-body">
      <input
        type="text"
        class="dropdown-search"
        placeholder="Search accounts"
        aria-label="Search accounts"
        v-model="userName"
        @input="handleUserInputFields(userName)"
        @keyup="handleUserInputFields(userName)"
      />
      <div class="dropdown-list">
      <li class="dropdown-item" @click="clearUser()">No user</li>
      <li
        v-for="user in filteredUsers"
        :key="user.Id"
        class="dropdown-item"
        @click="setSelectedUser(user)"
      >
        <div class="user">{{ user.firstName }} {{ user.lastName }}</div>
      </li>
      </div>
    </ul>
  </details>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import UserService from "@/service/UserService.js";

const props = defineProps({
  userId: {
    type: String,
    required: false,
  },
});
const emit = defineEmits(["update:modelValue"]);
const filteredUsers = ref([]);
const userName = ref("John Doe");
const name = {
  firstName: "John",
  lastName: "Doe",
};

onMounted(() => {
  emit("update:modelValue", null); // Initialize with no user selected
});

watch(userName, (newValue) => {
  if (newValue) {
    name.firstName = newValue.split(" ")[0] || "firstName";

    name.lastName = newValue.split(" ")[1] || null;
  } else {
    filteredUsers.value = [];
  }
});
const selectedUser = ref({
  id: 0,
  name: "placeholderUserName",
  firstName: "placeholder",
  lastName: "placeholder",
});

async function handleUserInputFields() {
  if (userName.value) {
    filteredUsers.value = await getUser(userName.value);
  } else {
    filteredUsers.value = await getAllUsers();
  }
}

async function getUser(Name) {
  try {
    const response = await UserService.getUserByName(Name);

    if (!response) {
      console.warn("No user data found:", props.userId);
    }
    return response;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

async function getAllUsers() {
  try {
    const response = await UserService.getAllUsers();
    if (!response) {
      console.warn("No user data found");
    }
    return response;
  } catch (error) {
    console.error("Error fetching all users:", error);
  }
}

function clearUser() {
  userName.value = "";
  filteredUsers.value = [];
  selectedUser.value = null; // Reset selected user
  emit("update:modelValue", null); // Emit null to clear the selected user
}

function setSelectedUser(User) {
  if (User == null || !User || !User.id) {
    throw new Error("Invalid user selected");
  }
  selectedUser.value = User;
  emit("update:modelValue", User); // Emit the selected user
}
</script>

<style lang="css" scoped>
.dropdown-body {
  min-height: 1;
  max-height: 350% !important;      /* Set your desired max height */
  overflow-y: auto;       /* Enable vertical scrolling */
}

</style>
