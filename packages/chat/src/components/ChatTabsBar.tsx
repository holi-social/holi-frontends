import { atom, useAtomValue } from 'jotai'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, Platform, View } from 'react-native'

import type { ChatRoom } from '@holi/chat/src/client/types'
import { roomAtomsRecordAtom, spaceRoomIdToChildRoomsAtom, spaceRoomIdsAtom } from '@holi/chat/src/store'
import { isWeb } from '@holi/chat/src/utils'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import BottomLineSeperator from '@holi/ui/components/organisms/HoliTabs/BotomLineSeperator'
import TabButton from '@holi/ui/components/organisms/HoliTabs/TabButton'
import TabButtonList from '@holi/ui/components/organisms/HoliTabs/TabButtonList'
import type { HoliTabItem } from '@holi/ui/components/organisms/HoliTabs/types'
import Spacing from '@holi/ui/foundations/Spacing'

export const DEFAULT_TAB_ID = 'all' as const

interface Tab extends HoliTabItem {
  key: string
}

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
      key: id,
      tabTitle: room.name,
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

  const [componentWidth, setComponentWidth] = useState(Platform.OS === 'web' ? 0 : Dimensions.get('window').width)

  const roomTabs = useAtomValue(roomTabsAtom)
  const defaultTab: Tab = {
    key: DEFAULT_TAB_ID,
    tabTitle: t('chat.tab.all'),
  }
  const tabs = [defaultTab].concat(roomTabs)

  return (
    <View onLayout={(event) => setComponentWidth(event.nativeEvent.layout.width)} style={{ width: '100%' }}>
      <BottomLineSeperator />
      <TabButtonList
        activeTab={selectedTabId}
        data={tabs}
        keyExtractor={({ key }) => key}
        renderItem={({ key, item }) => (
          <TabButton
            id="chat-bar"
            tabId={key}
            tabTitle={item.tabTitle}
            tabIcons={item.tabIcons}
            onPress={() => (isWeb ? replaceRoute('/chat?activeTab=' + key) : setParams({ activeTab: key }))}
            isActive={selectedTabId === key}
          />
        )}
        width={componentWidth}
        marginHorizontal={Spacing.xs}
      />
    </View>
  )
}

export default ChatTabBar
