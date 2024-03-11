import { ApolloError, useMutation } from '@apollo/client'
import { useApolloClient } from '@apollo/client'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import {
  UpdateSpaceUserConnectionResponse,
  updateSpaceUserConnectionMutation,
} from '@holi/core/screens/spaces/details/mutations'
import { Space, SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'

export interface UseSpaceJoinRequestProps {
  loading?: boolean
  error?: ApolloError
  submitJoinRequest: () => void
  updateSpaceUserConnection: (variables: object) => void
}

export const useSpaceJoinRequest = (
  space: Space,
  showJoinOverlay: () => void,
  message?: string
): UseSpaceJoinRequestProps => {
  const { isLoggedIn } = useLoggedInUser()
  const { openLoginModal } = useLoginModal()
  const { displayError } = useErrorHandling()
  const { t } = useTranslation()
  const client = useApolloClient()

  const [updateSpaceUserConnection, { loading }] = useMutation<UpdateSpaceUserConnectionResponse>(
    updateSpaceUserConnectionMutation,
    {
      // refetchQueries does not work on unmounted components and leads to buggy behavior, consider explicit cache eviction as per https://github.com/apollographql/apollo-client/issues/5419#issuecomment-1242511457
      update: (cache) => {
        cache.evict({ id: 'ROOT_QUERY', fieldName: 'mySpaces' })
      },
      onCompleted() {
        showJoinOverlay()
      },
      onError(error) {
        client.cache.evict({ id: client.cache.identify(space) })
        const context = {
          location: 'useSpaceJoinRequest.updateSpaceUserConnection',
          spaceId: space.id,
        }

        if (error.message.includes('Not requested to join community')) {
          displayError(error, 'Failed to request space membership as it was already handled', {
            displayMessage: t('spaces.join.error.already-revoked'),
            ...context,
          })
        } else {
          displayError(error, 'Failed to request space membership', {
            displayMessage: t('spaces.join.error'),
            ...context,
          })
        }
      },
    }
  )

  const submitJoinRequest = () => {
    if (!isLoggedIn) {
      return openLoginModal({
        description: t('spaces.join.loginRedirect.text', { spaceName: space.title }),
      })
    }
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.CONNECT,
        connectionType: SpaceConnectionType.MEMBERSHIP_REQUESTOR,
        message: message === '' ? null : message,
        spaceId: space.id,
      },
    })
  }

  return {
    loading,
    submitJoinRequest,
    updateSpaceUserConnection,
  }
}
