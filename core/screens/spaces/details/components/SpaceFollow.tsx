import type React from 'react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { StyleProp, ViewStyle } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { Button } from 'holi-bricks/components/button'
import {
  type Space,
  UpdateConnectionAction,
  SpaceUserConnectionType,
  useUpdateSpaceUserConnectionMutation,
} from '@holi/api/graphql/graphql-codegen'

export type SpaceFollowProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceFollow: React.FC<SpaceFollowProps> = ({ space }) => {
  const { t } = useTranslation()
  const { isLoggedIn, isLoading: isLoadingUser } = useLoggedInUser()
  const { openSignupModal } = useSignupModal()
  const { track } = useTracking()

  const [unfollowDialogIsOpen, setUnfollowDialogIsOpen] = useState(false)
  const { displayError } = useErrorHandling()

  const [followSpace, { loading }] = useUpdateSpaceUserConnectionMutation({
    // refetchQueries does not work on unmounted components and leads to buggy behavior, consider explicit cache eviction as per https://github.com/apollographql/apollo-client/issues/5419#issuecomment-1242511457
    update: (cache) => {
      cache.evict({ id: 'ROOT_QUERY', fieldName: 'mySpaces' })
    },
    onError: (error) => {
      displayError(error, 'Failed to follow space', {
        displayMessage: t('spaces.follow.error'),
        location: 'SpaceFollow.followSpace',
        spaceId: space.id,
      })
    },
  })

  const isFollowing = space.connectionStatusToMyself?.includes(SpaceUserConnectionType.Follower)
  const isInvited = space.connectionStatusToMyself?.includes(SpaceUserConnectionType.MembershipInvitee)
  const isMember = space.connectionStatusToMyself?.includes(SpaceUserConnectionType.Member)
  const hasRequestedMembership = space.connectionStatusToMyself?.includes(SpaceUserConnectionType.MembershipRequestor)

  const onFollowSpaceButtonPressed = useCallback(() => {
    track(TrackingEvent.Spaces.followSpaceButtonPressed(space.id, isLoggedIn))

    if (!isLoggedIn) {
      return openSignupModal({
        description: t('spaces.follow.loginRedirect.text', { spaceName: space.title }),
        trackTrigger: 'FOLLOW_SPACE',
      })
    }
    return followSpace({
      variables: {
        connectAction: UpdateConnectionAction.Connect,
        connectionType: SpaceUserConnectionType.Follower,
        spaceId: space.id,
      },
      onCompleted: () => track(TrackingEvent.Spaces.User.followed(space.id)),
    })
  }, [isLoggedIn, openSignupModal, t, followSpace, space.id, space.title, track])

  const onUnfollowSpaceButtonPressed = useCallback(() => {
    setUnfollowDialogIsOpen(false)
    followSpace({
      variables: {
        connectAction: UpdateConnectionAction.Disconnect,
        connectionType: SpaceUserConnectionType.Follower,
        spaceId: space.id,
      },
      onCompleted: () => track(TrackingEvent.Spaces.User.unfollowed(space.id)),
    })
  }, [followSpace, space.id, track])

  if (isMember || hasRequestedMembership || isInvited) {
    return null
  }

  return (
    <>
      {!isFollowing && (
        <Button
          inline
          variant="secondary"
          size="sm"
          label={t('spaces.follow.btn.follow')}
          onPress={onFollowSpaceButtonPressed}
          loading={isLoadingUser || loading}
          testID="follow-btn"
        />
      )}

      {isFollowing && (
        <Button
          inline
          variant="secondary"
          size="sm"
          label={t('spaces.follow.btn.following')}
          onPress={() => setUnfollowDialogIsOpen(true)}
          loading={loading}
          testID="unfollow-btn"
        />
      )}

      <HoliConfirmation
        show={unfollowDialogIsOpen}
        label={t('spaces.follow.unfollow.confirm.headline', { spaceName: space.title })}
        title={t('spaces.follow.unfollow.confirm.headline', { spaceName: space.title })}
        description={t('spaces.follow.unfollow.confirm.text', { spaceName: space.title })}
        secondaryText={t('global.dismiss')}
        primaryText={t('global.yes')}
        primaryButtonVariant="danger"
        onPrimary={onUnfollowSpaceButtonPressed}
        onDismiss={() => setUnfollowDialogIsOpen(false)}
        testID="unfollow-confirm"
      />
    </>
  )
}

export default SpaceFollow
