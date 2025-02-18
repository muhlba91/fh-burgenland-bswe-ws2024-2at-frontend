import { describe, it, expect } from 'vitest'
import { mount, type VueWrapper, type DOMWrapper } from '@vue/test-utils'
import ErrorAlert from '../../../../src/components/ErrorAlert.vue'
import type { ApiError } from '../../../../src/model/apiError'

describe('ErrorAlert.vue', () => {
  const findButtonByLabel = (
    wrapper: VueWrapper,
    label: string
  ): DOMWrapper<HTMLButtonElement> | undefined => {
    return wrapper
      .findAll('button')
      .find((btn: DOMWrapper<HTMLButtonElement>) => btn.text().includes(label))
  }

  const defaultProps = {
    error: {
      message: 'Network error occurred',
      status: 404,
      code: 'NETWORK_ERROR'
    } as ApiError
  }

  it('renders properly with required props', () => {
    const wrapper = mount(ErrorAlert, { props: defaultProps })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.text-subtitle2').text()).toBe('Network error occurred')
    expect(wrapper.find('.text-caption').text()).toBe('Status: 404')
  })

  it('emits retry event when retry button is clicked', async () => {
    const wrapper = mount(ErrorAlert, { props: defaultProps })
    const retryButton = findButtonByLabel(wrapper, 'Retry')
    await retryButton?.trigger('click')
    expect(wrapper.emitted('retry')).toBeTruthy()
  })

  it('emits dismiss event when close button is clicked', async () => {
    const wrapper = mount(ErrorAlert, { props: defaultProps })
    const closeButton = findButtonByLabel(wrapper, 'close')
    await closeButton?.trigger('click')
    expect(wrapper.emitted('dismiss')).toBeTruthy()
  })

  it('does not render status when not provided', () => {
    const wrapper = mount(ErrorAlert, {
      props: { error: { message: 'Simple error', code: 'SIMPLE_ERROR' } as ApiError }
    })
    expect(wrapper.find('.text-caption').exists()).toBe(false)
  })

  it('does not render when error is null', () => {
    const wrapper = mount(ErrorAlert, { props: { error: null } })
    expect(wrapper.find('.q-banner').exists()).toBe(false)
  })
})
