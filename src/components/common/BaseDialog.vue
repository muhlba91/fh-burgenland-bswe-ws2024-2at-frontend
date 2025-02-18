<template>
  <q-dialog v-model="show" @hide="onHide">
    <q-card class="base-dialog">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          class="close-button"
          data-cy="close-button"
        />
      </q-card-section>

      <slot></slot>

      <q-card-actions align="right" class="q-pb-md q-px-md">
        <q-btn
          flat
          :label="cancelLabel"
          color="grey-7"
          v-close-popup
          class="q-mr-sm dialog-button"
          data-cy="cancel-button"
        />
        <q-btn
          unelevated
          :label="confirmLabel"
          :color="confirmColor"
          :loading="loading"
          @click="$emit('confirm')"
          class="dialog-button"
          :disable="disabled"
          data-cy="confirm-button"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    confirmLabel?: string
    cancelLabel?: string
    confirmColor?: string
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    confirmColor: 'primary',
    loading: false,
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const onHide = () => {
  emit('update:modelValue', false)
}
</script>
