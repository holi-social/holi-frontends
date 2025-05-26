import { describe, expect, it } from '@jest/globals'

import {
  keyArgsWithoutLimitAndOffset,
  keyArgsWithoutMultiSearchPageInfo,
  mergeArraysByLimitAndOffset,
  multiSearchPagedPolicy,
  pagedPolicy,
} from '@holi/api/graphql/cachePolicies'
import type { KeyArgsFunction } from '@apollo/client/cache/inmemory/policies'

const one = { id: 1, __ref: 'TestType' }
const oneOne = { id: 11, __ref: 'TestType' }
const two = { id: 2, __ref: 'TestType' }
const twoTwo = { id: 22, __ref: 'TestType' }
const three = { id: 3, __ref: 'TestType' }
const four = { id: 4, __ref: 'TestType' }
const five = { id: 5, __ref: 'TestType' }

describe('cachePolicies', () => {
  describe('mergeArraysByLimitAndOffset', () => {
    it('should add new entries to empty cache', () => {
      const result = mergeArraysByLimitAndOffset({ existing: undefined, incoming: [one, two], offset: 0, limit: 2 })
      expect(result).toStrictEqual([one, two])
    })

    it('should add new entries to non-empty cache', () => {
      const result = mergeArraysByLimitAndOffset({ existing: [one, two], incoming: [three, four], offset: 2, limit: 2 })
      expect(result).toStrictEqual([one, two, three, four])
    })

    it('should overwrite starting from offset 0 if offset is not given', () => {
      const result = mergeArraysByLimitAndOffset({ existing: [one, two], incoming: [three, four] })
      expect(result).toStrictEqual([three, four])
    })

    it('should overwrite existing starting from offset 0 if offset and limit are not given', () => {
      // we assume all data was requested/returned so it should replace whatever was cached
      const result = mergeArraysByLimitAndOffset({ existing: [one, two, three], incoming: [four, five] })
      expect(result).toStrictEqual([four, five])
    })

    it('should add new entries to non-empty cache (with empty slots)', () => {
      const result = mergeArraysByLimitAndOffset({ existing: [one, two], incoming: [four, five], offset: 3, limit: 2 })
      expect(result).toStrictEqual([one, two, null, four, five])
    })

    it('should concatenate if non-overlapping', () => {
      const result = mergeArraysByLimitAndOffset({
        existing: [one, two],
        incoming: [one, two, three, four],
        offset: 0,
        limit: 4,
      })
      expect(result).toStrictEqual([one, two, three, four])
    })

    it('should update existing entries', () => {
      const result = mergeArraysByLimitAndOffset({
        existing: [one, two],
        incoming: [oneOne, twoTwo],
        offset: 0,
        limit: 2,
      })
      expect(result).toStrictEqual([oneOne, twoTwo])
    })

    it('should update and concatenate', () => {
      const result = mergeArraysByLimitAndOffset({
        existing: [one, two],
        incoming: [oneOne, twoTwo, three, four],
        offset: 0,
        limit: 4,
      })
      expect(result).toStrictEqual([oneOne, twoTwo, three, four])
    })

    it('should update at correct indices', () => {
      const result = mergeArraysByLimitAndOffset({
        existing: [one, two, three, four, five],
        incoming: [oneOne, twoTwo],
        offset: 2,
        limit: 2,
      })
      expect(result).toStrictEqual([one, two, oneOne, twoTwo, five])
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
      const result = policy.merge(undefined, partialPageResults, { args: { offset: 0, limit: 2 } })
      expect(result).toStrictEqual(partialPageResults)
    })

    it('should add new entries to non-empty cache', () => {
      // @ts-ignore
      const result = policy.merge(partialPageResults, partialPageResultsOffset2, { args: { offset: 2, limit: 2 } })
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
      const result = policy.merge(partialPageResults, partialPageResultsOffset3, { args: { offset: 3, limit: 2 } })
      expect(result).toStrictEqual({
        totalResults: 5,
        data: [one, two, null, four, five],
      })
    })

    it('should concatenate if non-overlapping', () => {
      // @ts-ignore
      const result = policy.merge(
        partialPageResults,
        { totalResults: 5, data: [three, four] },
        {
          args: { offset: 2, limit: 4 },
        }
      )
      expect(result).toStrictEqual({ totalResults: 5, data: [one, two, three, four] })
    })

    it('should update existing entries', () => {
      // @ts-ignore
      const result = policy.merge(partialPageResults, updatedPageResults, { args: { offset: 0, limit: 2 } })
      expect(result).toStrictEqual(updatedPageResults)
    })

    it('should update and concatenate', () => {
      const incoming = { totalResults: 5, data: [oneOne, twoTwo, three, four] }
      // @ts-ignore
      const result = policy.merge(partialPageResults, incoming, {
        args: { offset: 0, limit: 4 },
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
          args: { offset: 2, limit: 2 },
        }
      )
      expect(result).toStrictEqual({ totalResults: 5, data: [one, two, oneOne, twoTwo, five] })
    })

    it('should replace list if it was shortened', () => {
      const existing = { totalResults: 4, data: [one, two, three, four] }
      const incoming = { totalResults: 3, data: [one, two, three] }
      // @ts-ignore
      const result = policy.merge(existing, incoming, {
        args: { offset: 0, limit: 4 },
      })
      expect(result).toStrictEqual(incoming)
    })

    it('should replace with offset if list was shortened', () => {
      const existing = { totalResults: 4, data: [one, two, three, four] }
      const incoming = { totalResults: 3, data: [three] }
      const expected = { totalResults: 3, data: [one, two, three] }
      // @ts-ignore
      const result = policy.merge(existing, incoming, {
        args: { offset: 2, limit: 4 },
      })
      expect(result).toStrictEqual(expected)
    })
  })

  describe('pagedPolicy.read', () => {
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
      const result = policy.read(undefined, { args: { offset: 0, limit: 2 } })
      expect(result).toStrictEqual(undefined)
    })

    it('should return hit if result is present', () => {
      // @ts-ignore
      const result = policy.read(partialPageResults, { args: { offset: 0, limit: 2 } })
      expect(result).toStrictEqual(partialPageResults)
    })

    it('should return hit with all cached data (with offset + limit)', () => {
      // we want read to always return all cached data, otherwise fetchMore wouldn't work
      // @ts-ignore
      const result = policy.read(fullPageResults, { args: { offset: 0, limit: 2 } })
      expect(result).toStrictEqual(fullPageResults)
    })

    it('should return hit with all cached data (with offset + limit but less total results)', () => {
      // cached data is less than requested, but there are no more total results
      // @ts-ignore
      const result = policy.read(fullPageResults, { args: { offset: 0, limit: 10 } })
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
      const result = policy.read(partiallyNullPageResults, { args: { offset: 0, limit: 2 } })
      expect(result).toStrictEqual(undefined)
    })

    it('should return miss if cache contains empty slots (within requested range)', () => {
      // @ts-ignore
      const result = policy.read(partiallyNullPageResults, { args: { offset: 0, limit: 5 } })
      expect(result).toStrictEqual(undefined)
    })
  })

  describe('keyArgsWithoutLimitAndOffset', () => {
    it('should include all args except limit and offset', () => {
      expect(keyArgsWithoutLimitAndOffset({ limit: 10, offset: 0 })).toEqual('{}')
      expect(keyArgsWithoutLimitAndOffset({ limit: 10, offset: 0, location: 'Hamburg', spaceId: '123' })).toEqual(
        '{"location":"Hamburg","spaceId":"123"}'
      )
    })
  })

  describe('keyArgsWithoutMultiSearchPageInfo', () => {
    const testData: { context: Partial<Parameters<KeyArgsFunction>[1]>; expectedKey: string }[] = [
      {
        context: {},
        expectedKey: '[]',
      },
      {
        context: { variables: { input: { searches: [] } } },
        expectedKey: '[]',
      },
      {
        context: {
          variables: {
            input: {
              searches: [
                { page: 1, per_page: 10 },
                { page: 2, per_page: 5 },
              ],
            },
          },
        },
        expectedKey: '[{},{}]',
      },
      {
        context: {
          variables: {
            input: {
              searches: [
                { q: '*', filter_by: 'type:=volunteering', page: 1, per_page: 10 },
                { q: 'query', query_by: 'title_de', page: 2, per_page: 5 },
              ],
            },
          },
        },
        expectedKey: JSON.stringify([
          { q: '*', filter_by: 'type:=volunteering' },
          { q: 'query', query_by: 'title_de' },
        ]),
      },
    ]
    it.each(testData)('should create key $expectedKey for $context', ({ context, expectedKey }) => {
      expect(
        keyArgsWithoutMultiSearchPageInfo(
          {},
          {
            typename: '',
            fieldName: '',
            field: null,
            ...context,
          }
        )
      ).toEqual(expectedKey)
    })
  })

  describe('multiSearchPagedPolicy.write', () => {
    const policy = multiSearchPagedPolicy()
    const options = { variables: { input: { searches: [{ page: 2, per_page: 5 }] } } }
    const successResponse = {
      hits: [{}, {}, {}, {}, {}],
      found: 10,
    }
    const errorResponse = {
      error: 'Test',
      code: 123,
    }
    const mergedSuccessResponses = {
      hits: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      found: 10,
    }

    it('should return incoming if cache is empty', () => {
      // @ts-ignore
      const result = policy.merge(undefined, [successResponse], options)
      expect(result).toEqual([successResponse])
    })

    it('should return incoming if cache contains fewer entries than requested partial searches', () => {
      // @ts-ignore
      const result = policy.merge([], [successResponse], options)
      expect(result).toEqual([successResponse])
    })

    it('should return existing entries for a parial search if an error response is incoming', () => {
      // @ts-ignore
      const result = policy.merge([successResponse], [errorResponse], options)
      expect(result).toEqual([successResponse])
    })

    it('should return incoming entries if cache contains an error response for a partial search', () => {
      // @ts-ignore
      const result = policy.merge([errorResponse], [successResponse], options)
      expect(result).toEqual([successResponse])
    })

    it('should return merged entries if nothing is missing', () => {
      // @ts-ignore
      const result = policy.merge([successResponse], [successResponse], options)
      expect(result).toEqual([mergedSuccessResponses])
    })

    it('should return multiple merged entries if nothing is missing for a list of searches', () => {
      // @ts-ignore
      const result = policy.merge([successResponse, successResponse], [successResponse, successResponse], {
        variables: {
          input: {
            searches: [
              { page: 2, per_page: 5 },
              { page: 2, per_page: 5 },
            ],
          },
        },
      })
      expect(result).toEqual([mergedSuccessResponses, mergedSuccessResponses])
    })
  })

  describe('multiSearchPagedPolicy.read', () => {
    const policy = multiSearchPagedPolicy()
    const emptySearchOptions = {
      variables: {
        input: { searches: [{}] },
      },
    }

    it('should return miss if cache is empty', () => {
      // @ts-ignore
      const result = policy.read(undefined, {})
      expect(result).toBeUndefined()
    })

    it('should return miss if cache contains fewer entries than requested partial searches', () => {
      // @ts-ignore
      const result = policy.read([], emptySearchOptions)
      expect(result).toBeUndefined()
    })

    it('should return miss if cache is empty for a partial search', () => {
      // @ts-ignore
      const result = policy.read([undefined], emptySearchOptions)
      expect(result).toBeUndefined()
    })

    it('should return miss if cache contains error response for a partial search', () => {
      // @ts-ignore
      const result = policy.read([{ error: 'Test', code: 123 }], emptySearchOptions)
      expect(result).toBeUndefined()
    })

    it('should return miss if cache contains fewer entries for a partial search', () => {
      const options = {
        variables: { input: { searches: [{ page: 1, per_page: 10 }] } },
      }
      // @ts-ignore
      const result = policy.read([{ hits: [{}, {}, {}], found: 10 }], options)
      expect(result).toBeUndefined()
    })

    it('should return cache contents if nothing is missing', () => {
      const existing = [{ hits: [{}, {}, {}], found: 3 }]
      const options = {
        variables: { input: { searches: [{ page: 1, per_page: 10 }] } },
      }
      // @ts-ignore
      const result = policy.read(existing, options)
      expect(result).toEqual(existing)
    })
  })
})
