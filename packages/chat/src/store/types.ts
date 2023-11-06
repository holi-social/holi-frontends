import type { Atom, PrimitiveAtom } from 'jotai'

import { ChatRoomMember, PrivateRoomBase, SpaceGeneralRoomBase, SpaceRoomBase } from '@holi/chat/src/client/types'

export type HoliIdentity = string
export type ChatRoomId = string
export type ChatRoomAtom = PrimitiveAtom<ChatRoom>
export type ChatMessagesAtom = PrimitiveAtom<ChatMessage[]>
export type RoomAtomByRoomId = Record<ChatRoomId, ChatRoomAtom>
export type MessageAtomsByRoomId = Record<ChatRoomId, ChatMessagesAtom>

export type AtomRecordGetter = <T>(atom: Atom<Record<string, T>>) => Record<string, T>

interface BaseChatRoom {
  id: string
  name: string
  hasInvitation: boolean
  notificationCount: number
  lastMessage: ChatMessage | undefined
  creator: ChatRoomMember | null
  members: ChatRoomMember[]
  senderId?: string
  timestamp: number | undefined
}

interface PrivateChatRoom extends BaseChatRoom, PrivateRoomBase {}
interface SpaceChatRoom extends BaseChatRoom, SpaceRoomBase {}
interface SpaceGeneralChatRoom extends BaseChatRoom, SpaceGeneralRoomBase {}

export type ChatRoom = PrivateChatRoom | SpaceChatRoom | SpaceGeneralChatRoom
export type SpaceChatTab = SpaceGeneralRoomBase & Pick<ChatRoom, 'id' | 'members' | 'timestamp'>
export type PrivateChatTab = PrivateRoomBase & Pick<ChatRoom, 'id' | 'members' | 'timestamp'>

export const isSpaceGeneralChatRoom = (room: ChatRoom): room is SpaceGeneralChatRoom =>
  room.type === 'space-general-room'

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
