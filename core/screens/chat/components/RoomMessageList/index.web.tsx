import React from 'react'
import { useTranslation } from 'react-i18next'
import { SectionList, View } from 'react-native'
import { StyleSheet } from 'react-native'

import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import RoomMessage from '@holi/core/screens/chat/components/RoomMessageList/RoomMessage'
import { getSectionDisplayDate } from '@holi/core/screens/chat/components/RoomMessageList/helpers'
import { Message, Room } from '@holi/core/screens/chat/components/seed'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors, vars } from '@holi/ui/styles/globalVars'

interface MessageDateGroup {
  title: string
  data: Message[]
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

    groupedMessages[formatedDate] = groupedMessages[formatedDate] ?? {
      title: getSectionDisplayDate(locale, message.postedAt),
      data: [],
    }
    groupedMessages[formatedDate].data.unshift(message)
  }

  return Object.values(groupedMessages).reverse()
}

interface RoomMessageListProps {
  room: Room
}

const RoomMessageList = ({ room }: RoomMessageListProps) => {
  const { i18n } = useTranslation()

  const groupedMessages = groupByDate(room?.messages ?? [], i18n.language)

  return (
    <SectionList
      sections={groupedMessages}
      keyExtractor={(item) => item.id}
      renderItem={({ item: message, index, section: { data: list } }) => {
        const isFirstMessageInSection = index === 0
        const prevMessage = list[index + 1]
        const isPrevMessageFromSameUser = prevMessage && prevMessage?.user?.id === message.user?.id
        const nextMessage = list[index - 1]
        const isNextMessageFromSameUser = nextMessage && nextMessage?.user?.id === message.user?.id

        return (
          <RoomMessage
            message={message}
            showAvatar={isFirstMessageInSection || !isNextMessageFromSameUser}
            isPrevMessageFromSameUser={isPrevMessageFromSameUser}
            isNextMessageFromSameUser={isNextMessageFromSameUser}
          />
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
      ListFooterComponent={() => <View style={styles.listFooterSpacer} />}
      stickySectionHeadersEnabled={false}
      inverted={true}
      style={styles.list}
      removeClippedSubviews
      updateCellsBatchingPeriod={20}
      windowSize={11}
    />
  )
}

export default RoomMessageList

const styles = StyleSheet.create({
  list: {
    backgroundColor: colors.background20,
    height: '100%',
  },
  listFooterSpacer: {
    height: vars.topBarHeight,
  },
  listHeaderSpacer: {
    height: 20,
  },
})
