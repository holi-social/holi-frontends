import React from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import { ChatMessage, ChatTextMessage } from '@holi/chat/src/store'
import { User } from '@holi/core/screens/userprofile/types'

export interface RoomMessageListProps {
  messages: ChatMessage[]
  matrixIdToHoliUserRecord: Record<string, User | undefined>
  starter?: React.ReactNode
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  roomType: string
}

export interface RoomMessageProps {
  message: ChatMessage
  user?: User
  showAvatar?: boolean
  isPrevMessageFromSameUser?: boolean
  isNextMessageFromSameUser?: boolean
  testID?: string
}

export interface ListSectionHeader {
  title: string
}

export type MessageListItem = ChatMessage | ListSectionHeader

export const isMessageSection = (item: MessageListItem): item is ListSectionHeader => {
  return 'title' in item
}

export const isChatTextMessage = (item: MessageListItem): item is ChatTextMessage => {
  return 'type' in item && item.type === 'message'
}
