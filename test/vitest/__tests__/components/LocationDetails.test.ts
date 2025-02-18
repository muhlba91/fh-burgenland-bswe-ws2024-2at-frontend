import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LocationDetails from '../../../../src/components/LocationDetails.vue'
import { CoordinatesFormatter } from '../../../../src/utils/coordinatesFormatter'

describe('LocationDetails.vue', () => {
  const defaultProps = {
    location: {
      id: '1',
      givenName: 'Home',
      givenLocation: 'Vienna, Austria',
      coordinates: {
        latitude: 48.2082,
        longitude: 16.3738,
        elevation: 151
      },
      nearestAirport: 'LOWW',
      nearestAirportCoordinates: {
        latitude: 48.1102,
        longitude: 16.5697,
        elevation: 183
      }
    }
  }

  it('renders properly with required props', () => {
    const wrapper = mount(LocationDetails, { props: defaultProps })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays location details correctly', () => {
    const wrapper = mount(LocationDetails, { props: defaultProps })
    expect(wrapper.text()).toContain('Vienna, Austria')
    expect(wrapper.text()).toContain('151m')
    expect(wrapper.text()).toContain('LOWW')

    const formattedCoords = CoordinatesFormatter.format(
      defaultProps.location.coordinates.latitude,
      defaultProps.location.coordinates.longitude
    )
    expect(wrapper.text()).toContain(formattedCoords)
  })

  it('displays nearest airport coordinates', () => {
    const wrapper = mount(LocationDetails, { props: defaultProps })
    const airportCoords = CoordinatesFormatter.format(
      defaultProps.location.nearestAirportCoordinates.latitude,
      defaultProps.location.nearestAirportCoordinates.longitude
    )
    expect(wrapper.text()).toContain(airportCoords)
  })

  it('shows all required icons', () => {
    const wrapper = mount(LocationDetails, { props: defaultProps })
    const icons = wrapper.findAll('.q-icon')
    const iconNames = icons.map((icon) => icon.text())

    expect(iconNames).toContain('location_on')
    expect(iconNames).toContain('explore')
    expect(iconNames).toContain('height')
    expect(iconNames).toContain('flight')
  })
})
