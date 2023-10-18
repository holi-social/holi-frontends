import { NotificationCountType, Room } from 'matrix-js-sdk'

export type MatrixId = `@${string}:${string}`

export interface CreateRoomOptions {
  isDirectMessage: boolean
  isPrivate?: boolean
  name?: string
}

interface SpaceSharedDataContent {
  holiSpaceId: string
}

interface SpaceGeneralRoomSharedDataContent extends SpaceSharedDataContent {
  spaceName: string
  parentSpaceRoomId: string
}

export type SharedDataContent = SpaceSharedDataContent | SpaceGeneralRoomSharedDataContent

export const isSpaceGeneralRoomSharedDataContent = (
  content: SharedDataContent
): content is SpaceGeneralRoomSharedDataContent => {
  return !!content && 'parentSpaceRoomId' in content
}

export type RoomType = 'private' | 'space' | 'space-general-room'

interface BaseRoomWithSharedData {
  type: RoomType
  room: Room
}

export interface PrivateRoomBase {
  type: 'private'
}

export interface SpaceRoomBase {
  type: 'space'
  content: SpaceSharedDataContent
}

export interface SpaceGeneralRoomBase {
  type: 'space-general-room'
  content: SpaceGeneralRoomSharedDataContent
}

export type PrivateRoomWithSharedData = BaseRoomWithSharedData & PrivateRoomBase
export type SpaceWithSharedData = BaseRoomWithSharedData & SpaceRoomBase
export type SpaceGeneralRoomWithSharedData = BaseRoomWithSharedData & SpaceGeneralRoomBase

export type RoomWithSharedData = PrivateRoomWithSharedData | SpaceWithSharedData | SpaceGeneralRoomWithSharedData

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

export type Membership = Lowercase<MembershipStatus>
export type NotificationCount = Partial<Record<NotificationCountType, number>>

export interface RoomId {
  room_id: string
}

export interface ChatRoomMember {
  id: MatrixId // the matrix ID (e.g. '@otto:holi.social')
  name: string
  membership?: MembershipStatus
}

export enum ChatRoomEvent {
  SharedData = 'holi.room.shared.data',
}
