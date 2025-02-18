<template>
  <q-card class="feature-card q-mb-md">
    <q-expansion-item
      expand-separator
      header-class="text-h6 q-px-md q-py-sm"
      label="Map"
      :default-opened="false"
      class="map-expansion"
      @after-show="onExpand"
    >
      <q-card-section class="map-section">
        <div id="map" ref="mapContainer" class="map-container"></div>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, watch, onBeforeUnmount, ref } from 'vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const props = defineProps<{
  location: {
    coordinates: {
      latitude: number
      longitude: number
    }
    givenName: string
    givenLocation: string
  }
  airport: {
    icao: string
    coordinates: {
      latitude: number
      longitude: number
    }
  }
}>()

let map: L.Map | null = null
let locationMarker: L.Marker | null = null
let airportMarker: L.Marker | null = null
const mapContainer = ref<HTMLElement | null>(null)

// Custom marker icons
const locationIcon = L.divIcon({
  html: '<i class="material-icons" style="color: #1976d2; font-size: 36px;">place</i>',
  className: 'custom-div-icon',
  iconSize: [36, 36],
  iconAnchor: [18, 36]
})

const airportIcon = L.divIcon({
  html: '<i class="material-icons" style="color: #1976d2; font-size: 36px;">local_airport</i>',
  className: 'custom-div-icon',
  iconSize: [36, 36],
  iconAnchor: [18, 18]
})

function initMap() {
  if (map) return

  map = L.map('map', {
    center: [props.location.coordinates.latitude, props.location.coordinates.longitude],
    zoom: 10
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  updateMarkers()
}

function updateMarkers() {
  if (!map) return

  // Update location marker with styled popup
  if (locationMarker) map.removeLayer(locationMarker)
  locationMarker = L.marker(
    [props.location.coordinates.latitude, props.location.coordinates.longitude],
    { icon: locationIcon }
  )
    .addTo(map)
    .bindPopup(
      `<div class="map-popup">
        <div class="popup-title">${props.location.givenName}</div>
        <div class="popup-subtitle">${props.location.givenLocation}</div>
      </div>`,
      {
        className: 'custom-popup'
      }
    )

  // Update airport marker (always present)
  if (airportMarker) map.removeLayer(airportMarker)
  airportMarker = L.marker(
    [props.airport.coordinates.latitude, props.airport.coordinates.longitude],
    { icon: airportIcon }
  )
    .addTo(map)
    .bindPopup(
      `<div class="map-popup">
        <div class="popup-title">${props.airport.icao}</div>
        <div class="popup-subtitle">Nearest Airport</div>
      </div>`,
      {
        className: 'custom-popup'
      }
    )

  // Fit bounds to include both markers
  const bounds = L.latLngBounds(
    [props.location.coordinates.latitude, props.location.coordinates.longitude],
    [props.airport.coordinates.latitude, props.airport.coordinates.longitude]
  )
  map.fitBounds(bounds.pad(0.1))
}

function onExpand() {
  // Give the DOM time to update before invalidating the map size
  setTimeout(() => {
    if (map) {
      map.invalidateSize()
      updateMarkers() // Re-center the map after resize
    }
  }, 100)
}

// Update watchers
watch(
  () => props.location,
  () => {
    if (map) updateMarkers()
  },
  { deep: true }
)

onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.map-section {
  padding: 0;
  height: 400px;
  width: 100%;
  position: relative;
}

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
}

.map-expansion :deep(.q-expansion-item__content) {
  background-color: #f8f9fa;
  padding: 0;
}

.map-expansion :deep(.q-item__section--main) {
  padding: 0;
}
</style>
