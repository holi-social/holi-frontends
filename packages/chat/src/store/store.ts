import { produce } from 'immer'
import { type Atom, atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import type { IRoomEvent, MatrixEvent, Room, RoomMember, RoomState } from 'matrix-js-sdk'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import type ChatClient from '@holi/chat/src/client/ChatClient'
import { setChatInitialized } from '@holi/chat/src/client/chatState'
import {
  type ChatRoom,
  type ChatRoomMember,
  type ChatRoomMessage,
  type MatrixId,
  MembershipStatus,
  type NotificationCount,
  type RoomId,
  type RoomUpdatesContent,
  RoomUpdatesType,
  type SpaceChatRoom,
} from '@holi/chat/src/client/types'
import { createChatMessage } from '@holi/chat/src/client/utils'
import {
  addNotificationsCount,
  addOrUpdateChatRoom,
  addOrUpdateMemberInChatRoom,
  deleteChatRoom,
  updateChatRoomAvatar,
  updateChatRoomName,
  updateRoomAfterNewMessage,
  updateRoomInvitation,
  updateRoomUnreadNotifications,
  updateSpaceIdToChildIds,
  updateUserIdToMember,
} from '@holi/chat/src/store/producers'
import type {
  ChatMessagesAtom,
  ChatRoomAtom,
  CreateMessage,
  RoomAtomByRoomId,
  SpaceRoomAtom,
} from '@holi/chat/src/store/types'
import type { MessageAtomsByRoomId } from '@holi/chat/src/store/types'
import {
  getAtomFromRecordId,
  isPrivateChatRoom,
  isSpaceChatRoom,
  isSpaceChildChatRoom,
  toMatrixIdentity,
  updateSpaceRoomsNotifications,
} from '@holi/chat/src/store/utils'
import type { User as HoliUser } from '@holi/core/domain/shared/types'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { logError } from '@holi/core/errors/helpers'
import { getLogger } from '@holi/core/helpers/logging'

const logger = getLogger('Chat')

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
 * Room Atoms -(Read-Only)
 */

/**
 *
 * IMPORTANT! Do not set values to the room using this atom. It would be best to
 * use a `createRoomAtomRecord` derived atom to set values (updating the
 * state).To edit a particular room, you need to use a selector, which can be
 * found below under the Room section (e.g `createRoomAtom`).
 */
const _roomAtomsRecordAtom = atom<RoomAtomByRoomId>({})

/**
 * @description A read-only atom to receive a record mapping room ids to room atoms.
 * Each atom contains the room (conversation) of the logged-in user. To get the room
 * information, you must pass the single room to a const `room = useAtomValue(roomAtom)`
 * to access this read-only value.
 *
 * @see _roomAtomsRecordAtom
 */
export const roomAtomsRecordAtom = atom<RoomAtomByRoomId>((get) => get(_roomAtomsRecordAtom))

/**
 * @description An unsorted list of room atoms excluding space room parents.
 * @see _roomAtomsRecordAtom
 */
export const roomAtomsAtom = atom<ChatRoomAtom[]>((get) =>
  Object.values(get(_roomAtomsRecordAtom)).filter((roomAtom) => {
    return !isSpaceChatRoom(get(roomAtom))
  })
)

export const hasUnreadNotificationsAtom = atom<boolean>((get) =>
  Object.values(get(roomAtomsAtom)).some((roomAtom) => get(roomAtom).notificationCount > 0)
)

/**
 * @description An atom containing a list of all private rooms.
 * @see roomAtomsAtom
 */
export const privateRoomAtomsAtom = atom<ChatRoomAtom[]>((get) =>
  get(roomAtomsAtom).filter((roomAtom) => isPrivateChatRoom(get(roomAtom)))
)

/**
 * Derived atom that holds all room atoms sorted by date of last message in descending order
 */
export const roomAtomsSortedByDateAtom = atom((get) => {
  const roomAtoms = Object.values(get(_roomAtomsRecordAtom))
  return roomAtoms.sort((rA, rB) => {
    const tsA = get(rA).timestamp ?? Number.POSITIVE_INFINITY
    const tsB = get(rB).timestamp ?? Number.POSITIVE_INFINITY
    return tsA < tsB ? 1 : -1
  })
})

/**
 * @description A derived atom that contains a record of space ID to space child ID's.
 */
export const spaceRoomIdToChildIdsAtom = atom<Record<string, string[]>>({})

/**
 * @description A derived atom that contains a list of all the space ids.
 * @see spaceRoomIdToChildIdsAtom
 */
export const spaceRoomIdsAtom = atom<string[]>((get) => Object.keys(get(spaceRoomIdToChildIdsAtom)))

/**
 * @description A derived atom that contains a list of all the space rooms.
 * @see _roomAtomsRecordAtom, spaceRoomIdsAtom
 */
export const spaceRoomAtomsAtom = atom<SpaceRoomAtom[]>((get) => {
  const roomAtomsRecord = get(_roomAtomsRecordAtom)
  return get(spaceRoomIdsAtom).map((id) => roomAtomsRecord[id]) as SpaceRoomAtom[]
})

/**
 * @description Dynamically creates an atom representing a room in a space in
 * our Jōtai's store.
 * @see spaceRoomAtomsAtom
 */
export const spaceRoomAtomCreator = (id: string): Atom<SpaceChatRoom | null> =>
  atom<SpaceChatRoom | null>((get) => {
    const spaceRoom = get(spaceRoomAtomsAtom).find((roomAtom) => {
      if (!roomAtom) return false
      // get(roomAtom).content could be undefined first when user accepts invitation to the space
      return get(roomAtom).content?.holiSpaceId === id
    })

    return spaceRoom ? get(spaceRoom) : null
  })

/**
 * @description A derived atom that contains a record of space id to all of its children.
 * @see spaceRoomIdToChildIdsAtom
 */
export const spaceRoomIdToChildRoomsAtom = atom<Record<string, ChatRoomAtom[]>>((get) => {
  const spaceRoomIdToChildIds = get(spaceRoomIdToChildIdsAtom)
  const roomAtomsRecord = get(_roomAtomsRecordAtom)
  const spaceIdToRoomAtomsMap = new Map<string, ChatRoomAtom[]>()

  for (const id in spaceRoomIdToChildIds) {
    const roomAtoms: ChatRoomAtom[] = spaceRoomIdToChildIds[id].reduce((roomAtoms: ChatRoomAtom[], childId) => {
      const room = roomAtomsRecord[childId]
      if (room) roomAtoms.push(room)
      return roomAtoms
    }, [])

    if (!roomAtoms.length) continue

    spaceIdToRoomAtomsMap.set(id, roomAtoms)
  }

  return Object.fromEntries(spaceIdToRoomAtomsMap)
})

/**
 * Room Atoms -(Write-Only)
 */

/**
 * @description A write-only atom that programmatically creates a room based on
 * the Matrix Client store and listens to the room invitation event emitter for
 * creating rooms (`onMount`).
 * * IMPORTANT! Only import in tests.
 */
export const _roomAtomsRecordAtomSubscriber = atom(null, (get, set, rooms: ChatRoom[], ignoredUsers: MatrixId[]) => {
  const chatRooms = rooms.filter((room) => !hasOnlyIgnoredMembers(room.members, ignoredUsers))
  const spaceIdToChildIds = get(spaceRoomIdToChildIdsAtom)
  const updatedChatRooms = updateSpaceRoomsNotifications(chatRooms, spaceIdToChildIds)

  set(_roomAtomsRecordAtom, (prevRoomAtoms) => addOrUpdateChatRoom(prevRoomAtoms, updatedChatRooms, get))
})

_roomAtomsRecordAtomSubscriber.onMount = (setAtom) => {
  const client = getChatClient()
  const ignoredUsers = client.getIgnoredUsers()
  const addRoomAtom = (chatRoom: ChatRoom) => {
    setAtom([chatRoom], ignoredUsers)
    logger.debug('Chat.store [subscription room creation]', 'adding room ' + chatRoom.id + 'to store')
  }

  /**
   * Initial load
   */
  setAtom(client.getChatRooms(), ignoredUsers)
  logger.debug('Chat.store [init]', 'adding rooms to store')
  setChatInitialized(true)

  /**
   * Subscribe to incoming rooms
   */
  const unsubscribeNewRooms = client.subscribeToNewRooms(addRoomAtom)
  const unsubscribeRoomSharedData = client.subscribeToSharedData(addRoomAtom)
  const unsubscribeRoomNameEvents = client.subscribeToRoomNameEvent(addRoomAtom)

  return () => {
    unsubscribeNewRooms()
    unsubscribeRoomNameEvents()
    unsubscribeRoomSharedData()
  }
}

/*
 * @description Listen to incoming space children events emitted to the space
 * room according to the space room -> children relationship defined by
 * `m.space.child`. It also collects the already existing events on the first
 * load.
 *
 * * IMPORTANT! Only import in test.
 **/
export const _spaceRoomsSubscriber = atom(null, (_get, set, newSpaceIdToChildIds: Record<string, string[]>) => {
  set(spaceRoomIdToChildIdsAtom, (spaceIdToChildIds) =>
    updateSpaceIdToChildIds(spaceIdToChildIds, newSpaceIdToChildIds)
  )
})

_spaceRoomsSubscriber.onMount = (setAtom) => {
  const client = getChatClient()
  setAtom(client.getSpaceIdToChildIdsRecord())

  client.subscribeToSpaceRooms(setAtom)
}

const _roomsUpdatesSubscriber = atom(
  null,
  (get, set, roomId: string, type: RoomUpdatesType, content: RoomUpdatesContent) => {
    const roomAtom = getAtomFromRecordId(get, _roomAtomsRecordAtom, roomId)
    if (!roomAtom) return

    switch (type) {
      case RoomUpdatesType.avatar:
        set(roomAtom, (prevChatRoom) => updateChatRoomAvatar(prevChatRoom, content))
        break
      case RoomUpdatesType.name:
        set(roomAtom, (prevChatRoom) => updateChatRoomName(prevChatRoom, content))
        break
      default:
        throw new HoliError('_roomsUpdatesSubscriber got a wrong event type')
    }
  }
)

_roomsUpdatesSubscriber.onMount = (setAtom) => {
  return getChatClient().subscribeToRoomsUpdates(setAtom)
}

/**
 * @description Removes a room from the Jōtai store but not from the Matrix
 * client. We do this, for example, when we ignore users and don't want to
 * display a room if there are only two members, one of them being the one
 * ignored (blocked). Exported is only the helper hook below `useRemoveRoomAtom`
 */
const _removeRoomAtom = atom(null, (get, set, roomId: string) => {
  const roomAtom = getAtomFromRecordId(get, _roomAtomsRecordAtom, roomId)
  if (!roomAtom) return
  if (get(roomAtom).members.length > 2) return

  set(_roomAtomsRecordAtom, (prevRoomAtoms) => deleteChatRoom(prevRoomAtoms, roomId))
})

/**
 * @description It deletes a ChatRoom from the store for incoming Matrix delete
 * events.
 */
export const _deleteRoomAtomSubscriber = atom(null, (_, set, roomId: string) => {
  set(_roomAtomsRecordAtom, (prevRoomAtoms) => deleteChatRoom(prevRoomAtoms, roomId))
})

_deleteRoomAtomSubscriber.onMount = (setAtom) => {
  return getChatClient().subscribeToRoomDeletion(setAtom)
}

/**
 * @name _roomAtomsRecordAtomSubscriber (Write-Only)
 * @description This atom listens to unread notification changes emitted from
 * the server. It updates all the user rooms with the incoming unread
 * notification.
 */
export const _roomsNotificationsSubscriberAtom = atom(
  null,
  (get, set, roomId: string, notificationCount: NotificationCount) => {
    const roomAtom = getAtomFromRecordId(get, _roomAtomsRecordAtom, roomId)
    if (!roomAtom) return

    const room = get(roomAtom)
    if (isSpaceChildChatRoom(room)) {
      const spaceRoomAtom = getAtomFromRecordId(get, _roomAtomsRecordAtom, room.content.parentSpaceRoomId)
      if (spaceRoomAtom) {
        set(spaceRoomAtom, (prevSpaceRoomAtom) =>
          addNotificationsCount(prevSpaceRoomAtom, notificationCount.total ?? 0)
        )
      }
    }

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
    if (!roomAtom) return

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
 * @name getOrCreateRoom (Client Helper)
 * @description returns the room id of an existing one-on-one room, if it
 * exists, or creates a new one.
 */
export const getOrCreatePrivateRoom = async (userIds: string[], name?: string): Promise<RoomId> => {
  return getChatClient().getOrCreateRoom(userIds, { isDirectMessage: true, name: name, metadata: { type: 'private' } })
}

export const roomAlreadyExists = async (userIds: string[]): Promise<boolean> => {
  return getChatClient().roomAlreadyExists(userIds)
}

export const sendTaskEvent = async (roomId: string, taskId: string, spaceId?: string) => {
  return getChatClient().sendTaskStateEvent(roomId, taskId, spaceId)
}

export const getTopicByRoomId = async (roomId: string) => {
  return await getChatClient().getTopicByRoomId(roomId)
}

export const getParentSpaceByRoom = async (roomId: string) => {
  return await getChatClient().getParentSpaceByRoom(roomId)
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
      threadsRecord[roomId] = threadsRecord[roomId] ?? atom<ChatRoomMessage[]>([])
      set(threadsRecord[roomId], (existingMessages) => {
        // the list of messages must have `Backward` direction - from older to newer messages
        // it is why we reverse `requestedMessages`
        const requestedMessages = roomEvents.reverse().map((event) => createChatMessage(roomId, event))

        return merge ? [...requestedMessages, ...existingMessages] : requestedMessages
      })
    }
  )

  set(_messagesAtomsRecordAtom, (prevThreadsRecord) => addMessagesToRoomThread(prevThreadsRecord, events, merge))
})

