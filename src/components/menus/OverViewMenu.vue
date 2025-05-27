<script setup>
const emit  = defineEmits(['change']);

</script>

<template>
    <article>
        <header>
            <h4>Account Overview</h4>
        </header>
        <ul>
            <li><p @click="emit('change', 'overview')">Overview</p></li>
            <li><p @click="emit('change', 'transactions')">Transactions</p></li>
            <li><p @click="emit('change', 'find-iban')">Find IBAN</p></li>
        </ul>
      
    </article>
</template>



<style lang="css" scoped>
 
</style>