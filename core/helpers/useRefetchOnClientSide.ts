import { DocumentNode, QueryHookOptions, useApolloClient } from '@apollo/client'
import { useEffect, useState } from 'react'
import { Platform } from 'react-native'

import { useLoginState } from '@holi/core/auth/loginState'

interface UseRefetchOnClientSideHookArgs {
  query: DocumentNode
  options?: QueryHookOptions
  condition?: boolean
}

export const useRefetchOnClientSide = ({
  query,
  options,
  condition = true,
}: UseRefetchOnClientSideHookArgs): boolean => {
  const [isLoading, setIsLoading] = useState(false)
  const client = useApolloClient()

  useEffect(() => {
    if (condition) {
      setIsLoading(true)
      client
        .refetchQueries({
          include: [query].filter((q) => q !== undefined),
          ...options,
        })
        .finally(() => setIsLoading(false))
    }

    // do only when condition changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition])

  return isLoading
}

export const useRefetchOnClientSideForLoggedInWebUser = (query: DocumentNode, options?: QueryHookOptions): boolean => {
  const { isLoggedIn } = useLoginState()
  const isWeb = Platform.OS === 'web'

  return useRefetchOnClientSide({ condition: isWeb && isLoggedIn, query, options })
}
