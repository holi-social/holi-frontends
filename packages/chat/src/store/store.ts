import AsyncStorage from '@react-native-async-storage/async-storage'
import { produce } from 'immer'
import { atom, createStore } from 'jotai'

import { CHAT_SELECTED_ROOM_ID_KEY } from '@holi/chat/src//utils'
import ChatClient from '@holi/chat/src/client/ChatClient'
import { createChatMessage, updateMessages } from '@holi/chat/src/store/messages'
import { InvitationUpdate, createChatRoom, updateInvitation } from '@holi/chat/src/store/room'
import type { ChatMessage, ChatRoom, ChatRoomAtom, CreateMessage } from '@holi/chat/src/store/types'
import { isCreateMessage } from '@holi/chat/src/store/utils'
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
 * @description An array of room atoms, each atom contains the room
 * (conversation) of the logged-in user. To get the room information, you must
 * pass the single room to a const `room = useAtomValue(roomAtom)` to access
 * this read-only value.
 *
 * IMPORTANT! Do not set values to the room using this atom. It would be best to
 * use a `createRoomAtom` derived atom to set values (updating the state).To
 * edit a particular room, you need to use a selector, which can be found below
 * under the Room section (e.g `createRoomAtom`).
 */

export const roomAtomsAtom = atom<ChatRoomAtom[]>([])

/**
 * @name roomAtomsAtomSubscriber (Write-Only)
 * @description A write-only atom that programmatically creates a room based on
 * the Matrix Client store and listens to the room invitation event emitter for
 * creating rooms (`onMount`). Implementing a write-only atom has null as the
 * first parameter, and not the getter function. We require a getter function
 * because we subscribe to events in the `onMount` lifecycle.
 *
 * IMPORTANT! Do not use this atom to read/access rooms.
 */

export const roomAtomsAtomSubscriber = atom(
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

roomAtomsAtomSubscriber.onMount = (setAtom) => {
  // Initially, set all the rooms based on the Matrix Store `onMount`.
  chat.getRooms().then((rooms) => {
    rooms.forEach((room) => setAtom(createChatRoom(room)))
  })

  // Listens to the room invitations using the `ChatClient`, which forwards the
  // Matrix invitations events to our store.
  chat.subscribeToInvitations((roomId, displayName, hasInvitation) => {
    setAtom({
      hasInvitation,
      id: roomId,
      name: displayName,
      notificationCount: 1,
      lastThread: undefined,
    })
  })
}

/**
 * @name createRoomAtom (Write-Only)
 * @description A write-only atom action that triggers the creation of a new
 * room atom. A room is a conversation between 1 and n users. They are used in
 * events triggered by, e.g., an `onPress` event. It's a write-only Jōtai atom
 * because the first argument is `null`; we don't have a getter function.
 */

export const createRoomAtom = atom(null, (get, set, userIds: string[]) => {
  chat
    .createRoom(userIds)
    .then((response) => {
      const roomId = response?.room_id
      const room = chat.getRoom(roomId)
      if (!room) return

      const roomAtom = atom(createChatRoom(room))
      // TODO: Remove immer producer duplication
      const addChatRoom = produce((chatRoomAtoms: ChatRoomAtom[], room: ChatRoomAtom) => {
        const hasRoom = chatRoomAtoms.find((roomAtom) => get(roomAtom).id === get(room).id)
        if (hasRoom) return
        chatRoomAtoms.push(room)
      })

      set(roomAtomsAtom, (prevRooms) => addChatRoom(prevRooms, roomAtom))
    })
    .catch((err) => logError(err))
})

/** Room */

/**
 * @name selectedRoomAtomAtom (Read-Only)
 * @description In our data structure, we only have a list of room atoms. To
 * select a room, for example, when you press on one of the rooms from a
 * conversation list, we need a way to zoom in on the currently active room. It
 * is a container atom and should not be exported. It exists to derive read-only
 * and write-only atoms out of it.
 *
 * IMPORTANT! Please do not use this atom to set a selected room because it's
 * read-only; you can look at selectRoomAtom.
 */

const selectedRoomAtomAtom = atom<ChatRoomAtom | null>(null)

/**
 * @name selectRoomAtom (Write-Only)
 * @description A write-only atom that receives a chatRoomAtom and sets it as
 * the currently selected room atom. It also stores the id of the currently
 * selected Atom in the AsyncStorage for possible future references.
 */

export const selectRoomAtom = atom(null, (get, set, chatRoomAtom: ChatRoomAtom) => {
  const room = get(chatRoomAtom)
  set(selectedRoomAtomAtom, chatRoomAtom)
  AsyncStorage.setItem(CHAT_SELECTED_ROOM_ID_KEY, room.id).catch((err) => logError(err))
})

/**
 * @name selectedRoomAtomCreator (Read-Only)
 * @description A function that returns a derived read-only atom from
 * `selectedRoomAtomAtom` that can be created dynamically during rendering. Wrap
 * dynamically created atoms in React's `useMemo` or `useRef` hook for
 * memoization. If you forget to do so can cause an infinite loop.
 */

export const selectedRoomAtomCreator = (roomAtom: ChatRoomAtom) => {
  return atom((get) => roomAtom === get(selectedRoomAtomAtom))
}

/**
 * @name joinRoomAtom (Write-Only)
 * @description Joins a user to the invited room. It's important to consider
 * that the room needs to be selected to join the room. Selections is a
 * technique in Jōtai to select a specific atom (for example, a room atom) and
 * later update the state of that atom without the need to trigger a re-render
 * for the entire array.
 */

export const joinRoomAtom = atom(null, (get, set, roomUpdate: InvitationUpdate) => {
  const selectedRoomAtom = get(selectedRoomAtomAtom)
  if (!selectedRoomAtom) return
  chat.joinRoom(roomUpdate.id).then((hasJoined) => {
    if (!hasJoined) return
    set(selectedRoomAtom, (selectedRoom) => updateInvitation(selectedRoom, roomUpdate))
  })
})

/** Room Messages */

/**
 * @name roomMessagesAtom (Read-Only)
 * @description It collects all the messages related to a selected room in an
 * array. Only use it to read messages from the atom and not to set messages.
 * You can use the `roomMessagesSubscriberAtom` if you need to set messages.
 */

export const roomMessagesAtom = atom<ChatMessage[]>([])

/**
 * @name roomMessagesSubscriberAtom (Write-Only)
 * @description A write-only atom to add new messages to the array. It also
 * subscribes to Matrix room messages event emitter from the RoomEvent.Timeline
 * onMount and updates the store. Currently, the messages all come from Matrix,
 * even the ones a user just typed with the keyboard and pressed the send
 * button. In that case, we send the message to Matrix and wait for the new
 * event to come in to render the message. In the future, we should render the
 * message immediately and deduplicate the incoming message from the store.
 */

export const roomMessagesSubscriberAtom = atom(
  (get) => get(roomMessagesAtom),
  (_get, set, message: CreateMessage | ChatMessage) => {
    const isMsgCreation = isCreateMessage(message)

    // Add message from an incoming event to the messages array
    if (!isMsgCreation) {
      set(roomMessagesAtom, (prevMessages) => updateMessages(prevMessages, message))
      return
    }

    // Add a message from an user action
    chat.sendTextMessage(message.roomId, message.text)
  }
)

roomMessagesSubscriberAtom.onMount = (setAtom) => {
  chat.subscribeToMessages((roomId, event) => {
    AsyncStorage.getItem(CHAT_SELECTED_ROOM_ID_KEY).then((selectedId) => {
      if (selectedId !== roomId) return
      setAtom(createChatMessage(roomId, event))
    })
  })
}
