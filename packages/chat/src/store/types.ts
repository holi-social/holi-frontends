import type { PrimitiveAtom } from 'jotai'

export type ChatRoomAtom = PrimitiveAtom<ChatRoom>

export interface ChatRoom {
  id: string
  name: string
  hasInvitation: boolean
  threads?: ChatMessage[] // TODO: Move messages to other part of the store
  notificationCount: number
  lastThread: ChatMessage | undefined
}

export type ChatContentType = 'm.text'

export interface ChatMessageContent {
  body: string
  msgtype: ChatContentType
}

export interface ChatMessage {
  content: ChatMessageContent
  timestamp: number
  room_id: string
  id: string
  sender: string | undefined
}
