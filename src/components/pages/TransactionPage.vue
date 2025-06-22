<template>
  <article>
    <header>transactionForm</header>
    <form>
      <section class="sendSection">
        <h6>select account to send from:</h6>
        <AccountDropDown
          class="dropDown"
          :iban="localSendingIban"
          :userId="userId"
          v-model="selectedAccountSend"
        />
      </section>
      <h6>set transfer amount:</h6>
      <input
        type="number"
        v-model="Transaction.amount"
        placeholder="Amount"
        class="form-control"
        min="0"
        step="0.01"
        @input="DisableMinusValue"
      />
      <section class="receiveSection">
        <h6>where do you want to transfer to:</h6>
        <AccountDropDown
          class="dropDown"
          :userId="selectedUser?.id"
          v-model="selectedAccountReceive"
        />
        <h6>(optional) who do you want to transfer to?</h6>
        <UserDropdown class="dropDown" v-model="selectedUser" />
      </section>
      <h6>write a description:</h6>
      <input
        type="text"
        v-model="Transaction.description"
        placeholder="Description"
        class="form-control"
      />
      <button type="button" class="btn btn-primary" @click="SendTransaction">
        submit
      </button>
    </form>
  </article>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";
import transactionService from "@/service/TransactionService.js";
import UserDropdown from "../common/UserDropdown.vue";
import AccountDropDown from "../common/AccountDropDown.vue";

const userStore = useUserStore();
const route = useRoute();
const userId = ref(userStore.getUser?.id);
const selectedAccountSend = ref(null);
const selectedAccountReceive = ref(null);
const selectedUser = ref(null);

const props = defineProps({
  SendingIban: {
    type: String,
    default: "DE00000000000000000000",
  },
  ReceivingIban: {
    type: String,
    default: "DE00000000000000000000",
  },
});

const localSendingIban = ref(props.SendingIban);
const localReceivingIban = ref(props.ReceivingIban);

const Transaction = ref({
  amount: 0,
  date: new Date().toISOString(),
  description: "",
  senderIBAN: "",
  receiverIBAN: "",
});

onMounted(() => {
  fillSenderFromRoute();
});

watch(selectedAccountSend, (newValue) => {
  if (newValue && newValue.IBAN) {
    Transaction.value.senderIBAN = newValue.IBAN;
  } else {
    Transaction.value.senderIBAN = "";
  }
});

watch(selectedAccountReceive, (newValue) => {
  if (newValue && newValue.IBAN) {
    Transaction.value.receiverIBAN = newValue.IBAN;
  } else {
    Transaction.value.receiverIBAN = "";
  }
});

function DisableMinusValue(event) {
  if (event.target.value < 0) {
    console.log(event.target.value);
    Transaction.value.amount = 0;
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
    localSendingIban.value = route.params.iban;
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
