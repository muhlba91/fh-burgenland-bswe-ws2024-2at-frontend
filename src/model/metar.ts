/**
 * Represents a METAR (METeorological Aerodrome Report) weather observation.
 * METAR is a format for reporting weather information used by pilots.
 */
export interface Metar {
  /** Time information of the METAR report */
  time: MetarTime
  /** Raw METAR text string */
  raw: string
  /** ICAO code of the reporting station */
  station: string
  /** Current flight rules (e.g., 'VFR', 'IFR') */
  flight_rules: string
  /** Atmospheric pressure adjusted to sea level */
  altimeter: MetarNumericValue
  /** Current temperature */
  temperature: MetarNumericValue
  /** Dew point temperature */
  dewpoint: MetarNumericValue
  /** Horizontal visibility */
  visibility: MetarNumericValue
  /** Wind direction in degrees */
  wind_direction: MetarNumericValue
  /** Wind gust speed */
  wind_gust: MetarNumericValue
  /** Sustained wind speed */
  wind_speed: MetarNumericValue
  /** Cloud layer observations */
  clouds: MetarClouds[]
  /** Calculated density altitude in feet */
  density_altitude: number
  /** Unit system used in the report */
  units: MetarUnits
}

/** Time information for a METAR report */
export interface MetarTime {
  /** ISO 8601 formatted date-time string */
  dt: string
}

/** Represents a numeric value in a METAR report */
export interface MetarNumericValue {
  /** The numeric value of the measurement */
  value: number
}

/** Represents a cloud layer observation in a METAR report */
export interface MetarClouds {
  /** Cloud coverage type (e.g., 'FEW', 'SCT', 'BKN', 'OVC') */
  type: string
  /** Height of the cloud base in feet */
  altitude: number
}

/** Unit system used in METAR measurements */
export interface MetarUnits {
  /** Unit for pressure measurements (e.g., 'hPa', 'inHg') */
  altimeter: string
  /** Unit for height measurements */
  altitude: string
  /** Unit for temperature measurements */
  temperature: string
  /** Unit for visibility measurements */
  visibility: string
  /** Unit for wind speed measurements */
  wind_speed: string
}
