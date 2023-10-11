import { NotificationCountType, Room } from 'matrix-js-sdk'

export type MatrixId = `@${string}:${string}`

export interface CreateRoomOptions {
  isDirectMessage: boolean
  isPrivate?: boolean
  name?: string
}

export interface CreateSpaceOptions {
  name: string
  holiSpaceId: string
}

export interface SharedDataContent {
  holiSpaceId?: string
  spaceId?: string
  spaceName?: string
}

export interface RoomWithSharedData extends SharedDataContent {
  room: Room
}

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

// export interface SharedDataContent {
//   holiSpaceId?: string
//   spaceId?: string
//   spaceName?: string
// }

// export interface SharedRoomData {
//   room: Room
//   content: SharedDataContent
// }
