import { describe, it, expect } from 'vitest'
import { CoordinatesFormatter } from '../../../../src/utils/coordinatesFormatter'

describe('CoordinatesFormatter', () => {
  describe('format', () => {
    it('formats positive coordinates correctly', () => {
      expect(CoordinatesFormatter.format(48.2082, 16.3738)).toBe('48.2082°N, 16.3738°E')
    })

    it('formats negative coordinates correctly', () => {
      expect(CoordinatesFormatter.format(-33.8688, -151.2093)).toBe('33.8688°S, 151.2093°W')
    })

    it('formats mixed positive/negative coordinates correctly', () => {
      expect(CoordinatesFormatter.format(40.7128, -74.006)).toBe('40.7128°N, 74.006°W')
    })

    it('handles zero coordinates correctly', () => {
      expect(CoordinatesFormatter.format(0, 0)).toBe('0°N, 0°E')
    })

    it('handles decimal precision correctly', () => {
      expect(CoordinatesFormatter.format(51.5074321, -0.1277583)).toBe('51.5074321°N, 0.1277583°W')
    })
  })
})
