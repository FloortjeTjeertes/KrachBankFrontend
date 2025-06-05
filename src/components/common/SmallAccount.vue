<template>
  <div class="row small-account">
    <div class="col-md-1">
      <img
        :src="account.type.img"
        alt="Account Type Icon"
        class="image-icon"
      />
    </div>
    <div class="col-md infoSection">
      <div class="top-section">
        <b class="accountType">{{ account.type.name }} </b>
        <b class="text-center">€ {{ account.balance }}</b>
      </div>
      <div class="bottom-section">
        <small class="text-center">IBAN: {{ account.iban }}</small>
        <small class="text-center">Owner: {{ account.owner.firstName }} {{ account.owner.lastName }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import AccountTypes from "@/models/accountTypes";
import { ref } from "vue";

defineProps({
  account: {
    type: Object,
    required: true,
    default: () => ({
      owner: {
        id: 0,
        name: "placeholderUserName",
        firstName: "placeholder",
        lastName: "placeholder",
      },
      balance: 0,
      iban: "DE00000000000000000000",
      type: AccountTypes.CHECKING,
    }),
  },
});
</script>

<style lang="css" scoped>
.image-icon {
  width: fit-content;
  height: 50%;
}
.top-section {
  display: flex;
  align-items: center;
    justify-content: space-between;
}
.bottom-section {

  display: flex;
  flex-direction: column;
}
.infoSection {
  font-size: 60%;
}
</style>
