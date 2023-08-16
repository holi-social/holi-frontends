import type { PrimitiveAtom } from 'jotai'

import { ChatMember } from '@holi/chat/src/client/types'

export type ChatRoomAtom = PrimitiveAtom<ChatRoom>
export type ChatMessagesAtom = PrimitiveAtom<ChatMessage[]>

export type RoomAtomsRecord = Record<string, ChatRoomAtom>

export interface ChatRoom {
  id: string
  name: string
  hasInvitation: boolean
  notificationCount: number
  lastMessage: ChatMessage | undefined
  creator: ChatMember | null
  members: ChatMember[]
  senderId?: string
  timestamp: number | undefined
}

export type ChatContentType = 'm.text'

export interface ChatMessageContent {
  body: string
  msgtype: ChatContentType
}

export interface ChatMessage {
  content: ChatMessageContent
  timestamp?: number
  room_id: string
  id?: string
  sender: string | undefined
}

export interface CreateMessage {
  roomId: string
  text: string
}
