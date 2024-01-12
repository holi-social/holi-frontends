import React from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import type { ChatRoomMessage } from '@holi/chat/src/client/types'
import { User } from '@holi/core/screens/userprofile/types'

export interface RoomMessageListProps {
  messages: ChatRoomMessage[]
  matrixIdToHoliUserRecord: Record<string, User | undefined>
  roomId: string
  roomType: string
  starter?: React.ReactNode
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

export interface MessageSection {
  title: string
}

export type MessageItem = ChatRoomMessage | MessageSection

export const isMessageSection = (item: MessageItem): item is MessageSection => {
  return 'title' in item
}

export const isTextMessageItem = (item: MessageItem): item is ChatRoomMessage => {
  return 'type' in item && item.type === 'message'
}
