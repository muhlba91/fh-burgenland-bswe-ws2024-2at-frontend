/**
 * Configuration class for API endpoints and authentication.
 * Contains environment-specific configuration values for backend and external API services.
 */
export class ApiConfig {
  /** Base URL for the backend API. Defaults to localhost in development */
  static API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8080/api'

  /** URL template for the METAR API endpoint. Contains a placeholder {icao} for the airport code */
  static METAR_API_URL = import.meta.env.VITE_METAR_API_URL || 'https://avwx.rest/api/metar/{icao}'

  /** Authentication token for the AVWX weather service */
  static AVWX_API_KEY = import.meta.env.VITE_AVWX_API_KEY || 'Token avwx_api_key'
}
