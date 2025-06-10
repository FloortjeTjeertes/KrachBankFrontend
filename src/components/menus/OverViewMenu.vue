<script setup>
const emit  = defineEmits(['change']);
import { useRouter } from "vue-router";
const router = useRouter();
const goToNewTransaction = () => {
  router.push("/transactions/new"); // Change to your desired route
};
</script>

<template>
    <article>
        <header>
            <h4>Account Overview</h4>
        </header>
        <ul>
            <li><p @click="emit('change', 'overview')">Overview</p></li>
            <li><p @click="emit('change', 'transactions')">Transactions</p></li>
        </ul>
      <button class="transactionButton" @click="goToNewTransaction">new Transaction</button>
    </article>
</template>



<style lang="css" scoped>
 .transactionButton {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
 }
</style>