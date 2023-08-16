import { produce } from 'immer'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { IRoomEvent, MatrixEvent, Room } from 'matrix-js-sdk'
import { useCallback, useMemo, useRef } from 'react'

import ChatClient from '@holi/chat/src/client/ChatClient'
import type { RoomId } from '@holi/chat/src/client/types'
import { isRoomEvent } from '@holi/chat/src/store/utils'

import { createChatMessage, updateMessages } from './messages'
import {
  UpdateInvitationOptions,
  addChatRoom,
  createChatRoom,
  updateRoomAfterNewMessage,
  updateRoomInvitation,
} from './room'
import type { ChatMessage, ChatMessagesAtom, ChatRoom, ChatRoomAtom, CreateMessage } from './types'

/** Client **/
let chatClient: ChatClient | undefined = undefined
export const initChatClient = (newChatClient: ChatClient | undefined) => {
  chatClient = newChatClient
}

const getChatClient = (): ChatClient => {
  if (!chatClient)
    throw new Error(
      '[ChatStore]: chatClient was not initialized, please ensure to call initChatClient before using the store'
    )
  return chatClient
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

export const useRequestRoomMessages = () => {
  const setMessages = useSetAtom(_messageBunchAtomSetter)
  const client = chatClient
  const tokenRef = useRef<{ start?: string; end?: string }>({ start: undefined, end: undefined })
  const isLoading = useRef(false)

  return useCallback(
    (roomId: string) => {
      if (!roomId || !client) return
      if (isLoading.current || (tokenRef.current.start && !tokenRef.current.end)) return

      isLoading.current = true
      client
        .createMessagesRequest(roomId, tokenRef.current.end)
        .then(async (resp) => {
          const { chunk, start, end } = resp
          const appendMessages = !!tokenRef.current.end
          setMessages(roomId, chunk, appendMessages)

          // unpdate start and end tokens only after merging messages
          tokenRef.current = { start, end }
        })
        .finally(() => (isLoading.current = false))
    },
    [client, setMessages]
  )
}

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
const _roomAtomsRecordAtomSubscriber = atom(null, (get, set, room: Room, hasPendingInvitation: boolean) => {
  const chatRoom = createChatRoom(room, hasPendingInvitation)

  const hasRoom = room.roomId in get(_roomAtomsRecordAtom)
  set(_roomAtomsRecordAtom, (prevRoomAtoms) => addChatRoom(prevRoomAtoms, chatRoom))

  if (!hasRoom) {
    getChatClient().subscribeToRoomMessages(room, (event) => {
      set(_newMessageAtomSubscriber, event)
    })
  }
})

_roomAtomsRecordAtomSubscriber.onMount = (setAtom) => {
  // get current rooms from ChatClient and store them to Atoms
  getChatClient()
    .getRooms()
    .map((room) => setAtom(room, getChatClient().hasPendingInvitation(room)))

  // set litener for new rooms
  getChatClient().subscribeToRooms(setAtom)
}

/** Room */

/**
 * @name createNewRoom (Client Helper)
 * @description Initiates the creation of a room in Matrix through the
 * ChatClient. The store updates once the room creation event is received from
 * the Matrix server.
 */
export const createNewRoom = async (userIds: string[]): Promise<RoomId> => {
  return getChatClient().createRoom(userIds)
}
/**
 * @name getOrCreateRoom (Client Helper)
 * @description returns the room id of an existing one-on-one room, if it
 * exists, or creates a new one.
 */
export const getOrCreateRoom = async (userIds: string[]): Promise<RoomId> => {
  return getChatClient().getOrCreateRoom(userIds)
}

/**
 * @name joinRoom
 * @description Join a Matrix room by accepting the invitation. If you have
 * already joined the room, this will be a no-op.
 */
export const joinRoom = async (roomId: string): Promise<Room | null> => {
  return await getChatClient().joinRoom(roomId)
}

/**
 * @name messagesByRoomIdAtomCreator (Write-Only)
 * @description A function that creates a `ChatRoom` atom based on the passed room id.
 */
const roomByIdAtomCreator = (roomId: string) => {
  return atom((get) => {
    const roomAtomsRecord = get(_roomAtomsRecordAtom)
    const roomAtom = roomAtomsRecord[roomId]
    if (!roomAtom) return null

    return get(roomAtom)
  })
}

/**
 * @name _myRoomMembershipSubscriber
 * @description Listens to event changes in my room membership when accepting a
 * new invitation. Memberships can be `joinRoom`, `join`, or `leave`, Whenever
 * the user joins a room, we update the room has an invitation.
 */
const _myRoomMembershipSubscriber = atom(null, (get, set, options: UpdateInvitationOptions) => {
  const roomAtomsRecord = get(_roomAtomsRecordAtom)
  const roomAtom = roomAtomsRecord[options.room.roomId]
  if (!roomAtom) return null

  set(roomAtom, (room) => updateRoomInvitation(room, options))
})

_myRoomMembershipSubscriber.onMount = (setAtom) => {
  return getChatClient().subscribeToMyMembership((room, membership, prevMembership) => {
    setAtom({ room, membership, prevMembership })
  })
}

/** Room Messages */

/**
 * @name sendMessage (Client Helper)
 * @description sends a new message to the Chat client.
 */
export const sendMessage = async (message: CreateMessage): Promise<string> => {
  return await getChatClient().sendTextMessage(message.roomId, message.text)
}

/**
 * @name messagesAtomsRecordAtom (Read-Only)
 * @description An atom of type `Record<string, ChatMessagesAtom>` collects `Atom<ChatMessage[]>` for all rooms ids.
 * Only reading from this atom is allowed.
 */
const _messagesAtomsRecordAtom = atom<Record<string, ChatMessagesAtom>>({})
export const messagesAtomsRecordAtom = atom((get) => get(_messagesAtomsRecordAtom))

/**
 * @name _messageBunchAtomSetter
 * @description Write (setter) function is used to set a bunch of messages at once. It expects three arguments:
 * @argument roomId: `string`
 * @argument events: `IRoomEvent` - bunch of room events
 * @argument merge?: `boolean` - if `false` overrides the list of previous room's messages, otherwise merges created messages with the existing ones
 * This setter is used for initial messages and for pagination.
 * When we initially fetch messages, we do not need to merge them with previous, but for pagination we want to merge older messages with the new ones
 */
const _messageBunchAtomSetter = atom(null, (get, set, roomId: string, events: IRoomEvent[], merge?: boolean) => {
  if (!roomId) return

  const addMessagesToRoomThread = produce(
    (threadsRecord: Record<string, ChatMessagesAtom>, events: IRoomEvent[], merge = false) => {
      threadsRecord[roomId] = threadsRecord[roomId] ?? atom<ChatMessage[]>([])
      set(threadsRecord[roomId], (currentMessages) => {
        // the list of messages must have `Backward` direction - from older to newer messages
        // it is why we reverse `olderMessages`
        const olderMessages = events
          .filter(isRoomEvent)
          .reverse()
          .map((event) => createChatMessage(roomId, event))

        // and put `olderMessages` in the begining of the list
        return merge ? [...olderMessages, ...currentMessages] : olderMessages
      })
    }
  )

  set(_messagesAtomsRecordAtom, (prevThreadsRecord) => addMessagesToRoomThread(prevThreadsRecord, events, merge))
})

/**
 * @name _newMessageAtomSubscriber (Read-Write)
 * @description Write (setter) function expects `MatrixEvent` argunment
 * and if it has EventType.RoomMessage type, setter adds new message into the room's `Atom<ChatMessage[]>`.
 * This setter function is only used for new messages.
 */
const _newMessageAtomSubscriber = atom(null, (get, set, event: MatrixEvent) => {
  const roomId = event.getRoomId()
  if (!roomId) return

  const addMessageToRoomThread = produce((threadsRecord: Record<string, ChatMessagesAtom>, event: MatrixEvent) => {
    threadsRecord[roomId] = threadsRecord[roomId] ?? atom<ChatMessage[]>([])
    const newMessage = createChatMessage(roomId, event.event as IRoomEvent)
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
 * @name useRoomById (Hook Helper)
 * @description It returns the specific room with all its data (`ChatRoom` and `ChatMessage[]`).
 */
export const useRoomById = (roomId: string): [ChatRoom | null, ChatMessage[]] => {
  const room = useAtomValue(useMemo(() => roomByIdAtomCreator(roomId), [roomId]))
  const messages = useAtomValue(useMemo(() => messagesByRoomIdAtomCreator(roomId), [roomId]))

  return [room, messages]
}

/**
 * @name useSubscribeToChat hook
 * @description helper hook subscribes to rooms and messages updates. Should be used on the `<ChatStore />`.
 */
export const useSubscribeToChat = () => {
  useAtom(_roomAtomsRecordAtomSubscriber)
  useAtom(_myRoomMembershipSubscriber)
}
