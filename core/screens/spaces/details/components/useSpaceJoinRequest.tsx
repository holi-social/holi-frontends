import type { StoreObject } from '@apollo/client'
import { useApolloClient } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import type { Space } from '@holi/api/graphql/graphql-codegen'
import {
  UpdateConnectionAction,
  SpaceUserConnectionType,
  useUpdateSpaceUserConnectionMutation,
} from '@holi/api/graphql/graphql-codegen'

export const useSpaceJoinRequest = (space: Space, showJoinOverlay: () => void, message?: string) => {
  const { isLoggedIn } = useLoggedInUser()
  const { openSignupModal } = useSignupModal()
  const { displayError } = useErrorHandling()
  const { t } = useTranslation()
  const client = useApolloClient()

  const [updateSpaceUserConnection, { loading }] = useUpdateSpaceUserConnectionMutation({
    // refetchQueries does not work on unmounted components and leads to buggy behavior, consider explicit cache eviction as per https://github.com/apollographql/apollo-client/issues/5419#issuecomment-1242511457
    update: (cache) => {
      cache.evict({ id: 'ROOT_QUERY', fieldName: 'mySpaces' })
    },
    onCompleted() {
      showJoinOverlay()
    },
    onError(error) {
      if (!('__typename' in space)) {
        console.error('Object is missing __typename attribute:', space) // eslint-disable-line no-console
      }
      client.cache.evict({ id: client.cache.identify(space as unknown as StoreObject) })
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
  })

  const submitJoinRequest = async () => {
    if (!isLoggedIn) {
      return openSignupModal({
        description: t('spaces.join.loginRedirect.text', { spaceName: space.title }),
        trackTrigger: 'JOIN_SPACE',
      })
    }
    return updateSpaceUserConnection({
      variables: {
        connectAction: UpdateConnectionAction.Connect,
        connectionType: SpaceUserConnectionType.MembershipRequestor,
        message: message === '' ? undefined : message,
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
