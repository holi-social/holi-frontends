import { useReducer } from 'react'
import { createContainer } from 'react-tracked'

import type { ReducerAction } from '@holi/chat/src/utils'

export interface RoomState {
  id: string | null
  hasPendingInvitation: boolean
}

const initialRoomState: RoomState = {
  id: null,
  hasPendingInvitation: false,
}

export type RoomAction = ReducerAction<'room/invitation_pending', { hasPendingInvitation: boolean; id: string }>

// TODO: include immer
export const roomReducer = (state: RoomState, action: RoomAction): RoomState => {
  switch (action.type) {
    case 'room/invitation_pending': {
      const { payload } = action
      return {
        ...state,
        id: payload.id,
        hasPendingInvitation: payload.hasPendingInvitation,
      }
    }
    default:
      throw new Error('The action type from the room reducer is unknown ' + action.type)
  }
}

const useValue = () => useReducer(roomReducer, initialRoomState)

export const {
  Provider: RoomProvider,
  useTrackedState: useRoomState,
  useUpdate: useRoomDispatch,
} = createContainer(useValue)
