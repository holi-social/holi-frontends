import AsyncStorage from '@react-native-async-storage/async-storage'
import { produce } from 'immer'
import { atom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

import type { Message, ReducerAction } from '@holi/chat/src/utils'

export interface ChatState {
  roomsIds: string[]
  room: RoomState
}

export interface RoomState {
  id: string | null
  hasPendingInvitation: boolean
  messages: Message[]
}

export type RoomAction =
  | ReducerAction<'room/invitation_pending', { hasPendingInvitation: boolean; id: string }>
  | ReducerAction<'room/set_rooms_ids', { roomsIds: string[] }>
  | ReducerAction<'room/set_room_id', { roomId: string }>
  | ReducerAction<'room/set_message', { message: Message }>

const CHAT_STORE_KEY = 'mx_store'

export const initialState: ChatState = {
  roomsIds: [],
  room: {
    id: null,
    hasPendingInvitation: false,
    messages: [],
  },
}

const storeReducer = produce((draft: ChatState, action: RoomAction) => {
  switch (action.type) {
    case 'room/invitation_pending': {
      const { payload } = action
      draft.room.id = payload.id
      draft.room.hasPendingInvitation = payload.hasPendingInvitation
      break
    }
    case 'room/set_message': {
      const { payload } = action
      draft.room.messages.push(payload.message)
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

      draft.room.id = payload.roomId
      break
    }
  }
})

const storage = createJSONStorage<ChatState>(() => AsyncStorage)
/** Base store atom for persistent storage */
const storageAtom = atomWithStorage<ChatState>(CHAT_STORE_KEY, initialState, storage)

/** The Matrix chat writable global store using reducers */
export const storeAtom = atom(
  async (get) => get(await storageAtom),
  async (get, set, action: RoomAction) => {
    const asyncState = get(storageAtom)
    const state = await asyncState

    await set(storageAtom, storeReducer(state, action))
  }
)