/**
 * @name _newMessageAtomSubscriber (Read-Write)
 * @description Write (setter) function expects `MatrixEvent` argunment
 * and if it has EventType.RoomMessage type, setter adds new message into the room's `Atom<ChatRoomMessage[]>`.
 * This setter function is only used for new messages.
 *
 * * IMPORTANT! Only import in test.
 */
export const _newMessageAtomSubscriber = atom(null, (get, set, roomId: string, message: ChatRoomMessage) => {
  const roomAtomsRecord = get(roomAtomsRecordAtom)
  const roomAtom = roomAtomsRecord[roomId]

  if (!roomAtom) return

  const addMessageToRoomThread = produce((threadsRecord: Record<string, ChatMessagesAtom>) => {
    threadsRecord[roomId] = threadsRecord[roomId] ?? atom<ChatRoomMessage[]>([])
    set(threadsRecord[roomId], (prevMessages) => updateMessages(prevMessages, message))
  })

  set(roomAtom, (prevRoom) => updateRoomAfterNewMessage(prevRoom, message))
  set(_messagesAtomsRecordAtom, addMessageToRoomThread)
})

_newMessageAtomSubscriber.onMount = (setAtom) => {
  return getChatClient().subscribeToRoomMessages(setAtom)
}

/**
 * @name messagesByRoomIdAtomCreator (Write-Only)
 * @description A function that returns an atom of messages for the given room id.
 * @returns `Atom<ChatRoomMessage[]>` or `undefined` if the room does not exist.
 */
