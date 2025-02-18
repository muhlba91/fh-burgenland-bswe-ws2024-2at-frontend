import { type Coordinates } from './coordinates'

/**
 * Represents a complete weather forecast for a location, including current conditions
 * and hourly predictions.
 */
export interface Forecast {
  /** Geographic coordinates where the forecast applies */
  coordinates: Coordinates
  /** ISO 8601 timestamp when the forecast was requested */
  requestTime: string
  /** Unit system used for all measurements in the forecast */
  units: Units
  /** Current weather conditions at the location */
  currentWeather: CurrentWeather
  /** Hourly weather predictions, keyed by ISO 8601 timestamps */
  hourlyForecast: Record<string, HourlyForecast>
}

/**
 * Measurement units used throughout the forecast data.
 * Each property specifies the unit of measurement as a string (e.g., '°C', 'km/h').
 */
export interface Units {
  /** Temperature unit (e.g., '°C') */
  temperature: string
  /** Feels-like temperature unit (e.g., '°C') */
  feelsLike: string
  /** Humidity unit (e.g., '%') */
  humidity: string
  /** Dew point temperature unit (e.g., '°C') */
  dewPoint: string
  /** Precipitation probability unit (e.g., '%') */
  precipitationProbability: string
  /** Precipitation amount unit (e.g., 'mm') */
  precipitation: string
  /** Cloud cover unit (e.g., '%') */
  cloudCover: string
  /** Visibility distance unit (e.g., 'km') */
  visibility: string
  /** Wind speed unit (e.g., 'km/h') */
  windSpeed: string
  /** Wind direction unit (e.g., '°') */
  windDirection: string
  /** Wind gust speed unit (e.g., 'km/h') */
  windGusts: string
}

/**
 * Current weather conditions at a location.
 */
export interface CurrentWeather {
  /** Current temperature */
  temperature: number
  /** What the temperature feels like, considering humidity and wind */
  feelsLike: number
  /** Relative humidity percentage */
  humidity: number
  /** Dew point temperature */
  dewPoint: number
  /** Amount of precipitation */
  precipitation: number
  /** Sustained wind speed */
  windSpeed: number
  /** Wind direction in degrees (0-360) */
  windDirection: number
  /** Maximum wind gust speed */
  windGusts: number
}

/**
 * Weather forecast for a specific hour.
 * Similar to CurrentWeather but includes additional predictive metrics.
 */
export interface HourlyForecast {
  /** ISO 8601 timestamp for this forecast hour */
  time: string
  /** Predicted temperature */
  temperature: number
  /** Predicted feels-like temperature */
  feelsLike: number
  /** Predicted relative humidity percentage */
  humidity: number
  /** Predicted dew point temperature */
  dewPoint: number
  /** Probability of precipitation (0-100) */
  precipitationProbability: number
  /** Predicted precipitation amount */
  precipitation: number
  /** Predicted cloud cover percentage */
  cloudCover: number
  /** Predicted visibility distance */
  visibility: number
  /** Predicted sustained wind speed */
  windSpeed: number
  /** Predicted wind direction in degrees (0-360) */
  windDirection: number
  /** Predicted maximum wind gust speed */
  windGusts: number
}
