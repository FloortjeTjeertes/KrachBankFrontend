<template>
  <article >
    <header>transactionForm</header>
    <form>
      <h6>select account to send from:</h6>
      <TransactionDropDown class="dropDown" :iban="SendingIBan" :userId="userId" v-model="selectedAccountSend"/>
      <h6>set transfer amount:</h6>
      <input type="number" v-model="Transaction.amount" placeholder="Amount" class="form-control"
        min="0" step="0.01" @input="DisableMinusValue" />
      <h6>where do you want to transfer to:</h6>
      <TransactionDropDown class="dropDown" :iban="SendingIBan" v-model="selectedAccountReceive"/>
      <h6>write a description:</h6>
      <input type="text" v-model="Transaction.description" placeholder="Description" class="form-control" />
      <button type="button" class="btn btn-primary"  @click="SendTransaction">submit</button>
      
    </form>

    
  </article>
</template>

<script setup>
import { onMounted, ref, toRaw } from "vue";
import { useUserStore } from '@/stores/userStore';
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";
import TransactionDropDown from "@/components/common/TransactionDropDown.vue";
import { watch } from "vue";
import transactionService from "@/service/TransactionService.js";

const userStore = useUserStore();
const route = useRoute();
const userId = ref(userStore.getUser?.id);
const selectedAccountSend = ref(null);
const selectedAccountReceive = ref(null);
const sendingIBan = ref();

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
onMounted(() => {
  fillSenderFromRoute()
});

watch(selectedAccountSend, (newValue) => {
  console.log("Selected account for sending:", newValue);
  if (newValue && newValue.iban) {
    Transaction.value.senderIBAN = newValue.iban;
  }
  else {
    Transaction.value.senderIBAN = "";
  }
});

watch(selectedAccountReceive, (newValue) => {
  console.log("Selected account for receiving:", newValue);
  if (newValue && newValue.iban) {
    Transaction.value.receiverIBAN = newValue.iban;
  }
  else {
    Transaction.value.receiverIBAN = "";
  }
});


const Transaction = ref({
  amount: 0,
  date: new Date().toISOString(),
  description: "",
  senderIBAN: "",
  receiverIBAN: "",
});

function DisableMinusValue(event) {
  if (event.target.value < 0) {
      console.log(event.target.value);
     Transaction.value.amount= 0;
  }
}

function validateTransaction(transaction) {
  if (transaction.amount <= 0) {
    useToast().error("Amount must be greater than zero.");
    return false;
  }
  if (!transaction.senderIBAN || !transaction.receiverIBAN) {
    useToast().error("Both sender and receiver IBANs must be selected.");
    return false;
  }
  return true;
}

async function SendTransaction() {
  if (!validateTransaction(Transaction.value)) {
    return;
  }
  try {
  
    await transactionService.sendTransaction(Transaction.value);
    useToast().success("Transaction sent successfully!");
  } catch (error) {
    
    useToast().error(error.message);
  }

}


function fillSenderFromRoute() {
  if (route.params.iban) {
    sendingIBan.value = route.params.iban;

  } else {
    console.warn("No IBAN provided in route params.");
  }
}
</script>

<style lang="css" scoped>
  .dropDown {
    width: 40% !important;
    margin-bottom: 10px;
  }
</style>
