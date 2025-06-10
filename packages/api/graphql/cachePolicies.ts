import type { FieldFunctionOptions, FieldPolicy, Reference } from '@apollo/client/cache'
import type { KeyArgsFunction } from '@apollo/client/cache/inmemory/policies'
import type {
  Typesense_MultiSearchQueryVariables,
  Typesense_SearchResponse,
  Typesense_SearchResponseHit,
  Typesense_SearchResponseSuccess,
} from '@holi/api/graphql/graphql-codegen'

import type { Paged } from '@holi/core/types'

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

export function mergeArraysByLimitAndOffset<T = Reference>({
  existing,
  incoming,
  offset = 0,
  limit = 0,
}: {
  existing: readonly T[] | undefined
  incoming: readonly T[]
  offset?: number
  limit?: number
}): readonly T[] {
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

function mergeIndexAwareOffsetLimitArray<T = Reference>(
  existing: readonly T[] | undefined,
  incoming: readonly T[],
  options: Partial<FieldFunctionOptions> = {}
): readonly T[] {
  const { offset = 0, limit = 0 } = options?.args || {}
  return mergeArraysByLimitAndOffset({ existing, incoming, offset, limit })
}

export const keyArgsWithoutLimitAndOffset = (args: Record<string, unknown> | null) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { limit, offset, ...otherArgs } = args || {}
  return JSON.stringify(otherArgs)
}

export const keyArgsWithoutTypesenseMultiSearchPageInfo = (
  args: Record<string, unknown> | null,
  context: Parameters<KeyArgsFunction>[1]
) => {
  const { searches } = context.variables?.input || {}
  if (!Array.isArray(searches)) {
    return JSON.stringify([])
  }
  const filteredSearches = searches.map((searchParams) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page, per_page, ...otherArgs } = searchParams
    return otherArgs
  })
  return JSON.stringify(filteredSearches)
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

export function typesenseMultiSearchPagedPolicy(
  keyArgs: KeyArgs = keyArgsWithoutTypesenseMultiSearchPageInfo
): FieldPolicy<(Typesense_SearchResponse | undefined)[]> {
  return {
    keyArgs,
    merge: (existing, incoming, options) => {
      const searches: NonNullable<Typesense_MultiSearchQueryVariables['input']['searches']> =
        options?.variables?.input?.searches ?? []
      if (!existing || existing.length < searches.length) {
        return incoming
      }
      return searches.map((params, index) => {
        const { page = 1, per_page = 0 } = params
        const offset = Math.max((page - 1) * per_page, 0)
        const limit = page * per_page
        const existingForSearch: Typesense_SearchResponse | undefined = existing[index]
        const incomingForSearch = incoming[index]
        if (!incomingForSearch || !('hits' in incomingForSearch)) {
          return existingForSearch
        }
        if (!existingForSearch || !('hits' in existingForSearch)) {
          return incomingForSearch
        }
        return {
          ...incomingForSearch,
          hits: mergeArraysByLimitAndOffset({
            existing: existingForSearch.hits,
            incoming: incomingForSearch.hits as readonly Typesense_SearchResponseHit[],
            offset,
            limit,
          }) as Typesense_SearchResponseHit[],
        }
      })
    },
    read: (existing, options) => {
      const searches: NonNullable<Typesense_MultiSearchQueryVariables['input']['searches']> =
        options?.variables?.input?.searches ?? []
      if (!existing || existing.length < searches?.length) {
        return undefined
      }
      const results: (Typesense_SearchResponse | undefined)[] = searches.map<Typesense_SearchResponse | undefined>(
        (params, index) => {
          const { page = 1, per_page = 0 } = params
          const expectedResults = page * per_page
          const existingForSearch = existing[index]
          if (
            !existingForSearch ||
            !('hits' in existingForSearch) ||
            ((existingForSearch?.hits?.length ?? 0) < expectedResults && expectedResults <= existingForSearch?.found)
          ) {
            // cache miss if cache empty, error response or existing contains fewer entries than requested and in total
            return undefined
          }
          return existingForSearch
        }
      )
      if (!results || results.some((result) => !result)) {
        return undefined
      }
      return results as Typesense_SearchResponseSuccess[]
    },
  }
}
