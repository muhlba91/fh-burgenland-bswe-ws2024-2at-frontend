import { type Units } from 'src/model/forecast'

/**
 * Utility class for formatting weather values and units consistently across the application.
 */
export class WeatherFormatter {
  /**
   * Formats a weather value with its optional unit.
   *
   * @param value - The numeric or string value to format
   * @param unit - Optional unit to append to the value
   * @returns Formatted string with value and unit. Example: "20°C", "65%"
   */
  static formatValue(value: number | string, unit?: string): string {
    return `${value}${unit || ''}`
  }

  /**
   * Gets the display unit for a specific weather measurement type from the units configuration.
   *
   * @param units - The unit configuration object from the forecast data
   * @param key - The type of measurement to get the unit for (e.g., 'temperature', 'windSpeed')
   * @returns The display unit string (e.g., '°C', 'km/h') or empty string if not found
   */
  static getUnit(units: Units, key: keyof Units): string {
    return units[key] || ''
  }
}
