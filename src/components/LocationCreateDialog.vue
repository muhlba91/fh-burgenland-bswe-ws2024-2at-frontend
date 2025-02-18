<template>
  <q-dialog v-model="show" @hide="resetDialog" cy-data="create-location-dialog">
    <q-card class="create-location-dialog">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Add New Location</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup class="close-button" />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-input
          ref="inputRef"
          v-model="name"
          label="Location Name"
          :rules="[(val) => !!val || 'Name is required']"
          class="location-input q-mb-sm"
          outlined
          dense
        >
          <template v-slot:prepend>
            <q-icon name="bookmark" color="primary" />
          </template>
        </q-input>

        <q-input
          v-model="location"
          label="Location (City, Country)"
          :rules="[(val) => !!val || 'Location is required']"
          class="location-input"
          outlined
          dense
          @keyup.enter="submit"
        >
          <template v-slot:prepend>
            <q-icon name="place" color="primary" />
          </template>
        </q-input>

        <ErrorAlert
          v-if="error"
          :error="error"
          @retry="submit"
          @dismiss="error = null"
          class="q-mt-md"
        />
      </q-card-section>

      <q-card-actions align="right" class="q-pb-md q-px-md">
        <q-btn flat label="Cancel" color="grey-7" v-close-popup class="q-mr-sm dialog-button" />
        <q-btn
          unelevated
          label="Create"
          color="primary"
          :loading="loading"
          @click="submit"
          :disable="!isValid"
          class="dialog-button"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import { ApiConfig } from '../config/api'
import { type ApiError } from 'src/model/apiError'
import ErrorAlert from './ErrorAlert.vue'
import { QInput } from 'quasar'

const props = defineProps<{
  modelValue: boolean
  userId: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'created'): void
}>()

const name = ref('')
const location = ref('')
const loading = ref(false)
const error = ref<ApiError | null>(null)

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isValid = computed(() => name.value && location.value)
const inputRef = ref<InstanceType<typeof QInput> | null>(null)

function resetDialog() {
  name.value = ''
  location.value = ''
  error.value = null
}

async function submit() {
  if (!isValid.value) return
  loading.value = true
  error.value = null

  try {
    await axios.post(ApiConfig.API_URL + '/' + props.userId + '/favorite/', {
      name: name.value,
      location: location.value
    })
    show.value = false
    emit('created')
    resetDialog()
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
  } finally {
    loading.value = false
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      resetDialog()
      setTimeout(() => inputRef.value?.focus(), 100)
    }
  }
)
</script>

<style scoped>
.create-location-dialog {
  border-radius: 12px;
  max-width: 400px;
  width: 90vw;
  margin: 20px;
}

.close-button {
  margin-right: -8px;
}

.location-input :deep(.q-field__control) {
  border-radius: 8px;
}

.dialog-button {
  border-radius: 8px;
  min-width: 100px;
}

:deep(.q_dialog__backdrop) {
  backdrop-filter: blur(3px);
  background: rgba(0, 0, 0, 0.4);
}
</style>
