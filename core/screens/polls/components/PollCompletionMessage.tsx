import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowRightS, StarRounded } from '@holi/icons/src/generated'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export type PollCompletionMessageProps = {
  notificationsEnabled?: boolean
  onNotificationsEnable?: () => void
  style?: StyleProp<ViewStyle>
}

const PollCompletionMessage = ({ notificationsEnabled }: PollCompletionMessageProps) => {
  const { t } = useTranslation()

  return (
    <div style={styles.container}>
      <div style={styles.notificationContentStyle}>
        <HoliColumns alignItems="flex-end" flexDirection="row" justifyContent="space-between" padding={[0, 0, 16, 0]}>
          <HoliHeading>{t('homeFeed.notEnoughVotesNotification.thanks')}</HoliHeading>
          <HoliIcon icon={StarRounded} size={30} />
        </HoliColumns>
        {notificationsEnabled ? (
          <HoliText>{t('homeFeed.notEnoughVotesNotification.confirmationText')}</HoliText>
        ) : (
          <View>
            <HoliText>{t('homeFeed.notEnoughVotesNotification.notification')}</HoliText>
            <View style={styles.greyContainer}>
              <HoliLink label={t('profile.settings.notifications.GLOBAL.title')} href="/profile/settings/notifications">
                <Trans t={t} i18nKey="homeFeed.notEnoughVotesNotification.activation">
                  <HoliText size="small" bold={true} />
                </Trans>
              </HoliLink>
              <HoliIcon icon={ArrowRightS} size={30} />
            </View>
          </View>
        )}
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  notificationContentStyle: {
    flexGrow: 1,
  },
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: colors.black300,
    borderRadius: 12,
    backgroundColor: colors.background10,
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
    backgroundColor: colors.background30,
  },
})

export default PollCompletionMessage
