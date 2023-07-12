import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SectionList, View } from 'react-native'
import { SafeAreaView } from 'react-native'
import { StyleSheet } from 'react-native'

import { getLocale, isToday, isYesterday } from '@holi/core/i18n/helpers/dateHelper'
import createParam from '@holi/core/navigation/hooks/useParam'
import RoomMessage from '@holi/core/screens/chat/components/RoomMessage'
import { Message, chatRoomListSeed } from '@holi/core/screens/chat/components/seed'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors, vars } from '@holi/ui/styles/globalVars'

export type ChatRoomPageParams = {
  roomId: string
}

const { useParam } = createParam<ChatRoomPageParams>()

interface MessageDateGroup {
  title: string
  data: Message[]
}

const getDisplayDate = (locale: string, dateStr?: string): string => {
  if (!dateStr) return ''

  locale = getLocale(locale)

  const date = new Date(dateStr)

  if (isToday(date)) {
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(0, 'day')
  } else if (isYesterday(date)) {
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-1, 'day')
  } else {
    return Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).format(date)
  }
}

const groupByDate = (messages: Message[], locale: string): MessageDateGroup[] => {
  const groupedMessages: Record<string, MessageDateGroup> = {}
  locale = getLocale(locale)

  for (const message of messages) {
    const date = new Date(message.postedAt)
    const formatedDate = Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).format(date)

    groupedMessages[formatedDate] ??= { title: getDisplayDate(locale, message.postedAt), data: [] }
    groupedMessages[formatedDate].data.unshift(message)
  }

  return Object.values(groupedMessages).reverse()
}

const ChatRoom = () => {
  const { i18n } = useTranslation()

  const sectionListRef = useRef<SectionList<Message, MessageDateGroup>>(null)

  // TODO: use real data
  const [roomId = ''] = useParam('roomId')
  const room = chatRoomListSeed.find(({ id }) => roomId === id)!
  const groupedMessages = groupByDate(room.messages, i18n.language)

  return (
    <SafeAreaView style={styles.wrapper}>
      <SectionList
        ref={sectionListRef}
        sections={groupedMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index, section: { data: list } }) => {
          const isFirstMessageInSection = index === 0
          const prevMessage = list[index + 1]
          const isPrevMessageFromSameUser = prevMessage && prevMessage?.user?.id === item.user?.id
          const nextMessage = list[index - 1]
          const isNextMessageFromSameUser = nextMessage && nextMessage?.user?.id === item.user?.id

          const paddingBottom = isNextMessageFromSameUser ? 2 : 8
          const paddingTop = isPrevMessageFromSameUser ? 2 : 8

          return (
            <HoliBox padding={[paddingTop, 0, paddingBottom, 0]}>
              <RoomMessage
                message={item}
                showAvatar={isFirstMessageInSection || !isNextMessageFromSameUser}
                isPrevMessageFromSameUser={isPrevMessageFromSameUser}
                isNextMessageFromSameUser={isNextMessageFromSameUser}
              />
            </HoliBox>
          )
        }}
        renderSectionFooter={({ section }) => (
          <HoliBox padding={[32, 0, 4, 0]}>
            <View style={{ alignItems: 'center' }}>
              <HoliText size="extrasmall" color="gray300">
                {section.title}
              </HoliText>
            </View>
          </HoliBox>
        )}
        // BE CAREFUL: because this section list is inverted ListHeaderComponent is shown bellow and ListFooterComponent above in the list
        // use ListFooterComponent to add padding bottom for HeaderAnimated
        ListHeaderComponent={() => <View style={styles.listHeaderSpacer} />}
        ListFooterComponent={() => <View style={styles.listFooterSpacer} />}
        stickySectionHeadersEnabled={false}
        inverted={true}
        style={styles.list}
      />
    </SafeAreaView>
  )
}

export default ChatRoom

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background20,
    ...Platform.select({
      web: {
        minHeight: '100%',
      },
    }),
  },
  list: {
    height: '100%',
  },
  listFooterSpacer: {
    height: vars.topBarHeight,
  },
  listHeaderSpacer: {
    height: (Platform.OS === 'web' ? +vars.bottomBarHeight : 0) + 20,
  },
  noResultsMessage: {
    marginTop: 24,
  },
})
