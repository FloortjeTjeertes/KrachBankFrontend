<script setup>
import AccountTypes from '../../models/accountTypes';
defineProps({

    bankAccount: {
        type: Object,
        required: true,
        default: () => ({
            name: "Default Bank Account",
            owner: {
                id: 0,
                name: "placeholderUserName",
                firstName: "placeholder",
                lastName: "placeholder",
            },
            balance: 0,
            iban: "DE00000000000000000000",
            createdAt: new Date().toISOString(),
            absoluteLimit: 0,
            type: AccountTypes.CHECKING
        })
    },


});

</script>
<template>
    <article class="bank-account">
        <header class=" bank-header">
            <img :src="bankAccount.type.img" alt="Icon" class="bank-icon" />
            <h4>{{ bankAccount.type.name }} account</h4>
            <h4>{{ bankAccount.name }}</h4>
        </header>
        <section class="row">
            <section class="col-md account-col-1">
                <h4>{{ bankAccount.owner.firstName }} {{ bankAccount.owner.lastName }}</h4>
                <p><strong>IBAN:</strong> {{ bankAccount.IBAN }}</p>
            </section>
            <section class="col-md account-col-2">
                <strong>Balance:</strong> {{ bankAccount.balance }}
            </section>
        </section>


    </article>
</template>



<style lang="css" scoped>
.bank-account {
  width: 100%;
}

.bank-icon {
    height: 50%;
    width: 5%;
}

.bank-header {
    display: flex;
    align-items: center;
    gap: 10px;
}
.account-col-1 {
    display: flex;
    flex-direction: column;
}
.account-col-2{
    margin-left: auto;
    text-align: right;
}
</style>