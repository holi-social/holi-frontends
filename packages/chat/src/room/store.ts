import { produce } from 'immer'

import type { Message, ReducerAction } from '@holi/chat/src/utils'

export interface RoomState {
  id: string | null
  hasPendingInvitation: boolean
  messages: Message[]
  roomsIds: string[]
}

export const initialRoomState: RoomState = {
  id: null,
  hasPendingInvitation: false,
  messages: [],
  roomsIds: [],
}

export type RoomAction =
  | ReducerAction<'room/invitation_pending', { hasPendingInvitation: boolean; id: string }>
  | ReducerAction<'room/set_rooms_ids', { roomsIds: string[] }>
  | ReducerAction<'room/set_room_id', { roomId: string }>
  | ReducerAction<'room/set_message', { message: Message }>

// TODO: implement unit tests for all the reducers
/**
 * A React reducer based on immer creating persistent data structures for the state
 */
export const roomReducer = produce((draft: RoomState, action: RoomAction) => {
  switch (action.type) {
    case 'room/invitation_pending': {
      const { payload } = action
      draft.id = payload.id
      draft.hasPendingInvitation = payload.hasPendingInvitation
      break
    }
    case 'room/set_message': {
      const { payload } = action
      draft.messages.push(payload.message)
      break
    }
    case 'room/set_rooms_ids': {
      const { payload } = action
      draft.roomsIds = payload.roomsIds
      break
    }
    case 'room/set_room_id': {
      const { payload } = action
      const roomId = draft.roomsIds.find((id) => id === payload.roomId)
      if (!roomId) {
        draft.roomsIds.push(payload.roomId)
      }

      draft.id = payload.roomId
      break
    }
  }
})
