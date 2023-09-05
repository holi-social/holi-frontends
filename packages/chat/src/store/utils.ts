import { Draft } from 'immer'
import { Atom } from 'jotai'
import { EventType, IEvent, IRoomEvent } from 'matrix-js-sdk'

import type { MatrixId } from '@holi/chat/src/client/types'
import type { AtomRecordGetter, HoliIdentity } from '@holi/chat/src/store/types'
import { chatServerName } from '@holi/core/helpers/config'

/**
 * Identity
 *
 **/

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

export type AtomRecipe<T> = (draft: Draft<T>) => void

export function isAtomRecipe<T>(recipe: AtomRecipe<T> | T): recipe is AtomRecipe<T> {
  return typeof recipe === 'function'
}
