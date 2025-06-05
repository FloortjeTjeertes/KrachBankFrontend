<script setup>
// import { useUserStore } from '../../stores/userStore';
const emit  = defineEmits(['change']);
// const userStore = useUserStore();
// if(!userStore.getUser) {
//     console.warn("No user found in store, please login first.");
//     emit('change', 'login'); // Emit an event to change to login view if no user is found
// }

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
      
    </article>
</template>



<style lang="css" scoped>
 
</style>