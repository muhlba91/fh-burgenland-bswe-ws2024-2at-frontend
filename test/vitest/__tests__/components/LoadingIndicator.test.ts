import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingIndicator from '../../../../src/components/common/LoadingIndicator.vue'

describe('LoadingIndicator.vue', () => {
  const defaultProps = {
    showing: true,
    message: 'Loading...'
  }

  it('renders properly with required props', () => {
    const wrapper = mount(LoadingIndicator, { props: defaultProps })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Loading...')
  })

  it('shows spinner with default color and size', () => {
    const wrapper = mount(LoadingIndicator, { props: defaultProps })
    const spinner = wrapper.find('.q-spinner')
    expect(spinner.exists()).toBe(true)
    expect(spinner.classes()).toContain('text-primary')
  })

  it('applies custom color and size when provided', () => {
    const wrapper = mount(LoadingIndicator, {
      props: {
        ...defaultProps,
        color: 'secondary',
        size: '3em'
      }
    })
    const spinner = wrapper.find('.q-spinner')
    expect(spinner.classes()).toContain('text-secondary')
    expect(spinner.attributes('width')).toBe('3em')
    expect(spinner.attributes('height')).toBe('3em')
  })

  it('applies custom text size when provided', () => {
    const wrapper = mount(LoadingIndicator, {
      props: {
        ...defaultProps,
        textSize: 'subtitle1'
      }
    })
    expect(wrapper.find('.text-subtitle1').exists()).toBe(true)
    expect(wrapper.find('.text-subtitle1').text()).toBe('Loading...')
  })

  it('is not visible when showing is false', () => {
    const wrapper = mount(LoadingIndicator, {
      props: {
        ...defaultProps,
        showing: false
      }
    })
    const loading = wrapper.find('.q-inner-loading')
    expect(loading.exists()).toBe(false)
  })
})
