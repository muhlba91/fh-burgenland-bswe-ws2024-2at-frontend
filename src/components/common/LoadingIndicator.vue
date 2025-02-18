<template>
  <q-inner-loading :showing="showing" class="bg-grey-2">
    <div class="column items-center">
      <q-spinner :color="color" :size="size" />
      <div :class="`text-${textSize} q-mt-md`">{{ message }}</div>
    </div>
  </q-inner-loading>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    showing: boolean
    message: string
    color?: string
    size?: string
    textSize?: string
  }>(),
  {
    color: 'primary',
    size: '2em',
    textSize: 'caption'
  }
)
</script>
