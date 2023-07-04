import { produce } from 'immer'
import { atom, createStore } from 'jotai'

import ChatClient from '@holi/chat/src/client/ChatClient'
import type { ChatMessage, ChatRoom, ChatRoomAtom } from '@holi/chat/src/store/types'
import { logError } from '@holi/core/errors/helpers'

/** Store **/
export const chatStore = createStore()

/** Client **/
// TODO: Check if the user is logged in
const chat = new ChatClient()
chat.start().catch((err) => logError(err))

/** Rooms **/

/**
 * @name roomAtomsAtom (Read-Only)
 * @description Rooms are in Jōtai a pattern called **Atom Configs In An Atom** (or
 * Atoms in a Atom). A Atom is a config without a value until the value has
 * mounted in React. The benefit of this approach is that if a room changes,
 * only the updated room will be re-rendered. To edit a particular room, you need
 * to use a selector, which can be found below under the Room Section (e.g `joinRoomAtom`).
 */
export const roomAtomsAtom = atom<ChatRoomAtom[]>([])
chatStore.set(roomAtomsAtom, [])

/**
 * @name addRoomAtom (Write-Only)
 * @description Programmatically creates Atom Configs and adds them to the
 * room's state. It adds an atom to the atoms list container. It is a writable
 * atom in order to use `onMount`.
 * !Important do not read atoms from this derived atom.
 */

export const addRoomAtom = atom(
  (get) => get(roomAtomsAtom),
  (get, set, chatRoom: ChatRoom) => {
    const roomAtom = atom(chatRoom)

    const addChatRoom = produce((chatRoomAtoms: ChatRoomAtom[], room: ChatRoomAtom) => {
      const hasRoom = chatRoomAtoms.find((roomAtom) => get(roomAtom).id === get(room).id)
      if (hasRoom) return
      chatRoomAtoms.push(room)
    })

    set(roomAtomsAtom, (prevRooms) => addChatRoom(prevRooms, roomAtom))
  }
)

addRoomAtom.onMount = (setAtomValue) => {
  chat.getRooms().then((rooms) => {
    rooms.forEach(setAtomValue)
  })
}

/** Room */

/**
 * @name selectedRoomAtomAtom (Read-Only)
 * @description A container to hold a selected atom. As mentioned above, a
 * single room is unavailable through the `useAtom` hook for an update. Jōtai
 * has the concept of selectors; derived atoms point to a particular atom in the
 * list. This allows us to cheaply change them, removing unnecessary rerenders.
 * This pattern is also known as **Atoms Holding Atoms**.
 */
const selectedRoomAtomAtom = atom<ChatRoomAtom | null>(null)

/**
 * @name selectRoomAtom (Write-Only)
 * @description Merely a write-only atom that delegates the currently selected
 * room.
 */
export const selectRoomAtom = atom(null, (get, set, chatRoomAtom: ChatRoomAtom) => {
  set(selectedRoomAtomAtom, chatRoomAtom)
})

type InvitationUpdate = Pick<ChatRoom, 'hasInvitation'>

/**
 * @name selectedRoomAtomCreator (Read-Only)
 * @description Verifies if the room atom is currently selected
 */
export const selectedRoomAtomCreator = (roomAtom: ChatRoomAtom) => {
  return atom((get) => roomAtom === get(selectedRoomAtomAtom))
}

/**
 * @name joinRoomAtom (Write-Only)
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
 * @name selectedRoomThreadAtom (Read-Only)
 * @description An atom holds a list of all messages related to a room. They are
 * also updated by the selector pattern, just like in addMsgToThreadAtom.
 */
export const selectedRoomThreadAtom = atom<ChatMessage[]>([])
chatStore.set(selectedRoomThreadAtom, [])

/**
 * @name selectedRoomThreadAtom (Write-Only)
 * @description An atom holds a list of all messages related to a room. They are
 * also updated by the selector pattern, just like in addMsgToThreadAtom.
 * !Important it should never be used to read, the read property is necessary
 * to listen to unMount.
 */

export const addMsgToThreadAtom = atom(
  (get) => get(selectedRoomThreadAtom),
  (get, set, message: ChatMessage) => {
    const selectedRoomAtom = get(selectedRoomAtomAtom)
    if (!selectedRoomAtom) return

    const updateThread = produce((threads: ChatMessage[], msg: ChatMessage) => {
      threads.push(msg)
    })

    set(selectedRoomThreadAtom, (threads) => updateThread(threads, message))
  }
)

addMsgToThreadAtom.onMount = () => {
  return chatStore.sub(selectedRoomAtomAtom, () => {
    const roomAtom = chatStore.get(selectedRoomAtomAtom)
    if (!roomAtom) return

    const room = chatStore.get(roomAtom)
    if (!room) return
  })
}
