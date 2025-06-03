<template>

    <h2>Overview</h2>

    <ActionMenu @filter="handleFilter" class="box" />
    <section v-if="bankAccounts.length === 0">
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
import accounts from "../../queries/accounts";
import users from "../../queries/users";

import { ref, onMounted } from "vue";
import { useUserStore } from '../../stores/userStore';
import { useToast } from "vue-toastification";
import { mapToAccount } from '../../utils/mappers.js';
import { useRouter } from "vue-router";
const router = useRouter();
// TODO: replace with real data from API
const bankAccounts = ref([
    // {
    //     name: "placholder",
    //     owner: {
    //         id: 1,
    //         name: "John Doe",
    //         firstName: "John",
    //         lastName: "Doe"
    //     },
    //     balance: 1500.00,
    //     iban: "DE89370400440532013000"
    //     createdAt: "2023-10-01T12:00:00Z",
    //     absolutelimit: 10000.00,
    //     type: "checking",
    // }
]);
const toast = useToast();
const userStore = useUserStore();

//TODO: move this to the router
if(!userStore.isAuthenticated) {
    console.warn("No user found in store, redirecting to login.");
    router.push("/login" );
}
const currentUser = userStore.getUser?.id;

onMounted(() => {
    // getAccounts(userStore.getUser.getId).then(accounts => {
    getAccounts(currentUser).then(accounts => {


        if (!accounts && accounts.length <= 0) {
            toast.warning("No accounts found or error fetching accounts.");
            console.warn("No accounts found or error fetching accounts.");
            return;
        }
        bankAccounts.value = accounts.map(account => mapToAccount(account));
    }).catch(error => {
        toast.error(error.message || "Error fetching accounts");
        console.error("Error during account fetch:", error);
    });
});


async function getAccounts(userId, filter = null) {
    console.log("getAccounts called with userId:", userId, "and filter:", filter);
    if (userId == null || userId <= 0) {
        console.warn("No userId provided, returning empty array");
        return [];
    }

    try {
        const response = await accounts.fetchAccountsForUser(userId, filter);
        if (!response || response.length === 0) {
            console.warn("No accounts found for userId:", userId);
            return [];
        }

        const fullAccounts = await Promise.all(response.map(async (account) => {
            const owner = await getUserById(account.owner);
            if (!owner) {
                console.warn("User not found for account:", account.id);
            }
            return { ...account, owner };
        }));




        return fullAccounts;
    } catch (error) {
        console.error("Error fetching accounts:", error);
        return [];
    }


}

async function getUserById(accountId) {
    if (!accountId) {
        console.warn("No accountId provided, returning null");
        return null;
    }
    return users.fetchUserById(accountId).then(data => {
        return data;
    }).catch(error => {
        console.error("Error fetching user:", error);
        return null;
    });

}



function handleFilter(filterData) {
    console.log("Filter data received:", filterData);
    getAccounts(currentUser, filterData.value).then(accounts => {
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