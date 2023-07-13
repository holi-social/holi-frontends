import type { PrimitiveAtom } from 'jotai'

export type ChatRoomAtom = PrimitiveAtom<ChatRoom>
export type ChatThreadAtom = PrimitiveAtom<ChatRoom>

export interface ChatRoom {
  id: string
  name: string
  hasInvitation: boolean
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
  timestamp?: number
  room_id: string
  id?: string
  sender: string | undefined
}

export interface CreateMessage {
  roomId: string
  text: string
}
