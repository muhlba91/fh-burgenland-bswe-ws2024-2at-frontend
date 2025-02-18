<template>
  <q-page class="column items-center q-pa-md">
    <ErrorAlert
      v-if="error"
      :error="error"
      @retry="refreshData"
      @dismiss="error = null"
      class="full-width"
      style="max-width: 800px"
    />

    <template v-if="!error">
      <div class="row q-col-gutter-md justify-center full-width">
        <div class="col-12" style="max-width: 800px">
          <q-card class="feature-card q-mb-md">
            <q-card-section class="q-px-md q-pb-xs">
              <div class="text-h6 row items-center justify-between">
                <span>{{ location?.givenName || 'Loading Location...' }}</span>
                <q-btn
                  flat
                  round
                  dense
                  icon="refresh"
                  :loading="locationLoading || forecastLoading"
                  @click="refreshData"
                  size="sm"
                >
                  <q-tooltip>Refresh weather data</q-tooltip>
                </q-btn>
              </div>
            </q-card-section>
            <q-card-section>
              <q-inner-loading :showing="locationLoading" class="bg-grey-2">
                <div class="column items-center">
                  <q-spinner color="primary" size="3em" />
                  <div class="text-subtitle1 q-mt-md">Loading location details...</div>
                </div>
              </q-inner-loading>
              <div v-if="location && !locationLoading">
                <LocationDetails :location="location" />
              </div>
            </q-card-section>
          </q-card>

          <MapCard
            v-if="location"
            :location="{
              coordinates: {
                latitude: location.coordinates.latitude,
                longitude: location.coordinates.longitude
              },
              givenName: location.givenName,
              givenLocation: location.givenLocation
            }"
            :airport="{
              icao: location.nearestAirport,
              coordinates: {
                latitude: location.nearestAirportCoordinates.latitude,
                longitude: location.nearestAirportCoordinates.longitude
              }
            }"
          />

          <q-card class="feature-card q-mb-md">
            <q-card-section class="q-px-md q-pb-xs">
              <div class="text-h6">Current Weather</div>
            </q-card-section>
            <q-card-section>
              <q-inner-loading :showing="forecastLoading" class="bg-grey-2">
                <div class="column items-center">
                  <q-spinner color="primary" size="3em" />
                  <div class="text-subtitle1 q-mt-md">Requesting forecast data...</div>
                </div>
              </q-inner-loading>
              <div v-if="forecast && !forecastLoading">
                <div class="current-weather">
                  <div class="weather-row">
                    <WeatherMetric
                      v-for="metric in currentWeatherMetrics1"
                      :key="metric.label"
                      v-bind="metric"
                      class="weather-metric"
                    />
                  </div>
                  <div class="weather-row">
                    <WeatherMetric
                      v-for="metric in currentWeatherMetrics2"
                      :key="metric.label"
                      v-bind="metric"
                      class="weather-metric"
                    />
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card class="feature-card q-mb-md" v-if="location?.nearestAirport">
            <q-card-section class="q-px-md q-py-sm">
              <div class="text-h6">
                METAR {{ location.nearestAirport }}
                <span
                  :class="{
                    'flight-rules': true,
                    vfr: metar?.flight_rules === 'VFR',
                    ifr: metar?.flight_rules === 'IFR',
                    other:
                      metar?.flight_rules &&
                      metar.flight_rules !== 'VFR' &&
                      metar.flight_rules !== 'IFR'
                  }"
                  v-if="metar?.flight_rules"
                  >({{ metar.flight_rules }})</span
                >
              </div>
            </q-card-section>
            <q-card-section>
              <q-inner-loading :showing="metarLoading" class="bg-grey-2">
                <div class="column items-center">
                  <q-spinner color="primary" size="3em" />
                  <div class="text-subtitle1 q-mt-md">Loading METAR data...</div>
                </div>
              </q-inner-loading>
              <div v-if="metar && !metarLoading">
                <MetarCard :metar="metar" />
              </div>
            </q-card-section>
          </q-card>

          <q-card class="feature-card q-mb-md">
            <q-card-section class="q-px-md q-py-sm">
              <div class="text-h6">Hourly Forecast</div>
            </q-card-section>
            <q-card-section>
              <q-inner-loading :showing="forecastLoading" class="bg-grey-2">
                <div class="column items-center">
                  <q-spinner color="primary" size="3em" />
                  <div class="text-subtitle1 q-mt-md">Loading hourly forecast...</div>
                </div>
              </q-inner-loading>
              <div v-if="forecast && !forecastLoading">
                <div class="row q-gutter-md">
                  <div
                    v-for="(hour, index) in Object.values(forecast.hourlyForecast)"
                    :key="index"
                    class="col-12 hourly-item"
                  >
                    <HourlyForecastCard :forecast="hour" :units="forecast.units" />
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </template>
  </q-page>
</template>

