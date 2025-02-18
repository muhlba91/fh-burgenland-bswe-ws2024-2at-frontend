<template>
  <div class="metar-info">
    <div class="row items-center q-mb-sm">
      <q-icon name="schedule" size="sm" class="q-mr-sm metar-icon" />
      <span>{{ formattedDate }}</span>
    </div>
    <div class="metar-container">
      <q-icon name="travel_explore" size="sm" class="q-mr-sm metar-icon" />
      <div class="metar-raw">
        <template v-for="(chunk, index) in metarChunks" :key="index">
          <span>{{ chunk }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type Metar } from 'src/model/metar'
import { DateFormatter } from 'src/utils/dateFormatter'

const props = defineProps<{
  metar: Metar
}>()

const formattedDate = computed(() => DateFormatter.formatDateTime(props.metar.time.dt))
const metarChunks = computed(() => props.metar.raw.split(' '))
</script>

<style scoped>
.metar-container {
  display: flex;
  align-items: flex-start;
}

.metar-raw {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>
