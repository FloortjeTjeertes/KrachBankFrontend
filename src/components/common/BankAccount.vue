<script setup>
defineProps({

    bankAccount: {
        type: Object,
        default: () => ({
            id: 0,
            name: "Default Bank Account",
            user: {
                id: 0,
                name: "Default User",
                firstName: "John",
                lastName: "Doe"
            },
            balance: 0.0,
            currency: "EUR",
            iban: "DE89370400440532013000",
        })
    },


});

</script>
<template>
    <article class="bank-account">
        <header>
            <img>
            <h4>{{ bankAccount.name }}</h4>
        </header>
        <section>
            <strong>Account Holder:</strong> {{ bankAccount.user.firstName }} {{ bankAccount.user.lastName }}
            <strong>IBAN:</strong> {{ bankAccount.iban }}
        </section>
        <section>
            <strong>Balance:</strong> {{ bankAccount.balance }} {{ bankAccount.currency }}
        </section>

    </article>
</template>



<style lang="css" scoped></style>