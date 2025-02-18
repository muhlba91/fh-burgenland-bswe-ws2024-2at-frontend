<template>
  <div class="user-item">
    <q-expansion-item
      v-model="isOpen"
      :class="$route.params.user === id ? 'bg-grey-2' : ''"
      class="user-link"
    >
      <template v-slot:header>
        <q-item-section avatar>
          <q-icon name="person" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ username }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            flat
            round
            dense
            icon="delete"
            color="grey-7"
            size="sm"
            @click.stop="confirmDeleteUser"
            :loading="deleting"
          >
            <q-tooltip>Delete user</q-tooltip>
          </q-btn>
        </q-item-section>
      </template>

      <q-list padding class="locations-list">
        <div class="locations-header">
          <div class="text-subtitle2">Favorite Locations</div>
          <div class="row items-center">
            <q-btn
              flat
              round
              dense
              icon="add"
              @click.stop="showCreateDialog = true"
              size="sm"
              class="q-mr-sm"
            >
              <q-tooltip>Add new location</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="refresh"
              :loading="loading"
              @click.stop="refreshLocations"
              size="sm"
            >
              <q-tooltip>Refresh locations</q-tooltip>
            </q-btn>
          </div>
        </div>

        <div v-if="error" class="text-negative text-center q-pa-md">
          <q-icon name="error" size="sm" class="q-mr-xs" />
          {{ error.message }}
        </div>

        <q-inner-loading :showing="loading && !locations.length">
          <q-spinner color="primary" size="2em" />
          <div class="text-caption q-mt-sm">Loading favorite locations...</div>
        </q-inner-loading>

        <template v-if="!loading || locations.length > 0">
          <template v-if="locations.length > 0">
            <q-item
              v-for="location in locations"
              :key="location.id"
              :to="
                $route.params.location === location.id
                  ? undefined
                  : `/forecast/${id}/${location.id}`
              "
              clickable
              v-ripple
              :active="$route.params.location === location.id"
            >
              <q-item-section avatar>
                <q-icon name="place" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ location.givenName }}</q-item-label>
                <q-item-label caption lines="2">
                  <div class="location-details">
                    <span>{{ location.givenLocation }}</span>
                    <span class="coordinates">
                      <q-icon name="explore" size="12px" class="q-mr-xs" />
                      {{
                        formatCoordinates(
                          location.coordinates.latitude,
                          location.coordinates.longitude
                        )
                      }}
                    </span>
                  </div>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="grey-7"
                  size="sm"
                  @click.stop="confirmDeleteLocation(location)"
                  :loading="deletingLocation === location.id"
                >
                  <q-tooltip>Delete location</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
          </template>
          <div v-else class="text-grey-7 text-center q-pa-md">
            <q-icon name="info" size="sm" class="q-mr-xs" />
            No favorite locations found
          </div>
        </template>
      </q-list>
    </q-expansion-item>

    <LocationCreateDialog v-model="showCreateDialog" :user-id="id" @created="refreshLocations" />

    <ConfirmDialog
      v-model="showDeleteConfirm"
      title="Delete Location"
      :message="`Are you sure you want to delete <strong class='text-negative'>${locationToDelete?.givenName}</strong>?`"
      confirm-label="Delete"
      @confirm="confirmDelete"
      :html="true"
    />

    <ConfirmDialog
      v-model="showDeleteUserConfirm"
      title="Delete User"
      :message="`Are you sure you want to delete user <strong class='text-negative'>${username}</strong>? This will delete all their favorite locations.`"
      confirm-label="Delete"
      @confirm="deleteUser"
      :html="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import ConfirmDialog from './ConfirmDialog.vue'
import { ErrorHandler } from '../utils/errorHandler'
import { ApiConfig } from '../config/api'
import { type ApiError } from '../model/apiError'
import { type FavoriteLocation } from '../model/favoriteLocation'
import { type User } from 'src/model/user'
import LocationCreateDialog from './LocationCreateDialog.vue'

const props = withDefaults(defineProps<User>(), {})
const route = useRoute()
const router = useRouter()

const emit = defineEmits<{
  (e: 'deleted'): void
}>()

