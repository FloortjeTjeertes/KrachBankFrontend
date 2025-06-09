<template>

    <h2>Overview</h2>

    <ActionMenu @filter="handleFilter" class="box" />
    <section v-if="bankAccounts.length === 0 || !bankAccounts">
        <p>No bank accounts found.</p>
    </section>
    <section class="accountList"  v-else>
        <BankAccount @click="handleClick(account)" v-for="account in bankAccounts" :key="account" :bankAccount="account"
            class="box" />
    </section>
    <!-- TODO: make pagination -->



</template>
<script setup>
import ActionMenu from "../menus/ActionMenu.vue";
import BankAccount from "../common/BankAccount.vue";



import { ref, onMounted,toRaw } from "vue";
import { useUserStore } from '../../stores/userStore';
import { useToast } from "vue-toastification";
import { mapToAccount } from '../../utils/mappers.js';
import { useRouter } from "vue-router";
import  AccountService from "../../service/AccountService.js";


const router = useRouter();
const toast = useToast();
const userStore = useUserStore();
const bankAccounts = ref([]);

//TODO: move this to the router

const currentUser = userStore.getUser?.id;

onMounted(() => {

    AccountService.getAccounts(currentUser).then(accounts => {
        if (!accounts && accounts.length <= 0) {
            toast.warning("No accounts found or error fetching accounts.");
            console.warn("No accounts found or error fetching accounts.");
            return;
        }
        if(!Array.isArray(accounts)) {
            toast.error("Unexpected response format for accounts.");
            console.error("Unexpected response format for accounts:", accounts);
            return;
        }
        bankAccounts.value = accounts.map(account => mapToAccount(account));
    }).catch(error => {
        toast.error(error.message || "Error fetching accounts");
        console.error("Error during account fetch:", error);
    });
});






function handleFilter(filterData) {
    console.log("Filter data received:", filterData);
    let filter = toRaw(filterData) ;
    console.log("Filter to be applied:", filter);
    AccountService.getAccounts(currentUser, filter).then(accounts => {
        if (accounts && accounts.length > 0) {
            // bankAccounts.value = accounts.value;

            bankAccounts.value = accounts.map(account => mapToAccount(account));
            toast.success("Accounts fetched successfully with filter");
        } else {
            console.warn("No accounts found or error fetching accounts with filter.");
        }
    }).catch(error => {
        toast.error(error.message || "Error fetching accounts with filter");
        console.error("Error during account fetch with filter:", error);
    });

}

function handleClick(account) {
    console.log("Account clicked:", account);
   router.push({
        name: "AccountDetails",
        params: { iban: account.IBAN }
    });
}

</script>



<style lang="css" scoped>
.accountList {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.bank-account{
    width: 50%;
}
.bank-account:hover {
    background-color: var(--pico-secondary-background);
    cursor: pointer;
}
</style>