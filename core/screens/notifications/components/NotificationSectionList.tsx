import type React from 'react'
import { type ScrollView, SectionList, StyleSheet } from 'react-native'

import type { LayoutProps } from '@holi/core/components/DefaultLayout/types'
import { useThrottledMobileScrollEvents } from '@holi/core/components/ScrollHeaderLayout/useMobileScrollHandler'
import { withRefreshControl } from '@holi/core/helpers/withRefreshControl'
import NotificationItem from '@holi/core/screens/notifications/components/NotificationItem'
import { NotificationsEmptyPlaceholder } from '@holi/core/screens/notifications/components/NotificationsEmptyPlaceholder'
import type { Notification } from '@holi/core/screens/notifications/components/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export interface NotificationGroup {
  title: string
  data: Notification[]
}

interface NotificationSectionListProps extends LayoutProps {
  notifications: NotificationGroup[]
  footer?: React.ReactElement | null
}

const NotificationSectionList: React.FC<NotificationSectionListProps> = ({
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
        <HoliBox padding={[12, 0, 12, 0]}>
          <HoliHeading size="s">{section.title}</HoliHeading>
        </HoliBox>
      )}
      stickySectionHeadersEnabled={false}
      ListFooterComponent={footer}
      ListEmptyComponent={<NotificationsEmptyPlaceholder />}
      style={[mixins.container, styles.sectionList, style]}
      testID="notification-list"
      {...throttledScrollEventProps}
      {...scrollViewProps}
    />
  )
}

const RefreshableNotificationSectionList = withRefreshControl<NotificationSectionListProps, ScrollView>(
  NotificationSectionList
)

RefreshableNotificationSectionList.displayName = 'NotificationSectionListProps'

export default RefreshableNotificationSectionList

const styles = StyleSheet.create({
  sectionList: {
    overflow: 'visible',
  },
  lastSectionFooter: {
    marginBottom: dimensions.bottomBarHeight,
  },
  notification: {
    paddingVertical: 12,
  },
})
