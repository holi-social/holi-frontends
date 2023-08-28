import { produce } from 'immer'
import { atom } from 'jotai'
import { EventTimeline, EventType, type Room, RoomMember } from 'matrix-js-sdk'

import { ChatRoomMember, MembershipStatus, RoomId } from '@holi/chat/src/client/types'
import { createChatMessage } from '@holi/chat/src/store/messages'
import { getChatClient } from '@holi/chat/src/store/store'
import type { ChatMessage, ChatRoom, ChatRoomAtom } from '@holi/chat/src/store/types'
import { isRoomMessageEvent } from '@holi/chat/src/store/utils'

/**
 * Chat Client Actions
 *
 **/

/**
 * @name createNewRoom (Client Helper)
 * @description Initiates the creation of a room in Matrix through the
 * ChatClient. The store updates once the room creation event is received from
 * the Matrix server.
 */
export const createNewRoom = async (userIds: string[]): Promise<RoomId> => {
  return getChatClient().createRoom(userIds)
}
/**
 * @name getOrCreateRoom (Client Helper)
 * @description returns the room id of an existing one-on-one room, if it
 * exists, or creates a new one.
 */
export const getOrCreateRoom = async (userIds: string[]): Promise<RoomId> => {
  return getChatClient().getOrCreateRoom(userIds)
}

/**
 * @name joinRoom
 * @description Join a Matrix room by accepting the invitation. If you have
 * already joined the room, this will be a no-op.
 */
export const joinRoom = async (roomId: string): Promise<Room | null> => {
  return await getChatClient().joinRoom(roomId)
}

/**
 * @name joinRoom
 * @description Join a Matrix room by accepting the invitation. If you have
 * already joined the room, this will be a no-op.
 */
export const leaveRoom = async (roomId: string): Promise<void> => {
  await getChatClient().leaveRoom(roomId)
}

export function createChatRoom(room: Room, hasInvitation = false): ChatRoom {
  const lastLiveEvent = room.getLastLiveEvent()?.event
  const lastMessage = isRoomMessageEvent(lastLiveEvent) ? createChatMessage(room.roomId, lastLiveEvent) : undefined

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

  const createChatMember = (mxRoomMember: RoomMember): ChatRoomMember => {
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

/**
 * Immer Producers
 *
 **/
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
