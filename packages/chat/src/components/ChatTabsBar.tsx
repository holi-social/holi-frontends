import { atom, useAtomValue } from 'jotai'
import React from 'react'
import { useTranslation } from 'react-i18next'

import type { ChatRoom } from '@holi/chat/src/client/types'
import { roomAtomsRecordAtom, spaceRoomIdToChildRoomsAtom, spaceRoomIdsAtom } from '@holi/chat/src/store'
import { isWeb } from '@holi/chat/src/utils'
import { useBreakpointMatcher } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import type { Tab } from '@holi/ui/components/organisms/HoliTabBar'
import HoliTabBar from '@holi/ui/components/organisms/HoliTabBar'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export const DEFAULT_TAB_ID = 'all' as const

export const roomTabsAtom = atom<Tab[]>((get) => {
  const spaceRoomIds = get(spaceRoomIdsAtom)
  const roomsRecord = get(roomAtomsRecordAtom)
  const spaceRoomIdToChildRooms = get(spaceRoomIdToChildRoomsAtom)

  return spaceRoomIds.reduce((tabs: Tab[], id) => {
    const roomAtom = roomsRecord[id]

    if (!roomAtom) return tabs
    // do not show a space if it does not have any child rooms.
    // Use `spaceRoomIdToChildRoomsAtom` istead of `spaceRoomIdToChildIdsAtom` here to see only joined child rooms
    if (!spaceRoomIdToChildRooms[id]?.length) return tabs

    const room: ChatRoom = get(roomAtom)

    tabs.push({
      id,
      title: room.name,
    })

    return tabs
  }, [])
})

interface Props {
  selectedTabId: string
}

const ChatTabBar = ({ selectedTabId }: Props) => {
  const { setParams, replaceRoute } = useRouting()
  const { t } = useTranslation()

  const mixins = useStyleMixins()
  const tabBarStyle = useBreakpointMatcher([[dimensions.breakpointS, mixins.container]])
  const roomTabs = useAtomValue(roomTabsAtom)
  const defaultTab: Tab = {
    id: DEFAULT_TAB_ID,
    title: t('chat.tab.all'),
  }
  const tabs = [defaultTab].concat(roomTabs)

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
