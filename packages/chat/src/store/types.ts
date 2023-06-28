import type { PrimitiveAtom } from 'jotai'

export type ChatRoomAtom = PrimitiveAtom<ChatRoom>

export interface ChatRoom {
  id: string
  hasInvitation: boolean
  threads: ChatMessage[]
}

export type ChatContentType = 'm.text'

export interface ChatMessageContent {
  body: string
  msgtype: ChatContentType
}

export interface ChatMessage {
  content: ChatMessageContent
  ts: number
  room_id: string
  id: string
  sender: string | undefined
}
