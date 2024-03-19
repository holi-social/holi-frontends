import { useAtomValue } from 'jotai'
import React from 'react'

import { hasUnreadNotificationsAtom } from '@holi/chat/src/store'
import NotificationBellBadge from '@holi/core/navigation/components/header/NotificationBellBadge'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Chat3, Chat3Filled } from '@holi/icons/src/generated'
import { useTheme } from '@holi/ui/styles/theme'

export interface ChatBottomTabsNavigatorItemProps {
  focused: boolean
}

const ChatBottomTabsNavigatorItem = ({ focused }: ChatBottomTabsNavigatorItemProps) => {
  const { theme } = useTheme()
  const { colors } = theme

  const iconColor = (isActive: boolean) => (isActive ? colors.foreground30 : colors.foreground20)
  const hasUnreadNotifications = useAtomValue(hasUnreadNotificationsAtom)

  return (
    <NotificationBellBadge visible={hasUnreadNotifications} testID="bell-badge">
      <HoliIcon icon={focused ? Chat3Filled : Chat3} color={iconColor(focused)} />
    </NotificationBellBadge>
  )
}

export default ChatBottomTabsNavigatorItem
