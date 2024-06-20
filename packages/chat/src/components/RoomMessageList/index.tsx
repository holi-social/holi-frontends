import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, View } from 'react-native'
import { StyleSheet } from 'react-native'

import type { ChatRoomMessage } from '@holi/chat/src/client/types'
import RoomMessageSection from '@holi/chat/src/components/RoomMessageList/RoomMessageSection'
import { MessageItem, isMessageSection, isTextMessageItem } from '@holi/chat/src/components/RoomMessageList/types'
import { getSectionDisplayDate } from '@holi/chat/src/utils/date'
import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import RoomMessage from './RoomMessage'
import { RoomMessageListProps } from './types'

const groupByDate = (messages: ChatRoomMessage[], locale: string): MessageItem[] => {
  const groupedMessages: Record<string, MessageItem[]> = {}
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

const RoomMessageList = ({
  messages = [],
  matrixIdToHoliUserRecord,
  starter,
  onScroll,
  roomId,
}: RoomMessageListProps) => {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const groupedMessages = groupByDate(messages, i18n.language)

  return (
    <FlatList
      data={groupedMessages}
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
      // BE CAREFUL: this section list is inverted! So, ListHeaderComponent is shown bellow and ListFooterComponent above in the list
      // use ListFooterComponent to add padding bottom for HeaderAnimated
      ListHeaderComponent={() => <View style={styles.listHeaderSpacer} />}
      ListFooterComponent={() => <View style={styles.listFooterSpacer}>{starter}</View>}
      inverted={true}
      contentContainerStyle={styles.list}
      onScroll={onScroll}
    />
  )
}

export default RoomMessageList

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    list: {
      backgroundColor: theme.colors.background20,
    },
    listFooterSpacer: {
      paddingTop: dimensions.topBarHeight,
    },
    listHeaderSpacer: {
      height: 20,
    },
  })
