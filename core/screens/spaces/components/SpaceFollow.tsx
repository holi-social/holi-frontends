import { useMutation } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLoginRedirect } from '@holi/core/provider/LoginRedirectProvider'
import { UpdateSpaceUserConnectionResponse, updateSpaceUserConnectionMutation } from '@holi/core/screens/spaces/queries'
import { Space, SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'

export type SpaceFollowProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceFollow: React.VFC<SpaceFollowProps> = ({ space, style }) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useAuth()
  const { openLoginDialog } = useLoginRedirect()
  const [unfollowDialogIsOpen, setUnfollowDialogIsOpen] = useState(false)
  const [followSpace, { loading, error }] = useMutation<UpdateSpaceUserConnectionResponse>(
    updateSpaceUserConnectionMutation,
    {
      // refetchQueries considered harmful https://github.com/apollographql/apollo-client/issues/5419#issuecomment-1242511457
      update: (cache) => {
        cache.evict({ id: 'ROOT_QUERY', fieldName: 'mySpaces' })
      },
    }
  )
  const { displayError } = useErrorHandling()

  const isFollowing = space.connectionStatusToMyself?.includes(SpaceConnectionType.FOLLOWER)
  const isMember = space.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const hasRequestedMembership = space.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBERSHIP_REQUESTOR)

  const sendFollowRequest = useCallback(() => {
    if (!isLoggedIn) {
      return openLoginDialog({
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
  }, [isLoggedIn, openLoginDialog, t, followSpace, space.id, space.title])

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

  if (isMember || hasRequestedMembership) {
    return null
  }

  if (error) {
    displayError(error, t('spaces.follow.error'))
  }

  return (
    <>
      {!isFollowing && (
        <HoliButtonLoading
          inline
          type="secondary"
          label={t('spaces.follow.btn.follow')}
          onPress={sendFollowRequest}
          style={style}
          disabled={loading}
          iconSpinning={loading}
          testID="follow-btn"
        />
      )}

      {isFollowing && (
        <HoliButtonLoading
          inline
          label={t('spaces.follow.btn.unfollow')}
          onPress={() => setUnfollowDialogIsOpen(true)}
          style={style}
          disabled={loading}
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
        onConfirm={submitUnfollowRequest}
        onDismiss={() => setUnfollowDialogIsOpen(false)}
        testID="unfollow-confirm"
      />
    </>
  )
}

export default SpaceFollow
