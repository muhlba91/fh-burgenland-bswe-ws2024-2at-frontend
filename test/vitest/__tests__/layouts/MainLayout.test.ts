/* eslint-disable @typescript-eslint/unbound-method */
import type { Mocked } from 'vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../../../../src/layouts/MainLayout.vue'
import axios from 'axios'
import { Quasar } from 'quasar'
import { inject } from 'vue'

vi.mock('axios')
const mockedAxios = axios as Mocked<typeof axios>

describe('MainLayout.vue', () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/', component: { template: '<div>Home</div>' } }]
  })

  const mockUsers = [{ id: '1', username: 'testuser' }]

  const mountOptions = {
    global: {
      plugins: [router, Quasar],
      stubs: {
        UserCreateDialog: true,
        ErrorAlert: true,
        UserLink: true
      }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Component initialization', () => {
    it('should initialize with default values', () => {
      const wrapper = mount(MainLayout, mountOptions)
      expect(wrapper.vm.leftDrawerOpen).toBe(true)
      expect(wrapper.vm.users).toEqual([])
      expect(wrapper.vm.error).toBeNull()
      expect(wrapper.vm.currentLocationName).toBeNull()
    })

    it('should fetch users on mount', async () => {
      const mockedGet = vi.fn().mockResolvedValueOnce({ data: { users: mockUsers } })
      mockedAxios.get = mockedGet
      const wrapper = mount(MainLayout, mountOptions)
      await wrapper.vm.$nextTick()

      expect(mockedGet).toHaveBeenCalledWith(expect.stringContaining('/user/'))
      expect(wrapper.vm.users).toEqual(mockUsers)
      expect(wrapper.vm.usersLoading).toBe(false)
    })

    it('should handle error when fetching users fails', async () => {
      const mockedGet = vi.fn().mockRejectedValueOnce(new Error('Network Error'))
      mockedAxios.get = mockedGet
      const wrapper = mount(MainLayout, mountOptions)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.error).toEqual({ message: 'An unexpected error occurred' })
      expect(wrapper.vm.usersLoading).toBe(false)
    })

    it('should handle non-Axios errors when fetching users', async () => {
      const mockedGet = vi.fn().mockImplementationOnce(() => {
        throw new Error('Generic Error')
      })
      mockedAxios.get = mockedGet
      const wrapper = mount(MainLayout, mountOptions)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.error).toEqual({
        message: 'An unexpected error occurred'
      })
      expect(wrapper.vm.usersLoading).toBe(false)
    })
  })

  describe('Component functionality', () => {
    it('should toggle left drawer correctly', async () => {
      const wrapper = mount(MainLayout, mountOptions)
      expect(wrapper.vm.leftDrawerOpen).toBe(true)

      await wrapper.vm.toggleLeftDrawer()
      expect(wrapper.vm.leftDrawerOpen).toBe(false)

      await wrapper.vm.toggleLeftDrawer()
      expect(wrapper.vm.leftDrawerOpen).toBe(true)
    })

    it('should compute currentUser based on route params', async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: { users: mockUsers } })
      const wrapper = mount(MainLayout, mountOptions)
      await wrapper.vm.$nextTick()

      await router.push({ params: { user: '1' } })
      expect(wrapper.vm.currentUser).toBe('testuser')

      await router.push({ params: { user: '2' } })
      expect(wrapper.vm.currentUser).toBeUndefined()

      await router.push({ params: {} })
      expect(wrapper.vm.currentUser).toBeUndefined()
    })
  })

  describe('Location name functionality', () => {
    it('should provide and handle setCurrentLocationName function', () => {
      const wrapper = mount(MainLayout, mountOptions)
      const testName = 'Test Location'

      const TestComponent = {
        template: '<div></div>',
        setup() {
          const setLocationName = inject('setCurrentLocationName') as (name: string | null) => void
          setLocationName(testName)
        }
      }

      mount(TestComponent, {
        global: {
          plugins: [Quasar],
          provide: wrapper.vm.$.provides
        }
      })

      expect(wrapper.vm.currentLocationName).toBe(testName)
    })
  })
})
