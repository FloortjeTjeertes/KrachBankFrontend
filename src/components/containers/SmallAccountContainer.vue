<template>
  <div class="row small-account">
    <div class="col-md-2">
      <img
        :src="account.type.img"
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
/* .image-icon {
   width: 100%;
  height: 10%;
  max-width: 100%;   
  max-height: 100%; 
  object-fit: contain; 
  display: block;
} */
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
  width: max-content !important;
}
</style>
