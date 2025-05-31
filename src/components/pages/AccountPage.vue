<template>
    <div>
        <h1>account page</h1>
        <section class="row">
            <section class="col-md-5">
                <BankAccount :BankAccount="bankAccount"></BankAccount>
            </section>
            <section class="col-md">
                <TransactionsTable :transactions="transactionList" />

            </section>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BankAccount from "../common/BankAccount.vue";
import TransactionsTable from "../common/TransactionsTable.vue";
import transaction from "../../queries/transactions";
import { mapToTransaction } from "../../utils/mappers";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";

const toast = useToast();
const router = useRoute();
const accountId = router.params.accountId;
const bankAccount = ref(null);
// const userStore = useUserStore();

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

onMounted(() => {
    try {
        // Fetch transactions for the current user or a default user
        getTransactionsForAccount(accountId).then(transactions => {
            if (!transaction || transaction.length <= 0) {
                console.warn("No transactions found for account.");
                return;
            }
            transactionList.value = transactions.map(transaction => mapToTransaction(transaction));

            console.log("Transactions fetched successfully for account.", transactionList.value);

        }).catch(error => {
            toast.error("Error fetching transactions: " + error.message);
            console.error("Error fetching transactions:", error);
        });

    } catch (error) {
        console.error("Error during component mount:", error);
    }
});



async function getTransactionsForAccount(accountId) {
    try {
        if (!accountId) {
            console.warn("No accountId provided,returning empty array.");
            return [];
        }
        const transactions = await transaction.fetchTransactionsForAccount(accountId);
        if (!transactions || transactions.length <= 0) {
            throw new Error("No transactions found for account: " + accountId);
        }
        console.log("Fetched transactions for account:", accountId, transactions);
        return transactions;


    }
    catch (e) {
        toast.error("Error fetching transactions for account:", e);
        console.error("Error fetching transactions for account:", e);
    }
}


</script>

<style lang="css" scoped></style>