<template>
    <div>
        transaction overview
        <TransactionsTable :transactions="transactionList" />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TransactionsTable from "./TransactionsTable.vue";
import transaction from "../../queries/transactions";
import { mapToTransaction } from "../../utils/mappers";
import { useToast } from "vue-toastification";

const toast = useToast();

var accountId = 1; // Default account ID, replace with actual logic to get current account ID

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
        if (!userId) {
            console.warn("No userId provided, fetching transactions for default user.");
            userId = 1; // Default user ID, replace with actual logic to get current user ID
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



</script>

<style lang="css" scoped></style>