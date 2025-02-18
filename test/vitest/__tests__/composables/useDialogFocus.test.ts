import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDialogFocus } from '../../../../src/composables/useDialogFocus'
import type { QInput } from 'quasar'

describe('useDialogFocus', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should return an inputRef', () => {
    const { inputRef } = useDialogFocus(false)
    expect(inputRef).toBeDefined()
    expect(inputRef.value).toBeNull()
  })

  it('should attempt to focus input on mount if modelValue is true', () => {
    const mockFocus = vi.fn()
    const { inputRef } = useDialogFocus(true)
    inputRef.value = { focus: mockFocus } as unknown as InstanceType<typeof QInput>

    // Advance timers to hit each timeout (at 50ms, 150ms, and 350ms)
    vi.advanceTimersByTime(50) // First timeout
    vi.advanceTimersByTime(100) // Second timeout (total 150ms)
    vi.advanceTimersByTime(200) // Third timeout (total 350ms)

    expect(mockFocus).toHaveBeenCalledTimes(3)
  })

  it('should not focus input when modelValue is false', () => {
    const mockFocus = vi.fn()
    const { inputRef } = useDialogFocus(false)
    inputRef.value = { focus: mockFocus } as unknown as InstanceType<typeof QInput>

    vi.runAllTimers()

    expect(mockFocus).not.toHaveBeenCalled()
  })
})
