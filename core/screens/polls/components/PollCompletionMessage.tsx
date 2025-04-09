import { useQuery } from '@apollo/client'
import React, { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import {
  type NotificationsPreferencesResponse,
  notificationsPreferencesQuery,
} from '@holi/core/screens/notifications/queries'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowRightS, StarRoundedFilled } from '@holi/icons/src/generated'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

const PollCompletionMessage = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])
  const { displayError } = useErrorHandling()

  const { data: notificationSettings } = useQuery<NotificationsPreferencesResponse>(notificationsPreferencesQuery, {
    fetchPolicy: 'network-only',
    onError: (error) =>
      displayError(error, 'Failed to load notification preferences', {
        location: 'useNotificationPreferences.notificationsPreferencesQuery',
      }),
  })

  let notificationsEnabled = false
  const updates = notificationSettings?.notifications_preferences.find((entry) => entry.id === 'POLL_UPDATES')
  if (updates?.preferences?.email || updates?.preferences?.push) notificationsEnabled = true

  if (!notificationSettings) return <></>

  return (
    <View style={styles.container}>
      <View style={styles.notificationContentStyle}>
        <HoliColumns alignItems="flex-end" flexDirection="row" justifyContent="space-between" padding={[0, 0, 16, 0]}>
          <HoliHeading>{t('homeFeed.notEnoughVotesNotification.thanks')}</HoliHeading>
          <HoliIcon icon={StarRoundedFilled} size={30} colorOverride={colors.brandB200} />
        </HoliColumns>
        {notificationsEnabled ? (
          <HoliText>{t('homeFeed.notEnoughVotesNotification.confirmationText')}</HoliText>
        ) : (
          <View>
            <HoliText>{t('homeFeed.notEnoughVotesNotification.notification')}</HoliText>
            <View style={styles.greyContainer}>
              <HoliLink label={t('profile.settings.notifications.GLOBAL.title')} href="/profile/settings/notifications">
                <HoliText style={{ maxWidth: '95%' }}>
                  <Trans t={t} i18nKey="homeFeed.notEnoughVotesNotification.activation">
                    <HoliText size="small" bold={true} />
                  </Trans>
                </HoliText>
              </HoliLink>
              <HoliIcon icon={ArrowRightS} size={30} />
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    notificationContentStyle: {
      flexGrow: 1,
    },
    container: {
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.black300,
      borderRadius: 12,
      backgroundColor: theme.colors.background10,
      borderStyle: 'solid',
    },
    greyContainer: {
      fontSize: 14,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingLeft: 12,
      paddingRight: 8,
      marginBottom: 8,
      marginTop: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.background30,
    },
  })

export default PollCompletionMessage
