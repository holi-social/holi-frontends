import { BorderRadius, makeRadius } from './borderRadius'

describe('borderRadius', () => {
  describe('makeRadius', () => {
    it('should apply the same radius to all corners when given a single value', () => {
      expect(makeRadius('lg')).toEqual({
        borderTopLeftRadius: BorderRadius.lg,
        borderTopRightRadius: BorderRadius.lg,
        borderBottomLeftRadius: BorderRadius.lg,
        borderBottomRightRadius: BorderRadius.lg,
      })
    })

    it('should apply individual radius values per corner', () => {
      expect(makeRadius({ topLeft: 'xs', bottomRight: 'pill' })).toEqual({
        borderTopLeftRadius: BorderRadius.xs,
        borderBottomRightRadius: BorderRadius.pill,
      })
    })

    it('should return an empty object when no value is provided', () => {
      expect(makeRadius()).toEqual({})
    })
  })
})
