import { produce } from 'immer'
import { atom, createStore } from 'jotai'

import type { ChatRoom, ChatRoomAtom } from '@holi/chat/src/store/types'

// TODO: implement unit test
const chatStore = createStore()

/**
 * Room
 */

export const createRoomAtom = (room: ChatRoom) => atom(room)

const selectedRoomAtomAtom = atom<ChatRoomAtom | null>(null)
export const selectRoomAtom = atom(null, (_get, set, chatRoomAtom: ChatRoomAtom) => {
  set(selectedRoomAtomAtom, chatRoomAtom)
})

type InvitationUpdate = Pick<ChatRoom, 'hasInvitation'>

export const joinRoomAtom = atom(null, (get, set, update: InvitationUpdate) => {
  const updateInvitation = produce((draft: ChatRoom, update: InvitationUpdate) => {
    draft.hasInvitation = update.hasInvitation
  })
  const selectedRoomAtom = get(selectedRoomAtomAtom)
  if (!selectedRoomAtom) return
  set(selectedRoomAtom, (prevRoom) => updateInvitation(prevRoom, update))
})

/**
 * Rooms
 */
export const roomAtomsAtom = atom<ChatRoomAtom[]>([])

chatStore.set(roomAtomsAtom, [])

// TODO: don't forget to prefill async atoms to avoid errors
// TODO: remove empty state
/**
 * Adds a room atom to the rooms atom with atoms
 */
export const addRoomAtom = atom(null, (get, set, chatRoom: ChatRoom) => {
  const roomAtom = createRoomAtom(chatRoom)

  const addChatRoom = produce((draft: ChatRoomAtom[], room: ChatRoomAtom) => {
    const hasRoom = draft.find((roomAtom) => get(roomAtom).id === get(room).id)
    if (hasRoom) return
    draft.push(room)
  })

  set(roomAtomsAtom, (prevRooms) => addChatRoom(prevRooms, roomAtom))
})
