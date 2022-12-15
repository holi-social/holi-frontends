import React, { useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import useRouting from '@holi/core/navigation/hooks/useRouting'
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
  const { navigate } = useRouting()
  const [withdrawConfirmVisible, setWithdrawConfirmVisible] = useState(false)
  const [loginConfirmVisible, setLoginConfirmVisible] = useState(false)

  const sendJoinRequest = useCallback(() => {
    if (!isLoggedIn) {
      setLoginConfirmVisible(true)
      return
    }
    // TODO: make request
    onStateChange('pending')
  }, [isLoggedIn, onStateChange, setLoginConfirmVisible])

  const withdrawJoinRequest = useCallback(() => {
    setWithdrawConfirmVisible(true)
  }, [])

  const onWithdrawConfirmConfirm = useCallback(() => {
    setWithdrawConfirmVisible(false)
    // TODO: make request
    onStateChange('open')
  }, [onStateChange])

  const onWithdrawConfirmDismiss = useCallback(() => {
    setWithdrawConfirmVisible(false)
  }, [])

  const onLoginConfirmConfirm = useCallback(() => {
    // redirect
    navigate('/login')
    setLoginConfirmVisible(false)
  }, [navigate])

  const onLoginConfirmDismiss = useCallback(() => {
    setLoginConfirmVisible(false)
  }, [])

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
          onPress={withdrawJoinRequest}
          style={[styles.actionButtonJoin, props.style]}
        >
          <HoliText>{t('spaces.join.btnPending')}</HoliText>
          <HoliIcon icon="time" style={[{ marginLeft: 5 }]} />
        </HoliButton>
      )}

      <HoliConfirmation
        show={withdrawConfirmVisible}
        label={t('spaces.join.withdraw.confirm.headline')}
        title={t('spaces.join.withdraw.confirm.headline')}
        description={t('spaces.join.withdraw.confirm.text')}
        onDismiss={onWithdrawConfirmDismiss}
        dismissText={t('spaces.join.withdraw.confirm.dismiss')}
        confirmText={t('spaces.join.withdraw.confirm.accept')}
        onConfirm={onWithdrawConfirmConfirm}
      />

      <HoliConfirmation
        show={loginConfirmVisible}
        label={'Sie sind nicht eingeloggt'}
        title={'Sie sind nicht eingeloggt'}
        description={'Um den Beitritt anfragen zu können, müssen Sie eingeloggt sein.'}
        onDismiss={onLoginConfirmDismiss}
        dismissText={'Abbrechen'}
        confirmText={'Zum Login'}
        onConfirm={onLoginConfirmConfirm}
      />
    </>
  )
}

export default SpaceJoin

const styles = StyleSheet.create({
  spaceJoin: {
    marginTop: 32,
    flexDirection: 'row',
    maxWidth: 420,
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: 'green',
  },
  actionButtonJoin: {
    marginLeft: 8,
  },
  pending: {
    color: colors.fontColorDisabled,
  },
})
