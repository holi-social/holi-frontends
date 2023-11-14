import { Atom } from 'jotai'
import { EventType, IEvent, IRoomEvent } from 'matrix-js-sdk'

import type { MatrixId, SpaceSharedDataContent } from '@holi/chat/src/client/types'
import type {
  AtomRecordGetter,
  ChatRoom,
  HoliIdentity,
  SpaceChatRoom,
  SpaceChildChatRoom,
} from '@holi/chat/src/store/types'
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
 * Room
 *
 **/

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

export const isRoomMessageEvent = (event: IRoomEvent | Partial<IEvent> | undefined): event is IRoomEvent => {
  return event?.type === EventType.RoomMessage
}
export const isRoomMemberEvent = (event: IRoomEvent | Partial<IEvent> | undefined): event is IRoomEvent => {
  return event?.type === EventType.RoomMember && ['join', 'leave'].some((m) => m === event.content?.membership)
}

export const hasSpaceContent = <T extends Record<keyof T, unknown>>(content: T | null): content is T =>
  content !== null && 'holiSpaceId' in content

export const isSpaceChatRoom = (room: ChatRoom): room is SpaceChatRoom => {
  return room.type === 'space' && hasSpaceContent<SpaceSharedDataContent>(room.content)
}

export const isSpaceChildChatRoom = (room: ChatRoom): room is SpaceChildChatRoom => {
  return room.type === 'space.child' && hasSpaceContent(room.content)
}

/**
 * Selectors
 */
export const roomContentSelector = (room: SpaceChildChatRoom) => room.content
