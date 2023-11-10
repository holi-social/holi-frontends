import type { Atom, PrimitiveAtom } from 'jotai'
import type { Room } from 'matrix-js-sdk'

import type {
  ChatRoomMember,
  MatrixId,
  PrivateRoomBase,
  RoomWithSharedData,
  SpaceGeneralRoomBase,
  SpaceRoomBase,
} from '@holi/chat/src/client/types'

/**
 * Room
 */

export type HoliIdentity = string
export type ChatRoomId = string
export type ChatRoomAtom = PrimitiveAtom<ChatRoom>
export type SpaceGeneralChatRoomAtom = PrimitiveAtom<SpaceGeneralChatRoom>
export type ChatMessagesAtom = PrimitiveAtom<ChatMessage[]>
export type RoomAtomByRoomId = Record<ChatRoomId, ChatRoomAtom>
export type MessageAtomsByRoomId = Record<ChatRoomId, ChatMessagesAtom>

export type AtomRecordGetter = <T>(atom: Atom<Record<string, T>>) => Record<string, T>

interface BaseChatRoom {
  id: string
  name: string
  avatar?: string
  hasInvitation: boolean
  notificationCount: number
  lastMessage: ChatMessage | undefined
  creator: ChatRoomMember | null
  members: ChatRoomMember[]
  senderId?: string
  timestamp: number | undefined
}

export interface PrivateChatRoom extends BaseChatRoom, PrivateRoomBase {}
export interface SpaceChatRoom extends BaseChatRoom, SpaceRoomBase {}
export interface SpaceGeneralChatRoom extends BaseChatRoom, SpaceGeneralRoomBase {}

export type ChatRoom = PrivateChatRoom | SpaceChatRoom | SpaceGeneralChatRoom
export type SpaceChatTab = SpaceGeneralRoomBase & Pick<ChatRoom, 'id' | 'members' | 'timestamp'>
export type PrivateChatTab = PrivateRoomBase & Pick<ChatRoom, 'id' | 'members' | 'timestamp'>

export enum RoomAtomsActionType {
  'CREATE',
  'UPDATE',
  'DELETE',
}

export interface RoomUserData {
  room: RoomWithSharedData
  hasPendingInvitation: boolean
  ignoredUsers: MatrixId[]
}

interface CreateRoomArgs {
  type: RoomAtomsActionType.CREATE
  roomList: RoomUserData[]
}

interface UpdateRoomArgs {
  type: RoomAtomsActionType.UPDATE
  chatRoomList: ChatRoom[]
}

interface DeleteRoomArgs {
  type: RoomAtomsActionType.DELETE
  roomId: string
}

export type RoomAtomsRecordAtomSubscriberArgs = CreateRoomArgs | UpdateRoomArgs | DeleteRoomArgs

export const isSpaceGeneralChatRoom = (room: ChatRoom): room is SpaceGeneralChatRoom =>
  room.type === 'space-general-room'

/**
 * Message
 */

export type ChatContentType = 'm.text'

export interface ChatMessageContent {
  body: string
  msgtype: ChatContentType
}

export interface ChatMembershipContent {
  displayname: string
  membership: 'join' | 'leave'
}

export interface ChatMessageBase {
  timestamp?: number
  room_id: string
  id: string
  sender: string | undefined
}

export interface ChatTextMessage extends ChatMessageBase {
  type: 'message'
  content: ChatMessageContent
}

export interface ChaMembershipMessage extends ChatMessageBase {
  type: 'membership'
  content: ChatMembershipContent
}

export type ChatMessage = ChatTextMessage | ChaMembershipMessage

export interface CreateMessage {
  roomId: string
  text: string
}

/**
 * Member
 */
export interface MyMembershipOptions {
  room: Room
  membership: string
  prevMembership?: string
}
