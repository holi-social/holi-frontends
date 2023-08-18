import { Draft } from 'immer'
import { Atom } from 'jotai'
import { EventType, IEvent, IRoomEvent } from 'matrix-js-sdk'

import { AtomRecordGetter } from './types'

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

export const isRoomEvent = (event: IRoomEvent | Partial<IEvent> | undefined): event is IRoomEvent => {
  return event?.type === EventType.RoomMessage
}

export type AtomRecipe<T> = (draft: Draft<T>) => void

export function isAtomRecipe<T>(recipe: AtomRecipe<T> | T): recipe is AtomRecipe<T> {
  return typeof recipe === 'function'
}
