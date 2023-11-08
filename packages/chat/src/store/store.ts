import { produce } from 'immer'
import { type Atom, Getter, atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { EventTimeline, EventType, IRoomEvent, MatrixEvent, Room, RoomMember, RoomState } from 'matrix-js-sdk'
import { useCallback, useMemo, useRef } from 'react'

import ChatClient from '@holi/chat/src/client/ChatClient'
import { setChatInitialized } from '@holi/chat/src/client/chatState'
import {
  type ChatRoomMember,
  type MatrixId,
  MembershipStatus,
  type NotificationCount,
  type RoomId,
  type RoomWithSharedData,
  type SpaceGeneralRoomSharedDataContent,
} from '@holi/chat/src/client/types'
import type {
  ChatMessage,
  ChatMessageContent,
  ChatMessagesAtom,
  ChatRoom,
  ChatRoomAtom,
  ChatRoomId,
  CreateMessage,
  MyMembershipOptions,
  PrivateChatTab,
  RoomAtomByRoomId,
  RoomAtomsRecordAtomSubscriberArgs,
  SpaceChatTab,
  SpaceGeneralChatRoomAtom,
} from '@holi/chat/src/store/types'
import { MessageAtomsByRoomId, RoomAtomsActionType, isSpaceGeneralChatRoom } from '@holi/chat/src/store/types'
import { getAtomFromRecordId, isRoomMessageEvent, toMatrixIdentity } from '@holi/chat/src/store/utils'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { logError } from '@holi/core/errors/helpers'
import { logDebug } from '@holi/core/helpers/logging'
import type { User as HoliUser } from '@holi/core/screens/userprofile/types'

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

/**
 * Room Producers
 *
 **/

const updateRoomInvitation = produce((chatRoom: ChatRoom, { membership, prevMembership }: MyMembershipOptions) => {
  const hasJoined = prevMembership === 'invite' && membership === 'join'
  if (!hasJoined) return

  chatRoom.hasInvitation = !hasJoined
})

const updateRoomUnreadNotifications = produce((chatRoom: ChatRoom, count: number) => {
  chatRoom.notificationCount = count
})

const updateRoomAfterNewMessage = produce((room: ChatRoom, message: ChatMessage) => {
  room.lastMessage = message
  room.timestamp = message.timestamp
})

const addChatRoom = produce((roomAtoms: Record<string, ChatRoomAtom>, chatRoom: ChatRoom) => {
  roomAtoms[chatRoom.id] = atom(chatRoom)
})

const addOrUpdateChatRoom = produce((roomAtoms: Record<string, ChatRoomAtom>, rooms: ChatRoom[], get: Getter) => {
  rooms.forEach((room) => {
    const roomId = room.id

    const hasRoom = roomId in roomAtoms
    const roomAtom = roomAtoms[roomId]

    if (hasRoom && roomAtom) {
      const prevRoom = get(roomAtom)
      roomAtoms[roomId] = atom({ ...prevRoom, ...room })
    } else {
      roomAtoms[roomId] = atom(room)
    }
  })
})

const deleteChatRoom = produce((roomAtoms: Record<string, ChatRoomAtom>, roomId: string) => {
  if (roomId in roomAtoms) delete roomAtoms[roomId]
})

/**
 * Room Atoms -(Read-Only)
 */

/**
 * Internal
 *
 * IMPORTANT! Do not set values to the room using this atom. It would be best to
 * use a `createRoomAtomRecord` derived atom to set values (updating the
 * state).To edit a particular room, you need to use a selector, which can be
 * found below under the Room section (e.g `createRoomAtom`).
 */
const _roomAtomsRecordAtom = atom<RoomAtomByRoomId>({})

/**
 * @description: A read-only array of all the users chat room atoms to use internally.
 * @see _roomAtomsRecordAtom
 */
const _roomAtoms = atom<ChatRoomAtom[]>((get) => Object.values(get(_roomAtomsRecordAtom)))

/**
 * @description A read-only atom to receive a record mapping room ids to room atoms.
 * Each atom contains the room (conversation) of the logged-in user. To get the room
 * information, you must pass the single room to a const `room = useAtomValue(roomAtom)`
 * to access this read-only value.
 *
 * @see _roomAtomsRecordAtom
 */
export const roomAtomsRecordAtom: Atom<RoomAtomByRoomId> = atom((get) => get(_roomAtomsRecordAtom))

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

/**
 * @description This derived read-only atom contains a array with all the general Space Room Atoms.
 * @see _roomAtoms
 */
export const spaceGeneralRoomAtoms = atom<SpaceGeneralChatRoomAtom[]>((get) => {
  return get(_roomAtoms).filter((roomAtom) => isSpaceGeneralChatRoom(get(roomAtom))) as SpaceGeneralChatRoomAtom[]
})

/**
 * @description This derived read-only atom contains a array with all the spaceRoomAtoms.
 * @see spaceGeneralRoomAtoms
 */
export const spaceGeneralRoomContentAtoms: Atom<SpaceGeneralRoomSharedDataContent[]> = atom((get) => {
  return get(spaceGeneralRoomAtoms).map((roomAtom) => get(roomAtom).content)
})

/**
 * @description A read-only atom to receive a record mapping room ids to derived room
 * derived room has type SpaceChatTab | PrivateChatTab
 *
 * @see derivedRoomsRecordAtom
 */
export const derivedRoomsRecordAtom: Atom<Record<ChatRoomId, SpaceChatTab | PrivateChatTab>> = atom((get) => {
  const roomAtoms = Object.values(get(_roomAtomsRecordAtom))
  return roomAtoms.reduce<Record<ChatRoomId, SpaceChatTab | PrivateChatTab>>((acc, roomAtom) => {
    const room = get(roomAtom)
    if (room.type === 'space') return acc

    const derivedRoom: SpaceChatTab | PrivateChatTab = isSpaceGeneralChatRoom(room)
      ? {
          id: room.id,
          type: room.type,
          members: room.members,
          content: room.content,
          timestamp: room.timestamp,
        }
      : {
          id: room.id,
          type: room.type,
          members: room.members,
          timestamp: room.timestamp,
        }

    return {
      ...acc,
      [room.id]: derivedRoom,
    }
  }, {})
})

/**
 * @description A read-only atom to receive a record mapping room ids to derived room of type SpaceChatTab only
 *
 * @see spaceTabRecordAtom
 */
export const spaceTabRecordAtom: Atom<Record<ChatRoomId, SpaceChatTab>> = atom((get) => {
  return Object.entries(get(derivedRoomsRecordAtom)).reduce<Record<ChatRoomId, SpaceChatTab>>(
    (acc, [id, derivedRoom]) => {
      if (derivedRoom.type !== 'space-general-room') return acc

      return {
        ...acc,
        [id]: derivedRoom,
      }
    },
    {}
  )
})

/**
 * Derived atom that holds record with space ids as keys and array of all space's related room (ChatRoom) atoms as value
 */
export const spaceRoomAtomsRecordAtom: Atom<Promise<Record<ChatRoomId, ChatRoomAtom[]>>> = atom(async (get) => {
  const roomAtomsRecord = get(_roomAtomsRecordAtom)
  const spaceTabsRecord = get(spaceTabRecordAtom)
  const derivedRoomsRecord = get(derivedRoomsRecordAtom)

  return Object.entries(spaceTabsRecord).reduce<Record<ChatRoomId, ChatRoomAtom[]>>((acc, [roomId, spaceTabRoom]) => {
    const currentRoomMembers = spaceTabRoom.members

    const siblingRoomIds = Object.values(derivedRoomsRecord).reduce<ChatRoomId[]>((acc, siblingRoomTab) => {
      if (siblingRoomTab.id === roomId) return [...acc, roomId]
      if (siblingRoomTab.type !== 'private') return acc

      // find private space related rooms
      const siblingRoomMembers = siblingRoomTab.members
      const hasSpaceMembers = siblingRoomMembers.every((member) =>
        currentRoomMembers.some((spaceMember) => spaceMember.id === member.id)
      )

      return hasSpaceMembers ? [...acc, siblingRoomTab.id] : acc
    }, [])

    const sortedSiblingRoomIds = siblingRoomIds.sort((rIdA, rIdB) =>
      (derivedRoomsRecord[rIdA].timestamp ?? 0) < (derivedRoomsRecord[rIdB].timestamp ?? 0) ? 1 : -1
    )
    const siblingRoomAtoms = sortedSiblingRoomIds.map((roomId) => roomAtomsRecord[roomId])

    return {
      ...acc,
      [roomId]: siblingRoomAtoms,
    }
  }, {})
})

export const spaceNotificationCountRecordAtom: Atom<Promise<Record<ChatRoomId, number>>> = atom(async (get) => {
  const spaceRoomAtomsRecord = await get(spaceRoomAtomsRecordAtom)
  return Object.entries(spaceRoomAtomsRecord).reduce<Record<ChatRoomId, number>>((acc, [spaceRoomId, roomAtoms]) => {
    const spaceRelatedNotificationCount = roomAtoms.reduce((acc, roomAtom) => acc + get(roomAtom).notificationCount, 0)
    return {
      ...acc,
      [spaceRoomId]: spaceRelatedNotificationCount,
    }
  }, {})
})

/**
 * Room Atoms -(Write-Only)
 */

/**
 * @name _removeRoomAtom (Write-Only)
 * @description Removes a room from the Jōtai store but not from the Matrix
 * client. We do this, for example, when we ignore users and don't want to
 * display a room if there are only two members, one of them being the one
 * ignored (blocked). Exported is only the helper hook below `useRemoveRoomAtom`
 */
const _removeRoomAtom = atom(null, (get, set, roomId: string) => {
  const roomAtom = getAtomFromRecordId(get, _roomAtomsRecordAtom, roomId)
  if (!roomAtom) return
  if (get(roomAtom).members.length > 2) return

  const removeRoom = produce((roomAtomsRecord: Record<string, ChatRoomAtom>, roomId: string) => {
    delete roomAtomsRecord[roomId]
  })

  set(_roomAtomsRecordAtom, (prevAtomRecord) => removeRoom(prevAtomRecord, roomId))
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
const _roomAtomsRecordAtomSubscriber = atom(null, (get, set, args: RoomAtomsRecordAtomSubscriberArgs) => {
  switch (args.type) {
    case RoomAtomsActionType.CREATE:
    case RoomAtomsActionType.UPDATE: {
      const chatRoomList = args.roomList.reduce<ChatRoom[]>((acc, { room, hasPendingInvitation, ignoredUsers }) => {
        const chatRoom = createChatRoom(room, hasPendingInvitation)
        // Space rooms are used as containers and not shown in the UI
        if (room.room.isSpaceRoom()) return acc

        // We hide chat rooms with only ignored members from the user. We do an
        // early return not to include the chat room in the store.
        if (hasOnlyIgnoredMembers(chatRoom.members, ignoredUsers)) return acc

        return [...acc, chatRoom]
      }, [])

      set(_roomAtomsRecordAtom, (prevRoomAtoms) => addOrUpdateChatRoom(prevRoomAtoms, chatRoomList, get))
      break
    }

    case RoomAtomsActionType.DELETE:
      set(_roomAtomsRecordAtom, (prevRoomAtoms) => deleteChatRoom(prevRoomAtoms, args.roomId))
      break

    default:
      throw new HoliError('roomAtomsRecordAtomSubscriber got a wrong action type')
  }
})

_roomAtomsRecordAtomSubscriber.onMount = (setAtom) => {
  const client = getChatClient()
  const ignoredUsers = client.getIgnoredUsers()

  const addRoomToStore = (
    type: RoomAtomsActionType.CREATE | RoomAtomsActionType.UPDATE,
    roomListWithSharedData: RoomWithSharedData[],
    logPhase: string
  ) => {
    const roomList = roomListWithSharedData.map((roomWithSharedData) => {
      const hasPendingInvitation = client.hasPendingInvitation(roomWithSharedData.room)

      logDebug(`Chat.store [${logPhase}]`, `adding room ${roomWithSharedData.room.roomId} to store`)
      return { room: roomWithSharedData, hasPendingInvitation, ignoredUsers }
    })

    setAtom({ type, roomList })
  }

  const deleteRoomFromStore = (roomId: string) => {
    logDebug('Chat.store', `deleting room ${roomId} from store`)
    setAtom({ type: RoomAtomsActionType.DELETE, roomId })
  }

  const joinGeneralSpaceRoom = async ({ room }: RoomWithSharedData) => {
    try {
      const isSpaceRoom = room.isSpaceRoom() || room.name === '#general'
      if (isSpaceRoom && client.hasPendingInvitation(room)) {
        await client.joinRoom(room.roomId)
      }
    } catch (err) {
      console.debug(`Probably the space room with ID "${room.roomId}" was deleted`, err)
    }
  }

  /**
   * Initial load
   */
  // get current rooms from ChatClient and store them to Atoms directly
  const rooms = client.getRooms()
  addRoomToStore(
    RoomAtomsActionType.CREATE,
    rooms.map((room) => ({ type: 'private', room })),
    'init'
  )

  // ask for async shared data for space related rooms and update atoms
  client.getRoomsWithSharedData().then(async (rooms) => {
    const [roomsJoined, roomsLeft] = rooms.reduce<[RoomWithSharedData[], RoomWithSharedData[]]>(
      ([joined, left], room) => {
        const myMembership = room.room.getMyMembership()

        if (['leave', 'ban', 'block'].some((membership) => membership === myMembership)) {
          return [joined, [...left, room]]
        } else {
          return [[...joined, room], left]
        }
      },
      [[], []]
    )

    addRoomToStore(RoomAtomsActionType.CREATE, roomsJoined, 'init')
    roomsLeft.forEach(({ room }) => deleteRoomFromStore(room.roomId))

    rooms.forEach(async (roomWithSharedData) => {
      // automatically accept general space room invitations
      await joinGeneralSpaceRoom(roomWithSharedData).catch((err) => err)
    })
  })

  setChatInitialized(true)

  /**
   * Listen to just created rooms
   */
  const unsubscribeFromRoomSharedData = client.subscribeToRoomSharedData((roomWithSharedData) => {
    addRoomToStore(RoomAtomsActionType.UPDATE, [roomWithSharedData], 'subscription')
  })

  const unsubscribeFromRooms = client.subscribeToRooms((roomWithSharedData) => {
    const hasRoomEmptyName = (room: Room) => room.name === 'Empty room'
    /**
     * @name waitForCorrectRoomName
     * @description Matrix room has `Empty room` name on creation and then Matrix updates it under the hood.
     * We use this function to watch for the room `name` change and only create an atom when correct name was passed
     * or timeout exceeded.
     * @param timestamp `number` represents timestamp limit till function postponds setting the atom
     */
    const waitForCorrectRoomName = (timestamp: number) => {
      if (!hasRoomEmptyName(roomWithSharedData.room) || Date.now() > timestamp) {
        addRoomToStore(RoomAtomsActionType.CREATE, [roomWithSharedData], 'subscription')
      } else {
        setTimeout(() => {
          waitForCorrectRoomName(timestamp)
        }, 50)
      }
    }

    if (hasRoomEmptyName(roomWithSharedData.room)) {
      waitForCorrectRoomName(Date.now() + 2000)
    }

    addRoomToStore(RoomAtomsActionType.CREATE, [roomWithSharedData], 'subscription')
    joinGeneralSpaceRoom(roomWithSharedData)
  })

  /**
   * Listen to just deleted rooms
   */
  const unsubscribeFromRoomDeletion = client.subscribeToRoomDeletion(deleteRoomFromStore)

  return () => {
    unsubscribeFromRoomSharedData()
    unsubscribeFromRooms()
    unsubscribeFromRoomDeletion()
  }
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
  return getChatClient().subscribeToUnreadRoomsNotifications(setAtom)
}

export const useSetRemoveRoomAtom = () => {
  return useSetAtom(_removeRoomAtom)
}

/**
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
 * @name roomAtomsRecorAtomForTesting
 * @description Use this read-write atom for unit testing purposes; for example,
 * initialize the Jōtai store in the `TestBed.tsx` component.
 */
// TODO: move to testing directory
export const roomAtomsRecorAtomForTesting = atom(
  (get) => get(_roomAtomsRecordAtom),
  (_get, set, roomAtomsRecord: RoomAtomByRoomId) => {
    set(_roomAtomsRecordAtom, () => roomAtomsRecord)
  }
)

/**
 * Room Actions
 *
 **/

/**
 * @name createNewRoom (Client Helper)
 * @description Initiates the creation of a room in Matrix through the
 * ChatClient. The store updates once the room creation event is received from
 * the Matrix server.
 */
export const createNewRoom = async (userIds: string[]): Promise<RoomId> => {
  return getChatClient().createRoom(userIds, { isDirectMessage: true })
}
/**
 * @name getOrCreateRoom (Client Helper)
 * @description returns the room id of an existing one-on-one room, if it
 * exists, or creates a new one.
 */
export const getOrCreateRoom = async (userIds: string[]): Promise<RoomId> => {
  return getChatClient().getOrCreateRoom(userIds, { isDirectMessage: true })
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
 * @name leaveRoom
 * @description Leave a Matrix room.
 */
export const leaveRoom = async (roomId: string): Promise<void> => {
  await getChatClient().leaveRoom(roomId)
}

// TODO extract memberships from room to its own atom record
const getMembership = (membership?: string) => {
  switch (membership) {
    case 'join':
      return MembershipStatus.Joined
    case 'invite':
      return MembershipStatus.Invited
    case 'leave':
      return MembershipStatus.Left
  }
}

export const createChatMember = (mxRoomMember: RoomMember): ChatRoomMember => {
  const { userId, name, membership } = mxRoomMember
  const id = userId as MatrixId
  return {
    id,
    name,
    membership: getMembership(membership),
  }
}

export function createChatRoom({ room, ...data }: RoomWithSharedData, hasInvitation = false): ChatRoom {
  const lastLiveEvent = room.getLastLiveEvent()?.event
  const lastMessage = isRoomMessageEvent(lastLiveEvent) ? createChatMessage(room.roomId, lastLiveEvent) : undefined

  const roomMxCreatorId = room.getCreator()
  const roomMxCreator = roomMxCreatorId ? room.getMember(roomMxCreatorId) : null

  return {
    ...data,
    hasInvitation,
    id: room.roomId,
    notificationCount: room.getUnreadNotificationCount() + (hasInvitation ? 1 : 0),
    name: room.name,
    lastMessage: lastMessage,
    creator: roomMxCreator && createChatMember(roomMxCreator),
    members: room.getMembers().map(createChatMember),
    timestamp:
      room.getLastActiveTimestamp() > 0
        ? room.getLastActiveTimestamp()
        : room.getLiveTimeline().getState(EventTimeline.FORWARDS)?.getStateEvents(EventType.RoomCreate, '')?.getTs(),
  }
}

/**
 * Messages Actions
 *
 **/

/**
 * @name sendMessage (Client Helper)
 * @description sends a new message to the Chat client.
 */
export const sendMessage = async (message: CreateMessage): Promise<string> => {
  return await getChatClient().sendTextMessage(message.roomId, message.text)
}

const _messagesAtomsRecordAtom = atom<MessageAtomsByRoomId>({})

/**
 * Messages Atoms
 *
 **/

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
const _messageBunchAtomSetter = atom(null, (_get, set, roomId: string, events: IRoomEvent[], merge?: boolean) => {
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

  // TODO: optimize to update the room timestamp instead of updating the entire room
  // This could be done through the new room selection
  const updateRoom = produce((roomId: string, message: ChatMessage) => {
    const roomAtomsRecord = get(roomAtomsRecordAtom)
    const roomAtom = roomAtomsRecord[roomId]

    if (!roomAtom) return

    set(roomAtom, (room) => updateRoomAfterNewMessage(room, message))
  })

  const addMessageToRoomThread = produce((threadsRecord: Record<string, ChatMessagesAtom>, event: MatrixEvent) => {
    threadsRecord[roomId] = threadsRecord[roomId] ?? atom<ChatMessage[]>([])
    const newMessage = createChatMessage(roomId, event.event as IRoomEvent)

    updateRoom(roomId, newMessage)
    set(threadsRecord[roomId], (prevMessages) => updateMessages(prevMessages, newMessage))
  })

  set(_messagesAtomsRecordAtom, (prevThreadsRecord) => addMessageToRoomThread(prevThreadsRecord, event))
})

_newMessageAtomSubscriber.onMount = (setAtom) => {
  return getChatClient().subscribeToRoomMessages(setAtom)
}

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
 * Messages Client Actions
 *
 **/

export const setLatestMessagesAsRead = async (roomId: string): Promise<void> => {
  try {
    await getChatClient().setLatestMessagesAsRead(roomId)
  } catch (err) {
    logError(err, 'Could not set latest chat messages as read', { location: 'chat.store.setLatestMessagesAsRead' })
  }
}

export const updateMessages = produce((thread: ChatMessage[], newMessage: ChatMessage) => {
  const dupMessage = thread.find((m) => m.id === newMessage.id)
  if (!dupMessage) {
    thread.push(newMessage)
    return
  }

  Object.assign(dupMessage, newMessage)
})

export function createChatMessage(roomId: string, event: IRoomEvent): ChatMessage {
  // TODO: handle empty strings fallback
  return {
    id: event.event_id,
    content: event.content as ChatMessageContent,
    timestamp: event.origin_server_ts,
    room_id: roomId,
    sender: event.sender,
  }
}

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
 * Member Atoms
 *
 **/

/**
 * @name _myMembershipSubscriberAtom
 * @description Listens to event changes in my room membership when accepting a
 * new invitation. Memberships can be `joinRoom`, `join`, or `leave`, Whenever
 * the user joins a room, we update the room has an invitation.
 */
const _myMembershipSubscriberAtom = atom(null, async (get, set, options: MyMembershipOptions) => {
  const client = getChatClient()
  const roomAtomsRecord = get(_roomAtomsRecordAtom)
  const roomAtom = roomAtomsRecord[options.room.roomId]

  switch (options.membership) {
    case 'join': {
      if (!roomAtom) {
        try {
          const roomWithShareData = await client.getRoomWithSharedData(options.room)
          const chatRoom = createChatRoom(roomWithShareData)
          if (!isSpaceGeneralChatRoom(chatRoom)) return

          set(_roomAtomsRecordAtom, (prevRoomAtomsRecord) => addChatRoom(prevRoomAtomsRecord, chatRoom))
        } catch (err) {
          logError(err, 'Failed to retrieve shared room data', { location: '_myMembershipSubscriberAtom' })
        }
        return
      }

      set(roomAtom, (room) => updateRoomInvitation(room, options))
      break
    }
    case 'leave': {
      if (!roomAtom) return

      set(_roomAtomsRecordAtom, (roomAtomsRecord) => deleteChatRoom(roomAtomsRecord, options.room.roomId))
      break
    }
    case 'invite':
    case 'ban':
    case 'knock':
    default:
      return
  }
})

_myMembershipSubscriberAtom.onMount = (setAtom) => {
  return getChatClient().subscribeToMyMembership((room, membership, prevMembership) => {
    setAtom({ room, membership, prevMembership })
  })
}

/**
 * @name _membershipSubscriberAtom
 * @description The membership subscriber is used to listen to membership
 * changes and eventually forgetting (deleting) a room in case the creator
 * is the only member available. Currently it does not update state,
 * but triggers client events that update state.
 */
const _membershipSubscriberAtom = atom(null, () => {
  return
})

_membershipSubscriberAtom.onMount = (setAtom) => {
  return getChatClient().subscribeToMembership(setAtom)
}

const _ignoredUsersAtom = atom<string[]>([])

const _ignoredUsersAtomSubscriber = atom(null, async (_get, set) => {
  set(_ignoredUsersAtom, getChatClient().getIgnoredUsers)
})

_ignoredUsersAtomSubscriber.onMount = (setAtom) => {
  getChatClient().subscribeToIgnoredUsers(setAtom)
}

export const useIgnoredUsersAtom = () => {
  return useAtomValue(_ignoredUsersAtom)
}

/**
 * Member Client Actions
 *
 **/
export const ignoreUser = async (userId: string) => {
  await getChatClient().ignoreUser(userId)
}

export const ignoreUserAndLeaveRoom = async (userId: string) => {
  await getChatClient().ignoreUser(userId)
}

export const unignoreUser = async (userId: string) => {
  return await getChatClient().unignoreUser(userId)
}

export const getHoliUserForChatMember = (
  member: ChatRoomMember | undefined,
  userRecord: Record<MatrixId, HoliUser | undefined>
) => {
  if (!member) return

  return userRecord[member.id]
}

/**
 * Verifies if all the passed members (excluding the logged-in user) are ignored.
 */
export const hasOnlyIgnoredMembers = (members: ChatRoomMember[], ignoredUsers: MatrixId[]): boolean => {
  const hasOnlyMemberLeftRoom = members.length === 1 && members[0].membership === MembershipStatus.Left

  if (hasOnlyMemberLeftRoom) return true
  if (members.length >= 1 && ignoredUsers.length === 0) return false

  const ignoredRoomMembers = members.map((m) => m.id).filter((id) => ignoredUsers.includes(id))
  return ignoredRoomMembers.length === members.length - 1
}

export const getChatPartner = (holiUser: HoliUser, room: ChatRoom): ChatRoomMember | undefined => {
  // TODO this will have to be changed once we support multiple users per room
  return room.members.find((member) => member.id !== toMatrixIdentity(holiUser.identity))
}

export const isRoomCreator = (user: HoliUser, room: ChatRoom): boolean | undefined => {
  return room.creator ? room.creator.id === toMatrixIdentity(user.identity) : undefined
}

export interface MemberEventOptions {
  event: MatrixEvent
  roomState: RoomState
  member: RoomMember
}

export const leaveRoomUpdate = produce((roomAtomsRecord: Record<string, ChatRoomAtom>, options: MemberEventOptions) => {
  const { roomState, member } = options
  if (member.membership !== 'leave') return

  delete roomAtomsRecord[roomState.roomId]
})

/**
 * Global Atoms
 *
 **/

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
  useAtom(_newMessageAtomSubscriber)
  useAtom(_myMembershipSubscriberAtom)
  useAtom(_membershipSubscriberAtom)
  useAtom(_ignoredUsersAtomSubscriber)
}