const messagesByRoomIdAtomCreator = (roomId: string) =>
  atom((get) => {
    const roomMessagesAtomsRecord = get(_messagesAtomsRecordAtom)
    const messagesAtom = roomMessagesAtomsRecord[roomId]
    if (!messagesAtom) return undefined

    return get(messagesAtom)
  })

/**
 * @name lastMessageByRoomIdAtomCreator (Read-Only)
 * @description A function that returns an atom of the last message for the given room id.
 * @returns `Atom<ChatRoomMessage>` or `undefined` if the room or message does not exist.
 */
export const lastMessageByRoomIdAtomCreator = (roomId: string) =>
  atom((get) => {
    const roomMessagesAtomsRecord = get(_messagesAtomsRecordAtom)
    const messagesAtom = roomMessagesAtomsRecord[roomId]
    if (!messagesAtom) return undefined

    const roomMessages = get(messagesAtom)
    return roomMessages[roomMessages.length - 1]
  })

/**
 * @name updateMessagesByRoomIdAtomCreator (Read-Only)
 * @description A function that returns room update function to update last message.
 * @returns `Atom<ChatRoomMessage[]>` or `undefined` if the room does not exist.
 */
export const updateLastMessagesByRoomIdAtomCreator = (roomId: string) =>
  atom(null, (get, set, message: ChatRoomMessage) => {
    const roomAtomsRecord = get(roomAtomsRecordAtom)
    const roomAtom = roomAtomsRecord[roomId]

    if (!roomAtom) return

    set(roomAtom, (prevRoom) => updateRoomAfterNewMessage(prevRoom, message))
  })

