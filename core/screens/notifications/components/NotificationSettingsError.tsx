import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors, dimensions } from '@holi/ui/styles/globalVars'

const NotificationSettingsError = () => {
  const { t } = useTranslation()

  const reloadPage = () => {
    window.location.reload()
  }

  return (
    <View style={styles.wrapper}>
      <HoliLocalImage
        imageSource={require('@holi/ui/assets/img/illustrations/notification_settings_error.svg')}
        width={229}
        height={144}
        label={t('profile.settings.notifications.error.illustration')}
        isSvg
      />
      <HoliText style={styles.header} align="center">
        {t('profile.settings.notifications.error.header')}
      </HoliText>
      <HoliText size="large" align="center" style={styles.message}>
        {t('profile.settings.notifications.error.message')}
      </HoliText>
      <HoliButton inline label={t('profile.settings.notifications.error.button')} onPress={reloadPage}>
        {t('profile.settings.notifications.error.button')}
      </HoliButton>
    </View>
  )
}

export default NotificationSettingsError

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.white100,
    marginTop: 16,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  header: {
    marginVertical: 16,
  },
  message: {
    maxWidth: dimensions.breakpointL,
    marginBottom: 16,
  },
})
