import { produce } from 'immer'
import type { Atom } from 'jotai'

import type {
  ChatRoom,
  MatrixId,
  PrivateChatRoom,
  SpaceChatRoom,
  SpaceChildChatRoom,
  SpaceSharedDataContent,
} from '@holi/chat/src/client/types'
import type { AtomRecordGetter, HoliIdentity } from '@holi/chat/src/store/types'
import { chatServerName } from '@holi/core/helpers/config'

/**
 * Identity
 */

/**
 * Converts a Matrix ID (e.g. `@otto:holi.social`) to a Holi identity (e.g. `otto`).
 */
export const toHoliIdentity = (matrixId: MatrixId): HoliIdentity =>
  matrixId.endsWith(`:${chatServerName}`) ? matrixId.substring(1, matrixId.indexOf(':')) : ''

/**
 * Converts a Holi identity (e.g. `otto`) to a Matrix ID (e.g. `@otto:holi.social`).
 */
export const toMatrixIdentity = (holiIdentity: HoliIdentity): MatrixId => `@${holiIdentity}:${chatServerName}`

/**
 * A type guard that verifies if its a Matrix member ID (e.g. `@asap:holi.social`).
 */
export const isHoliMatrixIdentity = (id: string): id is MatrixId => /^@[a-z][a-z0-9_.-]*:.+$/.test(id)

/**
 * Rooms
 *
 */

export const getAtomFromRecordId = <T>(
  get: AtomRecordGetter,
  atomsRecordAtom: Atom<Record<string, T>>,
  roomId: string
): T | null => {
  const atomsRecord = get(atomsRecordAtom)
  const value = atomsRecord[roomId]
  if (!value) return null

  return value
}

export const hasSpaceContent = <T extends Record<keyof T, unknown>>(content: T | null): content is T =>
  content !== null && 'holiSpaceId' in content

export const isPrivateChatRoom = (room: ChatRoom): room is PrivateChatRoom => room.type === 'private'

export const isSpaceChatRoom = (room: ChatRoom): room is SpaceChatRoom => {
  return room.type === 'space' && hasSpaceContent<SpaceSharedDataContent>(room.content)
}

export const isSpaceChildChatRoom = (room: ChatRoom): room is SpaceChildChatRoom => {
  return room.type === 'space.child' && hasSpaceContent(room.content)
}

export const sortRoomByTimestamp = (roomA: ChatRoom, roomB: ChatRoom): number => {
  const timestampA = roomA.timestamp ?? Number.POSITIVE_INFINITY
  const timestampB = roomB.timestamp ?? Number.POSITIVE_INFINITY

  return timestampA < timestampB ? 1 : -1
}

// TODO: move to the producer file
const updateChatRoomNotificationCount = produce((chatRoom: ChatRoom, notificationCount: number) => {
  chatRoom.notificationCount = notificationCount
})

export function updateSpaceRoomsNotifications(chatRooms: ChatRoom[], spaceIdToChildIds: Record<string, string[]>) {
  return chatRooms.map((room) => {
    if (!isSpaceChatRoom(room)) return room
    if (!spaceIdToChildIds[room.id]) return room
    let totalNotificationCount: number = room.notificationCount

    for (const childId of spaceIdToChildIds[room.id]) {
      const childRoom = chatRooms.find((room) => room.id === childId)
      if (!childRoom) continue
      if (!isSpaceChildChatRoom(childRoom)) continue

      totalNotificationCount += childRoom.notificationCount
    }

    return updateChatRoomNotificationCount(room, totalNotificationCount)
  })
}

/**
 * Selectors
 */
export const roomContentSelector = (room: SpaceChildChatRoom) => room.content