/**
 * @name useLastRoomMessage (Hook-Helper)
 * @description Custom hook to fetch the valid last message of a room if it is not found in the Matrix room object.
 * 'lastMessage' in ChatRoom object could be 'undefined' bacause we get only 4 events in the Matrix room initially
 * and they could be invalid for our UI. So, we need to fetch the timeline and find a valid last message.
 * @important Because room preview is disablesd on the Matrix server, we do not load timeline for rooms with invitations.
 *
 * @param room - ChatRoom object
 */
export const useLastRoomMessage = ({ id, lastMessage: lastMessageFromRoom, hasInvitation }: ChatRoom) => {
  // try to get last message from store
  const lastMessageFromTimeline = useAtomValue(useMemo(() => lastMessageByRoomIdAtomCreator(id), [id]))
  const lastMessage = lastMessageFromRoom ?? lastMessageFromTimeline
  const lastMessageNotFound = !lastMessage

  // if last message is not found in the room object and in the stoer, we need to fetch messages
  const requestMessages = useRequestRoomMessages()
  useEffect(() => {
    if (lastMessageNotFound && !hasInvitation) {
      requestMessages(id, false)
    }
  }, [lastMessageNotFound, hasInvitation, requestMessages, id])

  // update last message in the room object if it is found in the timeline and it is not in the room object
  const updateLastMessageInRoom = useSetAtom(useMemo(() => updateLastMessagesByRoomIdAtomCreator(id), [id]))
  const needToUpdateLastMessageInRoom =
    !!lastMessage && (lastMessageFromTimeline?.timestamp ?? 0) > (lastMessageFromRoom?.timestamp ?? 1)
  useEffect(() => {
    if (needToUpdateLastMessageInRoom) {
      updateLastMessageInRoom(lastMessage)
    }
  }, [lastMessage, needToUpdateLastMessageInRoom, updateLastMessageInRoom])

  return lastMessage
}

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

