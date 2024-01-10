import type { Atom, PrimitiveAtom } from 'jotai'

import type {
  ChatRoomMember,
  ChatRoomMessage,
  MatrixId,
  PrivateRoom,
  RoomWithSharedData,
  SpaceChildRoom,
  SpaceChildSharedDataContent,
  SpaceRoom,
  SpaceSharedDataContent,
} from '@holi/chat/src/client/types'

/**
 * Room
 */

export type HoliIdentity = string
export type ChatRoomId = string
export type ChatRoomAtom = PrimitiveAtom<ChatRoom>
export type PrivateChatRoomAtom = PrimitiveAtom<PrivateChatRoom>
export type SpaceRoomAtom = PrimitiveAtom<SpaceChatRoom>
export type SpaceChildRoomAtom = PrimitiveAtom<SpaceChildChatRoom>
export type ChatMessagesAtom = PrimitiveAtom<ChatRoomMessage[]>
export type RoomAtomByRoomId = Record<ChatRoomId, ChatRoomAtom>
export type MessageAtomsByRoomId = Record<ChatRoomId, ChatMessagesAtom>

export type AtomRecordGetter = <T>(atom: Atom<Record<string, T>>) => Record<string, T>

export interface BaseChatRoom {
  id: string
  name: string
  avatar?: string
  hasInvitation: boolean
  notificationCount: number
  lastMessage: ChatRoomMessage | undefined
  creator: ChatRoomMember | null
  members: ChatRoomMember[]
  senderId?: string
  timestamp: number | undefined
}

export type PrivateChatRoom = BaseChatRoom & Omit<PrivateRoom, 'room'>
export interface SpaceChatRoom extends BaseChatRoom, Omit<SpaceRoom, 'room'> {
  content: SpaceSharedDataContent
}
export interface SpaceChildChatRoom extends BaseChatRoom, Omit<SpaceChildRoom, 'room'> {
  content: SpaceChildSharedDataContent
}

export type ChatRoom = PrivateChatRoom | SpaceChatRoom | SpaceChildChatRoom
export type SpaceChatTab = SpaceChildChatRoom & Pick<ChatRoom, 'id' | 'members' | 'timestamp'>
export type PrivateChatTab = PrivateRoom & Pick<ChatRoom, 'id' | 'members' | 'timestamp'>

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
  homeserverUrl: string
}

interface UpdateRoomArgs {
  type: RoomAtomsActionType.UPDATE
  chatRoomList: ChatRoom[]
  homeserverUrl: string
}

interface DeleteRoomArgs {
  type: RoomAtomsActionType.DELETE
  roomId: string
  homeserverUrl: string
}

export type RoomAtomsRecordAtomSubscriberArgs = CreateRoomArgs | UpdateRoomArgs | DeleteRoomArgs

/**
 * Message
 */

export interface CreateMessage {
  roomId: string
  text: string
}
