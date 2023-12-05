import { produce } from 'immer'
import { type Getter, atom } from 'jotai'

import type { ChatRoomMember } from '@holi/chat/src/client/types'
import type { ChatMessage, ChatRoom, ChatRoomAtom } from '@holi/chat/src/store/types'

/**
 * Room Producers
 */
export interface UpdateRoomInvitationOptions {
  membership: string
  prevMembership?: string
}

export const updateRoomInvitation = produce(
  (chatRoom: ChatRoom, { membership, prevMembership }: UpdateRoomInvitationOptions) => {
    const hasJoined = prevMembership === 'invite' && membership === 'join'
    if (!hasJoined) return

    chatRoom.hasInvitation = !hasJoined
  }
)

export const updateRoomUnreadNotifications = produce((chatRoom: ChatRoom, count: number) => {
  chatRoom.notificationCount = count
})

export const addNotificationsCount = produce((chatRoom: ChatRoom, count: number) => {
  chatRoom.notificationCount += count
})

export const updateRoomAfterNewMessage = produce((room: ChatRoom, message: ChatMessage) => {
  room.lastMessage = message
  room.timestamp = message.timestamp
})

/**
 * @description: adds (for first members `join` event) or update (for follow up `join/leave` events) a member in the ChatRoom.
 * @see addOrUpdateMemberInChatRoom
 */
export const addOrUpdateMemberInChatRoom = produce((room: ChatRoom, roomMember: ChatRoomMember) => {
  const memberIdx = room.members.findIndex(({ id }) => id === roomMember.id)

  if (memberIdx < 0) {
    room.members.push(roomMember)
    return
  }

  room.members.splice(memberIdx, 1, roomMember)
})

export const addChatRoom = produce((roomAtoms: Record<string, ChatRoomAtom>, chatRoom: ChatRoom) => {
  roomAtoms[chatRoom.id] = atom(chatRoom)
})

export const addOrUpdateChatRoom = produce(
  (roomAtoms: Record<string, ChatRoomAtom>, rooms: ChatRoom[], get: Getter) => {
    rooms.forEach((roomUpdate) => {
      const roomId = roomUpdate.id
      const roomAtom = roomAtoms[roomId]

      if (roomAtom) {
        const prevRoom = get(roomAtom)
        roomAtoms[roomId] = atom({ ...prevRoom, ...roomUpdate })
      } else {
        roomAtoms[roomId] = atom(roomUpdate)
      }
    })
  }
)

export const deleteChatRoom = produce((roomAtoms: Record<string, ChatRoomAtom>, roomId: string) => {
  if (roomId in roomAtoms) delete roomAtoms[roomId]
})

/**
 * Space Room Producers
 */

export const updateSpaceIdToChildIds = produce(
  (spaceIdToChildIds: Record<string, string[]>, newSpaceIdToChildIds: Record<string, string[]>) => {
    for (const id in newSpaceIdToChildIds) {
      if (!spaceIdToChildIds[id]) {
        spaceIdToChildIds[id] = newSpaceIdToChildIds[id]
        continue
      }

      const childIds = spaceIdToChildIds[id]
      const incomingChildIds = newSpaceIdToChildIds[id]

      spaceIdToChildIds[id] = childIds.concat(incomingChildIds)
    }
  }
)

/**
 * Member Producers
 */

export const updateUserIdToMember = produce((prevRecord: Record<string, ChatRoomMember>, member: ChatRoomMember) => {
  prevRecord[member.id] = member
})
