import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MetarCard from '../../../../src/components/MetarCard.vue'

describe('MetarCard.vue', () => {
  const defaultProps = {
    metar: {
      time: { dt: '2024-01-24T14:30:00Z' },
      raw: 'LOWW 241530Z 12008KT CAVOK 22/12 Q1020',
      station: 'LOWW',
      flight_rules: 'VFR',
      altimeter: { value: 1020 },
      temperature: { value: 22 },
      dewpoint: { value: 12 },
      visibility: { value: 9999 },
      wind_direction: { value: 120 },
      wind_gust: { value: 0 },
      wind_speed: { value: 8 },
      clouds: [{ type: 'CAVOK', altitude: 0 }],
      density_altitude: 1500,
      units: {
        altimeter: 'hPa',
        altitude: 'ft',
        temperature: '°C',
        visibility: 'm',
        wind_speed: 'kt'
      }
    }
  }

  it('renders properly with required props', () => {
    const wrapper = mount(MetarCard, { props: defaultProps })
    expect(wrapper.exists()).toBe(true)
  })

  it('formats the date correctly', () => {
    const wrapper = mount(MetarCard, { props: defaultProps })
    expect(wrapper.find('.metar-info').text()).toContain('24/01/2024, 14:30')
  })

  it('displays raw METAR data split into chunks', () => {
    const wrapper = mount(MetarCard, { props: defaultProps })
    const chunks = wrapper.findAll('.metar-raw span')
    const rawParts = defaultProps.metar.raw.split(' ')
    expect(chunks).toHaveLength(rawParts.length)
    chunks.forEach((chunk, index) => {
      expect(chunk.text()).toBe(rawParts[index])
    })
  })
})
