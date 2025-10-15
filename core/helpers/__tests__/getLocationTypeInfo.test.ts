import { getLocationTypeInfo } from '@holi/core/helpers/getLocationTypeInfo'

describe('getLocationTypeInfo', () => {
  describe('Remote classification', () => {
    it('should classify as remote when location_type is remote and no location', () => {
      const result = getLocationTypeInfo('remote', '')
      expect(result).toEqual({
        isRemote: true,
        isHybrid: false,
        isOnsite: false,
      })
    })

    it('should classify as remote when location_type is remote and null location', () => {
      const result = getLocationTypeInfo('remote', null)
      expect(result).toEqual({
        isRemote: true,
        isHybrid: false,
        isOnsite: false,
      })
    })

    it('should classify as remote when location_type is remote and undefined location', () => {
      const result = getLocationTypeInfo('remote', undefined)
      expect(result).toEqual({
        isRemote: true,
        isHybrid: false,
        isOnsite: false,
      })
    })

    it('should classify as remote when location_type is remote and Germany-wide location', () => {
      const result = getLocationTypeInfo('remote', 'Bundesweit')
      expect(result).toEqual({
        isRemote: true,
        isHybrid: false,
        isOnsite: false,
      })
    })
  })

  describe('Hybrid classification', () => {
    it('should classify as hybrid when location_type is hybrid', () => {
      const result = getLocationTypeInfo('hybrid', 'Berlin')
      expect(result).toEqual({
        isRemote: false,
        isHybrid: true,
        isOnsite: false,
      })
    })

    it('should classify as hybrid when location_type is remote with specific location', () => {
      const result = getLocationTypeInfo('remote', 'Berlin')
      expect(result).toEqual({
        isRemote: false,
        isHybrid: true,
        isOnsite: false,
      })
    })

    it('should classify as hybrid when location_type is hybrid with empty location', () => {
      const result = getLocationTypeInfo('hybrid', '')
      expect(result).toEqual({
        isRemote: false,
        isHybrid: true,
        isOnsite: false,
      })
    })
  })

  describe('On-site classification', () => {
    it('should classify as onsite when location_type is onsite', () => {
      const result = getLocationTypeInfo('onsite', 'Berlin')
      expect(result).toEqual({
        isRemote: false,
        isHybrid: false,
        isOnsite: true,
      })
    })
  })

  describe('Edge cases and data rectification', () => {
    it('should handle null/undefined inputs gracefully', () => {
      const result1 = getLocationTypeInfo(null, null)
      expect(result1).toEqual({
        isRemote: false,
        isHybrid: false,
        isOnsite: false,
      })

      const result2 = getLocationTypeInfo(undefined, undefined)
      expect(result2).toEqual({
        isRemote: false,
        isHybrid: false,
        isOnsite: false,
      })
    })

    it('should handle empty string location_type', () => {
      const result = getLocationTypeInfo('', 'Berlin')
      expect(result).toEqual({
        isRemote: false,
        isHybrid: false,
        isOnsite: false,
      })
    })

    it('should handle whitespace-only location', () => {
      const result = getLocationTypeInfo('remote', '   ')
      expect(result).toEqual({
        isRemote: true,
        isHybrid: false,
        isOnsite: false,
      })
    })
  })

  describe('Data quality rectification examples', () => {
    it('should rectify incorrectly tagged remote with location to hybrid', () => {
      // This is the main data quality issue we're solving
      const result = getLocationTypeInfo('remote', 'Hamburg')
      expect(result.isHybrid).toBe(true)
      expect(result.isRemote).toBe(false)
    })

    it('should correctly identify truly remote items', () => {
      const result = getLocationTypeInfo('remote', '')
      expect(result.isRemote).toBe(true)
      expect(result.isHybrid).toBe(false)
    })

    it('should correctly identify Germany-wide remote items', () => {
      const result = getLocationTypeInfo('remote', 'Bundesweit')
      expect(result.isRemote).toBe(true)
      expect(result.isHybrid).toBe(false)
    })
  })

  describe('Priority logic', () => {
    it('should prioritize hybrid type over remote logic', () => {
      const result = getLocationTypeInfo('hybrid', 'Berlin')
      expect(result.isHybrid).toBe(true)
      expect(result.isRemote).toBe(false)
    })

    it('should prioritize onsite type over other logic', () => {
      const result = getLocationTypeInfo('onsite', 'Berlin')
      expect(result.isOnsite).toBe(true)
      expect(result.isRemote).toBe(false)
      expect(result.isHybrid).toBe(false)
    })
  })
})
