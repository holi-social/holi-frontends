import { simpleColumnSortingByIndex } from '@holi/core/screens/individualPosts/components/PostsListResults'

describe('PostListResults', () => {
  describe('basic masonry sorting algorithym', () => {
    it('should sort items sequentially into columns', () => {
      const sorted = simpleColumnSortingByIndex([1, 4, 7], 2)

      expect(sorted[0][0]).toBe(1)
      expect(sorted[1][0]).toBe(4)
      expect(sorted[0][1]).toBe(7)
    })

    it('when there are no columns, should return no sorted items at all', () => {
      const sorted = simpleColumnSortingByIndex([1, 4, 7], 0)

      expect(sorted.length).toBe(0)
    })

    it('when there are less items than columns, should still return the correct number of columns', () => {
      const sorted = simpleColumnSortingByIndex([1, 4], 3)

      expect(sorted.length).toBe(3)
    })
  })
})
