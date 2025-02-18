import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorNotFound from '../../../../src/pages/ErrorNotFound.vue'
import { QBtn } from 'quasar'

describe('ErrorNotFound.vue', () => {
  const createWrapper = () => mount(ErrorNotFound)

  it('displays error messages', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('404')
    expect(wrapper.text()).toContain('Oops. Nothing here...')
  })

  it('renders home button with correct properties', () => {
    const wrapper = createWrapper()
    const button = wrapper.findComponent(QBtn)
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Go Home')
    expect(button.props('to')).toBe('/')
  })

  it('has correct layout classes', () => {
    const wrapper = createWrapper()
    const container = wrapper.find('div.fullscreen')
    expect(container.classes()).toContain('fullscreen')
    expect(container.classes()).toContain('bg-blue')
    expect(container.classes()).toContain('text-white')
    expect(container.classes()).toContain('text-center')
    expect(container.classes()).toContain('flex')
    expect(container.classes()).toContain('flex-center')
  })
})