<style scoped>
.q-page {
  background-color: #f0f2f5;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.current-weather {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.weather-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}

.weather-metric {
  flex: 1;
  min-width: 120px;
}

.flight-rules {
  font-size: 0.9em;
  margin-left: 8px;
}

.flight-rules.vfr {
  color: #2e7d32; /* dark green */
}

.flight-rules.ifr {
  color: #c62828; /* dark red */
}

.flight-rules.other {
  color: #1565c0; /* dark blue */
}
</style>

<script setup lang="ts">
import axios from 'axios'
import { useRoute } from 'vue-router'
import { onMounted, ref, watch, onUnmounted, inject, computed } from 'vue'
import { type FavoriteLocation } from '../model/favoriteLocation'
import { type Forecast } from '../model/forecast'
import { ApiConfig } from '../config/api'
import { type ApiError } from '../model/apiError'
import WeatherMetric from '../components/WeatherMetric.vue'
import LocationDetails from '../components/LocationDetails.vue'
import HourlyForecastCard from '../components/HourlyForecastCard.vue'
import { WeatherFormatter } from '../utils/weatherFormatter'
import ErrorAlert from '../components/ErrorAlert.vue'
import { ApiService } from '../services/api.service'
import MetarCard from '../components/MetarCard.vue'
import { type Metar } from '../model/metar'
import MapCard from '../components/MapCard.vue'

// Router
const route = useRoute()

// State
const error = ref<ApiError | null>(null)
const location = ref<FavoriteLocation | null>(null)
const forecast = ref<Forecast | null>(null)
const locationLoading = ref(false)
const forecastLoading = ref(false)
const metar = ref<Metar | null>(null)
const metarLoading = ref(false)

const setCurrentLocationName = inject('setCurrentLocationName') as (name: string | null) => void

onMounted(async () => {
  await fetchLocation()
  await fetchForecast()
})

onUnmounted(() => {
  setCurrentLocationName(null)
})

watch(
  () => location.value,
  (newLocation) => {
    setCurrentLocationName(newLocation?.givenName ?? null)
  }
)

// Add route watcher for location changes
watch(
  () => route.params.location,
  async (newLocation, oldLocation) => {
    if (newLocation !== oldLocation) {
      await refreshData()
    }
  }
)

watch(
  () => location.value?.nearestAirport,
  async (newAirport) => {
    if (newAirport) {
      await fetchMetar()
    }
  }
)

async function fetchLocation() {
  location.value = null
  locationLoading.value = true
  error.value = null
  try {
    const { data } = await axios.get(
      ApiConfig.API_URL +
        '/' +
        (route.params.user as string) +
        '/favorite/' +
        (route.params.location as string)
    )
    location.value = data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      error.value = {
        message: err.message,
        status: err.response?.status ?? undefined,
        code: err.code ?? undefined
      }
    } else {
      error.value = {
        message: 'An unexpected error occurred'
      }
    }
    console.error('Failed to load location:', err)
  } finally {
    locationLoading.value = false
  }
}

async function fetchForecast() {
  forecast.value = null
  forecastLoading.value = true
  error.value = null
  try {
    const { data } = await axios.get(
      ApiConfig.API_URL +
        '/' +
        (route.params.user as string) +
        '/' +
        (route.params.location as string) +
        '/forecast/'
    )
    forecast.value = data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      error.value = {
        message: err.message,
        status: err.response?.status ?? undefined,
        code: err.code ?? undefined
      }
    } else {
      error.value = {
        message: 'An unexpected error occurred'
      }
    }
    console.error('Failed to load forecast:', err)
  } finally {
    forecastLoading.value = false
  }
}

async function fetchMetar() {
  if (!location.value?.nearestAirport) return

  metar.value = null
  metarLoading.value = true
  error.value = null
  try {
    metar.value = await ApiService.getMetar(location.value.nearestAirport)
  } catch (err) {
    if (axios.isAxiosError(err)) {
      error.value = {
        message: err.message,
        status: err.response?.status ?? undefined,
        code: err.code ?? undefined
      }
    } else {
      error.value = {
        message: 'An unexpected error occurred'
      }
    }
    console.error('Failed to load METAR:', err)
  } finally {
    metarLoading.value = false
  }
}

async function refreshData() {
  await Promise.all([fetchLocation(), fetchForecast(), fetchMetar()])
}

const currentWeatherMetrics1 = computed(() =>
  forecast.value
    ? [
        {
          icon: 'thermostat',
          label: 'Temp',
          value: forecast.value.currentWeather.temperature,
          unit: WeatherFormatter.getUnit(forecast.value.units, 'temperature')
        },
        {
          icon: 'thermostat_auto',
          label: 'Feels',
          value: forecast.value.currentWeather.feelsLike,
          unit: WeatherFormatter.getUnit(forecast.value.units, 'feelsLike')
        },
        {
          icon: 'water_drop',
          label: 'Humidity',
          value: forecast.value.currentWeather.humidity,
          unit: WeatherFormatter.getUnit(forecast.value.units, 'humidity')
        },
        {
          icon: 'opacity',
          label: 'Dew',
          value: forecast.value.currentWeather.dewPoint,
          unit: WeatherFormatter.getUnit(forecast.value.units, 'dewPoint')
        }
      ]
    : []
)

const currentWeatherMetrics2 = computed(() =>
  forecast.value
    ? [
        {
          icon: 'grain',
          label: 'Precip',
          value: forecast.value.currentWeather.precipitation,
          unit: WeatherFormatter.getUnit(forecast.value.units, 'precipitation')
        },
        {
          icon: 'air',
          label: 'Wind Spd',
          value: forecast.value.currentWeather.windSpeed,
          unit: WeatherFormatter.getUnit(forecast.value.units, 'windSpeed')
        },
        {
          icon: 'explore',
          label: 'Wind Dir',
          value: forecast.value.currentWeather.windDirection,
          unit: WeatherFormatter.getUnit(forecast.value.units, 'windDirection')
        },
        {
          icon: 'flag',
          label: 'Wind Gusts',
          value: forecast.value.currentWeather.windGusts,
          unit: WeatherFormatter.getUnit(forecast.value.units, 'windGusts')
        }
      ]
    : []
)
</script>
