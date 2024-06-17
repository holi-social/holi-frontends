import React, { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowRightS, StarRounded } from '@holi/icons/src/generated'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type PollCompletionMessageProps = {
  notificationsEnabled?: boolean | 'mixed'
  style?: StyleProp<ViewStyle>
}

const PollCompletionMessage = ({ notificationsEnabled }: PollCompletionMessageProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={styles.container}>
      <View style={styles.notificationContentStyle}>
        <HoliColumns alignItems="flex-end" flexDirection="row" justifyContent="space-between" padding={[0, 0, 16, 0]}>
          <HoliHeading>{t('homeFeed.notEnoughVotesNotification.thanks')}</HoliHeading>
          <HoliIcon icon={StarRounded} size={30} color={colors.brandB200} />
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
