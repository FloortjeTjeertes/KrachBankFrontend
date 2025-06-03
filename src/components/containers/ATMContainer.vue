<script setup>
import { ref } from "vue";
import ATMSelect from "../common/ATMSelect.vue";
import ATMAmount from "../common/ATMAmount.vue";

const step = ref("select"); // "select" or "amount"
const action = ref(""); // "withdraw" or "deposit"
const amount = ref(null);

function handleSelect(selectedAction) {
  action.value = selectedAction;
  step.value = "amount";
}

function handleAmountSelected(selectedAmount) {
  amount.value = selectedAmount;
  // Here you would handle the ATM transaction logic (API call, etc.)
  alert(`You chose to ${action.value} €${selectedAmount}`);
  // Optionally reset or route away
  step.value = "select";
  action.value = "";
  amount.value = null;
}
</script>

<template>
  <div>
    <ATMSelect v-if="step === 'select'" @select="handleSelect" />
    <ATMAmount v-else-if="step === 'amount'" @amount-selected="handleAmountSelected" />
  </div>
</template>
