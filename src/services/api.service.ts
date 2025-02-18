import axios from 'axios'
import { ApiConfig } from '../config/api'
import type { FavoriteLocation } from '../model/favoriteLocation'
import type { Forecast } from '../model/forecast'
import type { User } from '../model/user'
import type { Metar } from 'src/model/metar'

/**
 * Service class that handles all API communication with the backend.
 * Provides methods for user management, location management, and weather data retrieval.
 */
export class ApiService {
  /**
   * Retrieves all users from the system.
   *
   * @returns A promise that resolves to an object containing an array of users.
   * @throws {Error} If the network request fails.
   */
  static async getUsers(): Promise<{ users: User[] }> {
    const { data } = await axios.get(`${ApiConfig.API_URL}/user/`)
    return data
  }

  /**
   * Creates a new user in the system.
   *
   * @param username - The desired username for the new user.
   * @returns A promise that resolves to the created User object.
   * @throws {Error} If the username is invalid or already taken.
   */
  static async createUser(username: string): Promise<User> {
    const { data } = await axios.post(`${ApiConfig.API_URL}/user/`, { username })
    return data
  }

  /**
   * Retrieves all favorite locations for a specific user.
   *
   * @param userId - The ID of the user whose locations to retrieve.
   * @returns A promise that resolves to an object containing an array of favorite locations.
   * @throws {Error} If the user doesn't exist or the network request fails.
   */
  static async getLocations(userId: string): Promise<{ locations: FavoriteLocation[] }> {
    const { data } = await axios.get(`${ApiConfig.API_URL}/${userId}/favorite/`)
    return data
  }

  /**
   * Creates a new favorite location for a user.
   * The location string will be geocoded by the backend to obtain coordinates.
   *
   * @param userId - The ID of the user who is creating the location.
   * @param name - A friendly name for the location (e.g., "Home", "Office").
   * @param location - A location string that can be geocoded (e.g., "Vienna, Austria").
   * @returns A promise that resolves to the created FavoriteLocation object.
   * @throws {Error} If the location cannot be geocoded or the user doesn't exist.
   */
  static async createLocation(
    userId: string,
    name: string,
    location: string
  ): Promise<FavoriteLocation> {
    const { data } = await axios.post(`${ApiConfig.API_URL}/${userId}/favorite/`, {
      name,
      location
    })
    return data
  }

  /**
   * Deletes a favorite location for a user.
   *
   * @param userId - The ID of the user who owns the location.
   * @param locationId - The ID of the location to delete.
   * @returns A promise that resolves when the location is deleted.
   * @throws {Error} If the location or user doesn't exist.
   */
  static async deleteLocation(userId: string, locationId: string): Promise<void> {
    await axios.delete(`${ApiConfig.API_URL}/${userId}/favorite/${locationId}`)
  }

  /**
   * Retrieves a weather forecast for a specific location.
   *
   * @param userId - The ID of the user who owns the location.
   * @param locationId - The ID of the location to get the forecast for.
   * @returns A promise that resolves to the Forecast object.
   * @throws {Error} If the location doesn't exist or the forecast service is unavailable.
   */
  static async getForecast(userId: string, locationId: string): Promise<Forecast> {
    const { data } = await axios.get(`${ApiConfig.API_URL}/${userId}/${locationId}/forecast/`)
    return data
  }

  /**
   * Retrieves METAR (Meteorological Aerodrome Report) data for an airport.
   *
   * @param icao - The ICAO code of the airport (e.g., "LOWW" for Vienna International).
   * @returns A promise that resolves to the Metar object.
   * @throws {Error} If the ICAO code is invalid or the METAR service is unavailable.
   */
  static async getMetar(icao: string): Promise<Metar> {
    const { data } = await axios.get(ApiConfig.METAR_API_URL.replace('{icao}', icao), {
      headers: {
        Authorization: ApiConfig.AVWX_API_KEY
      }
    })
    return data
  }
}
