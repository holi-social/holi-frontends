import React from 'react'
import { useTranslation } from 'react-i18next'
import { SectionList, View } from 'react-native'
import { StyleSheet } from 'react-native'

import { ChatMessage } from '@holi/chat/src/store'
import { getSectionDisplayDate } from '@holi/chat/src/utils/date'
import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors, vars } from '@holi/ui/styles/globalVars'

import RoomMessage from './RoomMessage'
import { RoomMessageListProps } from './types'

interface MessageDateGroup {
  title: string
  data: ChatMessage[]
}

const groupByDate = (messages: ChatMessage[], locale: string): MessageDateGroup[] => {
  const groupedMessages: Record<string, MessageDateGroup> = {}
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

    groupedMessages[formatedDate] = groupedMessages[formatedDate] ?? {
      title: getSectionDisplayDate(locale, timestamp),
      data: [],
    }
    groupedMessages[formatedDate].data.unshift(message)
  }

  return Object.values(groupedMessages).reverse()
}

const RoomMessageList = ({ messages = [], matrixIdToHoliUserRecord, starter, onScroll }: RoomMessageListProps) => {
  const { i18n } = useTranslation()

  const groupedMessages = groupByDate(messages, i18n.language)

  return (
    <SectionList
      sections={groupedMessages}
      keyExtractor={(item) => item.id}
      renderItem={({ item: message, index, section: { data: list } }) => {
        const isFirstMessageInSection = index === 0
        const prevMessage = list[index + 1]
        const isPrevMessageFromSameUser = prevMessage && prevMessage?.sender === message.sender
        const nextMessage = list[index - 1]
        const isNextMessageFromSameUser = nextMessage && nextMessage?.sender === message.sender

        return (
          <View style={styles.listItemContainer}>
            <RoomMessage
              message={message}
              user={matrixIdToHoliUserRecord[message.sender ?? '']}
              showAvatar={isFirstMessageInSection || !isNextMessageFromSameUser}
              isPrevMessageFromSameUser={isPrevMessageFromSameUser}
              isNextMessageFromSameUser={isNextMessageFromSameUser}
            />
          </View>
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
    backgroundColor: colors.background20,
    height: '100%',
  },
  listItemContainer: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: vars.maxScreenWidth,
  },
  listFooterSpacer: {
    paddingTop: vars.topBarHeight,
  },
  listHeaderSpacer: {
    height: 20,
  },
})
