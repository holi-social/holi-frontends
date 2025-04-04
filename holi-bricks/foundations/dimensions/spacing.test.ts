import { Spacing, makeMargin, makePadding } from './spacing'

describe('spacing', () => {
  describe('makePadding', () => {
    it('should apply the same padding to all sides when given a single value', () => {
      expect(makePadding('md')).toEqual({
        paddingTop: Spacing.md,
        paddingBottom: Spacing.md,
        paddingLeft: Spacing.md,
        paddingRight: Spacing.md,
      })
    })

    it('should apply individual padding values per side', () => {
      expect(makePadding({ top: 'sm', bottom: 'lg' })).toEqual({
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.lg,
      })
    })

    it('should return an empty object when no value is provided', () => {
      expect(makePadding()).toEqual({})
    })
  })

  describe('makeMargin', () => {
    it('should apply the same margin to all sides when given a single value', () => {
      expect(makeMargin('xl')).toEqual({
        marginTop: Spacing.xl,
        marginBottom: Spacing.xl,
        marginLeft: Spacing.xl,
        marginRight: Spacing.xl,
      })
    })

    it('should apply individual margin values per side', () => {
      expect(makeMargin({ left: 'xs', right: 'xxl' })).toEqual({
        marginLeft: Spacing.xs,
        marginRight: Spacing.xxl,
      })
    })

    it('should return an empty object when no value is provided', () => {
      expect(makeMargin()).toEqual({})
    })
  })
})
