import React, { createContext, useContext, useReducer } from 'react'
import type { Dispatch, PropsWithChildren } from 'react'

import { initialRoomState, roomReducer } from '@holi/chat/src/room/store'
import type { RoomAction, RoomState } from '@holi/chat/src/room/store'

const RoomContext = createContext<RoomState>(initialRoomState)
const RoomDispatchContext = createContext({} as Dispatch<RoomAction>)

const RoomProvider = ({ children }: PropsWithChildren) => {
  const [tasks, dispatch] = useReducer(roomReducer, initialRoomState)

  return (
    <RoomContext.Provider value={tasks}>
      <RoomDispatchContext.Provider value={dispatch}>{children}</RoomDispatchContext.Provider>
    </RoomContext.Provider>
  )
}

export default RoomProvider

export const useRoomState = () => {
  return useContext(RoomContext)
}

export const useRoomDispatch = () => {
  return useContext(RoomDispatchContext)
}
