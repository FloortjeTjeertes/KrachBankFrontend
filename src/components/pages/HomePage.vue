<template>
    <div class="row">
        <section class="sideBar col-xs-12 col-md-2 ">
            <OverviewMenu @change="changeMenu" />
        </section>
       <section class="container mainContent col-xs-12 col-md-10">
            <AccountOverview v-if="active === 'overview'"/>
            <TransactionOverview v-else-if="active === 'transactions'" />
            <TransactionForm v-else-if="active === 'transactionForm'" />
        </section>
    </div>
</template>
<script setup>
import OverviewMenu from "../menus/OverViewMenu.vue";
import AccountOverview from "../common/AccountOverview.vue";
import TransactionOverview from "../common/TransactionOverview.vue";
import TransactionForm from "./TransactionPage.vue";
import { ref } from "vue";
let active = ref("overview");



function changeMenu(menu) {
    console.log("Change menu to:", menu);
    active.value = menu;
    // Implement menu change logic here
}

</script>
<style scoped>

</style>
