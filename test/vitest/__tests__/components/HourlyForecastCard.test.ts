import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HourlyForecastCard from '../../../../src/components/HourlyForecastCard.vue'
import { DateFormatter } from '../../../../src/utils/dateFormatter'

describe('HourlyForecastCard.vue', () => {
  const defaultProps = {
    forecast: {
      time: '2024-01-24T15:00:00Z',
      temperature: 20,
      feelsLike: 22,
      humidity: 65,
      dewPoint: 15,
      precipitationProbability: 20,
      precipitation: 0,
      cloudCover: 30,
      visibility: 10,
      windSpeed: 10,
      windDirection: 180,
      windGusts: 15
    },
    units: {
      temperature: '°C',
      feelsLike: '°C',
      humidity: '%',
      dewPoint: '°C',
      precipitationProbability: '%',
      precipitation: 'mm',
      cloudCover: '%',
      visibility: 'km',
      windSpeed: 'km/h',
      windDirection: '°',
      windGusts: 'km/h'
    }
  }

  it('renders properly with required props', () => {
    const wrapper = mount(HourlyForecastCard, { props: defaultProps })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.text-h6').text()).toBe(
      DateFormatter.formatHour(defaultProps.forecast.time)
    )
  })

  it('displays all weather metrics correctly', () => {
    const wrapper = mount(HourlyForecastCard, { props: defaultProps })
    const metrics = wrapper.findAll('.hourly-weather .weather-value')
    expect(metrics).toHaveLength(4)
    expect(metrics[0]?.text()).toBe('20°C')
    expect(metrics[1]?.text()).toBe('65%')
    expect(metrics[2]?.text()).toBe('0mm')
    expect(metrics[3]?.text()).toBe('10km/h')
  })

  it('shows correct metric icons', () => {
    const wrapper = mount(HourlyForecastCard, { props: defaultProps })
    const icons = wrapper.findAll('.q-icon')
    const iconNames = icons.map((icon) => icon.text())
    expect(iconNames).toContain('thermostat')
    expect(iconNames).toContain('water_drop')
    expect(iconNames).toContain('grain')
    expect(iconNames).toContain('air')
  })

  it('shows correct metric labels', () => {
    const wrapper = mount(HourlyForecastCard, { props: defaultProps })
    const labels = wrapper.findAll('.weather-label')
    const labelTexts = labels.map((label) => label.text())
    expect(labelTexts).toContain('Temp')
    expect(labelTexts).toContain('Humidity')
    expect(labelTexts).toContain('Precip')
    expect(labelTexts).toContain('Wind')
  })
})
