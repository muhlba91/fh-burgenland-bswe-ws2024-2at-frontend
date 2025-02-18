<template>
  <q-page class="column items-center q-pa-md">
    <q-card class="hero-card q-mb-lg">
      <q-card-section class="q-px-md q-py-sm text-center">
        <q-icon name="wb_sunny" size="4rem" color="amber-8" class="q-mb-md" />
        <div class="text-h4 text-weight-bold q-mb-sm">Welcome to Weather App</div>
        <p class="text-body1 text-grey-4">
          Track weather conditions, forecasts, and METAR information for your favorite locations
        </p>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-md full-width justify-center">
      <div class="col-12 col-md-6">
        <q-card class="feature-card">
          <q-card-section>
            <div class="row items-center q-mb-md">
              <q-icon name="group" size="2rem" color="primary" class="q-mr-md" />
              <div class="text-h6">Managing Users</div>
            </div>
            <q-list dense class="feature-list">
              <q-item>
                <q-item-section avatar>
                  <q-icon name="menu" color="grey-7" />
                </q-item-section>
                <q-item-section>Open sidebar with the menu button</q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="add" color="positive" />
                </q-item-section>
                <q-item-section>Create new users</q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="delete" color="negative" />
                </q-item-section>
                <q-item-section>Remove existing users</q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="refresh" color="info" />
                </q-item-section>
                <q-item-section>Refresh user list</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card class="feature-card">
          <q-card-section class="q-px-md q-py-sm">
            <div class="row items-center q-mb-md">
              <q-icon name="place" size="2rem" color="deep-orange" class="q-mr-md" />
              <div class="text-h6">Managing Locations</div>
            </div>
            <q-list dense class="feature-list">
              <q-item>
                <q-item-section avatar>
                  <q-icon name="person" color="primary" />
                </q-item-section>
                <q-item-section>Select a user to view their locations</q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="add_location" color="positive" />
                </q-item-section>
                <q-item-section>Add new locations</q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="location_off" color="negative" />
                </q-item-section>
                <q-item-section>Remove saved locations</q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="refresh" color="info" />
                </q-item-section>
                <q-item-section>Refresh location list</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12">
        <q-card class="weather-info-card">
          <q-card-section class="q-px-md q-py-sm">
            <div class="row items-center q-mb-lg">
              <q-icon name="cloud" size="2rem" color="info" class="q-mr-md" />
              <div class="text-h6">Weather Information</div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6 col-md-3">
                <div class="weather-feature text-center">
                  <q-icon name="thermostat" size="2rem" color="deep-orange" />
                  <div class="text-subtitle1 q-mt-sm">Current Conditions</div>
                  <div class="text-caption text-grey-7">Temperature, humidity, and more</div>
                </div>
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <div class="weather-feature text-center">
                  <q-icon name="schedule" size="2rem" color="purple" />
                  <div class="text-subtitle1 q-mt-sm">Hourly Forecast</div>
                  <div class="text-caption text-grey-7">24-hour detailed prediction</div>
                </div>
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <div class="weather-feature text-center">
                  <q-icon name="flight" size="2rem" color="primary" />
                  <div class="text-subtitle1 q-mt-sm">METAR Data</div>
                  <div class="text-caption text-grey-7">Nearest airport conditions</div>
                </div>
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <div class="weather-feature text-center">
                  <q-icon name="refresh" size="2rem" color="teal" />
                  <div class="text-subtitle1 q-mt-sm">Live Updates</div>
                  <div class="text-caption text-grey-7">Real-time weather data</div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.feature-list {
  padding-left: 8px;
}

.text-caption {
  line-height: 1.4;
}
</style>

<script setup lang="ts" />
