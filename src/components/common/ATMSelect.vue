<template>
  <div>
    <h2>ATM - Choose Action</h2>
    <button @click="$emit('select', 'withdraw')">Withdraw</button>
    <button @click="$emit('select', 'deposit')" style="margin-left:1em;">Deposit</button>
  </div>
</template>

<script setup>
// No script needed except for emits
defineEmits(['select']);
</script>
