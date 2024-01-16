import { useAtomValue } from 'jotai'
import React from 'react'

import { hasUnreadNotificationsAtom } from '@holi/chat/src/store'
import { Chat3, Chat3Filled } from '@holi/icons/src/generated'
import { HoliButtonBell } from '@holi/ui/components/molecules/HoliButtonBell'
import { colors } from '@holi/ui/styles/globalVars'

export interface ChatBottomTabsNavigatorItemProps {
  focused: boolean
}

const ChatBottomTabsNavigatorItem = ({ focused }: ChatBottomTabsNavigatorItemProps) => {
  const iconColor = (isActive: boolean) => (isActive ? colors.foreground30 : colors.foreground20)
  const hasUnreadNotifications = useAtomValue(hasUnreadNotificationsAtom)

  return (
    <HoliButtonBell
      label="Chat"
      icon={focused ? Chat3Filled : Chat3}
      color={iconColor(focused)}
      showBell={hasUnreadNotifications}
    />
  )
}

export default ChatBottomTabsNavigatorItem
