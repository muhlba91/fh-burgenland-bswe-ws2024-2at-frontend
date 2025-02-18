<template>
  <q-banner v-if="error" rounded class="bg-negative text-white q-mb-md">
    <template #avatar>
      <q-icon name="error" />
    </template>
    <div class="text-subtitle2">{{ error.message }}</div>
    <div v-if="error.status" class="text-caption">Status: {{ error.status }}</div>

    <template #action>
      <q-btn flat color="white" label="Retry" @click="$emit('retry')" />
      <q-btn flat color="white" icon="close" @click="$emit('dismiss')" />
    </template>
  </q-banner>
</template>

<script setup lang="ts">
import { type ApiError } from 'src/model/apiError'

defineProps<{
  error: ApiError | null
}>()

defineEmits<{
  (e: 'retry'): void
  (e: 'dismiss'): void
}>()
</script>
