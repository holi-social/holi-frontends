import { produce } from 'immer'
import { atom, createStore, useAtom, useAtomValue } from 'jotai'
import { MatrixEvent } from 'matrix-js-sdk'
import { useMemo } from 'react'

import ChatClient from '@holi/chat/src/client/ChatClient'
import ChatLogin from '@holi/chat/src/client/ChatLogin'
import type { RoomId } from '@holi/chat/src/client/types'
import { StoredCredentials } from '@holi/chat/src/utils'
import { getSessionFromStorage } from '@holi/core/auth/helpers/auth'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { chatUrl } from '@holi/core/helpers/config'

import { createChatMessage, updateMessages } from './messages'
import { addChatRoom, createChatRoom, updateInvitation, updateRoomAfterNewMessage } from './room'
import type { ChatMessage, ChatMessagesAtom, ChatRoom, ChatRoomAtom, CreateMessage } from './types'

/** Store **/
export const chatStore = createStore()

/** Client **/
const chatLogin = new ChatLogin()
let chatClient: ChatClient | undefined = undefined

const CHAT_CLIENT_UNINITIALIZED_ERROR =
  '[ChatToggle]: chatClient was not initialized, please ensure to call ChatToggle.start() first before using it'

export class ChatToggle {
  private static isStarting = false
  private static isStopping = false

  public static start = async (): Promise<void> => {
    if (chatClient?.isOn || this.isStarting) return

    this.isStarting = true

    try {
      // initialize ChatClient here as this is *the* lifecycle hook where all of chat is initialized
      chatClient = await getSessionFromStorage()
        .then((orySession) => {
          if (!orySession) {
            throw new HoliError('[ChatToggle]: Can not start chat without Ory session token')
          }
          return chatLogin.ensureLoggedIn(orySession.session_token)
        })
        .then((credentials: StoredCredentials) => {
          return new ChatClient({
            baseUrl: chatUrl,
            accessToken: credentials.access_token,
            deviceId: credentials.device_id,
            userId: credentials.user_id,
            freshLogin: credentials.fresh_login,
          })
        })

      // make compiler believe that chatClient is in fact defined
      if (chatClient === undefined) throw new HoliError('[ChatToggle]: this should not happen')

      await chatClient.start()
    } finally {
      this.isStarting = false
    }
  }

  public static stop = async () => {
    if (!chatClient) return // chatClient never started
    if (chatClient.isOn || this.isStopping) return

    this.isStopping = true

    try {
      await chatClient.stop()
      await chatLogin.logout()
    } finally {
      this.isStopping = false
    }
  }
}

/** Rooms **/

/**
 * @name roomAtomsRecordAtom (Read-Only)
 * @description An object with id and room atoms, each atom contains the room
 * (conversation) of the logged-in user. To get the room information, you must
 * pass the single room to a const `room = useAtomValue(roomAtom)` to access
 * this read-only value.
 *
 * IMPORTANT! Do not set values to the room using this atom. It would be best to
 * use a `createRoomAtomRecord` derived atom to set values (updating the state).To
 * edit a particular room, you need to use a selector, which can be found below
 * under the Room section (e.g `createRoomAtom`).
 */
const _roomAtomsRecordAtom = atom<Record<string, ChatRoomAtom>>({})
export const roomAtomsRecordAtom = atom((get) => get(_roomAtomsRecordAtom))

/**
 * @name roomAtomNameMapAtom
 * @description derived atom that holds all room atoms sorted by date of last
 * message in descending order
 * @returns `Map<ChatRoomAtom, string`
 */
export const roomAtomNameMapAtom = atom<Map<ChatRoomAtom, string>>((get) => {
  const roomAtomsRecordAtom = get(_roomAtomsRecordAtom)
  const roomAtomNameMap: Map<ChatRoomAtom, string> = new Map()

  for (const roomAtom of Object.values(roomAtomsRecordAtom)) {
    roomAtomNameMap.set(roomAtom, get(roomAtom).name)
  }
  return roomAtomNameMap
})

