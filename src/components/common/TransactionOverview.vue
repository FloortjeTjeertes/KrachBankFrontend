<template>
    <div>
        transaction overview
        <TransactionsTable v-if="transactionList && transactionList.length > 0" :transactions="transactionList" />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TransactionsTable from "./TransactionsTable.vue";
import transaction from "../../queries/transactions";
import users from "../../queries/users";
import { mapToTransaction } from "../../utils/mappers";
import { useToast } from "vue-toastification";
import { useUserStore } from "../../stores/userStore";
import { useRouter } from "vue-router";
const toast = useToast();
const userStore = useUserStore();


var accountId = userStore.getUser?.id; // Default account ID, replace with actual logic to get current account ID

let transactionList = ref([
    // {
    //     amount: 100,
    //     to: "NL91ABNA0417164301",
    //     from: "NL91ABNA0417164300",
    //     description: "tax payment",
    //     initiator: 3,
    //     createdAt: "2023-10-01T12:00:00Z"
    // }

]);
// const userStore = useUserStore();

onMounted(() => {
    try {
        var user = getLoggedInUser(); // Ensure user is logged in before fetching transactions
        console.log("Logged in user:", user);
        // Fetch transactions for the current user or a default user
        getTransactionsForUser(accountId).then(transactions => {
            if (!transaction || transaction.length <= 0) {
                console.warn("No transactions found for user.");
                return;
            }
            transactionList.value = transactions.map(transaction => mapToTransaction(transaction));

            console.log("Transactions fetched successfully for user.");

        }).catch(error => {
            toast.error("Error fetching transactions: " + error.message);
            console.error("Error fetching transactions:", error);
        });

    } catch (error) {
        console.error("Error during component mount:", error);
    }
});

async function getTransactionsForUser(userId) {
    try {
        if (!Number.isInteger(userId)) {
            console.warn("userId is not an integer:", userId);
            toast.error("Invalid user ID.");
            return [];
        }


        const transactions = await transaction.fetchUserTransactions(userId);
        if (!transactions || transactions.length < 0) {
            throw new Error("No transactions found for user: " + userId);
        }

        return transactions;
    }
    catch (e) {
        console.error("Error fetching transactions for user:", e);
        toast.error("Error fetching transactions for user: " + e.message);
    }
}

function getLoggedInUser() {
    const userStore = useUserStore();
    console.log("User store:", userStore.get);
    const router = useRouter();

    try {
        if (!userStore.getUser || !userStore.getUser.id) {
            console.warn("No user found in store, please login first.");
            //router.push("/login"); // Redirect to login page if no user is found
        }
       
        users.fetchUserById(userStore.getUser.id); // Ensure user data is fetched
    } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error fetching user data: " + error.message);
    }



    return userStore.getUser;
}

</script>

<style lang="css" scoped></style>