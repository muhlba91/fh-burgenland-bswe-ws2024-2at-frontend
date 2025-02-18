/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import UserLink from '../../../../src/components/UserLink.vue'

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn()
}))

vi.mock('axios')

describe('UserLink.vue', () => {
  const mountOptions = {
    global: {
      plugins: [Quasar],
      stubs: {
        LocationCreateDialog: true,
        ConfirmDialog: true
      }
    }
  }

  const defaultProps = {
    id: 'user1',
    username: 'testuser'
  }

  const mockLocations = {
    locations: [
      {
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
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRoute).mockReturnValue({
      params: { user: 'user1', location: 'loc1' }
    } as any)
    vi.mocked(useRouter).mockReturnValue({
      push: vi.fn()
    } as any)
  })

  it('renders properly with required props', () => {
    const wrapper = mount(UserLink, {
      props: defaultProps,
      ...mountOptions
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('testuser')
  })

  it('loads locations when expanded', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({ data: mockLocations })

    const wrapper = mount(UserLink, {
      props: defaultProps,
      ...mountOptions
    })

    // Expand the user link
    await wrapper.find('.q-expansion-item').trigger('click')

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/user1/favorite/'))
    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('Vienna')
  })

  it('shows error when loading locations fails', async () => {
    vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'))

    const wrapper = mount(UserLink, {
      props: defaultProps,
      ...mountOptions
    })

    await wrapper.find('.q-expansion-item').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Failed to load locations')
  })

  it('deletes location and navigates correctly', async () => {
    const router = { push: vi.fn() }
    vi.mocked(useRouter).mockReturnValue(router as any)
    vi.mocked(axios.get).mockResolvedValueOnce({ data: mockLocations })
    vi.mocked(axios.delete).mockResolvedValueOnce({})

    const wrapper = mount(UserLink, {
      props: defaultProps,
      ...mountOptions
    })

    // Load locations
    await wrapper.find('.q-expansion-item').trigger('click')
    await wrapper.vm.$nextTick()

    // Delete location
    await wrapper.vm.deleteLocation(mockLocations.locations[0])

    expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining('/user1/favorite/loc1'))
    expect(router.push).toHaveBeenCalledWith('/')
  })

  it('deletes user and emits event', async () => {
    vi.mocked(axios.delete).mockResolvedValueOnce({})
    const router = { push: vi.fn() }
    vi.mocked(useRouter).mockReturnValue(router as any)

    const wrapper = mount(UserLink, {
      props: defaultProps,
      ...mountOptions
    })

    await wrapper.vm.deleteUser()

    expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining('/user/user1'))
    expect(wrapper.emitted('deleted')).toBeTruthy()
    expect(router.push).toHaveBeenCalledWith('/')
  })
})
