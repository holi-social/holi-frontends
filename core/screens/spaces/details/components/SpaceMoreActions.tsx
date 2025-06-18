import type { StoreObject } from '@apollo/client'
import type React from 'react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { Add, Check, Close } from '@holi/icons/src/generated'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import { useTheme } from '@holi/ui/styles/theme'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import {
  type Space,
  SpaceUserConnectionType,
  UpdateConnectionAction,
  useUpdateSpaceUserConnectionMutation,
} from '@holi/api/graphql/graphql-codegen'

export type SpaceMoreActionsProps = {
  space: Space
}

const SpaceMoreActions: React.FC<SpaceMoreActionsProps> = ({ space }) => {
  const { t } = useTranslation()
  const { track } = useTracking()
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()
  const { theme } = useTheme()
  const { colors } = theme

  const isInvited = space.connectionStatusToMyself?.includes(SpaceUserConnectionType.MembershipInvitee)
  const isFollowing = space.connectionStatusToMyself?.includes(SpaceUserConnectionType.Follower)

  const [updateSpaceUserConnection, { loading }] = useUpdateSpaceUserConnectionMutation({
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
  })

  const followSpace = useCallback(() => {
    updateSpaceUserConnection({
      variables: {
        spaceId: space.id,
        connectAction: UpdateConnectionAction.Connect,
        connectionType: SpaceUserConnectionType.Follower,
      },
      onCompleted: () => track(TrackingEvent.Spaces.User.followed(space.id)),
    })
  }, [space.id, track, updateSpaceUserConnection])

  const unfollowSpace = useCallback(() => {
    updateSpaceUserConnection({
      variables: {
        spaceId: space.id,
        connectAction: UpdateConnectionAction.Disconnect,
        connectionType: SpaceUserConnectionType.Follower,
      },
      onCompleted: () => track(TrackingEvent.Spaces.User.unfollowed(space.id)),
    })
  }, [space.id, track, updateSpaceUserConnection])

  const acceptSpaceInvitation = useCallback(() => {
    updateSpaceUserConnection({
      variables: {
        spaceId: space.id,
        connectAction: UpdateConnectionAction.Connect,
        connectionType: SpaceUserConnectionType.MembershipInvitee,
      },
      onCompleted() {
        openToast(t('spaces.invite.accept.success'), HoliToastType.SUCCESS)
        track(TrackingEvent.Spaces.Invitation.accepted(space.id))
      },
    })
  }, [openToast, space.id, t, track, updateSpaceUserConnection])

  const rejectSpaceInvitation = useCallback(() => {
    updateSpaceUserConnection({
      variables: {
        spaceId: space.id,
        connectAction: UpdateConnectionAction.Disconnect,
        connectionType: SpaceUserConnectionType.MembershipInvitee,
      },
      onCompleted() {
        openToast(t('spaces.invite.decline.success'), HoliToastType.SUCCESS)
        track(TrackingEvent.Spaces.Invitation.rejected(space.id))
      },
    })
  }, [openToast, space.id, t, track, updateSpaceUserConnection])

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
        handleAction={acceptSpaceInvitation}
        iconColor={colors.brandColorC30}
      />
      <HoliActionDrawer.Action
        isLoading={loading}
        icon={Close}
        title={t('spaces.invite.btn.decline')}
        handleAction={rejectSpaceInvitation}
        iconColor={colors.error20}
      />
      {!isFollowing && (
        <HoliActionDrawer.Action
          isLoading={loading}
          icon={Add}
          title={t('spaces.follow.btn.follow')}
          handleAction={followSpace}
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
            handleConfirmation={unfollowSpace}
            hasDismissBtn
          />
        </HoliActionDrawer.Action>
      )}
    </HoliActionDrawer.Drawer>
  )
}

export default SpaceMoreActions
