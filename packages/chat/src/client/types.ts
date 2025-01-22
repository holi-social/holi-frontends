import { EventType, type IRoomEvent, type IStateEvent, type NotificationCountType, type Room } from 'matrix-js-sdk'

export type MatrixId = `@${string}:${string}`

export type ChatRoomType = 'private' | 'space' | 'space.child' | 'space.task'

export type SharedDataContent = SpaceSharedDataContent | SpaceChildSharedDataContent

export interface SpaceSharedDataContent {
  roomId: string
  holiSpaceId: string
}

export interface SpaceChildSharedDataContent extends SpaceSharedDataContent {
  spaceName: string
  avatarDefaultColor: string
  parentSpaceRoomId: string
}

export interface SpaceTaskSharedDataContent extends SpaceSharedDataContent {
  taskName: string
  avatarDefaultColor: string
  taskId: string
}

export interface PrivateRoom {
  type: 'private'
  room: Room
}

export interface SpaceRoom {
  type: 'space'
  content: SpaceSharedDataContent
  room: Room
}

export interface SpaceChildRoom {
  type: 'space.child'
  content: SpaceChildSharedDataContent
  room: Room
}

export interface SpaceTaskRoom {
  type: 'space.task'
  content: SpaceTaskSharedDataContent
  room: Room
}

export type RoomWithSharedData = PrivateRoom | SpaceRoom | SpaceChildRoom | SpaceTaskRoom

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

export interface SpaceTaskChatRoom extends BaseChatRoom, Omit<SpaceTaskRoom, 'room'> {
  content: SpaceTaskSharedDataContent
}

export type ChatRoom = PrivateChatRoom | SpaceChatRoom | SpaceChildChatRoom | SpaceTaskChatRoom

export enum RoomUpdatesType {
  name = EventType.RoomName,
  avatar = EventType.RoomAvatar,
}

export interface RoomUpdatesContent {
  name: string
  url?: string
}

export interface CreateRoomOptions {
  isDirectMessage: boolean
  isPrivate?: boolean
  name?: string
}

export enum MembershipStatus {
  /**
   * The user is effectively invited to the room. Currently this is a direct map
   * to the invite membership as no other membership states are effectively
   * invites.
   */
  invite = 'invite',

  /**
   * The user is effectively joined to the room. For example, actually joined
   * or knocking on the room (when that becomes possible).
   */
  join = 'join',

  /**
   * The user is effectively no longer in the room. For example, kicked,
   * banned, or voluntarily left.
   */
  leave = 'leave',

  /**
   * The user is not allowed to join the room
   */
  ban = 'ban',

  /**
   * the user has requested to participate in the room, but has not yet been allowed to
   */
  knock = 'knock',
}

export type NotificationCount = Partial<Record<NotificationCountType, number>>

export interface RoomId {
  room_id: string
}

export interface ChatRoomMember {
  id: MatrixId // the matrix ID (e.g. '@otto:holi.social')
  name: string
  avatar?: string
  membership?: MembershipStatus
}

export enum ChatRoomEvent {
  SharedData = 'holi.room.shared.data',
}

/**
 * Messages
 */
export interface ChatRoomMessage {
  type: ChatMessageType
  content: MsgContent
  roomId: string
  id: string
  sender: string | undefined
  timestamp?: number
}

export type MsgContent = ChatMsgTextContent | ChatMsgMemberContent
export type ChatMessageType = 'message' | 'membership'
export type ChatMsgContentType = 'm.text'

export interface ChatMsgTextContent {
  body: string
  msgtype: ChatMsgContentType
}

export interface ChatMsgMemberContent {
  membership?: string
  name?: string
  avatar?: string
}

export interface MxMessagesResponse {
  start?: string
  end?: string
  chunk: IRoomEvent[]
  state?: IStateEvent[]
}
