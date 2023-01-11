import { useMutation } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import { displayError } from '@holi/core/errors/helpers'
import { useLoginRedirect } from '@holi/core/provider/LoginRedirectProvider'
import { JoinSpaceResponse, joinSpaceMutation } from '@holi/core/screens/spaces/queries'
import { Space, SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { colors } from '@holi/ui/styles/globalVars'

export enum SpaceFollowStateType {
  FOLLOWING = 'FOLLOWING',
  NOT_FOLLOWING = 'NOT_FOLLOWING',
}
export type SpaceFollowProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceFollow: React.VFC<SpaceFollowProps> = ({ space, ...props }) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useAuth()
  const { openLoginDialog } = useLoginRedirect()
  const [unfollowDialogIsOpen, setUnfollowDialogIsOpen] = useState(false)
  const [followSpace, { loading, error }] = useMutation<JoinSpaceResponse>(joinSpaceMutation)

  const followState = space.connectionStatusToMyself?.includes(SpaceConnectionType.FOLLOWER)
    ? SpaceFollowStateType.FOLLOWING
    : SpaceFollowStateType.NOT_FOLLOWING

  const sendFollowRequest = useCallback(() => {
    if (!isLoggedIn) {
      return openLoginDialog({
        text: t('spaces.follow.loginRedirect.text', { spaceName: space.title }),
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

  if (error) {
    displayError(error, t('spaces.follow.error'))
  }

  return (
    <>
      {followState === SpaceFollowStateType.NOT_FOLLOWING && (
        <HoliButtonLoading
          inline
          type="secondary"
          label={t('spaces.follow.btn.follow')}
          onPress={sendFollowRequest}
          style={[styles.actionButtonFollow, props.style]}
          disabled={loading}
          iconSpinning={loading}
        />
      )}

      {followState === SpaceFollowStateType.FOLLOWING && (
        <HoliButtonLoading
          inline
          label={t('spaces.follow.btn.unfollow')}
          onPress={() => setUnfollowDialogIsOpen(true)}
          style={[styles.actionButtonFollow, props.style]}
          disabled={loading}
          iconSpinning={loading}
        />
      )}

      <HoliConfirmation
        show={unfollowDialogIsOpen}
        label={t('spaces.follow.unfollow.confirm.headline', { spaceName: space.title })}
        title={t('spaces.follow.unfollow.confirm.headline', { spaceName: space.title })}
        description={t('spaces.follow.unfollow.confirm.text')}
        dismissText={t('global.dismiss')}
        confirmText={t('global.yes')}
        onConfirm={submitUnfollowRequest}
        onDismiss={() => setUnfollowDialogIsOpen(false)}
      />
    </>
  )
}

export default SpaceFollow

const styles = StyleSheet.create({
  actionButtonFollow: {
    marginLeft: 8,
  },
  pending: {
    color: colors.fontColorDisabled,
  },
})
