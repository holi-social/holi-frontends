import type { Atom, PrimitiveAtom } from 'jotai'

import type {
  ChatRoom,
  ChatRoomMessage,
  MatrixId,
  PrivateRoom,
  RoomWithSharedData,
  SpaceChatRoom,
  SpaceChildChatRoom,
} from '@holi/chat/src/client/types'

/**
 * Room
 */

export type HoliIdentity = string
export type ChatRoomId = string
export type ChatRoomAtom = PrimitiveAtom<ChatRoom>
export type SpaceRoomAtom = PrimitiveAtom<SpaceChatRoom>
export type ChatMessagesAtom = PrimitiveAtom<ChatRoomMessage[]>
export type RoomAtomByRoomId = Record<ChatRoomId, ChatRoomAtom>
export type MessageAtomsByRoomId = Record<ChatRoomId, ChatMessagesAtom>

export type AtomRecordGetter = <T>(atom: Atom<Record<string, T>>) => Record<string, T>

export type SpaceChatTab = SpaceChildChatRoom & Pick<ChatRoom, 'id' | 'members' | 'timestamp'>
export type PrivateChatTab = PrivateRoom & Pick<ChatRoom, 'id' | 'members' | 'timestamp'>

export enum RoomAtomsActionType {
  CREATE,
  UPDATE,
  DELETE,
  INIT,
}

export interface RoomUserData {
  room: RoomWithSharedData
  hasPendingInvitation: boolean
  ignoredUsers: MatrixId[]
}

interface InitRoomArgs {
  type: RoomAtomsActionType.INIT
  rooms: ChatRoom[]
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

export type RoomAtomsRecordAtomSubscriberArgs = CreateRoomArgs | UpdateRoomArgs | DeleteRoomArgs | InitRoomArgs

/**
 * Message
 */

export interface CreateMessage {
  roomId: string
  text: string
}
