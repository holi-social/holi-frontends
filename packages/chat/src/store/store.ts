import AsyncStorage from '@react-native-async-storage/async-storage'
import { produce } from 'immer'
import { atom, createStore } from 'jotai'

import { CHAT_SELECTED_ROOM_ID_KEY } from '@holi/chat/src//utils'
import ChatClient from '@holi/chat/src/client/ChatClient'
import { createChatMessage, updateMessages } from '@holi/chat/src/store/messages'
import { InvitationUpdate, createChatRoom, updateInvitation } from '@holi/chat/src/store/room'
import type { ChatMessage, ChatRoom, ChatRoomAtom, CreateMessage } from '@holi/chat/src/store/types'
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
export const roomAtomsAtom = atom<ChatRoomAtom[]>([])

/**
 * @name roomAtomsAtomSubscriber (Write-Only)
 * @description Programmatically creates the initial rooms (Atom Configs) and adds them to the
 * room's state. It adds an atom to the atoms list container. It is a writable
 * atom in order to use `onMount` to fill the initial state.
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
  // We set all the joined rooms initially
  chat.getRooms().then((rooms) => {
    rooms.forEach((room) => setAtom(createChatRoom(room)))
  })

  // In case of an invitation we would added by listening to this emitter.
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
export const selectRoomAtom = atom(null, (get, set, chatRoomAtom: ChatRoomAtom) => {
  const room = get(chatRoomAtom)
  set(selectedRoomAtomAtom, chatRoomAtom)
  AsyncStorage.setItem(CHAT_SELECTED_ROOM_ID_KEY, room.id).catch((err) => logError(err))
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
 * @description It collects all the joined room's messages on a map for later easy access O(1).
 *Only reading from this atom is allowed.
 */

export const roomMessagesAtom = atom<ChatMessage[]>([])

const isCreateMessage = (input: CreateMessage | ChatMessage): input is CreateMessage => {
  // eslint-disable-next-line no-prototype-builtins
  return input.hasOwnProperty('text') && input.hasOwnProperty('roomId')
}

/**
 * @name roomMessagesSubscriberAtom (Write-Only)
 * @description
 */
export const roomMessagesSubscriberAtom = atom(
  (get) => get(roomMessagesAtom),
  (get, set, message: CreateMessage | ChatMessage) => {
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

// TODO / FIXME: In order for this to work we need to do a `Record<string, ChatMessage[]>`
export const threadsAtomsAtomMap = atom(new Map<string, ChatMessage[]>())

threadsAtomsAtomMap.onMount = (setAtom) => {
  chat.subscribeToMessages((roomId, event) => {
    const threadsMap = chatStore.get(threadsAtomsAtomMap)
    const msg = createChatMessage(roomId, event)
    const threads = updateMessages(threadsMap.get(roomId) ?? [], msg)
    threadsMap.set(roomId, threads)
    setAtom(threadsMap)
  })
}

export const addThreadToAtomsAtomMap = atom(
  (get) => get(threadsAtomsAtomMap),
  (get, set, message: CreateMessage) => {
    chat
      .sendTextMessage(message.roomId, message.text)
      .then((eventId) => {
        const threadsMap = get(threadsAtomsAtomMap)
        const threads = threadsMap.get(message.roomId)
        const userId = chat.getUserId()
        if (!threads) return

        const chatMessage: ChatMessage = {
          id: eventId,
          room_id: message.roomId,
          sender: userId ?? undefined,
          content: {
            body: message.text,
            msgtype: 'm.text',
          },
        }

        set(threadsAtomsAtomMap, (prevMap) => {
          const threadsMap = new Map(prevMap)
          const threads = updateMessages(threadsMap.get(message.roomId) ?? [], chatMessage)
          threadsMap.set(message.roomId, threads)

          return threadsMap
        })
      })
      .catch((err) => logError(err))
  }
)
