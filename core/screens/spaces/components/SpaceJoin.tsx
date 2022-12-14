import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

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
  const [confirmationVisible, setConfirmationVisible] = useState(false)

  const sendJoinRequest = useCallback(() => {
    // make request
    onStateChange('pending')
  }, [onStateChange])

  const withdrawJoinRequest = useCallback(() => {
    setConfirmationVisible(true)
  }, [])

  const onConfirmConfirm = useCallback(() => {
    setConfirmationVisible(false)
    // make request
    onStateChange('open')
  }, [onStateChange])

  const onDismissConfirm = useCallback(() => {
    setConfirmationVisible(false)
  }, [])

  return (
    <>
      {state === 'open' && (
        <HoliButton
          inline
          label={t('spaces.join')}
          onPress={sendJoinRequest}
          style={[styles.actionButtonJoin, props.style]}
        >
          <HoliText>{t('spaces.join')}</HoliText>
        </HoliButton>
      )}
      {state === 'pending' && (
        <HoliButton
          type="secondary"
          inline
          label={t('spaces.join')}
          onPress={withdrawJoinRequest}
          style={[styles.actionButtonJoin, props.style]}
        >
          <HoliText>Anfrage ausstehend</HoliText>
          <HoliIcon icon="time" style={[{ marginLeft: 5 }]} />
        </HoliButton>
      )}

      <HoliConfirmation
        show={confirmationVisible}
        label={t('auth.logout.button')}
        title={t('auth.logout.button')}
        description={t('auth.logout.heading')}
        onDismiss={onDismissConfirm}
        dismissText={t('auth.logout.confirmation.dismiss')}
        confirmText={t('auth.logout.confirmation.confirm')}
        onConfirm={onConfirmConfirm}
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
