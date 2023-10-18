import type { Atom, PrimitiveAtom } from 'jotai'

import {
  ChatRoomMember,
  PrivateRoomBase,
  RoomType,
  SpaceGeneralRoomBase,
  SpaceRoomBase,
} from '@holi/chat/src/client/types'

export type HoliIdentity = string
export type ChatRoomId = string
export type ChatRoomAtom = PrimitiveAtom<ChatRoom>
export type ChatMessagesAtom = PrimitiveAtom<ChatMessage[]>
export type RoomAtomByRoomId = Record<ChatRoomId, ChatRoomAtom>
export type MessageAtomsByRoomId = Record<ChatRoomId, ChatMessagesAtom>

export type AtomRecordGetter = <T>(atom: Atom<Record<string, T>>) => Record<string, T>

interface BaseChatRoom {
  type: RoomType
  id: string
  name: string
  hasInvitation: boolean
  notificationCount: number
  lastMessage: ChatMessage | undefined
  creator: ChatRoomMember | null
  members: ChatRoomMember[]
  senderId?: string
  timestamp: number | undefined
  holiSpaceId?: string
  spaceId?: string
  spaceName?: string
}

type PrivateChatRoom = BaseChatRoom & PrivateRoomBase
type SpaceChatRoom = BaseChatRoom & SpaceRoomBase
type SpaceGeneralChatRoom = BaseChatRoom & SpaceGeneralRoomBase

export type ChatRoom = PrivateChatRoom | SpaceChatRoom | SpaceGeneralChatRoom

export type ChatContentType = 'm.text'

export interface ChatMessageContent {
  body: string
  msgtype: ChatContentType
}

export interface ChatMessage {
  content: ChatMessageContent
  timestamp?: number
  room_id: string
  id: string
  sender: string | undefined
}

export interface CreateMessage {
  roomId: string
  text: string
}
