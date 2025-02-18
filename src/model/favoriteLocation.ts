import { type Coordinates } from './coordinates'

/**
 * Represents a user's saved location with weather information and nearest airport.
 */
export interface FavoriteLocation {
  /** Unique identifier of the location */
  id: string
  /** User-provided name for the location */
  givenName: string
  /** User-provided location description (e.g., city name, address) */
  givenLocation: string
  /** Geographic coordinates of the location */
  coordinates: Coordinates
  /** ICAO code of the nearest airport */
  nearestAirport: string
  /** Geographic coordinates of the nearest airport */
  nearestAirportCoordinates: Coordinates
}

/**
 * Data transfer object for creating a new favorite location.
 * The backend will resolve the location string to coordinates and find the nearest airport.
 */
export interface FavoriteLocationCreate {
  /** Name to identify the location */
  name: string
  /** Location description that can be geocoded (e.g., "Vienna, Austria") */
  location: string
}
