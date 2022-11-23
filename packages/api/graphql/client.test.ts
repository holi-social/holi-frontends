import { expect, test } from '@jest/globals'

import { indexAwareOffsetLimitPagination } from './client'

const one = { id: 1, __ref: 'TestType' }
const two = { id: 2, __ref: 'TestType' }
const three = { id: 3, __ref: 'TestType' }
const four = { id: 4, __ref: 'TestType' }
const five = { id: 5, __ref: 'TestType' }

test('merge adds new entries to empty cache', () => {
  const policy = indexAwareOffsetLimitPagination([])
  const result = policy.merge(undefined, [one, two], { variables: { offset: 0, limit: 2 } })
  expect(result).toStrictEqual([one, two])
})

test('merge adds new entries to non-empty cache', () => {
  const policy = indexAwareOffsetLimitPagination([])
  const result = policy.merge([one, two], [three, four], { variables: { offset: 2, limit: 2 } })
  expect(result).toStrictEqual([one, two, three, four])
})

test('merge adds new entries to non-empty cache (with empty slots)', () => {
  const policy = indexAwareOffsetLimitPagination([])
  const result = policy.merge([one, two], [four, five], { variables: { offset: 3, limit: 2 } })
  expect(result).toStrictEqual([one, two, null, four, five])
})

test('read returns miss for empty cache', () => {
  const policy = indexAwareOffsetLimitPagination([])
  const result = policy.read(undefined, { variables: { offset: 0, limit: 2 } })
  expect(result).toStrictEqual(undefined)
})

test('read returns hit if result is present', () => {
  const policy = indexAwareOffsetLimitPagination([])
  const result = policy.read([one, two], { variables: { offset: 0, limit: 2 } })
  expect(result).toStrictEqual([one, two])
})

test('read returns hit with all cached data', () => {
  // we want read to always return all cached data, otherwise fetchMore wouldn't work
  const policy = indexAwareOffsetLimitPagination([])
  const result = policy.read([one, two, three, four, five], { variables: { offset: 0, limit: 2 } })
  expect(result).toStrictEqual([one, two, three, four, five])
})

test('read returns miss if cache contains empty slots (not within requested range)', () => {
  // given that we always return all cached data, we shouldn't display lists with empty values
  // returning undefined results in Apollo Client executing a network query after which required data will be present
  const policy = indexAwareOffsetLimitPagination([])
  const result = policy.read([one, two, null, four, five], { variables: { offset: 0, limit: 2 } })
  expect(result).toStrictEqual(undefined)
})

test('read returns miss if cache contains empty slots (within requested range)', () => {
  const policy = indexAwareOffsetLimitPagination([])
  const result = policy.read([one, two, null, four, five], { variables: { offset: 0, limit: 5 } })
  expect(result).toStrictEqual(undefined)
})
