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
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.firstname }}</td>
          <td>{{ user.lastname }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phonenumber }}</td>
          <td>{{ user.bsn }}</td>
          <td>{{ user.transferLimit }}</td>
          <td>
            <button @click="$emit('update', user)">Update</button>
            <button @click="$emit('delete', user)">Delete</button>
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
  defineEmits(["update", "delete"]);
  </script>
  