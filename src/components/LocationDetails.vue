<template>
  <div class="text-caption text-grey-7">
    <div class="row q-gutter-x-md items-center">
      <q-icon name="location_on" size="xs" class="q-mr-sm weather-icon" />
      {{ location.givenLocation }}
    </div>
    <div class="row q-gutter-x-md items-center q-mt-xs">
      <q-icon name="explore" size="xs" class="q-mr-sm weather-icon" />
      {{
        CoordinatesFormatter.format(location.coordinates.latitude, location.coordinates.longitude)
      }}
    </div>
    <div class="row q-gutter-x-md items-center q-mt-xs">
      <q-icon name="height" size="xs" class="q-mr-sm weather-icon" />
      {{ location.coordinates.elevation }}m
    </div>
    <div class="row q-gutter-x-md items-center q-mt-xs">
      <q-icon name="flight" size="xs" class="q-mr-sm weather-icon" />
      {{ location.nearestAirport }} ({{
        CoordinatesFormatter.format(
          location.nearestAirportCoordinates.latitude,
          location.nearestAirportCoordinates.longitude
        )
      }})
    </div>
  </div>
</template>

<script setup lang="ts">
import { type FavoriteLocation } from 'src/model/favoriteLocation'
import { CoordinatesFormatter } from '../utils/coordinatesFormatter'

defineProps<{ location: FavoriteLocation }>()
</script>

<style scoped></style>
