<template>
  <div class="weather-metric">
    <q-icon :name="icon" :size="size" class="q-mr-xs weather-icon" />
    <div class="weather-info">
      <div class="label-text">{{ label }}</div>
      <div class="value-text">{{ value }}{{ unit }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon: string
    label: string
    value: number | string
    unit?: string
    size?: string
  }>(),
  {
    unit: '',
    size: 'md'
  }
)
</script>

<style scoped>
.weather-metric {
  display: flex;
  align-items: center;
}

.weather-info {
  display: flex;
  flex-direction: column;
}
</style>
