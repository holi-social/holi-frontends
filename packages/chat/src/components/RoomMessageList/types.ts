import React from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import { ChatMessage, ChatTextMessage } from '@holi/chat/src/store'
import { User } from '@holi/core/screens/userprofile/types'

export interface RoomMessageListProps {
  messages: ChatMessage[]
  matrixIdToHoliUserRecord: Record<string, User | undefined>
  roomId: string
  roomType: string
  starter?: React.ReactNode
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

export interface MessageSection {
  title: string
}

export type MessageItem = ChatMessage | MessageSection

export const isMessageSection = (item: MessageItem): item is MessageSection => {
  return 'title' in item
}

export const isChatTextMessage = (item: MessageItem): item is ChatTextMessage => {
  return 'type' in item && item.type === 'message'
}
