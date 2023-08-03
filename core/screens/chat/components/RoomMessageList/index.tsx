import { FlashList } from '@shopify/flash-list'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { StyleSheet } from 'react-native'

import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import { getSectionDisplayDate } from '@holi/core/screens/chat/components/RoomMessageList/helpers'
import { Message, Room } from '@holi/core/screens/chat/components/seed'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors, vars } from '@holi/ui/styles/globalVars'

import RoomMessage from './RoomMessage'

interface MessageSection {
  title: string
}

const isMessageSection = (item: MessageSection | Message): item is MessageSection => {
  return 'title' in item
}

type MessageListItem = Message | MessageSection

const sortByDate = (messages: Message[], locale: string): MessageListItem[] => {
  const sortedMessages: Record<string, MessageListItem[]> = {}
  locale = getLocale(locale)

  for (const message of messages) {
    const date = new Date(message.postedAt)
    const formatedDate = Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).format(date)

    sortedMessages[formatedDate] = sortedMessages[formatedDate] ?? [
      { title: getSectionDisplayDate(locale, message.postedAt) },
    ]
    sortedMessages[formatedDate].unshift(message)
  }

  return Object.values(sortedMessages).reverse().flat()
}

interface RoomMessageListProps {
  room: Room
}

const RoomMessageList = ({ room }: RoomMessageListProps) => {
  const { i18n } = useTranslation()

  const sortedMessages = sortByDate(room.messages, i18n.language)

  return (
    <FlashList
      data={sortedMessages}
      getItemType={(item) => (isMessageSection(item) ? 'sectionHeader' : 'row')}
      renderItem={({ item, index }) => {
        if (isMessageSection(item)) {
          return (
            <HoliBox padding={[32, 0, 4, 0]}>
              <View style={{ alignItems: 'center' }}>
                <HoliText size="extrasmall" color="gray300">
                  {item.title}
                </HoliText>
              </View>
            </HoliBox>
          )
        }

        const isFirstMessageInSection = index === 0
        const prevMessage = sortedMessages[index + 1]
        const isPrevMessageFromSameUser =
          !!prevMessage && !isMessageSection(prevMessage) && prevMessage?.user?.id === item.user?.id
        const nextMessage = sortedMessages[index - 1]
        const isNextMessageFromSameUser =
          !!nextMessage && !isMessageSection(nextMessage) && nextMessage?.user?.id === item.user?.id

        return (
          <RoomMessage
            message={item}
            showAvatar={isFirstMessageInSection || !isNextMessageFromSameUser}
            isPrevMessageFromSameUser={isPrevMessageFromSameUser}
            isNextMessageFromSameUser={isNextMessageFromSameUser}
          />
        )
      }}
      // BE CAREFUL: this section list is inverted! So, ListHeaderComponent is shown bellow and ListFooterComponent above in the list
      // use ListFooterComponent to add padding bottom for HeaderAnimated
      ListHeaderComponent={() => <View style={styles.listHeaderSpacer} />}
      ListFooterComponent={() => <View style={styles.listFooterSpacer} />}
      inverted={true}
      estimatedItemSize={80}
      contentContainerStyle={styles.list}
    />
  )
}

export default RoomMessageList

const styles = StyleSheet.create({
  list: {
    backgroundColor: colors.background20,
  },
  listFooterSpacer: {
    height: vars.topBarHeight,
  },
  listHeaderSpacer: {
    height: 20,
  },
})
