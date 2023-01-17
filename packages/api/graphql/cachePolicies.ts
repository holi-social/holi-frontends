import { FieldPolicy, Reference } from '@apollo/client/cache'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeyArgs = FieldPolicy<any>['keyArgs']

/**
 * An index-aware pagination policy for Apollo Clients cache. An index-aware pagination function takes both offset and
 * limit arguments into account, whereas Apollos built-in offsetLimitPagination ignores the limit part. The resulting
 * issue (see also HOLI-2400) is that, given a cached query result of 5 items and a query with the same offset but 10
 * items, will result in no query being executed to fetch the missing 5 items.
 *
 * This implementation works by "remembering" individual items offsets and assuming a cache miss if any item requested
 * (any item within the range [offset, offset+limit]) is not present.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
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
