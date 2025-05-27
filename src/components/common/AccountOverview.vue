<template>
    <div class="row">
        <section class="sideBar col-xs-12 col-md-2 ">
            <OverviewMenu />
        </section>
        <section class="maincontent col-xs-12  col-md">
            <h2>Overview</h2>

            <ActionMenu @filter="handleFilter" class="box" />
            <template v-if="bankAccounts.length === 0">
                <p>No bank accounts found.</p>
            </template>
            <template v-else>
                <BankAccount v-for="account in bankAccounts" :key="account.id" :bankAccount="account" class="box" />
            </template>
            <!-- TODO: make pagination -->


        </section>

    </div>
</template>
<script setup>
import ActionMenu from "../menus/ActionMenu.vue";
import OverviewMenu from "../menus/OverViewMenu.vue";
import BankAccount from "../common/BankAccount.vue";
import accounts from "../../queries/accounts";
import users from "../../queries/users";
import AccountTypes from '../../models/accountTypes';

import { ref, onMounted } from "vue";
import { useUserStore } from '../../stores/userStore';

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
// Accounts =  createAccount();
onMounted(() => {
    getAccounts(useUserStore.userId).then(accounts => {
        if (accounts && accounts.length > 0) {

            accounts = accounts.map(account => mapToAccount(account));
            bankAccounts.value = accounts;
        } else {
            console.warn("No accounts found or error fetching accounts.");
        }
    }).catch(error => {
        console.error("Error during account fetch:", error);
    });
});

async function getAccounts(userId, filter = null) {
    if (!userId) {
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

function mapToAccount(apiObject) {
    if (!apiObject) {
        console.warn("No API object provided, returning null");
        return null;
    }
    if (!apiObject.name || !apiObject.owner || !apiObject.balance || !apiObject.IBAN || !apiObject.absoluteLimit || !apiObject.type) {
        console.warn("Incomplete API object, returning null");
        return null;
    }
    return {
        owner: apiObject.owner,
        balance: apiObject.balance,
        IBAN: apiObject.IBAN,
        absoluteLimit: apiObject.absoluteLimit,
        type: AccountTypes[apiObject.type.toUpperCase()] || AccountTypes.CHECKING
    };
}

function handleFilter(filterData) {
    getAccounts(1, filterData).then(accounts => {
        if (accounts && accounts.length > 0) {
            console.log("Filtered accounts:", accounts.value);
            bankAccounts.value = accounts.value;

            // bankAccounts.value = accounts.map(account => mapToAccount(account));
        } else {
            console.warn("No accounts found or error fetching accounts with filter.");
        }
    }).catch(error => {
        console.error("Error during account fetch with filter:", error);
    });

}

</script>



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