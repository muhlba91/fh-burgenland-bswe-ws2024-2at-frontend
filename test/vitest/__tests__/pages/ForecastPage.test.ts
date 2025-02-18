/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { Quasar } from 'quasar'
import { useRoute } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import axios from 'axios'
import ForecastPage from '../../../../src/pages/ForecastPage.vue'

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn()
}))

vi.mock('axios')

describe('ForecastPage.vue', () => {
  const setCurrentLocationName = vi.fn()

  const mountOptions = {
    global: {
      plugins: [Quasar],
      stubs: {
        ErrorAlert: true,
        LocationDetails: true,
        MapCard: true,
        MetarCard: true,
        HourlyForecastCard: true
      },
      provide: {
        setCurrentLocationName
      }
    }
  }

  const mockLocation = {
    id: 'loc1',
    givenName: 'Home',
    givenLocation: 'Vienna',
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

  const mockForecast = {
    coordinates: { longitude: 16.3738, latitude: 48.2082, elevation: 151 },
    requestTime: '2024-01-01T12:00:00Z',
    units: {
      temperature: '°C',
      feelsLike: '°C',
      humidity: '%',
      dewPoint: '°C',
      precipitation: 'mm',
      windSpeed: 'km/h',
      windDirection: '°',
      windGusts: 'km/h'
    },
    currentWeather: {
      temperature: 20,
      feelsLike: 22,
      humidity: 65,
      dewPoint: 15,
      precipitation: 0,
      windSpeed: 10,
      windDirection: 180,
      windGusts: 15
    },
    hourlyForecast: {
      '2024-01-01T12:00:00Z': {
        temperature: 20,
        feelsLike: 22,
        humidity: 65,
        precipitation: 0,
        windSpeed: 10,
        windDirection: 180
      }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    const mockRoute = {
      params: { user: 'user1', location: 'loc1' },
      path: '/user1/loc1',
      name: 'forecast',
      fullPath: '/user1/loc1',
      hash: '',
      query: {},
      matched: [],
      meta: {},
      redirectedFrom: undefined
    } as RouteLocationNormalizedLoaded

    vi.mocked(useRoute).mockReturnValue(mockRoute)
  })

  it('renders properly with loading state', () => {
    const wrapper = mount(ForecastPage, mountOptions)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Loading Location...')
  })

  it('loads location data successfully', async () => {
    const getMock = vi.mocked(axios.get)
    getMock.mockResolvedValueOnce({ data: mockLocation })
    const wrapper = mount(ForecastPage, mountOptions)
    await wrapper.vm.$nextTick()

    expect(getMock).toHaveBeenCalledWith(expect.stringContaining('/user1/favorite/loc1'))
  })

  it('calls setCurrentLocationName when location changes', async () => {
    vi.mocked(axios.get)
      .mockResolvedValueOnce({ data: mockLocation })
      .mockResolvedValueOnce({ data: mockForecast })

    const wrapper = mount(ForecastPage, mountOptions)

    // Wait for the location data to be loaded and Vue to update
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(setCurrentLocationName).toHaveBeenCalledWith('Home')
  })

  it('calls setCurrentLocationName with null when component is unmounted', () => {
    const wrapper = mount(ForecastPage, mountOptions)
    wrapper.unmount()

    expect(setCurrentLocationName).toHaveBeenCalledWith(null)
  })
})
