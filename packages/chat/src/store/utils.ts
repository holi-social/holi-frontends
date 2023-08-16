import { Draft } from 'immer'
import { EventType, IEvent, IRoomEvent } from 'matrix-js-sdk'

import type { ChatMessage, CreateMessage } from '@holi/chat/src/store/types'

export const isCreateMessage = (input: CreateMessage | ChatMessage): input is CreateMessage => {
  // eslint-disable-next-line no-prototype-builtins
  return input.hasOwnProperty('text') && input.hasOwnProperty('roomId')
}

export const isRoomEvent = (event: IRoomEvent | Partial<IEvent> | undefined): event is IRoomEvent => {
  return event?.type === EventType.RoomMessage
}

export type AtomRecipe<T> = (draft: Draft<T>) => void

export function isAtomRecipe<T>(recipe: AtomRecipe<T> | T): recipe is AtomRecipe<T> {
  return typeof recipe === 'function'
}
