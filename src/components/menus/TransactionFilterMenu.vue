<template>
  <section class="Filter-menu">
    <form>
      <section class="filter-container">
        <!-- row 1 -->
        <section class="row">
          <label class="col-md IbanLabel">
            IBAN
            <fieldset role="group" class="mb ibanGroup">
            <input
              type="text"
              placeholder="sender"
              v-model="filterData.iban.sender"
              class="form-control"
            />
            <input
              type="text"
              placeholder="receiver"
              v-model="filterData.iban.receiver"
              class="form-control">
            </fieldset>
          </label>
          <label class="col-md AmountLabel">
            Amount
            <fieldset role="group" class="mb amountGroup">
              <input
                type="number"
                placeholder="MinAmount"
                v-model.number="filterData.amount.min"
                class="form-control"
                min="0"
                step="0.01"
              />
              <input
                type="number"
                placeholder="MaxAmount"
                v-model.number="filterData.amount.max"
                class="form-control"
                min="0"
                step="0.01"
              />
            </fieldset>
          </label>
          <label for="dateFrom" class="dateFromLabel col-md">
            before and after date
            <fieldset role="group" class="mb">
              <input
                type="date"
                id="dateFrom"
                placeholder="Date From"
                v-model="dateFrom"
                class="form-control mb"
              />
              <input
                type="date"
                id="dateTo"
                placeholder="Date To"
                v-model="dateTo"
                class="form-control mb"
              />
            </fieldset>
          </label>

          <button
            type="button"
            @click="sendDataToParent()"
            class="btn btn-primary filter button filter-button"
          >
            filter
          </button>
        </section>
      </section>
    </form>
  </section>
</template>

<script setup>
import { reactive, watch, ref } from "vue";

const emit = defineEmits(["filter"]);

const filterData = reactive({
  iban:{
    sender: null,
    receiver: null,
  },
  amount: {
    min: null,
    max: null,
  },
  date: {
    before: null,
    after: null,
  },
});

const dateFrom = ref(null);
const dateTo = ref(null);
const TimeFrom = ref("00:00:00");
const TimeTo = ref("00:00:00");

function sendDataToParent() {
  if (dateFrom.value) {
    filterData.date.after = `${dateFrom.value}T${TimeFrom.value}`;
  }
  else {
    filterData.date.after = null;
  }

  if (dateTo.value) {
    filterData.date.before = `${dateTo.value}T${TimeTo.value}`;
  }
  else {
    filterData.date.before = null;
  }

  emit("filter", filterData);
}
</script>

<style lang="css" scoped>
.dateFromLabel {
  width: 100%;
  padding: 0%;
}
.dateToLabel {
  width: 100%;
  /* padding: 0%; */
}
.buttonContainer {
  display: flex;
  align-items: center;
  justify-content: bottom;
  font-size: 50%;
}
.row {
  margin-bottom: 0%;
}
.row input {
  font-size: small;
  height: fit-content;
}
.row label {
  font-size: 50%;
}
</style>
