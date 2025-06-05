<template>
  <div>
    transactionForm
    <section class="row">
      <section class="col-md-5">
        <BankAccout :bankAccount="SendingIBank" />
      </section>
      <section class="col-md-5">
        <BankAccout :bankAccount="ReceivingIBank" />
      </section>
    </section>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import BankAccout from "@/components/common/BankAccount.vue";
defineProps({
  SendingIBank: {
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
      type: {
        name: "Checking",
        img: "path/to/icon.png",
      },
    }),
  },
  ReceivingIBank: {
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
      type: {
        name: "Checking",
        img: "path/to/icon.png",
      },
    }),
  },

  Transaction: {
    type: Object,
    default: () => ({
      amount: 0,
      date: new Date().toISOString(),
      description: "",
      senderIBAN: "",
      receiverIBAN: "",
    }),
  },
});
</script>

<style lang="css" scoped></style>
