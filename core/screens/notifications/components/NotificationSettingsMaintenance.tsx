import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { breakpoints } from 'holi-bricks/foundations'

const NotificationSettingsMaintenance = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={styles.wrapper}>
      <HoliLocalImage
        imageSource={require('@holi/ui/assets/img/illustrations/notification_settings_maintenance.svg')}
        width={171}
        height={152}
        label={t('profile.settings.notifications.maintenance.illustration')}
        isSvg
      />
      <HoliText style={styles.header} align="center">
        {t('profile.settings.notifications.maintenance.header')}
      </HoliText>
      <HoliText size="large" align="center" style={styles.message}>
        {t('profile.settings.notifications.maintenance.message')}
      </HoliText>
    </View>
  )
}

export default NotificationSettingsMaintenance

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: theme.colors.white100,
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
      maxWidth: breakpoints.md,
    },
  })