export const roomAtomsSortedByDateAtom = atom((get) => {
  const roomAtoms = Object.values(get(_roomAtomsRecordAtom))
  return roomAtoms.sort((rA, rB) => {
    const tsA = get(rA).timestamp ?? Infinity
    const tsB = get(rB).timestamp ?? Infinity
    return tsA < tsB ? 1 : -1
  })
})

/**
 * @name _roomAtomsRecordAtomSubscriber (Write-Only)
 * @description A write-only atom that programmatically creates a room based on
 * the Matrix Client store and listens to the room invitation event emitter for
 * creating rooms (`onMount`). Implementing a write-only atom has null as the
 * first parameter, and not the getter function. We require a getter function
 * because we subscribe to events in the `onMount` lifecycle.
 *
 * IMPORTANT! Do not use this atom to read/access rooms.
 */
const _roomAtomsRecordAtomSubscriber = atom(null, (get, set, chatRoom: ChatRoom) => {
  set(_roomAtomsRecordAtom, (prevRoomAtoms) => addChatRoom(prevRoomAtoms, chatRoom))
})

_roomAtomsRecordAtomSubscriber.onMount = (setAtom) => {
  if (chatClient === undefined) {
    throw new Error(CHAT_CLIENT_UNINITIALIZED_ERROR)
  }
  chatClient.subscribeToRooms((room, hasPendingInvitation) => {
    /**
     * @name waitForCorrectRoomName
     * @description Matrix room has `Empty room` name on creation and then Matrix updates it under the hood.
     * We use this function to watch for the room `name` change and only create an atom when correct name was passed
     * or timeout exceeded.
     * @param timestamp `number` represents timestamp limit till function postponds setting the atom
     */
    const waitForCorrectRoomName = (timestamp: number) => {
      if (room.name !== 'Empty room' || Date.now() > timestamp) {
        setAtom(createChatRoom(room, hasPendingInvitation))
      } else {
        setTimeout(() => {
          waitForCorrectRoomName(timestamp)
        }, 50)
      }
    }

    waitForCorrectRoomName(Date.now() + 2000)
  })
}

/**
 * @name useSubscribeToChat hook
 * @description helper hook subscribes to rooms and messages updates. Should be used on the `<ChatStore />`.
 */
export const useSubscribeToChat = () => {
  useAtom(_roomAtomsRecordAtomSubscriber)
  useAtom(_messagesAtomsRecordAtomSubscriber)
}

/** Room */

/**
 * @name createNewRoom (Client Helper)
 * @description Initiates the creation of a room in Matrix through the
 * ChatClient. The store updates once the room creation event is received from
 * the Matrix server.
 */
export const createNewRoom = async (userIds: string[]): Promise<RoomId> => {
  if (!chatClient) throw new Error(CHAT_CLIENT_UNINITIALIZED_ERROR)

  return chatClient.createRoom(userIds)
}
/**
 * @name getOrCreateRoom (Client Helper)
 * @description returns the room id of an existing one-on-one room, if it
 * exists, or creates a new one.
 */
export const getOrCreateRoom = async (userIds: string[]): Promise<RoomId> => {
  if (!chatClient) throw new Error(CHAT_CLIENT_UNINITIALIZED_ERROR)

  return chatClient.getOrCreateRoom(userIds)
}

/**
 * @name selectedRoomAtom (Read-Only)
 * @description An atom containing a possible selected room.
 */
export const selectedRoomAtom = atom<ChatRoom | null>(null)

/**
 * @name selectRoomByIdAtom (Write-Only)
 * @description Selects the room for the `selectedRoomAtom`
 */
export const selectRoomByIdAtom = atom(null, (get, set, roomId: string) => {
  const roomAtomsRecord = get(_roomAtomsRecordAtom)
  const roomAtom = roomAtomsRecord[roomId]
  if (!roomAtom) return
  set(selectedRoomAtom, get(roomAtom))
})

/**
 * @name joinRoomAtom (Write-Only)
 * @description Joins a user to the invited room. It's important to consider
 * that the room needs to be selected to join the room. Selections is a
 * technique in Jōtai to select a specific atom (for example, a room atom) and
 * later update the state of that atom without the need to trigger a re-render
 * for the entire array.
 */
