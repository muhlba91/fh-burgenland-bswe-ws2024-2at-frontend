/**
 * Utility class for formatting geographic coordinates into human-readable strings.
 */
export class CoordinatesFormatter {
  /**
   * Formats latitude and longitude into a human-readable coordinate string.
   *
   * @param latitude - Latitude in decimal degrees (-90 to 90)
   * @param longitude - Longitude in decimal degrees (-180 to 180)
   * @returns Formatted string with directional indicators. Example: "48.2082°N, 16.3738°E"
   */
  static format(latitude: number, longitude: number): string {
    const latDirection = latitude >= 0 ? 'N' : 'S'
    const lonDirection = longitude >= 0 ? 'E' : 'W'
    return `${Math.abs(latitude)}°${latDirection}, ${Math.abs(longitude)}°${lonDirection}`
  }
}
