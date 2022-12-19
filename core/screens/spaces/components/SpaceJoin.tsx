import React, { useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import { useLoginRedirect } from '@holi/core/provider/LoginRedirectProvider'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { colors } from '@holi/ui/styles/globalVars'

export type SpaceJoinState = 'open' | 'pending' | 'joined'
export type SpaceJoinProps = {
  state?: SpaceJoinState
  onStateChange?: (state: SpaceJoinState) => void
  style?: StyleProp<ViewStyle>
}

const SpaceJoin: React.VFC<SpaceJoinProps> = ({ state = 'open', onStateChange = () => null, ...props }) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useContext(AuthContext)
  const { openLoginDialog } = useLoginRedirect()
  const [withdrawDialogIsOpen, setWithdrawDialogIsOpen] = useState(false)

  const sendJoinRequest = useCallback(() => {
    if (!isLoggedIn) {
      return openLoginDialog({
        text: t('spaces.join.loginRedirect.text'),
      })
    }
    // TODO: make request
    onStateChange('pending')
  }, [isLoggedIn, onStateChange, openLoginDialog, t])

  const submitWithdraw = useCallback(() => {
    setWithdrawDialogIsOpen(false)
    // TODO: make request
    onStateChange('open')
  }, [onStateChange])

  return (
    <>
      {state === 'open' && (
        <HoliButton
          inline
          label={t('spaces.join.btnRequest')}
          onPress={sendJoinRequest}
          style={[styles.actionButtonJoin, props.style]}
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
