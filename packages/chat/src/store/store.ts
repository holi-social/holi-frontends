import { produce } from 'immer'
import { atom, createStore } from 'jotai'

import type { ChatMessage, ChatRoom, ChatRoomAtom } from '@holi/chat/src/store/types'

// TODO: implement unit test
export const chatStore = createStore()

/** Rooms */

/**
 * @name roomAtomsAtom
 * @description Rooms are in Jōtai a pattern called **Atom Configs In An Atom** (or
 * Atoms in a Atom). A Atom is a config without a value until the value has
 * mounted in React. The benefit of this approach is that if a room changes,
 * only the updated room will be re-rendered. To edit a particular room, you need
 * to use a selector, which can be found below under the Room Section (e.g `joinRoomAtom`).
 */
export const roomAtomsAtom = atom<ChatRoomAtom[]>([])
chatStore.set(roomAtomsAtom, [])

/**
 * @name addRoomAtom
 * @description Programmatically creates Atom Configs and adds them to the
 * room's state. It adds an atom to the atoms list container.
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

/** Room */

/**
 * @name addRoomAtom
 * @description A helper function that produces room atoms. It is used to
 * programmatically create an Atom to add to roomAtomsAtom.
 */
export const createRoomAtom = (room: ChatRoom) => atom(room)

/**
 * @name selectedRoomAtomAtom
 * @description A container to hold a selected atom. As mentioned above, a
 * single room is unavailable through the `useAtom` hook for an update. Jōtai
 * has the concept of selectors; derived atoms point to a particular atom in the
 * list. This allows us to cheaply change them, removing unnecessary rerenders.
 * This pattern is also known as **Atoms Holding Atoms**.
 */
const selectedRoomAtomAtom = atom<ChatRoomAtom | null>(null)

/**
 * @name selectRoomAtom
 * @description Merely a write-only atom that delegates the currently selected
 * room.
 */
export const selectRoomAtom = atom(null, (_get, set, chatRoomAtom: ChatRoomAtom) => {
  set(selectedRoomAtomAtom, chatRoomAtom)
})

type InvitationUpdate = Pick<ChatRoom, 'hasInvitation'>

/**
 * @name joinRoomAtom
 * @description This updates the room and sets the changed room invitation from
 * the selected atom from the `selectedRoomAtomAtom`.
 */
export const joinRoomAtom = atom(null, (get, set, update: InvitationUpdate) => {
  const selectedRoomAtom = get(selectedRoomAtomAtom)
  if (!selectedRoomAtom) return

  const updateInvitation = produce((draft: ChatRoom, update: InvitationUpdate) => {
    draft.hasInvitation = update.hasInvitation
  })

  set(selectedRoomAtom, (selectedRoom) => updateInvitation(selectedRoom, update))
})

/** Room Threads */

/**
 * @name selectedRoomThreadAtom
 * @description An atom holds a list of all messages related to a room. They are
 * also updated by the selector pattern, just like in addMsgToThreadAtom.
 */
export const selectedRoomThreadAtom = atom<ChatMessage[]>([])

chatStore.set(selectedRoomThreadAtom, [])

export const addMsgToThreadAtom = atom(null, (get, set, message: ChatMessage) => {
  const selectedRoomAtom = get(selectedRoomAtomAtom)
  if (!selectedRoomAtom) return

  const updateThread = produce((draft: ChatRoom, msg: ChatMessage) => {
    draft.threads.push(msg)
  })

  set(selectedRoomAtom, (selectedRoom) => updateThread(selectedRoom, message))
})
