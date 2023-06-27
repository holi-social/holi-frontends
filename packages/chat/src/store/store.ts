import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Draft } from 'immer'
import { produce } from 'immer'
import { atom, createStore } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

// TODO: implement unit test
import type { ChatRoom } from '@holi/chat/src/store/types'

const chatStore = createStore()
const ROOMS_STORE_KEY = 'mx_rooms_store' as const
const roomsStorage = createJSONStorage<ChatRoom[]>(() => AsyncStorage)
const initialRoomState: ChatRoom = {
  id: '',
  hasInvitation: false,
}

// Read Atom
//export const addRoomAtom = withImmer(roomAtom)

export const createRoomAtom = (room: ChatRoom) => atom(room)

// TODO: move to utils file
export type AtomRecipe<T> = (draft: Draft<T>) => void

export function isAtomRecipe<T>(recipe: AtomRecipe<T> | T): recipe is AtomRecipe<T> {
  return typeof recipe === 'function'
}

export function immerProducer<T>(value: T, fn: T | AtomRecipe<T>): T {
  const recipe = isAtomRecipe(fn) ? fn : () => fn
  return produce(value, recipe)
}

export const roomAtomsAtom = atomWithStorage<ChatRoom[]>(ROOMS_STORE_KEY, [], roomsStorage)

// TODO: don't forget to prefill async atoms to avoid errors
export const addRoomAtom = atom(null, async (_get, set, update: ChatRoom) => {
  const roomsAtom = await roomAtomsAtom

  const roomAtom = createRoomAtom(update)
  const addAnRoomAtom = produce((draft: ChatRoom[], room) => void draft.push(room))
  await set(roomsAtom, async (prevRooms) => {
    const rooms = await prevRooms
    return addAnRoomAtom(rooms, roomAtom)
  })
})

chatStore.set(roomAtomsAtom, [initialRoomState])
