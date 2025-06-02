<template>
    <table>
      <thead>
        <tr>
          <th>First name</th>
          <th>Last name</th>
          <th>Email</th>
          <th>Phone number</th>
          <th>BSN</th>
          <th>Transfer Limit</th>
          <th>Verify</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.firstName }}</td>
          <td>{{ user.lastName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phoneNumber }}</td>
          <td>{{ user.BSN }}</td>
          <td>{{ user.transferLimit }}</td>
          <td>
            <button @click="$emit('verify', user)">Verify</button>
          </td>
        </tr>
      </tbody>
    </table>
  </template>
  
  <script setup>
  defineProps({
    users: {
      type: Array,
      required: true,
    },
  });
  // Only emit 'verify'
  defineEmits(["verify"]);
  </script>
