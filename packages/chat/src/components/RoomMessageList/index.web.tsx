import React from 'react'
import { useTranslation } from 'react-i18next'
import { SectionList, View } from 'react-native'
import { StyleSheet } from 'react-native'

import type { ChatRoomMessage } from '@holi/chat/src/client/types'
import RoomMessageSection from '@holi/chat/src/components/RoomMessageList/RoomMessageSection'
import { getSectionDisplayDate } from '@holi/chat/src/utils/date'
import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import { colors, dimensions } from '@holi/ui/styles/globalVars'

import RoomMessage from './RoomMessage'
import { RoomMessageListProps, isTextMessageItem } from './types'

interface MessageDateGroup {
  title: string
  data: ChatRoomMessage[]
}

const groupByDate = (messages: ChatRoomMessage[], locale: string): MessageDateGroup[] => {
  const groupedMessages: Record<string, MessageDateGroup> = {}
  locale = getLocale(locale)

  for (const message of messages) {
    const { timestamp } = message
    let formattedDate = ''

    if (timestamp) {
      const date = new Date(timestamp)
      formattedDate = Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }).format(date)
    }

    groupedMessages[formattedDate] = groupedMessages[formattedDate] ?? {
      title: getSectionDisplayDate(locale, timestamp),
      data: [],
    }
    groupedMessages[formattedDate].data.unshift(message)
  }

  return Object.values(groupedMessages).reverse()
}

const RoomMessageList = ({
  messages = [],
  matrixIdToHoliUserRecord,
  starter,
  onScroll,
  roomId,
}: RoomMessageListProps) => {
  const { i18n } = useTranslation()

  const groupedMessages = groupByDate(messages, i18n.language)

  return (
    <SectionList
      sections={groupedMessages}
      keyExtractor={(item) => item.id}
      renderItem={({ item: message, index, section: { data: list } }) => {
        const isFirstMessageInSection = index === 0
        const prevMessage = list[index + 1]
        const isPrevMessageFromSameUser =
          !!prevMessage && isTextMessageItem(prevMessage) && prevMessage.sender === message.sender
        const nextMessage = list[index - 1]
        const isNextMessageFromSameUser =
          !!nextMessage && isTextMessageItem(prevMessage) && nextMessage.sender === message.sender

        return (
          <View style={styles.listItemContainer}>
            <RoomMessage
              roomId={roomId}
              message={message}
              holiUser={matrixIdToHoliUserRecord[message.sender ?? '']}
              showAvatar={isFirstMessageInSection || !isNextMessageFromSameUser}
              isPrevMessageFromSameUser={isPrevMessageFromSameUser}
              isNextMessageFromSameUser={isNextMessageFromSameUser}
            />
          </View>
        )
      }}
      renderSectionFooter={({ section }) => <RoomMessageSection messageSection={section} />}
      // BE CAREFUL: this section list is inverted! So, ListHeaderComponent is shown bellow and ListFooterComponent above in the list
      // use ListFooterComponent to add padding bottom for HeaderAnimated
      ListHeaderComponent={() => <View style={styles.listHeaderSpacer} />}
      ListFooterComponent={() => <View style={styles.listFooterSpacer}>{starter}</View>}
      stickySectionHeadersEnabled={false}
      inverted={true}
      style={styles.list}
      removeClippedSubviews
      updateCellsBatchingPeriod={20}
      windowSize={11}
      onScroll={onScroll}
    />
  )
}

export default RoomMessageList

const styles = StyleSheet.create({
  list: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background20,
  },
  listItemContainer: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: dimensions.maxScreenWidth,
  },
  listFooterSpacer: {
    paddingTop: dimensions.topBarHeight,
  },
  listHeaderSpacer: {
    height: 20,
  },
})
