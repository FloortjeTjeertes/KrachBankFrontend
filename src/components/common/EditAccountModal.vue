<template>
  <dialog ref="dialogRef" @close="emitClose">
    <article>
      <header>
        <h3>Edit Account Limits</h3>
        <button class="close" @click="emitClose" aria-label="Close"></button>
      </header>

      <form @submit.prevent="handleSubmit" novalidate>
        <p>Editing IBAN: <strong>{{ localAccount.iban }}</strong></p>

        <div class="grid">
          <label>
            New Transaction Limit
            <input type="number" v-model.number="localAccount.transactionLimit" />
          </label>

          <label>
            New Absolute Limit
            <input type="number" v-model.number="localAccount.absoluteLimit" />
          </label>
        </div>

        <footer>
          <button type="button" class="secondary" @click="emitClose">Cancel</button>
          <button type="submit" :disabled="loading">
            {{ loading ? 'Updating...' : 'Save Changes' }}
          </button>
        </footer>
      </form>
    </article>
  </dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  accountData: {
    type: Object,
    default: () => ({ iban: '', transactionLimit: 0, absoluteLimit: 0 }),
  },
  loading: Boolean,
});

const emit = defineEmits(['close', 'submit']);

const dialogRef = ref(null);
const localAccount = ref({ ...props.accountData });

// Watch for show prop to open/close dialog
watch(
  () => props.show,
  (val) => {
    if (val) {
      localAccount.value = { ...props.accountData };
      dialogRef.value?.showModal();
    } else {
      if (dialogRef.value?.open) dialogRef.value.close();
    }
  }
);

// Watch for changes in accountData while dialog open
watch(
  () => props.accountData,
  (newVal) => {
    if (props.show) {
      localAccount.value = { ...newVal };
    }
  }
);

function emitClose() {
  emit('close');
}

function handleSubmit() {
  emit('submit', { ...localAccount.value });
  emitClose();
}
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

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

button.close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
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
