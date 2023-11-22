import React from 'react'
import { SectionList, StyleSheet, View } from 'react-native'

import { LayoutProps } from '@holi/core/components/DefaultLayout/types'
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

interface NotificationSectionListProps extends LayoutProps {
  notifications: NotificationGroup[]
  footer?: React.ReactElement | null
}

export const NotificationSectionList: React.FC<NotificationSectionListProps> = ({
  notifications,
  footer,
  style,
  ...scrollViewProps
}) => {
  const mixins = useStyleMixins()
  const throttledScrollEventProps = useThrottledMobileScrollEvents()

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
      stickySectionHeadersEnabled={false}
      ListFooterComponent={footer}
      ListHeaderComponent={() => <View style={styles.listHeaderSpacer} />}
      ListEmptyComponent={<NotificationsEmptyPlaceholder />}
      style={[mixins.container, styles.sectionList, style]}
      testID="notification-list"
      {...throttledScrollEventProps}
      {...scrollViewProps}
    />
  )
}

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
  notification: {
    paddingVertical: 12,
  },
})
