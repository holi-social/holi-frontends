import { EventType, IRoomEvent, IStateEvent, NotificationCountType, Room } from 'matrix-js-sdk'

export type MatrixId = `@${string}:${string}`

export type RoomType = 'private' | 'space' | 'space.child'

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

export type RoomWithSharedData = PrivateRoom | SpaceRoom | SpaceChildRoom

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

export const memberships = ['invite', 'join', 'leave', 'ban', 'knock'] as const
export type Memberships = typeof memberships
export type Membership = Memberships[number]

export enum MembershipStatus {
  /**
   * The user is effectively joined to the room. For example, actually joined
   * or knocking on the room (when that becomes possible).
   */
  Joined = 'JOIN',

  /**
   * The user is effectively invited to the room. Currently this is a direct map
   * to the invite membership as no other membership states are effectively
   * invites.
   */
  Invited = 'INVITE',

  /**
   * The user is effectively no longer in the room. For example, kicked,
   * banned, or voluntarily left.
   */
  Left = 'LEFT',
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

export interface MxMessagesResponse {
  start?: string
  end?: string
  chunk: IRoomEvent[]
  state?: IStateEvent[]
}
