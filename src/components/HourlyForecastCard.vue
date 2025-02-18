<template>
  <q-card class="hourly-card">
    <q-card-section class="q-pa-sm">
      <div class="row items-center">
        <div class="col-12 col-sm-2 text-weight-bold text-h6 q-mb-xs-sm">
          {{ DateFormatter.formatHour(forecast.time) }}
        </div>
        <div class="col-12 col-sm-10 hourly-weather">
          <div class="row q-col-gutter-sm">
            <div v-for="metric in metrics" :key="metric.label" class="col-6 col-sm-3">
              <div class="weather-metric">
                <q-icon :name="metric.icon" size="sm" />
                <span class="weather-label">{{ metric.label }}</span>
                <span class="weather-value">{{ metric.value }}{{ metric.unit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DateFormatter } from '../utils/dateFormatter'
import { WeatherFormatter } from '../utils/weatherFormatter'
import { type HourlyForecast, type Units } from '../model/forecast'

const props = defineProps<{
  forecast: HourlyForecast
  units: Units
}>()

const metrics = computed(() => [
  {
    icon: 'thermostat',
    label: 'Temp',
    value: props.forecast.temperature,
    unit: WeatherFormatter.getUnit(props.units, 'temperature')
  },
  {
    icon: 'water_drop',
    label: 'Humidity',
    value: props.forecast.humidity,
    unit: WeatherFormatter.getUnit(props.units, 'humidity')
  },
  {
    icon: 'grain',
    label: 'Precip',
    value: props.forecast.precipitation,
    unit: WeatherFormatter.getUnit(props.units, 'precipitation')
  },
  {
    icon: 'air',
    label: 'Wind',
    value: props.forecast.windSpeed,
    unit: WeatherFormatter.getUnit(props.units, 'windSpeed')
  }
])
</script>

<style scoped>
.hourly-weather {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.weather-metric {
  display: flex;
  align-items: center;
  gap: 8px;
}

.weather-info {
  display: flex;
  flex-direction: column;
}

.weather-label {
  font-size: 14px;
  color: #607d8b;
}

.weather-value {
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
}
</style>
