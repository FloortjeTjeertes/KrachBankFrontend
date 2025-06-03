<template>
  <div>
    <h2>Enter Amount</h2>
    <form @submit.prevent="submitAmount">
      <input
        type="number"
        v-model.number="amount"
        min="1"
        placeholder="Amount"
        required
        style="width: 120px;"
      />
      <button type="submit" style="margin-left:1em;">OK</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
const amount = ref(0);
const emit = defineEmits(['amount-selected']);

function submitAmount() {
  if (amount.value > 0) {
    emit('amount-selected', amount.value);
  }
}
</script>
