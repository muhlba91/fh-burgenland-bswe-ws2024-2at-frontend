<template>
  <q-dialog v-model="show" @hide="resetDialog" cy-data="create-user-dialog">
    <q-card class="create-user-dialog">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Create New User</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup class="close-button" />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-input
          ref="inputRef"
          v-model="username"
          label="Username"
          :rules="[(val) => !!val || 'Username is required']"
          @keyup.enter="submit"
          class="username-input"
          outlined
          dense
        >
          <template v-slot:prepend>
            <q-icon name="person" color="primary" />
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
          :disable="!username"
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
import { type ApiError } from '../model/apiError'
import ErrorAlert from './ErrorAlert.vue'
import { QInput } from 'quasar'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'created'): void
}>()

const username = ref('')
const loading = ref(false)
const error = ref<ApiError | null>(null)

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const inputRef = ref<InstanceType<typeof QInput> | null>(null)

function resetDialog() {
  username.value = ''
  error.value = null
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      resetDialog()
      // Try to focus after state is reset
      setTimeout(() => {
        inputRef.value?.focus()
      }, 100)
    }
  }
)

async function submit() {
  if (!username.value) return

  loading.value = true
  error.value = null

  try {
    await axios.post(ApiConfig.API_URL + '/user/', {
      username: username.value
    })
    show.value = false
    emit('created')
    username.value = ''
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
</script>

<style scoped>
.create-user-dialog {
  border-radius: 12px;
  max-width: 400px;
  width: 90vw;
  margin: 20px;
}

.close-button {
  margin-right: -8px;
}

.username-input :deep(.q-field__control) {
  border-radius: 8px;
}

.dialog-button {
  border-radius: 8px;
  min-width: 100px;
}

:deep(.q-dialog__backdrop) {
  backdrop-filter: blur(3px);
  background: rgba(0, 0, 0, 0.4);
}
</style>
