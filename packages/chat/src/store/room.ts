import { produce } from 'immer'
import { atom } from 'jotai'
import { EventTimeline, EventType, type Room, RoomMember } from 'matrix-js-sdk'

import { ChatMember, MembershipStatus } from '@holi/chat/src/client/types'
import { isRoomEvent } from '@holi/chat/src/store/utils'

import { createChatMessage } from './messages'
import type { ChatMessage, ChatRoom, ChatRoomAtom } from './types'

export interface UpdateInvitationOptions {
  room: Room
  membership: string
  prevMembership?: string
}

export const updateRoomInvitation = produce(
  (chatRoom: ChatRoom, { membership, prevMembership }: UpdateInvitationOptions) => {
    const hasJoined = prevMembership === 'invite' && membership === 'join'
    if (!hasJoined) return

    chatRoom.hasInvitation = !hasJoined
  }
)

export const updateRoomUnreadNotifications = produce((chatRoom: ChatRoom, count: number) => {
  chatRoom.notificationCount = count
})

export const updateRoomAfterNewMessage = produce((room: ChatRoom, message: ChatMessage) => {
  room.lastMessage = message
  room.timestamp = message.timestamp
})

export const addChatRoom = produce((roomAtoms: Record<string, ChatRoomAtom>, room: ChatRoom) => {
  const roomId = room.id
  const roomAtom = atom(room)

  const hasRoom = roomId in roomAtoms
  if (hasRoom) return
  roomAtoms[roomId] = roomAtom
})

export function createChatRoom(room: Room, hasInvitation = false): ChatRoom {
  const lastLiveEvent = room.getLastLiveEvent()?.event
  const lastMessage = isRoomEvent(lastLiveEvent) ? createChatMessage(room.roomId, lastLiveEvent) : undefined

  // TODO extract memberships from room to its own atom record
  const getMembership = (membership?: string) => {
    switch (membership) {
      case 'join':
        return MembershipStatus.Joined
      case 'invite':
        return MembershipStatus.Invited
      case 'leave':
        return MembershipStatus.Left
    }
  }

  const createChatMember = (mxRoomMember: RoomMember): ChatMember => {
    const { userId: id, name, membership } = mxRoomMember
    return {
      id,
      name,
      membership: getMembership(membership),
    }
  }

  const roomMxCreatorId = room.getCreator()
  const roomMxCreator = roomMxCreatorId ? room.getMember(roomMxCreatorId) : null

  return {
    hasInvitation,
    id: room.roomId,
    notificationCount: room.getUnreadNotificationCount() + (hasInvitation ? 1 : 0),
    name: room.name,
    lastMessage: lastMessage,
    creator: roomMxCreator && createChatMember(roomMxCreator),
    members: room.getMembers().map(createChatMember),
    timestamp:
      room.getLastActiveTimestamp() > 0
        ? room.getLastActiveTimestamp()
        : room.getLiveTimeline().getState(EventTimeline.FORWARDS)?.getStateEvents(EventType.RoomCreate, '')?.getTs(),
  }
}
