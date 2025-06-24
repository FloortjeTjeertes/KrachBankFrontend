<template>
  <dialog ref="dialogRef" :open="show" @close="emitClose">
    <article>
      <header>
        <h3>Add New Transaction</h3>
      </header>

      <form @submit.prevent="handleSubmit" novalidate>
        <label>
          Sender IBAN
          <input type="text" v-model="transaction.senderIBAN" required />
        </label>

        <label>
          Receiver IBAN
          <input type="text" v-model="transaction.receiverIBAN" required />
        </label>

        <label>
          Amount
          <input type="number" v-model.number="transaction.amount" min="0.01" step="0.01" required />
        </label>

        <footer>
          <button type="submit" :disabled="loading">
            {{ loading ? 'Adding…' : 'Add Transaction' }}
          </button>
          <button type="button" class="secondary" @click="emitClose">Cancel</button>
        </footer>
      </form>
    </article>
  </dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  loading: Boolean,
});

const emit = defineEmits(['close', 'submit']);

const transaction = ref({
  senderIBAN: '',
  receiverIBAN: '',
  amount: null,
});

const dialogRef = ref(null);

function emitClose() {
  emit('close');
}

function handleSubmit() {
  emit('submit', { ...transaction.value });
  resetForm();
  emitClose();
}

function resetForm() {
  transaction.value = {
    senderIBAN: '',
    receiverIBAN: '',
    amount: null,
  };
}

watch(() => props.show, (val) => {
  if (val) {
    dialogRef.value?.showModal();
  } else if (dialogRef.value?.open) {
    dialogRef.value.close();
  }
});
</script>

<style scoped>
dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 9999;
}

dialog {
  border-radius: 1rem;
  max-width: 480px;
  width: 90%;
  padding: 1.5rem 2rem;
  border: none;
}

footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

button.secondary {
  background: transparent;
  border: 1px solid var(--color-contrast-medium);
  color: var(--color-contrast-high);
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

button.secondary:hover {
  background: var(--color-contrast-medium);
  color: var(--color-contrast-low);
}
</style>
