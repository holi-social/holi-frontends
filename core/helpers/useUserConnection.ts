import { useMutation } from '@apollo/client'
import { useCallback } from 'react'

import {
  UpdateConnectionWithUserResponse,
  updateConnectionWithUserMutation,
} from '@holi/core/screens/userprofile/queries'
import { UpdateConnectionWithUserActions } from '@holi/core/screens/userprofile/types'

export const useUserConnection = () => {
  const [updateConnectionWithUser, { loading, error }] = useMutation<UpdateConnectionWithUserResponse>(
    updateConnectionWithUserMutation
  )

  const updateUserConnectionStatus = useCallback(
    (action: UpdateConnectionWithUserActions, userId: string) =>
      updateConnectionWithUser({
        variables: {
          input: {
            userId,
            action,
          },
        },
      }),
    [updateConnectionWithUser]
  )

  const connect = useCallback(
    (userId: string) => updateUserConnectionStatus(UpdateConnectionWithUserActions.CONNECT, userId),
    [updateUserConnectionStatus]
  )

  const disconnect = useCallback(
    (userId: string) => updateUserConnectionStatus(UpdateConnectionWithUserActions.DISCONNECT, userId),
    [updateUserConnectionStatus]
  )

  return {
    connect,
    disconnect,
    loading,
    error,
  }
}