export const joinRoomAtom = atom(null, async (get, set, roomId: string) => {
  if (chatClient === undefined) {
    throw new Error(CHAT_CLIENT_UNINITIALIZED_ERROR)
  }
  const roomAtomsRecord = get(_roomAtomsRecordAtom)
  const selectedRoomAtom = roomAtomsRecord[roomId]
  if (!selectedRoomAtom) return

  const hasJoined = await chatClient.joinRoom(roomId)
  if (!hasJoined) return
  set(selectedRoomAtom, (selectedRoom) => updateInvitation(selectedRoom, hasJoined))
})

/** Room Messages */

/**
 * @name sendMessage (Client Helper)
 * @description sends a new message to the Chat client.
 */
export const sendMessage = async (message: CreateMessage): Promise<string> => {
  if (!chatClient) throw new Error(CHAT_CLIENT_UNINITIALIZED_ERROR)

  return await chatClient.sendTextMessage(message.roomId, message.text)
}

/**
 * @name messagesAtomsRecordAtom (Read-Only)
 * @description An atom of type `Record<string, ChatMessagesAtom>` collects `Atom<ChatMessage[]>` for all rooms ids.
 * Only reading from this atom is allowed.
 */
const _messagesAtomsRecordAtom = atom<Record<string, ChatMessagesAtom>>({})
export const messagesAtomsRecordAtom = atom((get) => get(_messagesAtomsRecordAtom))

/**
 * @name _messagesAtomsRecordAtomSubscriber (Write-Only)
 * @description Read (getter) function returns `Record<string, ChatMessagesAtom>`
 * Write (setter) function expects two argunments: `roomId` and `event` of type `MatrixEvent` and adds new message into the room's `Atom<ChatMessage[]>`
 * This atom should has `onMount` function that subsribes to `ChatClient` and listens for new messages.
 */
const _messagesAtomsRecordAtomSubscriber = atom(null, (get, set, roomId: string, event: MatrixEvent) => {
  if (!roomId) return

  const addMessageToRoomThread = produce((threadsRecord: Record<string, ChatMessagesAtom>, event: MatrixEvent) => {
    threadsRecord[roomId] = threadsRecord[roomId] ?? atom<ChatMessage[]>([])
    const newMessage = createChatMessage(roomId, event)

    set(threadsRecord[roomId], (prevMessages) => updateMessages(prevMessages, newMessage))
    updateRoom(roomId, newMessage)
  })

  // TODO: optimize to update the room timestamp instead of updating the entire room
  // This could be done through the new room selection
  const updateRoom = produce((roomId: string, message: ChatMessage) => {
    const roomAtomsRecord = get(roomAtomsRecordAtom)
    const roomAtom = roomAtomsRecord[roomId]

    if (!roomAtom) return

    set(roomAtom, (room) => updateRoomAfterNewMessage(room, message))
  })

  set(_messagesAtomsRecordAtom, (prevThreadsRecord) => addMessageToRoomThread(prevThreadsRecord, event))
})

_messagesAtomsRecordAtomSubscriber.onMount = (setAtom) => {
  if (!chatClient) throw new Error(CHAT_CLIENT_UNINITIALIZED_ERROR)
  chatClient.subscribeToMessages(setAtom)
}

/**
 * @name messagesByRoomIdAtomCreator (Write-Only)
 * @description A function that creates message list atom based on the passed room id.
 */
const messagesByRoomIdAtomCreator = (roomId: string) =>
  atom((get) => {
    const roomMessagesAtomsRecord = get(_messagesAtomsRecordAtom)
    const messagesAtom = roomMessagesAtomsRecord[roomId]
    if (!messagesAtom) return []

    return get(messagesAtom)
  })

/**
 * @name useSelectedRoom (Hook Helper)
 * @description It returns the room selection with the data required for a specific room.
 */
export const useSelectedRoom = (roomId: string): [ChatRoom | null, ChatMessage[]] => {
  const room = useAtomValue(selectedRoomAtom)
  const messages = useAtomValue(useMemo(() => messagesByRoomIdAtomCreator(roomId), [roomId]))

  return [room, messages]
}