const loading = ref(false)
const error = ref<ApiError | null>(null)
const locations = ref<FavoriteLocation[]>([])
const showCreateDialog = ref(false)
const deletingLocation = ref<string | null>(null)
const showDeleteConfirm = ref(false)
const locationToDelete = ref<FavoriteLocation | null>(null)
const isOpen = ref(false)
const showDeleteUserConfirm = ref(false)
const deleting = ref(false)

// Initialize isOpen after route is available
onMounted(async () => {
  if (route?.params?.user === props.id) {
    isOpen.value = true
    await loadLocations()
  }
})

watch(
  () => route?.params?.user,
  async (newUserId) => {
    if (newUserId === props.id) {
      await loadLocations()
    }
  }
)

watch(isOpen, async (newValue) => {
  if (newValue) {
    await loadLocations()
  }
})

onMounted(async () => {
  if (route.params.user === props.id) {
    isOpen.value = true
    await loadLocations()
  }
})

async function loadLocations() {
  loading.value = true
  error.value = null

  try {
    const { data } = await axios.get(ApiConfig.API_URL + '/' + props.id + '/favorite/')
    locations.value = data.locations
  } catch (err) {
    setError(err, 'Failed to load locations')
  } finally {
    loading.value = false
  }
}

async function refreshLocations() {
  locations.value = []
  await loadLocations()
}

function confirmDeleteLocation(location: FavoriteLocation) {
  locationToDelete.value = location
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  if (!locationToDelete.value) return
  await deleteLocation(locationToDelete.value)
  locationToDelete.value = null
}

async function deleteLocation(location: FavoriteLocation) {
  deletingLocation.value = location.id
  error.value = null
  try {
    await axios.delete(`${ApiConfig.API_URL}/${props.id}/favorite/${location.id}`)

    if (route.params.location === location.id) {
      const remainingLocations = locations.value.filter((l) => l.id !== location.id)
      if (remainingLocations.length > 0 && remainingLocations[0]) {
        await router.push(`/forecast/${props.id}/${remainingLocations[0].id}`)
      } else {
        await router.push('/')
        isOpen.value = true
      }
    }
    await refreshLocations()
  } catch (err) {
    setError(err, `Failed to delete location "${location.givenName}"`)
  } finally {
    deletingLocation.value = null
  }
}

function confirmDeleteUser() {
  showDeleteUserConfirm.value = true
}

async function deleteUser() {
  deleting.value = true
  error.value = null
  try {
    await axios.delete(`${ApiConfig.API_URL}/user/${props.id}`)
    if (route.params.user === props.id) {
      await router.push('/')
    }
    emit('deleted')
  } catch (err) {
    setError(err, `Failed to delete user "${props.username}"`)
  } finally {
    deleting.value = false
  }
}

function setError(err: unknown, defaultMessage: string) {
  error.value = ErrorHandler.createError(err, defaultMessage)
  console.error(defaultMessage, err)
}

function formatCoordinates(latitude: number, longitude: number): string {
  const latDirection = latitude >= 0 ? 'N' : 'S'
  const lonDirection = longitude >= 0 ? 'E' : 'W'
  return `${Math.abs(latitude)}°${latDirection}, ${Math.abs(longitude)}°${lonDirection}`
}
</script>

<style scoped>
.user-item {
  margin: 4px 8px;
}

.user-link {
  border-radius: 12px;
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  background: white;
}

.user-link:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.locations-list {
  background: #f8f9fa;
  margin-left: 16px;
  border-left: 2px solid rgba(66, 165, 245, 0.2);
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.locations-list :deep(.q-item) {
  border-radius: 8px;
  margin: 4px 8px;
  transition: background-color 0.2s;
}

.locations-list :deep(.q-item__section--avatar) {
  min-width: 0;
}

.locations-list :deep(.q-item.q-router-link--active) {
  background: rgba(66, 165, 245, 0.15);
  font-weight: 500;
}

.locations-list :deep(.q-item:hover) {
  background: rgba(66, 165, 245, 0.08);
}

.location-details {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: #607d8b;
  align-items: center;
}

.location-details span {
  display: inline-flex;
  align-items: center;
}

.coordinates {
  font-family: monospace;
}

.locations-list :deep(.q-item) {
  padding: 8px 12px;
  min-height: 64px;
}

.locations-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
