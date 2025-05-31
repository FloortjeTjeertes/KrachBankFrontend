<script setup>
import { createAccountFilter } from "../../filters/accountFilter.js";
import { reactive } from "vue";

const emit  = defineEmits(['filter']);
const filterData = reactive(createAccountFilter());
</script>
<template>
    <section class="action-menu ">
        <form>
            <legend>Actions</legend>
            <section class="grid">
                <input type="text" placeholder="iban" v-model="filterData.iban" class="form-control mb-2">
                <fieldset role="group" class="flex">
                    <input type="number" placeholder="MinBalance"  v-model.number="filterData.balance.min" class="form-control mb-2">
                    <input type="number" placeholder="MaxBalance" v-model.number="filterData.balance.max" class="form-control mb-2">
                </fieldset>
                <button type="button" @click="emit('filter', filterData)" class="btn btn-primary filter button">filter</button>
            </section>
            
        </form>
    </section>
</template>



<style lang="css" scoped>
.action-menu {
    background-color: var(--color-background);
   
}
.filter {
    width: 50%;
    

}
</style>