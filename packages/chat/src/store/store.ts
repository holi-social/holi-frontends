import { produce } from 'immer'
import { Atom, atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import type { IRoomEvent, MatrixEvent, Room, RoomMember, RoomState } from 'matrix-js-sdk'
import { useCallback, useMemo, useRef } from 'react'

import ChatClient from '@holi/chat/src/client/ChatClient'
import type { NotificationCount, RoomId } from '@holi/chat/src/client/types'
import { isLastMemberCreator, leaveRoomUpdate } from '@holi/chat/src/store/member'
import { createChatMessage, updateMessages } from '@holi/chat/src/store/messages'
import {
  UpdateInvitationOptions,
  addChatRoom,
  createChatRoom,
  updateRoomAfterNewMessage,
  updateRoomInvitation,
  updateRoomUnreadNotifications,
} from '@holi/chat/src/store/room'
import type {
  ChatMessage,
  ChatMessagesAtom,
  ChatRoom,
  ChatRoomAtom,
  ChatRoomId,
  CreateMessage,
} from '@holi/chat/src/store/types'
import { getAtomFromRecordId, isRoomMessageEvent } from '@holi/chat/src/store/utils'
import { logError } from '@holi/core/errors/helpers'
import { logDebug } from '@holi/core/helpers/logging'

const _chatInitializedAtom = atom(false)

/**
 * Hook to check if the chat client has been initialized. Intended for usage in arbitrary
 * components that need to check if the chat client has been initialized, e.g. in order to
 * render a loading indicator.
 *
 * @returns `true` if the chat client has been initialized, `false` otherwise.
 */
export const useChatInitialized = () => useAtom(_chatInitializedAtom)

/** Client **/
let chatClient: ChatClient | undefined = undefined
export const initChatClient = (newChatClient: ChatClient | undefined) => {
  chatClient = newChatClient
}

export const getChatClient = (): ChatClient => {
  if (!chatClient)
    throw new Error(
      '[ChatStore]: chatClient was not initialized, please ensure to call initChatClient before using the store'
    )
  return chatClient
}

/** Rooms **/

/**
 * Internal
 *
 * IMPORTANT! Do not set values to the room using this atom. It would be best to
 * use a `createRoomAtomRecord` derived atom to set values (updating the
 * state).To edit a particular room, you need to use a selector, which can be
 * found below under the Room section (e.g `createRoomAtom`).
 */
const _roomAtomsRecordAtom = atom<Record<ChatRoomId, ChatRoomAtom>>({})

/**
 * @description A read-only atom to receive a record mapping room ids to room atoms.
 * Each atom contains the room (conversation) of the logged-in user. To get the room
 * information, you must pass the single room to a const `room = useAtomValue(roomAtom)`
 * to access this read-only value.
 *
 * @see _roomAtomsRecordAtom
 */
export const roomAtomsRecordAtom: Atom<Record<ChatRoomId, ChatRoomAtom>> = atom((get) => get(_roomAtomsRecordAtom))

/**
 * Derived atom that holds all room atoms sorted by date of last message in descending order
 */
export const roomAtomsSortedByDateAtom = atom((get) => {
  const roomAtoms = Object.values(get(_roomAtomsRecordAtom))
  return roomAtoms.sort((rA, rB) => {
    const tsA = get(rA).timestamp ?? Infinity
    const tsB = get(rB).timestamp ?? Infinity
    return tsA < tsB ? 1 : -1
  })
})

type RoomAtomsRecordAtomSubscriberArgs = { room: Room; hasPendingInvitation: boolean } | 'initDone'

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
const _roomAtomsRecordAtomSubscriber = atom(null, (get, set, args: RoomAtomsRecordAtomSubscriberArgs) => {
  if (args === 'initDone') {
    logDebug('Chat.store', 'chat initialized')
    // hack to be able to set the atom, see _roomAtomsRecordAtomSubscriber.onMount for details
    if (!get(_chatInitializedAtom)) {
      set(_chatInitializedAtom, true)
    }
  } else {
    const { room, hasPendingInvitation } = args
    const chatRoom = createChatRoom(room, hasPendingInvitation)

    const hasRoom = room.roomId in get(_roomAtomsRecordAtom)
    set(_roomAtomsRecordAtom, (prevRoomAtoms) => addChatRoom(prevRoomAtoms, chatRoom))

    if (!hasRoom) {
      getChatClient().subscribeToRoomMessages(room, (event) => {
        set(_newMessageAtomSubscriber, event)
      })
    }
  }
})

_roomAtomsRecordAtomSubscriber.onMount = (setAtom) => {
  const client = getChatClient()

  const addRoomToStore = (room: Room, logPhase: string) => {
    const hasPendingInvitation = getChatClient().hasPendingInvitation(room)
    logDebug(`Chat.store [${logPhase}]`, `adding room ${room.roomId} to store`)
    setAtom({ room, hasPendingInvitation })
  }

  // get current rooms from ChatClient and store them to Atoms
  client.getRooms().forEach((room) => addRoomToStore(room, 'init'))

  // hack to be able to set `_chatInitializedAtom` to true. we know that the chat has been initialized when we added
  // all rooms to the store. this is a hack because we cannot set atoms in the `onMount` lifecycle.
  // strictly speaking, this is a timing issue, as room events might arrive shortly after, but in tests they always
  // arrived so quick that they were already available in client.getRooms() above.
  setAtom('initDone')

  // set litener for new rooms
  getChatClient().subscribeToRooms((room) => {
    /**
     * @name waitForCorrectRoomName
     * @description Matrix room has `Empty room` name on creation and then Matrix updates it under the hood.
     * We use this function to watch for the room `name` change and only create an atom when correct name was passed
     * or timeout exceeded.
     * @param timestamp `number` represents timestamp limit till function postponds setting the atom
     */
    const waitForCorrectRoomName = (timestamp: number) => {
      if (room.name !== 'Empty room' || Date.now() > timestamp) {
        addRoomToStore(room, 'subscription')
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
 * @name _roomAtomsRecordAtomSubscriber (Write-Only)
 * @description This atom listens to unread notification changes emitted from
 * the server. It updates all the user rooms with the incoming unread
 * notification.
 */
const _roomsNotificationsSubscriberAtom = atom(
  null,
  (get, set, roomId: string, notificationCount: NotificationCount) => {
    const roomAtom = getAtomFromRecordId(get, _roomAtomsRecordAtom, roomId)
    if (!roomAtom) return

    set(roomAtom, (prevRoom) =>
      updateRoomUnreadNotifications(prevRoom, notificationCount.total ?? prevRoom.notificationCount)
    )
  }
)

_roomsNotificationsSubscriberAtom.onMount = (setAtom) => {
  getChatClient()
    .subscribeToUnreadRoomsNotifications(setAtom)
    .catch((err) => logError(err))
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
 * @name joinRoom
 * @description Join a Matrix room by accepting the invitation. If you have
 * already joined the room, this will be a no-op.
 */
export const leaveRoom = async (roomId: string): Promise<void> => {
  await getChatClient().leaveRoom(roomId)
}

/**
 * @name messagesByRoomIdAtomCreator (Write-Only)
 * @description A function that creates a `ChatRoom` atom based on the passed room id.
 */
const roomByIdAtomCreator = (roomId: string) => {
  return atom((get) => {
    const roomAtomsRecord = get(_roomAtomsRecordAtom)
    const roomAtom = roomAtomsRecord[roomId]
    if (!roomAtom) return undefined

    return get(roomAtom)
  })
}

/**
 * @name _myMembershipSubscriberAtom
 * @description Listens to event changes in my room membership when accepting a
 * new invitation. Memberships can be `joinRoom`, `join`, or `leave`, Whenever
 * the user joins a room, we update the room has an invitation.
 */
const _myMembershipSubscriberAtom = atom(null, (get, set, options: UpdateInvitationOptions) => {
  const roomAtomsRecord = get(_roomAtomsRecordAtom)
  const roomAtom = roomAtomsRecord[options.room.roomId]
  if (!roomAtom) return null

  set(roomAtom, (room) => updateRoomInvitation(room, options))
})

_myMembershipSubscriberAtom.onMount = (setAtom) => {
  return getChatClient().subscribeToMyMembership((room, membership, prevMembership) => {
    setAtom({ room, membership, prevMembership })
  })
}

/**
 * @name _membershipSubscriberAtom
 * @description The membership subscriber is used to listening to members
 * leaving rooms and eventually forgetting (deleting) a room in case the creator
 * is the only member available. You can extend when updating the store based on
 * membership events.
 */
const _membershipSubscriberAtom = atom(
  null,
  async (_get, set, event: MatrixEvent, roomState: RoomState, member: RoomMember) => {
    const client = getChatClient()

    // If the creator of the room is the last one we forget (delete) entirely the room
    if (isLastMemberCreator(roomState, member)) {
      await client.leaveRoom(roomState.roomId)
      await client.forgetRoom(roomState.roomId, true)
    }

    set(_roomAtomsRecordAtom, (prevRoomAtomsRecord) =>
      leaveRoomUpdate(prevRoomAtomsRecord, { event, roomState, member })
    )
  }
)

_membershipSubscriberAtom.onMount = (setAtom) => {
  return getChatClient().subscribeToMembership(setAtom)
}

/** Messages */

/**
 * @name sendMessage (Client Helper)
 * @description sends a new message to the Chat client.
 */
export const sendMessage = async (message: CreateMessage): Promise<string> => {
  return await getChatClient().sendTextMessage(message.roomId, message.text)
}

const _ignoredUsersAtom = atom<string[]>([])
const _ignoredUsersAtomSubscriber = atom(null, async (_get, set) => {
  const client = getChatClient()
  set(_ignoredUsersAtom, client.getIgnoredUsers)
})

_ignoredUsersAtomSubscriber.onMount = (setAtom) => {
  getChatClient().subscribeToIgnoredUsers(setAtom)
  setAtom() // triggers that the list of ignored users is intially populated
}

export const useIgnoredUsers = () => {
  return useAtomValue(_ignoredUsersAtom)
}

export const ignoreUser = async (userId: string) => {
  await getChatClient().ignoreUser(userId)
}

export const unignoreUser = async (userId: string) => {
  return await getChatClient().unignoreUser(userId)
}

const _messagesAtomsRecordAtom = atom<Record<ChatRoomId, ChatMessagesAtom>>({})

/**
 * @description A read-only atom containing records to look up `Atom<ChatMessage[]>` by room ID.
 */
export const messagesAtomsRecordAtom: Atom<Record<ChatRoomId, ChatMessagesAtom>> = atom((get) =>
  get(_messagesAtomsRecordAtom)
)

/**
 * @name _messageBunchAtomSetter
 * @description Write (setter) function is used to set a bunch of messages at
 * once. It expects three arguments:
 * @argument roomId: `string`
 * @argument events: `IRoomEvent` - bunch of room events
 * @argument merge?: `boolean` - if `false` overrides the list of previous
 * room's messages, otherwise merges created messages with the existing ones
 * This setter is used for initial messages and for pagination. When we
 * initially fetch messages, we do not need to merge them with previous, but for
 * pagination we want to merge older messages with the new ones
 */
const _messageBunchAtomSetter = atom(null, (get, set, roomId: string, events: IRoomEvent[], merge?: boolean) => {
  if (!roomId) return

  const addMessagesToRoomThread = produce(
    (threadsRecord: Record<string, ChatMessagesAtom>, roomEvents: IRoomEvent[], merge = false) => {
      threadsRecord[roomId] = threadsRecord[roomId] ?? atom<ChatMessage[]>([])
      set(threadsRecord[roomId], (existingMessages) => {
        // the list of messages must have `Backward` direction - from older to newer messages
        // it is why we reverse `requestedMessages`
        const requestedMessages = roomEvents
          .filter(isRoomMessageEvent)
          .reverse()
          .map((event) => createChatMessage(roomId, event))

        // and put `requestedMessages` in the begining of the list
        return merge ? [...requestedMessages, ...existingMessages] : requestedMessages
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
 * @description A function that returns an atom of messages for the given room id.
 * @returns `Atom<ChatMessage[]>` or `undefined` if the room does not exist.
 */
const messagesByRoomIdAtomCreator = (roomId: string) =>
  atom((get) => {
    const roomMessagesAtomsRecord = get(_messagesAtomsRecordAtom)
    const messagesAtom = roomMessagesAtomsRecord[roomId]
    if (!messagesAtom) return undefined

    return get(messagesAtom)
  })

/**
 * @name useRequestRoomMessages (Hook-Helper)
 * @description
 */
export const useRequestRoomMessages = () => {
  const setMessages = useSetAtom(_messageBunchAtomSetter)
  const client = chatClient
  const tokenRef = useRef<{ start?: string; end?: string }>({ start: undefined, end: undefined })
  const isLoading = useRef(false)

  return useCallback(
    (roomId: string, resync: boolean) => {
      if (!client) return
      if (!roomId || !client) return
      if (isLoading.current || (tokenRef.current.start && !tokenRef.current.end)) return

      isLoading.current = true
      let merge = !!tokenRef.current.end
      if (resync) {
        tokenRef.current = { start: undefined, end: undefined }
        merge = false
      }
      client
        .createMessagesRequest(roomId, tokenRef.current.end)
        .then(async (resp) => {
          const { chunk: roomEvents, start, end } = resp
          setMessages(roomId, roomEvents, merge)

          // unpdate start and end tokens only after merging messages
          tokenRef.current = { start, end }
        })
        .finally(() => (isLoading.current = false))
    },
    [client, setMessages]
  )
}

/**
 * @name useRoomById (Hook Helper)
 * @description It returns the specific room with all its data (`ChatRoom` and `ChatMessage[]`) or
 * `undefined` for both if the room ID could not be found.
 */
export const useRoomById = (roomId: string): [ChatRoom | undefined, ChatMessage[] | undefined] => {
  const room = useAtomValue(useMemo(() => roomByIdAtomCreator(roomId), [roomId]))
  const messages = useAtomValue(useMemo(() => messagesByRoomIdAtomCreator(roomId), [roomId]))

  return [room, messages]
}

/**
 * @description hook that triggers atoms subscriptions to Matrix events (calling useAtom will result
 * in the atoms `.onMount` method being called). As a result, the atoms will be populated with domain
 * objects derived from the Matrix events. Example: Matrix message events will be converted to
 * `ChatMessage` instances and stored in the `messagesAtomsRecordAtom`.
 */
export const useSubscribeToChat = () => {
  useAtom(_roomAtomsRecordAtomSubscriber)
  useAtom(_roomsNotificationsSubscriberAtom)
  useAtom(_myMembershipSubscriberAtom)
  useAtom(_membershipSubscriberAtom)
  useAtom(_ignoredUsersAtomSubscriber)
}
