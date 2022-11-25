import { describe, expect, it } from '@jest/globals'

import { indexAwareOffsetLimitPagination } from './cachePolicies'

const one = { id: 1, __ref: 'TestType' }
const oneOne = { id: 11, __ref: 'TestType' }
const two = { id: 2, __ref: 'TestType' }
const twoTwo = { id: 22, __ref: 'TestType' }
const three = { id: 3, __ref: 'TestType' }
const four = { id: 4, __ref: 'TestType' }
const five = { id: 5, __ref: 'TestType' }

describe('indexAwareOffsetLimitPagination.merge', () => {
  it('should add new entries to empty cache', () => {
    const policy = indexAwareOffsetLimitPagination([])
    const result = policy.merge(undefined, [one, two], { variables: { offset: 0, limit: 2 } })
    expect(result).toStrictEqual([one, two])
  })

  it('should add new entries to non-empty cache', () => {
    const policy = indexAwareOffsetLimitPagination([])
    const result = policy.merge([one, two], [three, four], { variables: { offset: 2, limit: 2 } })
    expect(result).toStrictEqual([one, two, three, four])
  })

  it('should overwrite starting from offset 0 if offset is not given', () => {
    const policy = indexAwareOffsetLimitPagination([])
    const result = policy.merge([one, two], [three, four])
    expect(result).toStrictEqual([three, four])
  })

  it('should overwrite existing starting from offset 0 if offset and limit are not given', () => {
    // we assume all data was requested/returned so it should replace whatever was cached
    const policy = indexAwareOffsetLimitPagination([])
    const result = policy.merge([one, two, three], [four, five])
    expect(result).toStrictEqual([four, five])
  })

  it('should add new entries to non-empty cache (with empty slots)', () => {
    const policy = indexAwareOffsetLimitPagination([])
    const result = policy.merge([one, two], [four, five], { variables: { offset: 3, limit: 2 } })
    expect(result).toStrictEqual([one, two, null, four, five])
  })

  it('should concatenate if non-overlapping', () => {
    const policy = indexAwareOffsetLimitPagination([])
    const result = policy.merge([one, two], [one, two, three, four], { variables: { offset: 0, limit: 4 } })
    expect(result).toStrictEqual([one, two, three, four])
  })

  it('should update existing entries', () => {
    const policy = indexAwareOffsetLimitPagination([])
    const result = policy.merge([one, two], [oneOne, twoTwo], { variables: { offset: 0, limit: 2 } })
    expect(result).toStrictEqual([oneOne, twoTwo])
  })

  it('should update and concatenate', () => {
    const policy = indexAwareOffsetLimitPagination([])
    const result = policy.merge([one, two], [oneOne, twoTwo, three, four], { variables: { offset: 0, limit: 4 } })
    expect(result).toStrictEqual([oneOne, twoTwo, three, four])
  })

  it('should update at correct indices', () => {
    const policy = indexAwareOffsetLimitPagination([])
    const result = policy.merge([one, two, three, four, five], [oneOne, twoTwo], { variables: { offset: 2, limit: 2 } })
    expect(result).toStrictEqual([one, two, oneOne, twoTwo, five])
  })
})

describe('indexAwareOffsetLimitPagination.read', () => {
  it('should return miss for empty cache', () => {
    const policy = indexAwareOffsetLimitPagination([])
    const result = policy.read(undefined, { variables: { offset: 0, limit: 2 } })
    expect(result).toStrictEqual(undefined)
  })

  it('should return hit if result is present', () => {
    const policy = indexAwareOffsetLimitPagination([])
    const result = policy.read([one, two], { variables: { offset: 0, limit: 2 } })
    expect(result).toStrictEqual([one, two])
  })

  it('should return hit with all cached data (with offset + limit)', () => {
    // we want read to always return all cached data, otherwise fetchMore wouldn't work
    const policy = indexAwareOffsetLimitPagination([])
    const result = policy.read([one, two, three, four, five], { variables: { offset: 0, limit: 2 } })
    expect(result).toStrictEqual([one, two, three, four, five])
  })

  it('should return hit with all cached data (without offset + limit)', () => {
    // we want read to always return all cached data, otherwise fetchMore wouldn't work
    const policy = indexAwareOffsetLimitPagination([])
    const result = policy.read([one, two, three, four, five])
    expect(result).toStrictEqual([one, two, three, four, five])
  })

  it('should return miss if cache contains empty slots (not within requested range)', () => {
    // given that we always return all cached data, we shouldn't display lists with empty values
    // returning undefined results in Apollo Client executing a network query after which required data will be present
    const policy = indexAwareOffsetLimitPagination([])
    const result = policy.read([one, two, null, four, five], { variables: { offset: 0, limit: 2 } })
    expect(result).toStrictEqual(undefined)
  })

  it('should return miss if cache contains empty slots (within requested range)', () => {
    const policy = indexAwareOffsetLimitPagination([])
    const result = policy.read([one, two, null, four, five], { variables: { offset: 0, limit: 5 } })
    expect(result).toStrictEqual(undefined)
  })
})
