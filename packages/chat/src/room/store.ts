import { useReducer } from 'react'
import { createContainer } from 'react-tracked'

import type { ReducerAction } from '@holi/chat/src/utils'

export interface RoomState {
  hasPendingInvitation: boolean
}

const initialRoomState: RoomState = {
  hasPendingInvitation: false,
}

export type RoomAction = ReducerAction<'room/invitation_pending', { hasPendingInvitation: boolean }>

// TODO: include immer
export const roomReducer = (state: RoomState, action: RoomAction): RoomState => {
  switch (action.type) {
    case 'room/invitation_pending': {
      const { payload } = action
      return {
        ...state,
        hasPendingInvitation: payload.hasPendingInvitation,
      }
    }
    default:
      throw new Error('Unknow action type: ' + action.type)
  }
}

const useValue = () => useReducer(roomReducer, initialRoomState)

export const {
  Provider: RoomProvider,
  useTrackedState: useRoomState,
  useUpdate: useRoomDispatch,
} = createContainer(useValue)
