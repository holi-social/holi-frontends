import { describe, expect, it } from '@jest/globals'

import { indexAwareOffsetLimitPagination, mergeIndexAwareOffsetLimitArray, pagedPolicy } from './cachePolicies'

const one = { id: 1, __ref: 'TestType' }
const oneOne = { id: 11, __ref: 'TestType' }
const two = { id: 2, __ref: 'TestType' }
const twoTwo = { id: 22, __ref: 'TestType' }
const three = { id: 3, __ref: 'TestType' }
const four = { id: 4, __ref: 'TestType' }
const five = { id: 5, __ref: 'TestType' }

describe('cachePolicies', () => {
  describe('mergeIndexAwareOffsetLimitArray', () => {
    it('should add new entries to empty cache', () => {
      const result = mergeIndexAwareOffsetLimitArray(undefined, [one, two], { variables: { offset: 0, limit: 2 } })
      expect(result).toStrictEqual([one, two])
    })

    it('should add new entries to non-empty cache', () => {
      const result = mergeIndexAwareOffsetLimitArray([one, two], [three, four], { variables: { offset: 2, limit: 2 } })
      expect(result).toStrictEqual([one, two, three, four])
    })

    it('should overwrite starting from offset 0 if offset is not given', () => {
      const result = mergeIndexAwareOffsetLimitArray([one, two], [three, four])
      expect(result).toStrictEqual([three, four])
    })

    it('should overwrite existing starting from offset 0 if offset and limit are not given', () => {
      // we assume all data was requested/returned so it should replace whatever was cached
      const result = mergeIndexAwareOffsetLimitArray([one, two, three], [four, five])
      expect(result).toStrictEqual([four, five])
    })

    it('should add new entries to non-empty cache (with empty slots)', () => {
      const result = mergeIndexAwareOffsetLimitArray([one, two], [four, five], { variables: { offset: 3, limit: 2 } })
      expect(result).toStrictEqual([one, two, null, four, five])
    })

    it('should concatenate if non-overlapping', () => {
      const result = mergeIndexAwareOffsetLimitArray([one, two], [one, two, three, four], {
        variables: { offset: 0, limit: 4 },
      })
      expect(result).toStrictEqual([one, two, three, four])
    })

    it('should update existing entries', () => {
      const result = mergeIndexAwareOffsetLimitArray([one, two], [oneOne, twoTwo], {
        variables: { offset: 0, limit: 2 },
      })
      expect(result).toStrictEqual([oneOne, twoTwo])
    })

    it('should update and concatenate', () => {
      const result = mergeIndexAwareOffsetLimitArray([one, two], [oneOne, twoTwo, three, four], {
        variables: { offset: 0, limit: 4 },
      })
      expect(result).toStrictEqual([oneOne, twoTwo, three, four])
    })

    it('should update at correct indices', () => {
      const result = mergeIndexAwareOffsetLimitArray([one, two, three, four, five], [oneOne, twoTwo], {
        variables: { offset: 2, limit: 2 },
      })
      expect(result).toStrictEqual([one, two, oneOne, twoTwo, five])
    })
  })

  describe('indexAwareOffsetLimitPagination.read', () => {
    const policy = indexAwareOffsetLimitPagination()

    it('should return miss for empty cache', () => {
      // @ts-ignore
      const result = policy.read(undefined, { variables: { offset: 0, limit: 2 } })
      expect(result).toStrictEqual(undefined)
    })

    it('should return hit if result is present', () => {
      // @ts-ignore
      const result = policy.read([one, two], { variables: { offset: 0, limit: 2 } })
      expect(result).toStrictEqual([one, two])
    })

    it('should return hit with all cached data (with offset + limit)', () => {
      // we want read to always return all cached data, otherwise fetchMore wouldn't work
      // @ts-ignore
      const result = policy.read([one, two, three, four, five], { variables: { offset: 0, limit: 2 } })
      expect(result).toStrictEqual([one, two, three, four, five])
    })

    it('should return hit with all cached data (without offset + limit)', () => {
      // we want read to always return all cached data, otherwise fetchMore wouldn't work
      // @ts-ignore
      const result = policy.read([one, two, three, four, five])
      expect(result).toStrictEqual([one, two, three, four, five])
    })

    it('should return miss if cache contains empty slots (not within requested range)', () => {
      // given that we always return all cached data, we shouldn't display lists with empty values
      // returning undefined results in Apollo Client executing a network query after which required data will be present
      // @ts-ignore
      const result = policy.read([one, two, null, four, five], { variables: { offset: 0, limit: 2 } })
      expect(result).toStrictEqual(undefined)
    })

    it('should return miss if cache contains empty slots (within requested range)', () => {
      // @ts-ignore
      const result = policy.read([one, two, null, four, five], { variables: { offset: 0, limit: 5 } })
      expect(result).toStrictEqual(undefined)
    })
  })

  describe('pagedPolicy.merge', () => {
    const policy = pagedPolicy()
    const partialPageResults = {
      totalResults: 5,
      data: [one, two],
    }
    const partialPageResultsOffset2 = {
      totalResults: 5,
      data: [three, four],
    }
    const partialPageResultsOffset3 = {
      totalResults: 5,
      data: [four, five],
    }
    const updatedPageResults = {
      totalResults: 5,
      data: [oneOne, twoTwo],
    }

    it('should add new entries to empty cache', () => {
      // @ts-ignore
      const result = policy.merge(undefined, partialPageResults, { variables: { offset: 0, limit: 2 } })
      expect(result).toStrictEqual(partialPageResults)
    })

    it('should add new entries to non-empty cache', () => {
      // @ts-ignore
      const result = policy.merge(partialPageResults, partialPageResultsOffset2, { variables: { offset: 2, limit: 2 } })
      expect(result).toStrictEqual({ totalResults: 5, data: [one, two, three, four] })
    })

    it('should overwrite starting from offset 0 if offset is not given', () => {
      // @ts-ignore
      const result = policy.merge(partialPageResults, partialPageResultsOffset2)
      expect(result).toStrictEqual(partialPageResultsOffset2)
    })

    it('should overwrite existing starting from offset 0 if offset and limit are not given', () => {
      // we assume all data was requested/returned so it should replace whatever was cached
      // @ts-ignore
      const result = policy.merge({ totalResults: 5, data: [one, two, three] }, partialPageResultsOffset3)
      expect(result).toStrictEqual(partialPageResultsOffset3)
    })

    it('should add new entries to non-empty cache (with empty slots)', () => {
      // @ts-ignore
      const result = policy.merge(partialPageResults, partialPageResultsOffset3, { variables: { offset: 3, limit: 2 } })
      expect(result).toStrictEqual({
        totalResults: 5,
        data: [one, two, null, four, five],
      })
    })

    it('should concatenate if non-overlapping', () => {
      // @ts-ignore
      const result = policy.merge(
        partialPageResults,
        { totalResults: 5, data: [one, two, three, four] },
        {
          variables: { offset: 0, limit: 4 },
        }
      )
      expect(result).toStrictEqual({ totalResults: 5, data: [one, two, three, four] })
    })

    it('should update existing entries', () => {
      // @ts-ignore
      const result = policy.merge(partialPageResults, updatedPageResults, { variables: { offset: 0, limit: 2 } })
      expect(result).toStrictEqual(updatedPageResults)
    })

    it('should update and concatenate', () => {
      const incoming = { totalResults: 5, data: [oneOne, twoTwo, three, four] }
      // @ts-ignore
      const result = policy.merge(partialPageResults, incoming, {
        variables: { offset: 0, limit: 4 },
      })
      expect(result).toStrictEqual(incoming)
    })

    it('should update at correct indices', () => {
      // @ts-ignore
      const result = policy.merge(
        {
          totalResults: 5,
          data: [one, two, three, four, five],
        },
        updatedPageResults,
        {
          variables: { offset: 2, limit: 2 },
        }
      )
      expect(result).toStrictEqual({ totalResults: 5, data: [one, two, oneOne, twoTwo, five] })
    })
  })

  describe('pagesPolicy.read', () => {
    const policy = pagedPolicy()
    const partialPageResults = {
      totalResults: 5,
      data: [one, two],
    }
    const fullPageResults = {
      totalResults: 5,
      data: [one, two, three, four, five],
    }
    const partiallyNullPageResults = {
      totalResults: 5,
      data: [one, two, null, four, five],
    }

    it('should return miss for empty cache', () => {
      // @ts-ignore
      const result = policy.read(undefined, { variables: { offset: 0, limit: 2 } })
      expect(result).toStrictEqual(undefined)
    })

    it('should return hit if result is present', () => {
      // @ts-ignore
      const result = policy.read(partialPageResults, { variables: { offset: 0, limit: 2 } })
      expect(result).toStrictEqual(partialPageResults)
    })

    it('should return hit with all cached data (with offset + limit)', () => {
      // we want read to always return all cached data, otherwise fetchMore wouldn't work
      // @ts-ignore
      const result = policy.read(fullPageResults, { variables: { offset: 0, limit: 2 } })
      expect(result).toStrictEqual(fullPageResults)
    })

    it('should return hit with all cached data (with offset + limit but less total results)', () => {
      // cached data is less than requested, but there are no more total results
      // @ts-ignore
      const result = policy.read(fullPageResults, { variables: { offset: 0, limit: 10 } })
      expect(result).toStrictEqual(fullPageResults)
    })

    it('should return hit with all cached data (without offset + limit)', () => {
      // we want read to always return all cached data, otherwise fetchMore wouldn't work
      // @ts-ignore
      const result = policy.read(fullPageResults)
      expect(result).toStrictEqual(fullPageResults)
    })

    it('should return miss if cache contains empty slots (not within requested range)', () => {
      // given that we always return all cached data, we shouldn't display lists with empty values
      // returning undefined results in Apollo Client executing a network query after which required data will be present
      // @ts-ignore
      const result = policy.read(partiallyNullPageResults, { variables: { offset: 0, limit: 2 } })
      expect(result).toStrictEqual(undefined)
    })

    it('should return miss if cache contains empty slots (within requested range)', () => {
      // @ts-ignore
      const result = policy.read(partiallyNullPageResults, { variables: { offset: 0, limit: 5 } })
      expect(result).toStrictEqual(undefined)
    })
  })
})
