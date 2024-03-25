import { FieldFunctionOptions, FieldPolicy, Reference } from '@apollo/client/cache'

import { Paged } from '@holi/core/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeyArgs = FieldPolicy<any>['keyArgs']

/**
 * Cache policy to always use the incoming data and replacing the existing.
 *
 * Fixes warnings like "Cache data may be lost when replacing the `members` field of a Space object."
 */
export const alwaysReplacePolicy: FieldPolicy = {
  keyArgs: [],
  merge: (existing, incoming) => incoming,
}

export function mergeIndexAwareOffsetLimitArray<T = Reference>(
  existing: readonly T[] | undefined,
  incoming: readonly T[],
  options: Partial<FieldFunctionOptions> = {}
): readonly T[] {
  const { offset = 0, limit = 0 } = options?.args || {}
  if (!existing) {
    // empty cache
    return incoming
  } else if (!offset && !limit) {
    // we assume that *all* entries were requested, so incoming "overwrites" existing
    return incoming
  } else if (!offset || offset === 0) {
    // limit was given, we assume offset = 0, so incoming entries partially overwrite existing ones
    return incoming.concat(existing.slice(incoming.length))
  } else if (existing.length >= offset + limit) {
    // within range of existing -> incoming overwrites at the correct indices
    const prefix = existing.slice(0, offset)
    const suffix = existing.slice(offset + incoming.length)
    return prefix.concat(incoming.concat(suffix))
  } else {
    // existing and incoming are not overlapping -> fill with empty values in between
    const fill = Array(Math.max(offset - existing?.length, 0)).fill(null)
    return existing.concat(fill).concat(incoming)
  }
}

export const keyArgsWithoutLimitAndOffset = (args: Record<string, unknown> | null) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { limit, offset, ...otherArgs } = args || {}
  return JSON.stringify(otherArgs)
}

/**
 * An index-aware pagination Apollo cache policy for cache items of type
 * Paged<T>.
 * The function takes `offset` and `limit` arguments into account as well as the
 * `totalResults` that can potentially be fetched.
 *
 * Apollos built-in offsetLimitPagination ignores the limit part. The
 * resulting issue (see also HOLI-2400) is that, given a cached query result of
 * 5 items and a query with the same offset but 10 items, will result in no
 * query being executed to fetch the missing 5 items.
 *
 * This implementation works by "remembering" individual items offsets and
 * assuming a cache miss if any item requested (any item within the range
 * [offset, offset+limit]) is not present and we are sure that the there are
 * more elements left to fetch (`totalResults >= offset + limit`, see
 * HOLI-6474).
 */
export function pagedPolicy<T = Reference>(keyArgs: KeyArgs = keyArgsWithoutLimitAndOffset): FieldPolicy<Paged<T>> {
  return {
    keyArgs,
    merge: (existing, incoming, options) => {
      return {
        ...incoming,
        data: (mergeIndexAwareOffsetLimitArray<T>(existing?.data, incoming.data, options) || []).slice(
          0,
          incoming.totalResults
        ),
      }
    },
    read: (existing, options) => {
      const { offset = 0, limit = 0 } = options?.args || {}
      const expectedResults = offset + limit
      if (!existing?.data || (existing.data.length < expectedResults && expectedResults <= existing?.totalResults)) {
        // cache miss if cache empty or existing contains fewer entries than requested and in total
        return undefined
      } else if (existing.data.some((e) => e === null)) {
        // cache miss if cache is missing individual items
        return undefined
      } else {
        return existing
      }
    },
  }
}
