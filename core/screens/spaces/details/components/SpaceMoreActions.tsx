import { StoreObject, useMutation } from '@apollo/client'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import {
  UpdateSpaceUserConnectionResponse,
  updateSpaceUserConnectionMutation,
} from '@holi/core/screens/spaces/details/mutations'
import { Space, SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { Add, Check, Close } from '@holi/icons/src/generated'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import { useTheme } from '@holi/ui/styles/theme'

export type SpaceMoreActionsProps = {
  space: Space
}

const SpaceMoreActions: React.FC<SpaceMoreActionsProps> = ({ space }) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()
  const { theme } = useTheme()
  const { colors } = theme

  const isInvited = space.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBERSHIP_INVITEE)
  const isFollowing = space.connectionStatusToMyself?.includes(SpaceConnectionType.FOLLOWER)

  const [updateSpaceUserConnection, { loading }] = useMutation<UpdateSpaceUserConnectionResponse>(
    updateSpaceUserConnectionMutation,
    {
      variables: {
        spaceId: space.id,
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
        displayError(error, 'Failed to update space user connection', {
          location: 'SpaceMoreActions.updateSpaceUserConnection',
          spaceId: space.id,
        })
      },
    }
  )

  const sendFollowRequest = useCallback(() => {
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.CONNECT,
        connectionType: SpaceConnectionType.FOLLOWER,
      },
    })
  }, [updateSpaceUserConnection])

  const submitUnfollowRequest = useCallback(() => {
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.DISCONNECT,
        connectionType: SpaceConnectionType.FOLLOWER,
      },
    })
  }, [updateSpaceUserConnection])

  const approveConnectionRequest = useCallback(() => {
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.CONNECT,
        connectionType: SpaceConnectionType.MEMBERSHIP_INVITEE,
      },
      onCompleted() {
        openToast(t('spaces.invite.accept.success'), HoliToastType.SUCCESS)
      },
    })
  }, [openToast, t, updateSpaceUserConnection])

  const rejectConnectionRequest = useCallback(() => {
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.DISCONNECT,
        connectionType: SpaceConnectionType.MEMBERSHIP_INVITEE,
      },
      onCompleted() {
        openToast(t('spaces.invite.decline.success'), HoliToastType.SUCCESS)
      },
    })
  }, [openToast, t, updateSpaceUserConnection])

  if (!isInvited) {
    return null
  }

  return (
    <HoliActionDrawer.Drawer
      label={t('spaces.actions.more')}
      testID="space-more-actions-btn"
      buttonProps={{ transparent: false, variant: 'small', type: 'secondary' }}
      buttonElement={t('spaces.actions.more')}
    >
      <HoliActionDrawer.Action
        isLoading={loading}
        icon={Check}
        title={t('spaces.invite.btn.accept')}
        handleAction={approveConnectionRequest}
        iconColor={colors.brandColorC30}
      />
      <HoliActionDrawer.Action
        isLoading={loading}
        icon={Close}
        title={t('spaces.invite.btn.decline')}
        handleAction={rejectConnectionRequest}
        iconColor={colors.error20}
      />
      {!isFollowing && (
        <HoliActionDrawer.Action
          isLoading={loading}
          icon={Add}
          title={t('spaces.follow.btn.follow')}
          handleAction={sendFollowRequest}
        />
      )}
      {isFollowing && (
        <HoliActionDrawer.Action
          isLoading={loading}
          icon={Close}
          title={t('spaces.follow.btn.unfollow')}
          showConfirmation
        >
          <HoliActionDrawer.Confirmation
            title={t('spaces.follow.unfollow.confirm.headline', { spaceName: space.title })}
            description={t('spaces.follow.unfollow.confirm.text', { spaceName: space.title })}
            handleConfirmation={submitUnfollowRequest}
            hasDismissBtn
          />
        </HoliActionDrawer.Action>
      )}
    </HoliActionDrawer.Drawer>
  )
}

export default SpaceMoreActions
