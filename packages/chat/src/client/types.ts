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

export interface RoomId {
  room_id: string
}

export interface ChatMember {
  name: string
  id: string
  membership?: MembershipStatus
}
