import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Animated, { LayoutAnimationConfig, ZoomInEasyDown, LinearTransition } from 'react-native-reanimated'
import type { ChatRoomMessage } from '@holi/chat/src/client/types'
import RoomMessageSection from '@holi/chat/src/components/RoomMessageList/RoomMessageSection'
import { type MessageItem, isMessageSection, isTextMessageItem } from '@holi/chat/src/components/RoomMessageList/types'
import { getSectionDisplayDate } from '@holi/chat/src/utils/date'
import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import { dimensions } from '@holi/ui/styles/globalVars'

import RoomMessage from './RoomMessage'
import type { RoomMessageListProps } from './types'
import { createStyleSheet } from 'holi-bricks/utils'
import { useStyles } from 'holi-bricks/hooks'

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
  const { styles } = useStyles(stylesheet)

  const groupedMessages = groupByDate(messages, i18n.language)

  return (
    // skip entering animation for the first render
    <LayoutAnimationConfig skipEntering>
      <Animated.FlatList
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
            <Animated.View entering={ZoomInEasyDown}>
              <RoomMessage
                roomId={roomId}
                message={message}
                holiUser={matrixIdToHoliUserRecord[message.sender ?? '']}
                showAvatar={isFirstMessageInSection || !isNextMessageFromSameUser}
                isPrevMessageFromSameUser={isPrevMessageFromSameUser}
                isNextMessageFromSameUser={isNextMessageFromSameUser}
              />
            </Animated.View>
          )
        }}
        initialNumToRender={15}
        // BE CAREFUL: this section list is inverted! So, ListHeaderComponent is shown bellow and ListFooterComponent above in the list
        // use ListFooterComponent to add padding bottom for HeaderAnimated
        inverted={true}
        onScroll={onScroll}
        keyboardDismissMode="interactive"
        ListHeaderComponent={() => <View style={styles.listHeaderSpacer} />}
        ListFooterComponent={() => <View style={styles.listFooterSpacer}>{starter}</View>}
        itemLayoutAnimation={LinearTransition.springify().damping(14).stiffness(90)}
      />
    </LayoutAnimationConfig>
  )
}

export default RoomMessageList

const stylesheet = createStyleSheet((theme) => ({
  listFooterSpacer: {
    paddingTop: dimensions.topBarHeight,
  },
  listHeaderSpacer: {
    height: 20,
  },
  container: {
    flex: 1,
  },
  list: {
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
}))
