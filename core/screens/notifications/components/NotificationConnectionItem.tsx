import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import { displayError } from '@holi/core/errors/helpers'
import { useUserConnection } from '@holi/core/helpers'
import NotificationBaseItem from '@holi/core/screens/notifications/components/NotificationBaseItem'
import { NotificationConnection, NotificationProps } from '@holi/core/screens/notifications/components/types'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import { vars } from '@holi/ui/styles/globalVars'

const NotificationConnectionItem: React.VFC<NotificationProps<NotificationConnection>> = ({ notification, style }) => {
  const { id: userId } = notification.options.user
  const { t } = useTranslation()
  const { width: screenWidth } = useWindowDimensions()

  const { connect, disconnect, error, loading } = useUserConnection()

  if (error) {
    displayError(error, t('user.profileView.connection.error'))
  }

  const buttons = [
    <HoliButton
      key="decline"
      type="secondary"
      label={t('notifications.connection.ignore')}
      onPress={() => disconnect(userId)}
      disabled={loading}
      style={styles.button}
    >
      {t('notifications.connection.ignore')}
    </HoliButton>,
    <HoliButton
      key="accept"
      type="primary"
      label={t('notifications.connection.accept')}
      onPress={() => connect(userId)}
      disabled={loading}
      style={styles.button}
    >
      {t('notifications.connection.accept')}
    </HoliButton>,
  ]

  return (
    <NotificationBaseItem notification={notification} i18nKey="notifications.connection.message" style={style}>
      {screenWidth > +vars.breakpointXs ? (
        <HoliHorizontalRow gap={8} style={styles.buttonContainer}>
          {buttons}
        </HoliHorizontalRow>
      ) : (
        <View style={styles.buttonContainer}>{buttons}</View>
      )}
    </NotificationBaseItem>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingLeft: 48,
  },
  button: {
    marginTop: 12,
  },
})

export default NotificationConnectionItem
