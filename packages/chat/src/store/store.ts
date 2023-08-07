import { makeVar, useReactiveVar } from '@apollo/client'
import { produce } from 'immer'
import { atom, createStore, useAtom } from 'jotai'
import { MatrixEvent } from 'matrix-js-sdk'

import ChatClient from '@holi/chat/src/client/ChatClient'
import ChatLogin from '@holi/chat/src/client/ChatLogin'
import { isCreateMessage } from '@holi/chat/src/store/utils'

import { createChatMessage, updateMessages } from './messages'
import { addChatRoom, createChatRoom, updateInvitation, updateRoomAfterNewMessage } from './room'
import type { ChatMessage, ChatMessagesAtom, ChatRoom, ChatRoomAtom, CreateMessage } from './types'

/** Store **/
export const chatStore = createStore()

/** Client **/
// TODO: Check if the user is logged in
const isChatReadyVar = makeVar(false)
export const useIsChatClientReady = () => useReactiveVar(isChatReadyVar)

export const chatClient = new ChatClient()
export const chatLogin = new ChatLogin()
export const startChat = async (orySessionToken: string, freshLogin = true) => {
  await chatLogin.fetchSessionCredentials(orySessionToken, freshLogin)
  await chatClient.start()
  isChatReadyVar(true)
}
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
const _roomAtomsRecordAtom = atom<Record<string, ChatRoomAtom>>({})
export const roomAtomsRecordAtom = atom((get) => get(_roomAtomsRecordAtom))
export const roomIdNameRecortAtom = atom<Record<string, string>>((get) => {
  const roomAtomsRecordAtom = get(_roomAtomsRecordAtom)
  const roomIdNameRecord: Record<string, string> = {}

  for (const [id, roomAtom] of Object.entries(roomAtomsRecordAtom)) {
    roomIdNameRecord[id] = get(roomAtom).name
  }
  return roomIdNameRecord
})

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
export const roomAtomsRecordAtomSubscriber = atom(
  (get) => get(_roomAtomsRecordAtom),
  (get, set, chatRoom: ChatRoom) => {
    set(_roomAtomsRecordAtom, (prevRoomAtoms) => addChatRoom(prevRoomAtoms, chatRoom))
  }
)

roomAtomsRecordAtomSubscriber.onMount = (setAtom) => {
  chatClient.subscribeToRooms((room, hasPendingInvitation) => {
    /**
     * @name waitForCorrectRoomName
     * @description Matrix room has `Empty room` name on creation and then Matrix updates it under the hood.
     * We use this function to watch for the room `name` change and only create an atom when correct name was passed
     * or timeout exceeded.
     * @param tillTimestapm `number` represents timestamp limit till function postponds setting the atom
     */
    const waitForCorrectRoomName = (tillTimestapm: number) => {
      if (room.name !== 'Empty room' || Date.now() > tillTimestapm) {
        setAtom(createChatRoom(room, hasPendingInvitation))
      } else {
        setTimeout(() => {
          waitForCorrectRoomName(tillTimestapm)
        }, 50)
      }
    }

    waitForCorrectRoomName(Date.now() + 2000)
  })
}

/**
 * @name useSubscribeToRoomAndMessageUpdates hook
 * @description helper hook subscribes to rooms and messages updates. Should be used on root component.
 */
export const useSubscribeToRoomAndMessageUpdates = () => {
  useAtom(roomAtomsRecordAtomSubscriber)
  useAtom(threadsAtomsRecordAtomSubscriber)
}

/** Room */

/**
 * @name joinRoomAtom (Write-Only)
 * @description Joins a user to the invited room. It's important to consider
 * that the room needs to be selected to join the room. Selections is a
 * technique in Jōtai to select a specific atom (for example, a room atom) and
 * later update the state of that atom without the need to trigger a re-render
 * for the entire array.
 */
export const joinRoomAtom = atom(null, async (get, set, roomId: string) => {
  const roomAtomsRecord = get(_roomAtomsRecordAtom)
  const selectedRoomAtom = roomAtomsRecord[roomId]
  if (!selectedRoomAtom) return

  const hasJoined = await chatClient.joinRoom(roomId)
  if (!hasJoined) return
  set(selectedRoomAtom, (selectedRoom) => updateInvitation(selectedRoom, hasJoined))
})

export const createNewRoom = (targetIds: string[]) => chatClient.createRoom(targetIds)

/** Room Messages */

/**
 * @name roomMessagesAtom (Read-Only)
 * @description It collects all the messages related to a selected room in an
 * array. Only use it to read messages from the atom and not to set messages.
 * You can use the `roomMessagesSubscriberAtom` if you need to set messages.
 */
const _roomMessagesAtom = atom<ChatMessage[]>([])
export const roomMessagesAtom = atom((get) => get(_roomMessagesAtom))

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
  (get) => get(_roomMessagesAtom),
  async (get, set, message: CreateMessage | ChatMessage) => {
    const isMsgCreation = isCreateMessage(message)

    // Add message from an incoming event to the messages array
    if (!isMsgCreation) {
      set(_roomMessagesAtom, (prevMessages) => updateMessages(prevMessages, message))
      return
    }

    // Add a message from an user action
    await chatClient.sendTextMessage(message.roomId, message.text)
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
      const newMessage = createChatMessage(roomId, event)
      set(threadsRecord[roomId], (prevMessages) => updateMessages(prevMessages, newMessage))
      updateRoom(roomId, newMessage)
    })

    const updateRoom = produce((roomId: string, message: ChatMessage) => {
      const roomAtomsRecord = get(roomAtomsRecordAtom)
      const roomAtom = roomAtomsRecord[roomId]

      if (!roomAtom) return

      set(roomAtom, (room) => updateRoomAfterNewMessage(room, message))
    })

    set(_threadsAtomsRecordAtom, (prevThreadsRecord) => addMessageToRoomThread(prevThreadsRecord, event))
  }
)

threadsAtomsRecordAtomSubscriber.onMount = (setAtom) => {
  chatClient.subscribeToMessages(setAtom)
}
