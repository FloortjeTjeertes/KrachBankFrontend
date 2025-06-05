<template>
  <article >
    <header>transactionForm</header>
    <section>
      <p>select account to send from</p>
      <TransactionDropDown :iban="SendingIBan" />
      <input type="number" v-model="Transaction.amount" placeholder="Amount" class="form-control"
        min="0" step="0.01" @input="DisableMinusValue" />
      <TransactionDropDown :iban="SendingIBan" />
      <button type="button" class="btn btn-primary"  @click="$emit('submit', Transaction)">submit</button>
    </section>

  </article>
</template>

<script setup>
import { ref } from "vue";
import BankAccount from "@/components/common/BankAccount.vue";
import TransactionDropDown from "@/components/common/TransactionDropDown.vue";

const props = defineProps({
  SendingIBan: {
    type: String,
    default: "DE00000000000000000000",
  },
  ReceivingIBan: {
    type: String,
    default: "DE00000000000000000000",
  },
});

const Transaction = ref({
  amount: 0,
  date: new Date().toISOString(),
  description: "",
  senderIBAN: props.SendingIBan,
  receiverIBAN: props.ReceivingIBan,
});

function DisableMinusValue(event) {
  if (event.target.value < 0) {
      console.log(event.target.value);
     Transaction.value.amount= 0;
  }
}

</script>

<style lang="css" scoped></style>
