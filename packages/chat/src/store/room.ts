import { produce } from 'immer'
import { atom } from 'jotai'
import { EventTimeline, type Room } from 'matrix-js-sdk'

import { createChatMessage } from './messages'
import type { ChatMessage, ChatRoom, ChatRoomAtom } from './types'

export type InvitationUpdate = Pick<ChatRoom, 'hasInvitation' | 'id'>

export const updateInvitation = produce((chatRoom: ChatRoom, update: InvitationUpdate) => {
  chatRoom.hasInvitation = update.hasInvitation
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

export function createChatRoom(room: Room, userId: string | null, hasInvitation = false): ChatRoom {
  const lastLiveEvent = room.getLastLiveEvent()
  const lastMessage =
    lastLiveEvent?.getType() === 'm.room.message' ? createChatMessage(room.roomId, lastLiveEvent) : undefined

  return {
    hasInvitation,
    id: room.roomId,
    notificationCount: room.getUnreadNotificationCount(),
    name: room.name,
    lastMessage: lastMessage,
    timestamp:
      room.getLastActiveTimestamp() ??
      room.getLiveTimeline().getState(EventTimeline.FORWARDS)?.getStateEvents('m.room.create', '')?.getTs(),
  }
}
