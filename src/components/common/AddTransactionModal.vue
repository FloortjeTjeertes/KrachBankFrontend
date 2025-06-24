<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="emitClose"
    >
      <div
        class="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          @click="emitClose"
          class="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h3 class="text-xl font-semibold mb-4 text-gray-800">Add New Transaction</h3>

        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">From IBAN</label>
            <input
              v-model="from"
              type="text"
              required
              placeholder="Sender IBAN"
              class="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">To IBAN</label>
            <input
              v-model="to"
              type="text"
              required
              placeholder="Receiver IBAN"
              class="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Amount</label>
            <input
              v-model.number="amount"
              type="number"
              required
              min="0.01"
              step="0.01"
              placeholder="Amount"
              class="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              @click="emitClose"
              class="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {{ loading ? "Adding..." : "Add Transaction" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from "vue";
const emit = defineEmits(["close", "submit"]);

const props = defineProps({
  show: Boolean,
  loading: Boolean,
});

const from = ref("");
const to = ref("");
const amount = ref(0);
// Removed the description ref: const description = ref("");

// Watch for the 'show' prop to reset form fields when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    from.value = "";
    to.value = "";
    amount.value = 0;
    // Removed description reset: description.value = "";
  }
});


function submit() {
  if (amount.value <= 0) {
    alert("Amount must be greater than 0.");
    return;
  }

  emit("submit", {
    senderIBAN: from.value.trim(),
    receiverIBAN: to.value.trim(),
    amount: amount.value,
    description: "Admin Transaction", 
  });
}

function emitClose() {
  emit("close");
}
</script>

<style scoped>
/* Fade transition for modal */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>