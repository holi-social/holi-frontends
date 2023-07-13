import { produce } from 'immer'
import type { Room } from 'matrix-js-sdk'

import { createChatMessage } from '@holi/chat/src/store/messages'
import type { ChatRoom } from '@holi/chat/src/store/types'

export type InvitationUpdate = Pick<ChatRoom, 'hasInvitation' | 'id'>

export const updateInvitation = produce((chatRoom: ChatRoom, update: InvitationUpdate) => {
  chatRoom.hasInvitation = update.hasInvitation
})

export function createChatRoom(room: Room, hasInvitation = false): ChatRoom {
  const lastMessageEvent = room.getLastThread()?.events.find((e) => e.getType() === 'm.room.message')
  const lastThreadMessage = lastMessageEvent ? createChatMessage(room.roomId, lastMessageEvent) : undefined

  return {
    hasInvitation,
    id: room.roomId,
    notificationCount: room.getUnreadNotificationCount(),
    name: room.name,
    lastThread: lastThreadMessage,
  }
}
