import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowRightS, StarRounded } from '@holi/icons/src/generated'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

interface BaseProps {
  style?: StyleProp<ViewStyle>
}
interface Props extends BaseProps {
  onNotificationsOn?: () => void
}

export type PollSelectionProps = Props

const PollCompletionMessage = () => {
  const { t } = useTranslation()

  const notificationsEnabled = false

  const content = () => {
    if (notificationsEnabled) {
      return <HoliText>{t('homeFeed.notEnoughVotesNotification.confirmationText')}</HoliText>
    } else {
      return (
        <View>
          <HoliText>{t('homeFeed.notEnoughVotesNotification.notification')}</HoliText>
          <div style={styles.greyContainer}>
            <HoliColumns alignItems="center" justifyContent="space-between">
              <div>
                <Trans t={t} i18nKey="homeFeed.notEnoughVotesNotification.activation">
                  <HoliText bold={true} />
                </Trans>
              </div>
              <HoliIcon style={styles.icon} icon={ArrowRightS} size={30} />
            </HoliColumns>
          </div>
        </View>
      )
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.notificationContentStyle}>
        <HoliColumns alignItems="flex-end" flexDirection="row" justifyContent="space-between" padding={[0, 0, 16, 0]}>
          <HoliHeading>{t('homeFeed.notEnoughVotesNotification.thanks')}</HoliHeading>
          <HoliIcon style={styles.icon} icon={StarRounded} size={30} />
        </HoliColumns>
        {content()}
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
    padding: 8,
    marginBottom: 8,
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: colors.background30,
  },
  icon: {
    marginLeft: 10,
  },
  title: {
    marginTop: 8,
    lineHeight: 33.6,
  },
  description: {
    marginTop: 16,
    lineHeight: 23.68,
  },
  italic: {
    fontStyle: 'italic',
  },
})

export default PollCompletionMessage
