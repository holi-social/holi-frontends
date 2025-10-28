import { useMutation } from '@apollo/client/react'

import { anonCountQuery } from '@holi/core/domain/shared/queries'
import { useCallback } from 'react'
import { getLogger } from '@holi/core/helpers/logging'
import type { MutationAnonCountArgs } from '@holi/api/graphql/graphql-codegen'

export type AnonCountFn = (counterName: string) => void

const logger = getLogger('Tracking')

/**
 * Hook returning a function to call the `anonCount` API. Guaranteed to not throw, i.e. intentionally ignores any errors
 * that might occur on server- or client-side. Anonymous counts are intended to be (non-reliable) side effects of user
 * interactions.
 */
export const useAnonCount: () => AnonCountFn = () => {
  const [anonCount] = useMutation<void, MutationAnonCountArgs>(anonCountQuery)
  return useCallback(
    (counterName: string): void => {
      logger.debug('anonCount', counterName)
      // noinspection JSIgnoredPromiseFromCall
      anonCount({
        variables: {
          counterName,
        },
      })
    },
    [anonCount]
  )
}
