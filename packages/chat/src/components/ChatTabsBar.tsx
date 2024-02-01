import { atom, useAtomValue } from 'jotai'
import React from 'react'

import { roomAtomsRecordAtom, spaceRoomIdsAtom } from '@holi/chat/src/store'
import type { ChatRoom } from '@holi/chat/src/store/types'
import { isWeb } from '@holi/chat/src/utils'
import { useBreakpointMatcher } from '@holi/core/helpers'
import i18n from '@holi/core/i18n'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import type { Tab } from '@holi/ui/components/organisms/HoliTabBar'
import HoliTabBar from '@holi/ui/components/organisms/HoliTabBar'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export const DEFAULT_TAB_ID = 'all' as const

export const tabsAtom = atom<Tab[]>((get) => {
  const spaceRoomIds = get(spaceRoomIdsAtom)
  const roomsRecord = get(roomAtomsRecordAtom)

  const tabs: Tab[] = spaceRoomIds.reduce((tabs: Tab[], id) => {
    const roomAtom = roomsRecord[id]

    if (!roomAtom) return tabs
    const room: ChatRoom = get(roomAtom)

    tabs.push({
      id,
      title: room.name,
    })

    return tabs
  }, [])

  const defaultTab: Tab = {
    id: DEFAULT_TAB_ID,
    title: i18n.t('chat.tab.all'),
  }

  tabs.unshift(defaultTab)

  return tabs
})

interface Props {
  selectedTabId: string
}

const ChatTabBar = ({ selectedTabId }: Props) => {
  const { setParams, replaceRoute } = useRouting()

  const mixins = useStyleMixins()
  const tabBarStyle = useBreakpointMatcher([[dimensions.breakpointS, mixins.container]])
  const tabs = useAtomValue(tabsAtom)

  return (
    <HoliTabBar
      id="chat-bar"
      tabs={tabs}
      selectedTabId={selectedTabId}
      onPress={(tabId) => (isWeb ? replaceRoute('/chat?activeTab=' + tabId) : setParams({ activeTab: tabId }))}
      tabBarStyle={isWeb && tabBarStyle}
    />
  )
}

export default ChatTabBar
