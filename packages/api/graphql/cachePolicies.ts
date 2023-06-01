import {
  FieldFunctionOptions,
  FieldMergeFunction,
  FieldPolicy,
  FieldReadFunction,
  Reference,
} from '@apollo/client/cache'

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

/**
 * An index-aware pagination policy for Apollo Clients cache. An index-aware pagination function takes both offset and
 * limit arguments into account, whereas Apollos built-in offsetLimitPagination ignores the limit part. The resulting
 * issue (see also HOLI-2400) is that, given a cached query result of 5 items and a query with the same offset but 10
 * items, will result in no query being executed to fetch the missing 5 items.
 *
 * This implementation works by "remembering" individual items offsets and assuming a cache miss if any item requested
 * (any item within the range [offset, offset+limit]) is not present.
 */
export function indexAwareOffsetLimitPagination<T = Reference>(keyArgs?: KeyArgs): FieldPolicy<T[]> {
  return {
    keyArgs,
    merge: (existing, incoming, options) => {
      const limit = options?.variables?.limit
      const offset = options?.variables?.offset
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
        const suffix = existing.slice(offset + limit)
        return prefix.concat(incoming.concat(suffix))
      } else {
        // existing and incoming are not overlapping -> fill with empty values in between
        const fill = Array(offset - existing.length).fill(null)
        return existing.concat(fill).concat(incoming)
      }
    },
    read: (existing, options) => {
      const limit = options?.variables?.limit
      const offset = options?.variables?.offset
      if (!existing || existing.length < offset + limit) {
        // cache miss if cache empty or existing contains fewer entries than requested
        return undefined
      } else if (existing.some((e) => e === null)) {
        // cache miss if cache is missing individual items
        return undefined
      } else {
        return existing
      }
    },
  }
}

/**
 * Uses different caching policies depending on the context as nesting
 * pagination policies does not seem to work*:
 *  - If the parent context is already using pagination itself (e.g. a list of
 *    spaces), we use the "always replace" policy for nested list fields (e.g.
 *    space members).
 *  - If the parent context does not use pagination, we can safely use a
 *    pagination policy for nested list fields (e.g. members of a space in its
 *    detail view).
 *
 * To determine if the parent context is using pagination, we check for
 * variables passed in `options` (e.g. the space detail page will provide `idOrName`).
 *
 * *: For reasons unknown, when fetching a second page of the parent entities
 * (using `fetchMore` in a `useQuery` hook, e.g. with offset 20), Apollo sets
 * of a second request starting with offset 0 in addition, does not return from
 * the `fetchMore` and does not update the cache.
 *
 * @param variablesAllowingPagination Variables indicating that we are in a context where we can use pagination.
 * @see indexAwareOffsetLimitPagination
 * @see alwaysReplacePolicy
 */
export function nestedPaginationPolicy<T = Reference>(
  variablesAllowingPagination: string[],
  keyArgs?: KeyArgs
): FieldPolicy {
  const canUsePagination = (options: FieldFunctionOptions) =>
    Object.keys(options.variables || {}).some((variable) => variablesAllowingPagination.includes(variable))
  const paginationPolicy = indexAwareOffsetLimitPagination<T>(keyArgs)
  return {
    ...paginationPolicy,
    merge: (existing, incoming, options) => {
      if (canUsePagination(options)) {
        return (paginationPolicy.merge as FieldMergeFunction)(existing, incoming, options) as FieldMergeFunction
      }
      return incoming
    },
    read: (existing, options) => {
      if (canUsePagination(options)) {
        return (paginationPolicy.read as FieldReadFunction)(existing, options)
      }
      return existing
    },
  }
}
