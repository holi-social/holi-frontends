import { produce } from 'immer'
import { type Getter, atom } from 'jotai'

import type { ChatRoom, ChatRoomMember, ChatRoomMessage, RoomUpdatesContent } from '@holi/chat/src/client/types'
import type { ChatRoomAtom } from '@holi/chat/src/store/types'

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

export const updateRoomAfterNewMessage = produce((room: ChatRoom, message: ChatRoomMessage) => {
  if (!room.timestamp || (message.timestamp && room.timestamp <= message.timestamp)) {
    room.lastMessage = message
    room.timestamp = message.timestamp
  }
})

/**
 * @description: adds (for first members `join` event) or update (for follow up
 * `join/leave` events) a member in the ChatRoom.
 */
export const addOrUpdateMemberInChatRoom = produce((room: ChatRoom, member: ChatRoomMember) => {
  const memberIdx = room.members.findIndex(({ id }) => id === member.id)

  if (memberIdx < 0) {
    room.members.push(member)
    return
  }

  room.members.splice(memberIdx, 1, member)
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
  if (roomId in roomAtoms) {
    delete roomAtoms[roomId]
  }
})

export const updateChatRoomName = produce((chatRoom: ChatRoom, content: RoomUpdatesContent) => {
  chatRoom.name = content.name
})

export const updateChatRoomAvatar = produce((chatRoom: ChatRoom, content: RoomUpdatesContent) => {
  chatRoom.avatar = content.url
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
