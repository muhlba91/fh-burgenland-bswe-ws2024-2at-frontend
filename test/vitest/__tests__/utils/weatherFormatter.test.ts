import { describe, it, expect } from 'vitest'
import { WeatherFormatter } from '../../../../src/utils/weatherFormatter'
import type { Units } from '../../../../src/model/forecast'

describe('WeatherFormatter', () => {
  describe('formatValue', () => {
    it('formats numeric value with unit', () => {
      expect(WeatherFormatter.formatValue(20, '°C')).toBe('20°C')
    })

    it('formats string value with unit', () => {
      expect(WeatherFormatter.formatValue('20', '°C')).toBe('20°C')
    })

    it('formats value without unit', () => {
      expect(WeatherFormatter.formatValue(65)).toBe('65')
    })

    it('handles zero values correctly', () => {
      expect(WeatherFormatter.formatValue(0, '°C')).toBe('0°C')
    })

    it('handles negative values', () => {
      expect(WeatherFormatter.formatValue(-5, '°C')).toBe('-5°C')
    })
  })

  describe('getUnit', () => {
    const units: Units = {
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
    }

    it('returns correct unit for temperature', () => {
      expect(WeatherFormatter.getUnit(units, 'temperature')).toBe('°C')
    })

    it('returns correct unit for wind speed', () => {
      expect(WeatherFormatter.getUnit(units, 'windSpeed')).toBe('km/h')
    })

    it('returns correct unit for precipitation', () => {
      expect(WeatherFormatter.getUnit(units, 'precipitation')).toBe('mm')
    })

    it('returns correct unit for humidity', () => {
      expect(WeatherFormatter.getUnit(units, 'humidity')).toBe('%')
    })

    it('returns empty string for undefined unit', () => {
      const incompleteUnits = {} as Units
      expect(WeatherFormatter.getUnit(incompleteUnits, 'temperature')).toBe('')
    })
  })
})
