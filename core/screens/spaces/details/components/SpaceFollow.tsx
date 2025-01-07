import { useMutation } from '@apollo/client'
import type React from 'react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { StyleProp, ViewStyle } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import {
  type UpdateSpaceUserConnectionResponse,
  updateSpaceUserConnectionMutation,
} from '@holi/core/screens/spaces/details/mutations'
import { type Space, SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { Button } from 'holi-bricks/components/button'

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

  const [followSpace, { loading }] = useMutation<UpdateSpaceUserConnectionResponse>(updateSpaceUserConnectionMutation, {
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

  const isFollowing = space.connectionStatusToMyself?.includes(SpaceConnectionType.FOLLOWER)
  const isInvited = space.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBERSHIP_INVITEE)
  const isMember = space.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const hasRequestedMembership = space.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBERSHIP_REQUESTOR)

  const sendFollowRequest = useCallback(() => {
    track(TrackingEvent.Spaces.followSpaceButtonPressed(space.id, isLoggedIn))

    if (!isLoggedIn) {
      return openSignupModal({
        description: t('spaces.follow.loginRedirect.text', { spaceName: space.title }),
        trackTrigger: 'FOLLOW_SPACE',
      })
    }
    return followSpace({
      variables: {
        connectAction: SpaceConnectionAction.CONNECT,
        connectionType: SpaceConnectionType.FOLLOWER,
        spaceId: space.id,
      },
    })
  }, [isLoggedIn, openSignupModal, t, followSpace, space.id, space.title, track])

  const submitUnfollowRequest = useCallback(() => {
    setUnfollowDialogIsOpen(false)
    followSpace({
      variables: {
        connectAction: SpaceConnectionAction.DISCONNECT,
        connectionType: SpaceConnectionType.FOLLOWER,
        spaceId: space.id,
      },
    })
  }, [followSpace, space.id])

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
          onPress={sendFollowRequest}
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
        onPrimary={submitUnfollowRequest}
        onDismiss={() => setUnfollowDialogIsOpen(false)}
        testID="unfollow-confirm"
      />
    </>
  )
}

export default SpaceFollow
