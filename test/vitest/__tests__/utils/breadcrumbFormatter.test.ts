import { describe, it, expect } from 'vitest'
import { BreadcrumbFormatter } from '../../../../src/utils/breadcrumbFormatter'

describe('BreadcrumbFormatter', () => {
  describe('formatLocationPath', () => {
    it('returns "Weather App" when no user or location is provided', () => {
      expect(BreadcrumbFormatter.formatLocationPath(null, null)).toBe('Weather App')
    })

    it('returns username when only username is provided', () => {
      expect(BreadcrumbFormatter.formatLocationPath('john_doe', null)).toBe('john_doe')
    })

    it('returns formatted path when both username and location are provided', () => {
      expect(BreadcrumbFormatter.formatLocationPath('john_doe', 'Home')).toBe('john_doe / Home')
    })

    it('handles empty strings correctly', () => {
      expect(BreadcrumbFormatter.formatLocationPath('', '')).toBe(' / ')
    })

    it('handles special characters in username and location', () => {
      expect(BreadcrumbFormatter.formatLocationPath('user.name@email', 'My Home!')).toBe(
        'user.name@email / My Home!'
      )
    })
  })
})
