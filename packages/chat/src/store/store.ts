import AsyncStorage from '@react-native-async-storage/async-storage'
import { produce } from 'immer'
import { atom, createStore, useAtom } from 'jotai'
import { MatrixEvent } from 'matrix-js-sdk'

import { CHAT_SELECTED_ROOM_ID_KEY } from '@holi/chat/src//utils'
import ChatClient from '@holi/chat/src/client/ChatClient'
import { createChatMessage, updateMessages } from '@holi/chat/src/store/messages'
import { InvitationUpdate, createChatRoom, updateInvitation } from '@holi/chat/src/store/room'
import type { ChatMessage, ChatMessagesAtom, ChatRoom, ChatRoomAtom, CreateMessage } from '@holi/chat/src/store/types'
import { logError } from '@holi/core/errors/helpers'

/** Store **/
export const chatStore = createStore()

/** Client **/
// TODO: Check if the user is logged in
export const chat = new ChatClient()
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
const _roomAtomsRecordAtom = atom<Record<string, ChatRoomAtom>>({})
export const roomAtomsRecordAtom = atom((get) => get(_roomAtomsRecordAtom))

/**
 * @name roomAtomsAtomSubscriber (Write-Only)
 * @description Programmatically creates the initial rooms (Atom Configs) and adds them to the
 * room's state. It adds an atom to the atoms list container. It is a writable
 * atom in order to use `onMount` to fill the initial state.
 */
export const roomAtomsAtomSubscriber = atom(
  (get) => get(_roomAtomsRecordAtom),
  (get, set, chatRoom: ChatRoom) => {
    const addChatRoom = produce((chatRoomAtoms: Record<string, ChatRoomAtom>, chatRoom: ChatRoom) => {
      const roomId = chatRoom.id
      const roomAtom = atom(chatRoom)

      const hasRoom = roomId in chatRoomAtoms
      if (hasRoom) return

      chatRoomAtoms[roomId] = roomAtom
    })

    set(_roomAtomsRecordAtom, (prevRoomAtoms) => addChatRoom(prevRoomAtoms, chatRoom))
  }
)

roomAtomsAtomSubscriber.onMount = (setAtom) => {
  const userId = chat.getUserId()
  // We set all the joined rooms initially
  chat.getRooms().then((rooms) => {
    rooms.forEach((room) => setAtom(createChatRoom(room, userId)))
  })

  // In case of an invitation we would added by listening to this emitter.
  chat.subscribeToInvitations((roomId, displayName, hasInvitation, senderId) => {
    setAtom({
      hasInvitation,
      id: roomId,
      name: displayName,
      notificationCount: 1,
      lastMessage: undefined,
      senderId,
      timestamp: undefined,
    })
  })
}

export const addToRoomAtoms = atom(null, (get, set, userIds: string[]) => {
  chat
    .createRoom(userIds)
    .then((response) => {
      const roomId = response?.room_id
      const room = chat.getRoom(roomId)
      if (!room) return

      const roomAtom = atom(createChatRoom(room, null))
      // TODO: Remove immer producer duplication
      const addChatRoom = produce((chatRoomAtoms: Record<string, ChatRoomAtom>, room: ChatRoomAtom) => {
        const newRoomId = get(room).id
        const hasRoom = Object.keys(chatRoomAtoms).find((roomId) => roomId === newRoomId)
        if (hasRoom) return
        chatRoomAtoms[newRoomId] = room
      })

      set(_roomAtomsRecordAtom, (prevRooms) => addChatRoom(prevRooms, roomAtom))
    })
    .catch((err) => logError(err))
})

/**
 * @name useSubscribeToRoomAndMessageUpdates hook
 * @description helper hook subscribes to rooms and messages updates. Should be used on root component.
 */
export const useSubscribeToRoomAndMessageUpdates = () => {
  useAtom(roomAtomsAtomSubscriber)
  useAtom(threadsAtomsRecordAtomSubscriber)
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
 * room. It also stores the current selected room in local storage for later use.
 */
export const selectRoomAtom = atom(null, async (get, set, chatRoomAtom: ChatRoomAtom) => {
  const room = get(chatRoomAtom)
  set(selectedRoomAtomAtom, chatRoomAtom)
  await AsyncStorage.setItem(CHAT_SELECTED_ROOM_ID_KEY, room.id).catch((err) => logError(err))
})

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
export const joinRoomAtom = atom(null, async (get, set, roomUpdate: InvitationUpdate) => {
  const selectedRoomAtom = get(selectedRoomAtomAtom)
  if (!selectedRoomAtom) return

  const hasJoined = await chat.joinRoom(roomUpdate.id)
  if (!hasJoined) return
  set(selectedRoomAtom, (selectedRoom) => updateInvitation(selectedRoom, roomUpdate))
})

/** Room Messages */

/**
 * @name roomMessagesAtom (Read-Only)
 * @description It collects all the joined room's messages on a map for later easy access O(1).
 *Only reading from this atom is allowed.
 */
const _roomMessagesAtom = atom<ChatMessage[]>([])
export const roomMessagesAtom = atom((get) => get(_roomMessagesAtom))

const isCreateMessage = (input: CreateMessage | ChatMessage): input is CreateMessage => {
  // eslint-disable-next-line no-prototype-builtins
  return input.hasOwnProperty('text') && input.hasOwnProperty('roomId')
}

/**
 * @name roomMessagesSubscriberAtom (Write-Only)
 * @description
 */
export const roomMessagesSubscriberAtom = atom(
  (get) => get(_roomMessagesAtom),
  async (get, set, message: CreateMessage | ChatMessage) => {
    const isMsgCreation = isCreateMessage(message)

    // Add message from an incoming event to the messages array
    if (!isMsgCreation) {
      set(_roomMessagesAtom, (prevMessages) => updateMessages(prevMessages, message))
      return
    }

    // Add a message from an user action
    await chat.sendTextMessage(message.roomId, message.text)
  }
)

/**
 * @name threadsAtomsRecordAtom (Read-Only)
 * @description An atom of type `Record<string, ChatMessagesAtom>` collects `Atom<ChatMessage[]>` for all rooms ids.
 * Only reading from this atom is allowed.
 */
const _threadsAtomsRecordAtom = atom<Record<string, ChatMessagesAtom>>({})
export const threadsAtomsRecordAtom = atom((get) => get(_threadsAtomsRecordAtom))

/**
 * @name threadsAtomsRecordAtomSubscriber (Read-Write)
 * @description Read (getter) function returns `Record<string, ChatMessagesAtom>`
 * Write (setter) function expects two argunments: `roomId` and `event` of type `MatrixEvent` and adds new message into the room's `Atom<ChatMessage[]>`
 * This atom should has `onMount` function that subsribes to `ChatClient` and listens for new messages.
 */
export const threadsAtomsRecordAtomSubscriber = atom(
  (get) => get(_threadsAtomsRecordAtom),
  (get, set, roomId: string, event: MatrixEvent) => {
    if (!roomId) return

    const addMessageToRoomThread = produce((threadsRecord: Record<string, ChatMessagesAtom>, event: MatrixEvent) => {
      threadsRecord[roomId] = threadsRecord[roomId] ?? atom<ChatMessage[]>([])
      set(threadsRecord[roomId], (prevMessages) => updateMessages(prevMessages, createChatMessage(roomId, event)))
    })

    set(_threadsAtomsRecordAtom, (prevThreadsRecord) => addMessageToRoomThread(prevThreadsRecord, event))
  }
)

threadsAtomsRecordAtomSubscriber.onMount = (setAtom) => {
  chat.subscribeToMessages(setAtom)
}
