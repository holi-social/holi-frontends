import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import NotificationBellBadge from '@holi/core/navigation/components/header/NotificationBellBadge'
import NotificationContentText from '@holi/core/screens/notifications/components/NotificationContentText'
import { NotificationAppointments, NotificationProps } from '@holi/core/screens/notifications/components/types'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliHtmlView from '@holi/ui/components/molecules/HoliHtmlView'
import { colors } from '@holi/ui/styles/globalVars'

export const NotificationSpaceAppointmentBaseItem = ({
  notification,
  testID = '',
  link,
}: NotificationProps<NotificationAppointments>) => {
  const { i18n } = useTranslation()
  const {
    created,
    read,
    content,
    options: { space },
  } = notification

  return (
    <View
      testID={testID}
      style={{
        paddingVertical: 12,
      }}
    >
      <HoliLink href={link ?? '/'} label={space.title} mobileNavigateBackFirst>
        <View style={styles.link}>
          <SpaceAvatar space={space} size="small" style={{ borderColor: 'transparent' }} />

          <View style={styles.content}>
            <NotificationContentText size="small" style={styles.fontColorGray}>
              {content && <HoliHtmlView html={content} />}
            </NotificationContentText>

            <HoliText size="extrasmall" style={[styles.fontColorGray, styles.createdDate]}>
              {getRelativeDateString(created, i18n.language)}
            </HoliText>
          </View>

          <NotificationBellBadge visible={!read} backgroundColor={colors.background30} style={styles.readStatus} />
        </View>
      </HoliLink>
    </View>
  )
}

export const styles = StyleSheet.create({
  link: {
    display: 'flex',
    flexDirection: 'row',
  },
  content: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '100%',
    marginLeft: 12,
  },
  fontColorGray: {
    color: colors.foreground20,
  },
  createdDate: {
    marginTop: 4,
  },
  readStatus: {
    marginLeft: 12,
  },
})
