<script setup>
import ActionMenu from "../menus/ActionMenu.vue";
import OverviewMenu from "../menus/OverViewMenu.vue";
import BankAccount from "../common/BankAccount.vue";

// TODO: replace with real data from API
const bankAccounts = [
    {
        id: 1,
        name: "Main Account",
        user: {
            id: 1,
            name: "John Doe",
            firstName: "John",
            lastName: "Doe"
        },
        balance: 1500.00,
        currency: "EUR",
        iban: "DE89370400440532013000"
    },
    {
        id: 2,
        name: "Savings Account",
        user: {
            id: 1,
            name: "John Doe",
            firstName: "John",
            lastName: "Doe"
        },
        balance: 5000.00,
        currency: "EUR",
        iban: "DE89370400440532013001"
    }
];

</script>

<template>
    <div class="row">
        <section class="sideBar col-xs-12 col-md-2 ">
            <OverviewMenu />
        </section>
        <section class="maincontent col-xs-12  col-md">
            <h2>Overview</h2>
            <ActionMenu class="box"/>
            <BankAccount v-for="account in bankAccounts" 
            :key="account.id"
            :bankAccount="account"
            class="box" />
            <!-- TODO: make pagination -->

        </section>

    </div>
</template>



<style lang="css" scoped>
/* .sideBar {
    grid-column: 1;
    grid-row: 1;
}

.maincontent {
    grid-column: 2;
    grid-row: 1;
} */
</style>