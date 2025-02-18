<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="header">
      <q-toolbar class="q-px-lg">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="text-white q-mr-md"
        />

        <q-toolbar-title class="row items-center">
          <div class="text-h6 text-weight-bold q-mr-sm">Weather App</div>
          <template v-if="currentUser">
            <q-separator vertical color="white" class="header-separator q-mx-lg" />
            <div class="text-subtitle1 header-item">
              <q-icon name="person" size="xs" class="q-mr-xs icon-fix" />
              {{ currentUser }}
            </div>
            <template v-if="currentLocationName">
              <q-separator vertical color="white" class="header-separator q-mx-lg" />
              <div class="text-subtitle1 header-item">
                <q-icon name="place" size="xs" class="q-mr-xs icon-fix" />
                {{ currentLocationName }}
              </div>
            </template>
          </template>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="drawer">
      <q-list>
        <q-item-label header class="text-weight-bold q-py-md row items-center justify-between">
          <span>Users ({{ users.length }})</span>
          <div class="row items-center">
            <q-btn
              flat
              round
              dense
              icon="add"
              @click="showCreateDialog = true"
              size="sm"
              class="q-mr-sm"
            >
              <q-tooltip>Add new user</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="refresh"
              :loading="usersLoading"
              @click="fetchUsers"
              size="sm"
            >
              <q-tooltip>Refresh users</q-tooltip>
            </q-btn>
          </div>
        </q-item-label>

        <ErrorAlert
          v-if="error"
          :error="error"
          @retry="fetchUsers"
          @dismiss="error = null"
          class="q-mx-sm drawer-alert"
        />

        <q-inner-loading :showing="usersLoading && users.length === 0">
          <div class="column items-center">
            <q-spinner color="primary" size="2em" />
            <div class="text-caption q-mt-sm">Loading users...</div>
          </div>
        </q-inner-loading>

        <div v-if="users.length > 0" class="user-list">
          <UserLink v-for="user in users" :key="user.id" v-bind="user" @deleted="fetchUsers" />
        </div>
        <div v-else-if="!usersLoading && !error" class="q-pa-md text-grey-7">
          <q-item>
            <q-item-section>
              <q-item-label>No users available.</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container class="page-container">
      <router-view />
    </q-page-container>

    <UserCreateDialog v-model="showCreateDialog" @created="fetchUsers" />
  </q-layout>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref, type Ref, computed, provide } from 'vue'
import { type User } from '../model/user'
import { type ApiError } from '../model/apiError'
import UserLink from '../components/UserLink.vue'
import { ApiConfig } from '../config/api'
import { useRoute } from 'vue-router'
import ErrorAlert from '../components/ErrorAlert.vue'
import UserCreateDialog from '../components/UserCreateDialog.vue'

const error = ref<ApiError | null>(null)

const users = ref([]) as Ref<User[]>

const leftDrawerOpen = ref(false)

const route = useRoute()

const currentLocationName = ref<string | null>(null)

// Provide the setter for child components
provide('setCurrentLocationName', (name: string | null) => {
  currentLocationName.value = name
})

const currentUser = computed(() => {
  if (!route.params.user) return null
  const user = users.value.find((u) => u.id === route.params.user)
  return user?.username
})

const usersLoading = ref(false)

const showCreateDialog = ref(false)

onMounted(async () => {
  await fetchUsers()
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

async function fetchUsers() {
  usersLoading.value = true
  users.value = []
  try {
    const { data } = await axios.get(ApiConfig.API_URL + '/user/')
    users.value = data.users
  } catch (err) {
    if (axios.isAxiosError(err)) {
      error.value = {
        message: err.message,
        status: err.response?.status,
        code: err.code
      }
    } else {
      error.value = {
        message: 'An unexpected error occurred'
      }
    }
  } finally {
    usersLoading.value = false
  }
}
</script>

<style scoped>
.header {
  background: linear-gradient(90deg, #42a5f5, #2979ff);
  color: #ffffff;
}

.header .q-toolbar {
  height: 64px;
}

.header .q-separator {
  height: 20px;
  opacity: 0.4;
}

.header-separator {
  height: 16px;
  margin-top: 4px;
  opacity: 0.4;
}

.header-item {
  display: flex;
  align-items: center;
}

.icon-fix {
  margin-top: -1px;
}

.drawer {
  background-color: #ffffff;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  padding: 8px 0;
}

.page-container {
  background-color: #f0f2f5;
}

.user-list :deep(.q-expansion-item__container) {
  margin: 4px;
  border-radius: 12px;
  overflow: hidden;
}

.user-list :deep(.q-item) {
  min-height: 48px;
  padding: 12px 16px;
  transition: background-color 0.2s;
}

.user-list :deep(.q-item:hover) {
  background-color: rgba(66, 165, 245, 0.08);
}

.user-list :deep(.q-item.bg-grey-2) {
  background-color: rgba(66, 165, 245, 0.15) !important;
  font-weight: 500;
}

.drawer-alert :deep(.q-banner) {
  border-radius: 8px;
  margin: 8px;
  background: #fff3e0;
}

.drawer-alert :deep(.q-banner__content) {
  padding: 4px 0;
}

.drawer-alert :deep(.text-subtitle2) {
  font-size: 12px;
  line-height: 1.2;
}

.drawer-alert :deep(.q-btn) {
  padding: 4px;
  min-height: unset;
  font-size: 12px;
}
</style>
