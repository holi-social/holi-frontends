import { FlashList } from '@shopify/flash-list'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { StyleSheet } from 'react-native'

import { ChatMessage } from '@holi/chat/src/store'
import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors, vars } from '@holi/ui/styles/globalVars'

import RoomMessage from './RoomMessage'
import { getSectionDisplayDate } from './helpers'
import { RoomMessageListProps } from './types'

interface ListSectionHeader {
  title: string
}

type MessageListItem = ChatMessage | ListSectionHeader

const isMessageSection = (item: MessageListItem): item is ListSectionHeader => {
  return 'title' in item
}

const groupByDate = (messages: ChatMessage[], locale: string): MessageListItem[] => {
  const groupedMessages: Record<string, MessageListItem[]> = {}
  locale = getLocale(locale)

  for (const message of messages) {
    const { timestamp } = message
    let formatedDate = ''

    if (timestamp) {
      const date = new Date(timestamp)
      formatedDate = Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }).format(date)
    }

    groupedMessages[formatedDate] = groupedMessages[formatedDate] ?? [
      { title: getSectionDisplayDate(locale, timestamp) },
    ]
    groupedMessages[formatedDate].unshift(message)
  }

  return Object.values(groupedMessages).reverse().flat()
}

const RoomMessageList = ({ messages, mxIdUserRecord }: RoomMessageListProps) => {
  const { i18n } = useTranslation()

  const groupedMessages = groupByDate(messages, i18n.language)

  return (
    <FlashList
      data={groupedMessages}
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
        const prevMessage = groupedMessages[index + 1]
        const isPrevMessageFromSameUser =
          !!prevMessage && !isMessageSection(prevMessage) && prevMessage?.sender === item.sender
        const nextMessage = groupedMessages[index - 1]
        const isNextMessageFromSameUser =
          !!nextMessage && !isMessageSection(nextMessage) && nextMessage?.sender === item.sender

        return (
          <RoomMessage
            message={item}
            user={mxIdUserRecord[item.sender ?? '']}
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
