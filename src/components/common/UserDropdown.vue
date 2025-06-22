<template>
  <details class="dropdown" @click="getAccounts">
    <summary class="dropdown-header">
      <!-- <SmallUser class="dropdown-account" :account="SelectedAccount" /> -->

      {{ selectedUser.firstName }} {{ selectedUser.lastName }}
    </summary>
    <ul class="dropdown-body">
      <input
        type="text"
        class="dropdown-search"
        placeholder="Search accounts"
        aria-label="Search accounts"
        v-model="userName"
        @oninput="getUser(userName)"
        @keyup="getUser(userName)"
      />
      <li
        v-for="user in filteredUsers"
        :key="user.Id"
        class="dropdown-item"
        @click="setSelectedUse(user)"
      >
        <!--TODO: maybe make this into an cutom component -->
        <div clas="user">
          {{ user.id }} {{ user.firstName }} {{ user.lastName }}
        </div>
      </li>
    </ul>
  </details>
</template>

<script setup>
import { ref, watch } from "vue";
// import SmallAccount from "@/components/containers/SmallAccountContainer.vue";
import UserService from "@/service/UserService.js";

const props = defineProps({
  userId: {
    type: String,
    required: false,
  },
});
const emit = defineEmits(['update:modelValue']);
const filteredUsers = ref([]);
const userName = ref("John Doe");
const name = {
  firstName: "John",
  lastName: "Doe",
};

emit("update:modelValue", {
  id: 0,
  name: "placeholderUserName",
  firstName: "placeholder",
  lastName: "placeholder",
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

async function getUser(Name) {
  try {
    const response = await UserService.getUserByName(Name);

    if (response) {
      filteredUsers.value = response;

      console.log("User data fetched:", filteredUsers.value);
    } else {
      console.warn("No user data found:", props.userId);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

function setSelectedUse(User) {
  console.log("Selected user:", User);
  if (!User && !User.id) {
    throw new Error("Invalid user selected");
  }
  selectedUser.value = User;
  emit("update:modelValue", User); // Emit the selected user
}


</script>

<style lang="css" scoped></style>
