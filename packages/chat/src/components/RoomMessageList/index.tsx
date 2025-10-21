import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import type { ChatRoomMessage } from '@holi/chat/src/client/types'
import RoomMessageSection from '@holi/chat/src/components/RoomMessageList/RoomMessageSection'
import { type MessageItem, isMessageSection, isTextMessageItem } from '@holi/chat/src/components/RoomMessageList/types'
import { FlashList } from '@shopify/flash-list'
import { getSectionDisplayDate } from '@holi/chat/src/utils/date'
import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import RoomMessage from './RoomMessage'
import type { RoomMessageListProps } from './types'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Spacing } from 'holi-bricks/foundations'

const groupByDate = (messages: ChatRoomMessage[], locale: string): MessageItem[] => {
  const groupedMessages: Record<string, MessageItem[]> = {}
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

    groupedMessages[formattedDate] = groupedMessages[formattedDate] ?? [
      { title: getSectionDisplayDate(locale, timestamp) },
    ]
    groupedMessages[formattedDate].push(message)
  }

  return Object.values(groupedMessages).flat()
}

const RoomMessageList = ({
  messages = [],
  matrixIdToHoliUserRecord,
  starter,
  onScroll,
  roomId,
}: RoomMessageListProps) => {
  const { i18n } = useTranslation()
  const { styles } = useStyles(stylesheet)

  const groupedMessages = groupByDate(messages, i18n.language)
  return (
    <FlashList
      renderItem={({ item: message, index }) => {
        if (isMessageSection(message)) return <RoomMessageSection messageSection={message} />

        const isFirstMessageInSection = index === 0
        const prevMessage = groupedMessages[index + 1]
        const isPrevMessageFromSameUser =
          !!prevMessage && isTextMessageItem(prevMessage) && prevMessage?.sender === message.sender
        const nextMessage = groupedMessages[index - 1]
        const isNextMessageFromSameUser =
          !!nextMessage && isTextMessageItem(nextMessage) && nextMessage?.sender === message.sender

        return (
          <RoomMessage
            roomId={roomId}
            message={message}
            holiUser={matrixIdToHoliUserRecord[message.sender ?? '']}
            showAvatar={isFirstMessageInSection || !isNextMessageFromSameUser}
            isPrevMessageFromSameUser={isPrevMessageFromSameUser}
            isNextMessageFromSameUser={isNextMessageFromSameUser}
          />
        )
      }}
      data={groupedMessages}
      maintainVisibleContentPosition={{
        autoscrollToBottomThreshold: 0.2,
        startRenderingFromBottom: true,
      }}
      onScroll={onScroll}
      removeClippedSubviews
      keyboardDismissMode="interactive"
      ListHeaderComponent={() => <View style={styles.listHeaderSpacer}>{starter}</View>}
      ListFooterComponent={() => <View style={styles.listFooterSpacer} />}
    />
  )
}

export default RoomMessageList

const stylesheet = createStyleSheet(() => ({
  listHeaderSpacer: {
    paddingHorizontal: Spacing['xs'],
  },
  listFooterSpacer: {
    height: 20,
  },
}))
