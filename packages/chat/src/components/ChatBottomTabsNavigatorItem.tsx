import { createStyleSheet } from 'holi-bricks/styles'
import { useAtomValue } from 'jotai'
import React from 'react'

import { hasUnreadNotificationsAtom } from '@holi/chat/src/store'
import NotificationBellBadge from '@holi/core/navigation/components/header/NotificationBellBadge'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Chat3, Chat3Filled } from '@holi/icons/src/generated'

export interface ChatBottomTabsNavigatorItemProps {
  focused: boolean
}

const ChatBottomTabsNavigatorItem = ({ focused }: ChatBottomTabsNavigatorItemProps) => {
  const hasUnreadNotifications = useAtomValue(hasUnreadNotificationsAtom)

  return (
    <NotificationBellBadge visible={hasUnreadNotifications} testID="bell-badge">
      <HoliIcon icon={focused ? Chat3Filled : Chat3} colorOverride={styles.icon(focused).color} />
    </NotificationBellBadge>
  )
}

export default ChatBottomTabsNavigatorItem

const styles = createStyleSheet((theme) => ({
  icon: (focused: boolean) => ({
    color: focused ? theme.colors.fill.main : theme.colors.fill.default,
  }),
}))
