import { useMutation } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import {
  UpdateSpaceUserConnectionResponse,
  updateSpaceUserConnectionMutation,
} from '@holi/core/screens/spaces/details/mutations'
import { Space, SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { Loader } from '@holi/icons/src/generated'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export type SpaceAcceptInvitationProps = {
  space: Space
}

const SpaceAcceptInvitation: React.VFC<SpaceAcceptInvitationProps> = ({ space }) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()

  const isInvited = space.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBERSHIP_INVITEE)

  const [updateSpaceUserConnection, { loading }] = useMutation<UpdateSpaceUserConnectionResponse>(
    updateSpaceUserConnectionMutation,
    {
      variables: {
        spaceId: space.id,
      },
      // refetchQueries does not work on unmounted components and leads to buggy behavior, consider explicit cache eviction as per https://github.com/apollographql/apollo-client/issues/5419#issuecomment-1242511457
      update: (cache) => {
        cache.evict({ id: 'ROOT_QUERY', fieldName: 'mySpaces' })
        cache.evict({ id: cache.identify(space) })
      },
      onError: (error) => {
        displayError(error, t('global.technicalError'))
      },
    }
  )
  const approveConnectionRequest = () => {
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.CONNECT,
        connectionType: SpaceConnectionType.MEMBERSHIP_INVITEE,
      },
      onCompleted() {
        openToast(t('spaces.invite.accept.success'), HoliToastType.SUCCESS)
      },
    })
  }

  return (
    <>
      {isInvited ? (
        <HoliButtonLoading
          iconSpinning={loading}
          disabled={loading}
          inline
          variant="small"
          label={t('spaces.invite.btn.accept')}
          onPress={approveConnectionRequest}
          icon={loading ? Loader : undefined}
        />
      ) : null}
    </>
  )
}

export default SpaceAcceptInvitation
