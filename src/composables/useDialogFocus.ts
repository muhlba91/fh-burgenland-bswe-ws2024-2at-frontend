import { ref, watch, type Ref, unref, isRef } from 'vue'
import { type QInput } from 'quasar'

/**
 * Vue composable that handles automatic focus of input elements within dialogs.
 * When a dialog opens, it attempts to focus the referenced input element multiple
 * times with increasing delays to ensure reliable focus behavior.
 *
 * @param modelValue - A boolean value or ref that represents the dialog's open state.
 *                    Usually this would be bound to the v-model of a dialog component.
 *
 * @returns An object containing:
 *          - inputRef: A template ref that should be bound to the input element
 *                     that needs to receive focus.
 *
 * @example
 * ```vue
 * <template>
 *   <q-dialog v-model="isOpen">
 *     <q-input ref="inputRef" v-model="value" />
 *   </q-dialog>
 * </template>
 *
 * <script setup lang="ts">
 * const isOpen = ref(false)
 * const { inputRef } = useDialogFocus(isOpen)
 * </script>
 * ```
 */
export function useDialogFocus(modelValue: boolean | Ref<boolean>) {
  const inputRef = ref<InstanceType<typeof QInput> | null>(null)

  function focusInput() {
    // Try multiple times with increasing delays
    let currentDelay = 0
    const delays = [50, 100, 200]

    delays.forEach((delay) => {
      currentDelay += delay
      setTimeout(() => {
        if (inputRef.value) {
          inputRef.value.focus()
        }
      }, currentDelay)
    })
  }

  if (unref(modelValue)) {
    focusInput()
  }

  // Only set up watch if modelValue is a ref
  if (isRef(modelValue)) {
    watch(modelValue, (newValue) => {
      if (newValue) {
        focusInput()
      }
    })
  }

  return {
    inputRef
  }
}
