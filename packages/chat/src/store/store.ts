import { makeVar, useReactiveVar } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { produce } from 'immer'
import { atom, createStore, useAtom } from 'jotai'
import { MatrixEvent } from 'matrix-js-sdk'

import ChatClient from '@holi/chat/src/client/ChatClient'
import ChatLogin from '@holi/chat/src/client/ChatLogin'
import { isCreateMessage } from '@holi/chat/src/store/utils'
import { CHAT_LOCAL_STORAGE_KEY_SELECTED_ROOM_ID } from '@holi/chat/src/utils'
import { logError } from '@holi/core/errors/helpers'

import { createChatMessage, updateMessages } from './messages'
import { InvitationUpdate, addChatRoom, createChatRoom, updateInvitation, updateRoomAfterNewMessage } from './room'
import type { ChatMessage, ChatMessagesAtom, ChatRoom, ChatRoomAtom, CreateMessage } from './types'

/** Store **/
export const chatStore = createStore()

/** Client **/
// TODO: Check if the user is logged in
const isChatReadyVar = makeVar(false)
export const useIsChatClientReady = () => useReactiveVar(isChatReadyVar)

export const chatClientP = ChatClient.createClient()

export const startChat = async (orySessionToken: string, freshLogin = true): Promise<void> => {
  console.debug('startChat')

  const chatClient = await chatClientP
  const chatLogin = new ChatLogin()

  await chatLogin.ensureLoggedIn(orySessionToken, freshLogin)
  await chatClient.start()
  await chatClient.configurePusher()
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
  chatClientP.then((chatClient) => {
    const userId = chatClient.getUserId()
    // We set all the joined rooms initially
    chatClient.getRooms().then((rooms) => {
      rooms.forEach((room) => setAtom(createChatRoom(room, userId)))
    })

    // In case of an invitation we would added by listening to this emitter.
    chatClient.subscribeToInvitations((roomId, displayName, hasInvitation, senderId) => {
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
  })
}

export const addToRoomAtoms = atom(null, async (get, set, userIds: string[]) => {
  const chatClient = await chatClientP
  chatClient
    .createRoom(userIds)
    .then(({ room_id }) => {
      const room = chatClient.getRoom(room_id)
      if (!room) return

      set(_roomAtomsRecordAtom, (prevRooms) => addChatRoom(prevRooms, createChatRoom(room, null)))
    })
    .catch((err) => logError(err))
})

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
export const selectRoomAtom = atom(null, async (get, set, chatRoomAtom: ChatRoomAtom) => {
  const room = get(chatRoomAtom)
  set(selectedRoomAtomAtom, chatRoomAtom)
  await AsyncStorage.setItem(CHAT_LOCAL_STORAGE_KEY_SELECTED_ROOM_ID, room.id).catch((err) => logError(err))
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
export const joinRoomAtom = atom(null, async (get, set, roomUpdate: InvitationUpdate) => {
  const selectedRoomAtom = get(selectedRoomAtomAtom)
  if (!selectedRoomAtom) return

  const hasJoined = await (await chatClientP).joinRoom(roomUpdate.id)
  if (!hasJoined) return
  set(selectedRoomAtom, (selectedRoom) => updateInvitation(selectedRoom, roomUpdate))
})

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
    await (await chatClientP).sendTextMessage(message.roomId, message.text)
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
  chatClientP.then((chatClient) => {
    chatClient.subscribeToMessages(setAtom)
  })
}
