import { useMutation } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import { displayError } from '@holi/core/errors/helpers'
import { useLoginRedirect } from '@holi/core/provider/LoginRedirectProvider'
import { JoinSpaceResponse, joinSpaceMutation } from '@holi/core/screens/spaces/queries'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { colors } from '@holi/ui/styles/globalVars'

export type SpaceJoinState = 'open' | 'pending' | 'joined'
export type SpaceJoinProps = {
  spaceId: string
  state?: SpaceJoinState
  onStateChange?: (state: SpaceJoinState) => void
  style?: StyleProp<ViewStyle>
}

const SpaceJoin: React.VFC<SpaceJoinProps> = ({ spaceId, state = 'open', onStateChange = () => null, ...props }) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useAuth()
  const { openLoginDialog } = useLoginRedirect()
  const [withdrawDialogIsOpen, setWithdrawDialogIsOpen] = useState(false)
  const [joinSpace, { loading, error }] = useMutation<JoinSpaceResponse>(joinSpaceMutation)

  if (error) {
    displayError(error, t('spaces.join.error'))
  }

  const sendJoinRequest = useCallback(() => {
    if (!isLoggedIn) {
      return openLoginDialog({
        text: t('spaces.join.loginRedirect.text'),
      })
    }
    joinSpace({
      variables: { connectAction: 'CONNECT', connectionType: 'MEMBERSHIP_REQUESTOR', spaceId: spaceId },
    })
    onStateChange('pending')
  }, [isLoggedIn, onStateChange, openLoginDialog, t, joinSpace, spaceId])

  const submitWithdraw = useCallback(() => {
    setWithdrawDialogIsOpen(false)
    joinSpace({
      variables: {
        connectAction: 'DISCONNECT',
        connectionType: 'MEMBERSHIP_REQUESTOR',
        spaceId: spaceId,
      },
    })
    onStateChange('open')
  }, [onStateChange, joinSpace, spaceId])

  return (
    <>
      {state === 'open' && (
        <HoliButton
          inline
          label={t('spaces.join.btnRequest')}
          onPress={sendJoinRequest}
          style={[styles.actionButtonJoin, props.style]}
          disabled={loading}
        >
          <HoliText>{t('spaces.join.btnRequest')}</HoliText>
        </HoliButton>
      )}
      {state === 'pending' && (
        <HoliButton
          type="secondary"
          inline
          label={t('spaces.join.btnPending')}
          onPress={() => setWithdrawDialogIsOpen(true)}
          style={[styles.actionButtonJoin, props.style]}
          disabled={loading}
        >
          <HoliText>{t('spaces.join.btnPending')}</HoliText>
          <HoliIcon icon="time" style={[{ marginLeft: 5 }]} />
        </HoliButton>
      )}

      <HoliConfirmation
        show={withdrawDialogIsOpen}
        label={t('spaces.join.withdraw.confirm.headline')}
        title={t('spaces.join.withdraw.confirm.headline')}
        description={t('spaces.join.withdraw.confirm.text')}
        dismissText={t('spaces.join.withdraw.confirm.dismiss')}
        confirmText={t('spaces.join.withdraw.confirm.accept')}
        onConfirm={submitWithdraw}
        onDismiss={() => setWithdrawDialogIsOpen(false)}
      />
    </>
  )
}

export default SpaceJoin

const styles = StyleSheet.create({
  actionButtonJoin: {
    marginLeft: 8,
  },
  pending: {
    color: colors.fontColorDisabled,
  },
})
