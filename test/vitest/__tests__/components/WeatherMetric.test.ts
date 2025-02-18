import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WeatherMetric from '../../../../src/components/WeatherMetric.vue'

describe('WeatherMetric.vue', () => {
  const defaultProps = {
    icon: 'thermostat',
    label: 'Temperature',
    value: 25
  }

  it('renders properly with required props', () => {
    const wrapper = mount(WeatherMetric, { props: defaultProps })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the correct icon', () => {
    const wrapper = mount(WeatherMetric, { props: defaultProps })
    const icon = wrapper.findComponent({ name: 'q-icon' })
    expect(icon.exists()).toBe(true)
    expect(icon.props('name')).toBe('thermostat')
  })

  it('shows label and value correctly', () => {
    const wrapper = mount(WeatherMetric, { props: defaultProps })
    expect(wrapper.find('.label-text').text()).toBe('Temperature')
    expect(wrapper.find('.value-text').text()).toBe('25')
  })

  it('applies custom unit when provided', () => {
    const wrapper = mount(WeatherMetric, { props: { ...defaultProps, unit: '°C' } })
    expect(wrapper.find('.value-text').text()).toBe('25°C')
  })

  it('uses empty string as default unit', () => {
    const wrapper = mount(WeatherMetric, { props: defaultProps })
    expect(wrapper.find('.value-text').text()).toBe('25')
  })

  it('handles string values correctly', () => {
    const wrapper = mount(WeatherMetric, { props: { ...defaultProps, value: 'High' } })
    expect(wrapper.find('.value-text').text()).toBe('High')
  })

  it('applies custom size when provided', () => {
    const wrapper = mount(WeatherMetric, { props: { ...defaultProps, size: 'lg' } })
    const icon = wrapper.find('.q-icon')
    expect(icon.classes()).toContain('q-icon')
    expect(icon.attributes('style')).toContain('font-size: 38px')
  })

  it('uses md as default size', () => {
    const wrapper = mount(WeatherMetric, { props: defaultProps })
    const icon = wrapper.find('.q-icon')
    expect(icon.classes()).toContain('q-icon')
    expect(icon.attributes('style')).toContain('font-size: 32px')
  })
})
