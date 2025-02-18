import { describe, it, expect } from 'vitest'
import { DateFormatter } from '../../../../src/utils/dateFormatter'

describe('DateFormatter', () => {
  describe('formatHour', () => {
    it('formats time correctly in 12-hour format', () => {
      expect(DateFormatter.formatHour('2024-01-24T15:30:00Z')).toBe('03:30 PM')
    })

    it('handles midnight correctly', () => {
      expect(DateFormatter.formatHour('2024-01-24T00:00:00Z')).toBe('12:00 AM')
    })

    it('handles noon correctly', () => {
      expect(DateFormatter.formatHour('2024-01-24T12:00:00Z')).toBe('12:00 PM')
    })

    it('handles single-digit minutes in morning', () => {
      expect(DateFormatter.formatHour('2024-01-24T09:05:00Z')).toBe('09:05 AM')
    })

    it('handles single-digit minutes in afternoon', () => {
      expect(DateFormatter.formatHour('2024-01-24T14:05:00Z')).toBe('02:05 PM')
    })
  })

  describe('formatDateTime', () => {
    it('formats afternoon time in 24-hour British English format', () => {
      expect(DateFormatter.formatDateTime('2024-01-24T15:30:00Z')).toBe('24/01/2024, 15:30')
    })

    it('formats morning time in 24-hour British English format', () => {
      expect(DateFormatter.formatDateTime('2024-01-24T09:30:00Z')).toBe('24/01/2024, 09:30')
    })

    it('handles single-digit dates correctly', () => {
      expect(DateFormatter.formatDateTime('2024-01-05T09:05:00Z')).toBe('05/01/2024, 09:05')
    })

    it('handles different months correctly', () => {
      expect(DateFormatter.formatDateTime('2024-12-31T23:59:00Z')).toBe('31/12/2024, 23:59')
    })

    it('handles midnight correctly', () => {
      expect(DateFormatter.formatDateTime('2024-01-24T00:00:00Z')).toBe('24/01/2024, 00:00')
    })
  })
})