export const updateMessages = produce((thread: ChatRoomMessage[], newMessage: ChatRoomMessage) => {
  const dupMessage = thread.find((m) => m.id === newMessage.id)
  if (!dupMessage) {
    thread.push(newMessage)
    return
  }

  Object.assign(dupMessage, newMessage)
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
    async (roomId: string, resync: boolean, limit?: number) => {
      if (!roomId || !client) return
      if (isLoading.current || (tokenRef.current.start && !tokenRef.current.end)) return

      isLoading.current = true
      let merge = !!tokenRef.current.end
      if (resync) {
        tokenRef.current = { start: undefined, end: undefined }
        merge = false
      }

      await client
        .createMessagesRequest(roomId, tokenRef.current.end, limit)
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
 * @description an atom containing the id of the currently loggedin user or null
 * if not logged in.
 */
export const loggedInMemberIdAtom = atom<string | null>(null)

/**
 * @description an atom that writes the id of the currently logged in user.
 */
const _setLoggedInMemberId = atom(null, (_get, set, id: string) => {
  set(loggedInMemberIdAtom, id)
})

_setLoggedInMemberId.onMount = (setAtom) => {
  const userId = getChatClient().getUserId()
  if (!userId) return
  setAtom(userId)
}

/**
 * @description Listens to event changes in my room membership when accepting a
 * new invitation. Memberships can be `joinRoom`, `join`, or `leave`, Whenever
 * the user joins a room, we update the room has an invitation.
 */
const _myMembershipSubscriberAtom = atom(
  null,
  async (get, set, room: Room, membership: string, prevMembership?: string) => {
    const roomAtomsRecord = get(_roomAtomsRecordAtom)
    const roomAtom = roomAtomsRecord[room.roomId]

    switch (membership) {
      case 'join': {
        if (!roomAtom) break
        set(roomAtom, (room) => updateRoomInvitation(room, { membership, prevMembership }))
        break
      }
      case 'leave': {
        if (!roomAtom) break
        set(_roomAtomsRecordAtom, (prevRoomAtomsRecord) => deleteChatRoom(prevRoomAtomsRecord, room.roomId))
        break
      }
      case 'invite':
      case 'ban':
      case 'knock':
      default:
        break
    }
  }
)

_myMembershipSubscriberAtom.onMount = (setAtom) => getChatClient().subscribeToMyMembership(setAtom)

/**
 * @description The membership subscriber is used to listen to membership
 * changes and eventually forgetting (deleting) a room in case the creator
 * is the only member available. Currently it does not update state,
 * but triggers client events that update state.
 */
const _membershipSubscriberAtom = atom(
  null,
  async (get, set, roomId: string, member: ChatRoomMember, membership?: string) => {
    const roomAtomsRecord = get(_roomAtomsRecordAtom)
    const roomAtom = roomAtomsRecord[roomId]
    if (!roomAtom) return

    switch (membership) {
      case 'join':
      case 'leave': {
        set(roomAtom, (room) => addOrUpdateMemberInChatRoom(room, member))
        break
      }

      case 'invite':
      case 'ban':
      case 'knock':
      default:
        break
    }
  }
)

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

/**
 * @description An atom creator that gives you the partner member in a DM
 * conversion between two people.
 */
export const chatPartnerAtomCreator = (roomId: string, holiUser?: HoliUser): Atom<ChatRoomMember[] | undefined> => {
  return atom((get) => {
    if (!holiUser) return

    const roomAtom = getAtomFromRecordId(get, _roomAtomsRecordAtom, roomId)
    if (!roomAtom) return

    const chatRoom = get(roomAtom)
    return getChatPartners(holiUser, chatRoom)
  })
}

/**
 * @description An atom creator that returns a user ID record to a Chat room
 * member for a given room.
 */
export const roomMembersAtomCreator = (roomId: string): Atom<Record<string, ChatRoomMember>> => {
  return atom((get) => {
    const userIdToMemberRecord: Record<string, ChatRoomMember> = {}
    const roomAtom = getAtomFromRecordId(get, _roomAtomsRecordAtom, roomId)
    if (!roomAtom) return userIdToMemberRecord

    const chatRoom = get(roomAtom)
    if (!chatRoom) return userIdToMemberRecord

    return chatRoom.members.reduce(updateUserIdToMember, userIdToMemberRecord)
  })
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
  const hasOnlyMemberLeftRoom = members.length === 1 && members[0].membership === MembershipStatus.leave

  if (hasOnlyMemberLeftRoom) return true
  if (members.length >= 1 && ignoredUsers.length === 0) return false

  const ignoredRoomMembers = members.map((m) => m.id).filter((id) => ignoredUsers.includes(id))
  return ignoredRoomMembers.length === members.length - 1
}

export const getChatPartners = (holiUser: HoliUser, room: ChatRoom): ChatRoomMember[] | undefined => {
  // TODO this will have to be changed once we support multiple users per room
  if (room.type === 'space.task' || room.type === 'private') {
    return room.members.filter((member) => member.id !== toMatrixIdentity(holiUser.identity))
  }
  return undefined
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
 * @description It returns the specific room with all its data (`ChatRoom` and `ChatRoomMessage[]`) or
 * `undefined` for both if the room ID could not be found.
 */
export const useRoomById = (roomId: string): [ChatRoom | undefined, ChatRoomMessage[] | undefined] => {
  const room = useAtomValue(useMemo(() => roomByIdAtomCreator(roomId), [roomId]))
  const messages = useAtomValue(useMemo(() => messagesByRoomIdAtomCreator(roomId), [roomId]))

  return [room, messages]
}

/**
 * @description hook that triggers atoms subscriptions to Matrix events (calling useAtom will result
 * in the atoms `.onMount` method being called). As a result, the atoms will be populated with domain
 * objects derived from the Matrix events. Example: Matrix message events will be converted to
 * `ChatRoomMessage` instances and stored in the `messagesAtomsRecordAtom`.
 */
export const useSubscribeToChat = () => {
  useAtom(_setLoggedInMemberId)
  useAtom(_roomAtomsRecordAtomSubscriber)
  useAtom(_spaceRoomsSubscriber)
  useAtom(_roomsUpdatesSubscriber)
  useAtom(_roomsNotificationsSubscriberAtom)
  useAtom(_newMessageAtomSubscriber)
  useAtom(_myMembershipSubscriberAtom)
  useAtom(_membershipSubscriberAtom)
  useAtom(_ignoredUsersAtomSubscriber)
  useAtom(_deleteRoomAtomSubscriber)
}
