import { useMutation } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import {
  UpdateSpaceUserConnectionResponse,
  updateSpaceUserConnectionMutation,
} from '@holi/core/screens/spaces/details/mutations'
import { Space, SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'

export type SpaceFollowProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceFollow: React.FC<SpaceFollowProps> = ({ space, style }) => {
  const { t } = useTranslation()
  const { isLoggedIn, isLoading: isUserLoading } = useLoggedInUser()
  const { openLoginModal } = useLoginModal()

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
    if (!isLoggedIn) {
      return openLoginModal({
        description: t('spaces.follow.loginRedirect.text', { spaceName: space.title }),
      })
    }
    followSpace({
      variables: {
        connectAction: SpaceConnectionAction.CONNECT,
        connectionType: SpaceConnectionType.FOLLOWER,
        spaceId: space.id,
      },
    })
  }, [isLoggedIn, openLoginModal, t, followSpace, space.id, space.title])

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
        <HoliButtonLoading
          inline
          type="secondary"
          variant="small"
          label={t('spaces.follow.btn.follow')}
          onPress={sendFollowRequest}
          style={style}
          disabled={isUserLoading || loading}
          iconSpinning={loading}
          testID="follow-btn"
        />
      )}

      {isFollowing && (
        <HoliButtonLoading
          inline
          type="secondary"
          variant="small"
          label={t('spaces.follow.btn.following')}
          onPress={() => setUnfollowDialogIsOpen(true)}
          style={style}
          disabled={isUserLoading || loading}
          iconSpinning={loading}
          testID="unfollow-btn"
        />
      )}

      <HoliConfirmation
        show={unfollowDialogIsOpen}
        label={t('spaces.follow.unfollow.confirm.headline', { spaceName: space.title })}
        title={t('spaces.follow.unfollow.confirm.headline', { spaceName: space.title })}
        description={t('spaces.follow.unfollow.confirm.text', { spaceName: space.title })}
        dismissText={t('global.dismiss')}
        confirmText={t('global.yes')}
        confirmationButtonType="warning"
        onConfirm={submitUnfollowRequest}
        onDismiss={() => setUnfollowDialogIsOpen(false)}
        testID="unfollow-confirm"
      />
    </>
  )
}

export default SpaceFollow
