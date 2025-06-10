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
          <th>Daily Limit</th>
          <th>Update</th>
          <th>Delete</th>
          <th>Transactions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.firstName }}</td>
          <td>{{ user.lastName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phoneNumber }}</td>
          <td>{{ user.bsn }}</td>
          <td>{{ user.transferLimit }}</td>
          <td>{{ user.dailyLimit}}</td>
          <td>
            <button @click="$emit('update', user)">Update</button>
          </td>
          <td>
            <button v-if="user.active !== false" @click="$emit('delete', user)">Delete</button>
            <button v-else @click="$emit('reactivate', user)">Reactivate</button>
          </td>
          <td>
            <button @click="$emit('view-transactions', user)">Transactions</button>
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
  defineEmits(["update", "delete", "reactivate", "view-transactions"]);
  </script>
