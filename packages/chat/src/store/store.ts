import { produce } from 'immer'
import { type Atom, Getter, atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { EventTimeline, EventType, IRoomEvent, MatrixEvent, Room, RoomMember, RoomState } from 'matrix-js-sdk'
import { useCallback, useMemo, useRef } from 'react'

import ChatClient from '@holi/chat/src/client/ChatClient'
import { setChatInitialized } from '@holi/chat/src/client/chatSession'
import { ChatRoomMember, MatrixId, MembershipStatus, NotificationCount, RoomId } from '@holi/chat/src/client/types'
import type {
  ChatMessage,
  ChatMessageContent,
  ChatMessagesAtom,
  ChatRoom,
  ChatRoomAtom,
  ChatRoomId,
  CreateMessage,
  RoomAtomByRoomId,
} from '@holi/chat/src/store/types'
import { MessageAtomsByRoomId } from '@holi/chat/src/store/types'
import { getAtomFromRecordId, isRoomMessageEvent, toMatrixIdentity } from '@holi/chat/src/store/utils'
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

export const isChatInitializedAtom = atom(false)

/**
 * Room Producers
 *
 **/
export interface UpdateInvitationOptions {
  room: Room
  membership: string
  prevMembership?: string
}

const updateRoomInvitation = produce((chatRoom: ChatRoom, { membership, prevMembership }: UpdateInvitationOptions) => {
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

const addOrUpdateChatRoom = produce((roomAtoms: Record<string, ChatRoomAtom>, room: ChatRoom, get: Getter) => {
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

/**
 * Room Atoms
 *
 **/

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
 * Derived atom that holds record with spaces ids as keys and array of all space's related room atoms as value
 */
export const spaceRoomAtomsRecordAtom: Atom<Record<ChatRoomId, ChatRoomAtom[]>> = atom((get) => {
  const client = getChatClient()
  const roomAtomsRecord = get(_roomAtomsRecordAtom)
  const roomIds = Object.keys(roomAtomsRecord)
  const allMxRooms = client.getRooms()

  return roomIds.reduce<Record<ChatRoomId, ChatRoomAtom[]>>((acc, roomId) => {
    const mxRoom = client.getRoom(roomId)
    // Process only Space Rooms
    // TODO: use !mxRoom?.isSpaceRoom() after adding real space rooms
    if (!mxRoom || mxRoom?.isSpaceRoom()) return acc

    const spaceRoomMembers = mxRoom.getMembers()
    const siblingRoomsAtoms = allMxRooms.reduce<ChatRoomAtom[]>((acc, siblingMxRoom) => {
      if (siblingMxRoom.roomId === roomId) return [...acc, roomAtomsRecord[roomId]]
      if (siblingMxRoom.isSpaceRoom()) return acc

      const siblingRoomMembers = siblingMxRoom.getMembers()
      const areMembersOfTheSpaceRoom = siblingRoomMembers.every((member) =>
        spaceRoomMembers.some((spaceMember) => spaceMember.userId === member.userId)
      )

      return areMembersOfTheSpaceRoom ? [...acc, roomAtomsRecord[siblingMxRoom.roomId]] : acc
    }, [])

    return {
      ...acc,
      [roomId]: siblingRoomsAtoms,
    }
  }, {})
})

type RoomAtomsRecordAtomSubscriberArgs = { room: Room; hasPendingInvitation: boolean; ignoredUsers: MatrixId[] }

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
  const { room, hasPendingInvitation, ignoredUsers } = args
  const chatRoom = createChatRoom(room, hasPendingInvitation)

  // We hide chat rooms with only ignored members from the user. We do an
  // early return not to include the chat room in the store.
  if (hasOnlyIgnoredMembers(chatRoom.members, ignoredUsers)) return

  set(_roomAtomsRecordAtom, (prevRoomAtoms) => addOrUpdateChatRoom(prevRoomAtoms, chatRoom, get))
})

_roomAtomsRecordAtomSubscriber.onMount = (setAtom) => {
  const client = getChatClient()
  const ignoredUsers = client.getIgnoredUsers()

  const addRoomToStore = (room: Room, logPhase: string) => {
    const hasPendingInvitation = client.hasPendingInvitation(room)
    logDebug(`Chat.store [${logPhase}]`, `adding room ${room.roomId} to store`)
    setAtom({ room, hasPendingInvitation, ignoredUsers })
  }

  // get current rooms from ChatClient and store them to Atoms
  client.getRooms().forEach((room) => addRoomToStore(room, 'init'))

  setChatInitialized(true)

  // set litener for new rooms
  return client.subscribeToRooms((room) => {
    const hasRoomEmptyName = (room: Room) => room.name === 'Empty room'

    /**
     * @name waitForCorrectRoomName
     * @description Matrix room has `Empty room` name on creation and then Matrix updates it under the hood.
     * We use this function to watch for the room `name` change and only create an atom when correct name was passed
     * or timeout exceeded.
     * @param timestamp `number` represents timestamp limit till function postponds setting the atom
     */
    const waitForCorrectRoomName = (timestamp: number) => {
      if (!hasRoomEmptyName(room) || Date.now() > timestamp) {
        addRoomToStore(room, 'subscription')
      } else {
        setTimeout(() => {
          waitForCorrectRoomName(timestamp)
        }, 50)
      }
    }

    if (hasRoomEmptyName(room)) {
      waitForCorrectRoomName(Date.now() + 2000)
    }

    addRoomToStore(room, 'subscription')
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
  return getChatClient().subscribeToUnreadRoomsNotifications(setAtom)
}

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

export const useSetRemoveRoomAtom = () => {
  return useSetAtom(_removeRoomAtom)
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
 * @name roomAtomsRecorAtomForTesting
 * @description Use this read-write atom for unit testing purposes; for example,
 * initialize the Jōtai store in the `TestBed.tsx` component.
 */
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

export function createChatMemberFixture(overrides?: Partial<ChatRoomMember>): ChatRoomMember {
  const identity = overrides?.name ? overrides.name + 'Identity' : 'defaultUserIdentity'

  const defaultChatMember: ChatRoomMember = {
    name: 'defaultUserName',
    id: `@${identity}:test.chat`,
    membership: MembershipStatus.Joined,
  }
  return { ...defaultChatMember, ...overrides }
}

export function createChatRoom(room: Room, hasInvitation = false): ChatRoom {
  const lastLiveEvent = room.getLastLiveEvent()?.event
  const lastMessage = isRoomMessageEvent(lastLiveEvent) ? createChatMessage(room.roomId, lastLiveEvent) : undefined

  const roomMxCreatorId = room.getCreator()
  const roomMxCreator = roomMxCreatorId ? room.getMember(roomMxCreatorId) : null

  return {
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

export function createChatRoomFixture(overrides?: Partial<ChatRoom>): ChatRoom {
  const creator = overrides?.creator ? overrides.creator : createChatMemberFixture()

  const defaultRoom: ChatRoom = {
    id: 'defaultRoomId',
    name: 'defaultRoomName',
    hasInvitation: true,
    notificationCount: 0,
    lastMessage: undefined,
    creator: creator,
    members: [creator],
    senderId: 'defaultSenderId',
    timestamp: new Date().getTime(),
  }

  return { ...defaultRoom, ...overrides }
}

/**
 * Messages
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
export const messagesAtomsRecordInitializationAtom = atom(
  null,
  (get, set, chatMessagesByRoomId: MessageAtomsByRoomId) => {
    if (Object.keys(get(_messagesAtomsRecordAtom)).length > 0) {
      return
    }
    set(_messagesAtomsRecordAtom, () => chatMessagesByRoomId)
  }
)

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

export function createChatMessageFixture(
  overrides?: Partial<ChatMessage> | string,
  sender?: ChatRoomMember,
  room?: ChatRoom
): ChatMessage {
  const defaultMessage: ChatMessage = {
    id: 'defaultMessageId',
    content: {
      body: 'Default chat message',
      msgtype: 'm.text',
    },
    timestamp: new Date().getTime(),
    room_id: 'defaultRoomId',
    sender: 'defaultSenderId',
  }

  let fixture = { ...defaultMessage }

  if (typeof overrides === 'string') {
    fixture.content.body = overrides
  } else {
    fixture = { ...fixture, ...overrides }

    const bodyContentOverride = overrides?.content?.body
    if (bodyContentOverride) {
      defaultMessage.content.body = bodyContentOverride
    }
  }

  if (room) {
    fixture.room_id = room.id
  }

  if (sender) {
    fixture.sender = sender.id
  }

  return fixture
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
  const { event, roomState, member } = options

  if (member.membership !== 'leave') return
  if (event.getSender() !== member.userId) return

  delete roomAtomsRecord[roomState.roomId]
})

export const isLastMemberCreator = (roomState: RoomState, member: RoomMember) => {
  const members = roomState.getMembers()
  const creator = members.find((m) => m.powerLevel === 100)

  return member.membership === 'leave' && creator?.userId !== member.userId && members.length <= 2
}

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
