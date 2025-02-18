/**
 * Represents a geographic location with longitude, latitude, and elevation.
 */
export interface Coordinates {
  /** Longitude in decimal degrees (WGS84) */
  longitude: number
  /** Latitude in decimal degrees (WGS84) */
  latitude: number
  /** Elevation above sea level in meters */
  elevation: number
}
