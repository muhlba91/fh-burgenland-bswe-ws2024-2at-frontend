import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import '@quasar/extras/material-icons/material-icons.css'
import { beforeEach, vi } from 'vitest'
import { VueRouterMock, createRouterMock, injectRouterMock } from 'vue-router-mock'
import { config } from '@vue/test-utils'

installQuasarPlugin()

const router = createRouterMock()
beforeEach(() => {
  router.reset()
  injectRouterMock(router)
})

config.plugins.VueWrapper.install(VueRouterMock)

vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => ({
      remove: vi.fn(),
      setView: vi.fn(),
      addLayer: vi.fn(),
      invalidateSize: vi.fn(),
      fitBounds: vi.fn(),
      removeLayer: vi.fn()
    })),
    tileLayer: vi.fn(() => ({
      addTo: vi.fn()
    })),
    marker: vi.fn(() => ({
      addTo: vi.fn().mockReturnThis(),
      bindPopup: vi.fn().mockReturnThis(),
      setLatLng: vi.fn()
    })),
    divIcon: vi.fn(() => ({})),
    latLngBounds: vi.fn(() => ({
      pad: vi.fn().mockReturnThis()
    }))
  }
}))
