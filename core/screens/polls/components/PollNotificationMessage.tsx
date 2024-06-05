import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { NotificationSmallFilledSoftPurple } from '@holi/icons/src/generated'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

const NotEnoughVotesNotification = () => {
  const { t } = useTranslation()
  return (
    <div style={styles.container}>
      <div style={styles.notificationContentStyle}>
        <HoliColumns alignItems="flex-end" padding={[0, 0, 16, 0]}>
          <HoliHeading>{t('homeFeed.notEnoughVotesNotification.confirmationHeading')}</HoliHeading>
          <HoliIcon style={styles.icon} icon={NotificationSmallFilledSoftPurple} size={30} />
        </HoliColumns>
        <HoliText>{t('homeFeed.notEnoughVotesNotification.confirmationText')}</HoliText>
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
  icon: {
    marginLeft: 10,
  },
})

export default NotEnoughVotesNotification
