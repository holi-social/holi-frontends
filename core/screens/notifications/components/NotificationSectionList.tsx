import React from 'react'
import { ScrollViewProps, SectionList, StyleSheet, View } from 'react-native'

import { useThrottledMobileScrollEvents } from '@holi/core/components/ScrollHeaderLayout/useMobileScrollHandler'
import NotificationItem from '@holi/core/screens/notifications/components/NotificationItem'
import { NotificationsEmptyPlaceholder } from '@holi/core/screens/notifications/components/NotificationsEmptyPlaceholder'
import { Notification } from '@holi/core/screens/notifications/components/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import { vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export interface NotificationGroup {
  title: string
  data: Notification[]
}

interface NotificationSectionList extends ScrollViewProps {
  notifications: NotificationGroup[]
  footer?: React.ReactElement | null
}

export const NotificationSectionList: React.FC<NotificationSectionList> = ({
  notifications,
  footer,
  ...scrollViewProps
}) => {
  const mixins = useStyleMixins()
  const throttledScrollEventProps = useThrottledMobileScrollEvents()

  const styles = StyleSheet.create({
    sectionList: {
      overflow: 'visible',
    },
    listHeaderSpacer: {
      height: +vars.topBarHeight,
    },
    groupTitle: {
      paddingVertical: 12,
    },
    lastSectionFooter: {
      marginBottom: +vars.bottomBarHeight,
    },
    notification: {
      paddingVertical: 12,
    },
  })

  return (
    <SectionList
      sections={notifications}
      keyExtractor={({ id }) => id}
      renderItem={({ item }) => <NotificationItem notification={item} style={styles.notification} />}
      renderSectionHeader={({ section }) => (
        <HoliHeading size="small" style={styles.groupTitle}>
          {section.title}
        </HoliHeading>
      )}
      renderSectionFooter={({ section }) =>
        section === notifications[notifications.length - 1] ? footer || <View style={styles.lastSectionFooter} /> : null
      }
      ListHeaderComponent={() => <View style={styles.listHeaderSpacer} />}
      stickySectionHeadersEnabled={false}
      style={[mixins.container, styles.sectionList]}
      testID="notification-list"
      ListEmptyComponent={<NotificationsEmptyPlaceholder />}
      {...throttledScrollEventProps}
      {...scrollViewProps}
    />
  )
}
