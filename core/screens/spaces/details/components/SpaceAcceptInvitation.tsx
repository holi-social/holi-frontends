import { type StoreObject, useMutation } from '@apollo/client'
import type React from 'react'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import {
  type UpdateSpaceUserConnectionResponse,
  updateSpaceUserConnectionMutation,
} from '@holi/core/screens/spaces/details/mutations'
import { type Space, SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'

export type SpaceAcceptInvitationProps = {
  space: Space
}

const SpaceAcceptInvitation: React.FC<SpaceAcceptInvitationProps> = ({ space }) => {
  const { t } = useTranslation()
  const { track } = useTracking()
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()

  const spaceId = space.id
  const isInvited = space.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBERSHIP_INVITEE)

  const [updateSpaceUserConnection] = useMutation<UpdateSpaceUserConnectionResponse>(
    updateSpaceUserConnectionMutation,
    {
      variables: {
        spaceId,
      },
      // refetchQueries does not work on unmounted components and leads to buggy behavior, consider explicit cache eviction as per https://github.com/apollographql/apollo-client/issues/5419#issuecomment-1242511457
      update: (cache) => {
        if (!('__typename' in space)) {
          console.error('Object is missing __typename attribute:', space) // eslint-disable-line no-console
        }
        cache.evict({ id: 'ROOT_QUERY', fieldName: 'mySpaces' })
        cache.evict({ id: cache.identify(space as unknown as StoreObject) })
      },
      onError: (error) => {
        displayError(error, 'Failed to accept space invitation', {
          location: 'SpaceAcceptInvitation.updateSpaceUserConnection',
          spaceId,
        })
      },
    }
  )
  const approveConnectionRequest = () =>
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.CONNECT,
        connectionType: SpaceConnectionType.MEMBERSHIP_INVITEE,
      },
      onCompleted() {
        openToast(t('spaces.invite.accept.success'), HoliToastType.SUCCESS)
        track(TrackingEvent.Spaces.RequestToJoin.accepted(spaceId))
      },
    })

  return isInvited ? (
    <HoliButtonLoading
      inline
      variant="small"
      label={t('spaces.invite.btn.accept')}
      onPress={approveConnectionRequest}
    />
  ) : null
}

export default SpaceAcceptInvitation
