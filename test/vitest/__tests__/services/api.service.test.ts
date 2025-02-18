/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import axios from 'axios'
import { ApiService } from '../../../../src/services/api.service'
import { ApiConfig } from '../../../../src/config/api'

vi.mock('axios')

describe('ApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getUsers', () => {
    it('should fetch users successfully', async () => {
      const mockUsers = { users: [{ id: '1', username: 'test' }] }
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockUsers })

      const result = await ApiService.getUsers()

      expect(axios.get).toHaveBeenCalledWith(`${ApiConfig.API_URL}/user/`)
      expect(result).toEqual(mockUsers)
    })

    it('should handle error when fetching users fails', async () => {
      vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'))
      await expect(ApiService.getUsers()).rejects.toThrow('Network error')
    })
  })

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const mockUser = { id: '1', username: 'newuser' }
      vi.mocked(axios.post).mockResolvedValueOnce({ data: mockUser })

      const result = await ApiService.createUser('newuser')

      expect(axios.post).toHaveBeenCalledWith(`${ApiConfig.API_URL}/user/`, { username: 'newuser' })
      expect(result).toEqual(mockUser)
    })

    it('should handle error when creating user fails', async () => {
      vi.mocked(axios.post).mockRejectedValueOnce(new Error('Creation failed'))
      await expect(ApiService.createUser('newuser')).rejects.toThrow('Creation failed')
    })
  })

  describe('getLocations', () => {
    it('should fetch locations successfully', async () => {
      const mockLocations = {
        locations: [
          {
            id: '1',
            givenName: 'Home',
            givenLocation: 'Vienna',
            coordinates: { longitude: 16.3738, latitude: 48.2082, elevation: 151 },
            nearestAirport: 'VIE'
          }
        ]
      }
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockLocations })

      const result = await ApiService.getLocations('user1')

      expect(axios.get).toHaveBeenCalledWith(`${ApiConfig.API_URL}/user1/favorite/`)
      expect(result).toEqual(mockLocations)
    })

    it('should handle error when fetching locations fails', async () => {
      vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'))
      await expect(ApiService.getLocations('user1')).rejects.toThrow('Network error')
    })
  })

  describe('createLocation', () => {
    it('should create location successfully', async () => {
      const mockLocation = {
        id: '1',
        givenName: 'Home',
        givenLocation: 'Vienna',
        coordinates: { longitude: 16.3738, latitude: 48.2082, elevation: 151 },
        nearestAirport: 'VIE'
      }
      vi.mocked(axios.post).mockResolvedValueOnce({ data: mockLocation })

      const result = await ApiService.createLocation('user1', 'Home', 'Vienna')

      expect(axios.post).toHaveBeenCalledWith(`${ApiConfig.API_URL}/user1/favorite/`, {
        name: 'Home',
        location: 'Vienna'
      })
      expect(result).toEqual(mockLocation)
    })

    it('should handle error when creating location fails', async () => {
      vi.mocked(axios.post).mockRejectedValueOnce(new Error('Creation failed'))
      await expect(ApiService.createLocation('user1', 'Home', 'Vienna')).rejects.toThrow(
        'Creation failed'
      )
    })
  })

  describe('deleteLocation', () => {
    it('should delete location successfully', async () => {
      vi.mocked(axios.delete).mockResolvedValueOnce({})
      await ApiService.deleteLocation('user1', 'location1')
      expect(axios.delete).toHaveBeenCalledWith(`${ApiConfig.API_URL}/user1/favorite/location1`)
    })

    it('should handle error when deleting location fails', async () => {
      vi.mocked(axios.delete).mockRejectedValueOnce(new Error('Deletion failed'))
      await expect(ApiService.deleteLocation('user1', 'location1')).rejects.toThrow(
        'Deletion failed'
      )
    })
  })

  describe('getForecast', () => {
    it('should fetch forecast successfully', async () => {
      const mockForecast = {
        coordinates: { longitude: 16.3738, latitude: 48.2082, elevation: 151 },
        requestTime: '2024-01-01T12:00:00Z',
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
        hourlyForecast: {}
      }
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockForecast })

      const result = await ApiService.getForecast('user1', 'location1')

      expect(axios.get).toHaveBeenCalledWith(`${ApiConfig.API_URL}/user1/location1/forecast/`)
      expect(result).toEqual(mockForecast)
    })

    it('should handle error when fetching forecast fails', async () => {
      vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'))
      await expect(ApiService.getForecast('user1', 'location1')).rejects.toThrow('Network error')
    })
  })

  describe('getMetar', () => {
    it('should fetch METAR data successfully', async () => {
      const mockMetar = {
        flight_rules: 'VFR',
        raw: 'LOWW 241530Z 12008KT CAVOK 22/12 Q1020',
        time: { dt: new Date('2024-01-24T15:30:00Z') }
      }
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockMetar })

      const result = await ApiService.getMetar('LOWW')

      expect(axios.get).toHaveBeenCalledWith(ApiConfig.METAR_API_URL.replace('{icao}', 'LOWW'), {
        headers: { Authorization: ApiConfig.AVWX_API_KEY }
      })
      expect(result).toEqual(mockMetar)
    })

    it('should handle error when fetching METAR fails', async () => {
      vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'))
      await expect(ApiService.getMetar('LOWW')).rejects.toThrow('Network error')
    })
  })
})
