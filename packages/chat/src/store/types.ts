export interface ChatRoom {
  id: string
  hasInvitation: boolean
}

export type ChatContentType = 'm.text'

export interface ChatMessageContent {
  body: string
  msgtype: ChatContentType
}

export interface ChatMessage {
  content: ChatMessageContent
  id: string
  ts: number
  room_id: string
  sender: string
}
