<template>
  <q-dialog v-model="show" cy-data="confirm-dialog">
    <q-card class="confirm-dialog">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup class="close-button" />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <p class="text-body1" v-if="html" v-html="message"></p>
        <p class="text-body1" v-else>{{ message }}</p>
      </q-card-section>

      <q-card-actions align="right" class="q-pb-md q-px-md">
        <q-btn
          flat
          :label="cancelLabel"
          color="grey-7"
          v-close-popup
          class="q-mr-sm dialog-button"
        />
        <q-btn
          unelevated
          :label="confirmLabel"
          color="negative"
          :loading="loading"
          @click="confirm"
          class="dialog-button"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    html?: boolean
  }>(),
  {
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    html: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()

const loading = ref(false)

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

function confirm() {
  loading.value = true
  try {
    emit('confirm')
  } finally {
    loading.value = false
    show.value = false
  }
}
</script>

<style scoped>
.confirm-dialog {
  border-radius: 12px;
  max-width: 400px;
  width: 90vw;
  margin: 20px;
}

.close-button {
  margin-right: -8px;
}

.dialog-button {
  border-radius: 8px;
  min-width: 100px;
}

:deep(.q-dialog__backdrop) {
  backdrop-filter: blur(3px);
  background: rgba(0, 0, 0, 0.4);
}
</style>
