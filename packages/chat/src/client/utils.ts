import type { TFunction } from 'i18next'
import {
  ClientEvent,
  EventType,
  type IContent,
  type IEvent,
  type IRoomEvent,
  type IStateEvent,
  type IStateEventWithRoomId,
  type Listener,
  type ListenerMap,
  type MatrixClient,
  type MatrixEvent,
  type Room,
  type RoomEvent,
  type RoomMember,
  type RoomNameState,
  RoomNameType,
} from 'matrix-js-sdk'

import {
  type BaseChatRoom,
  type ChatMsgMemberContent,
  type ChatMsgTextContent,
  type ChatRoom,
  ChatRoomEvent,
  type ChatRoomMember,
  type ChatRoomMessage,
  type ChatRoomType,
  type MatrixId,
  MembershipStatus,
  type MsgContent,
  type PrivateChatRoom,
  RoomUpdatesType,
  type RoomWithSharedData,
  type SharedDataContent,
  type SpaceChatRoom,
  type SpaceChildChatRoom,
  type SpaceChildRoom,
  type SpaceChildSharedDataContent,
  type SpaceRoom,
  SpaceTaskChatRoom,
  SpaceTaskRoom,
} from '@holi/chat/src/client/types'
import { getChatMemberName } from '@holi/chat/src/utils'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { chatAdminUserId } from '@holi/core/helpers/config'

/**
 * Rooms
 */

type RoomListener = Listener<RoomEvent, ListenerMap<RoomEvent>, RoomEvent>

export const isEventWithSharedData = (event: IStateEventWithRoomId): boolean => event.type === ChatRoomEvent.SharedData

export const isSharedDataContent = (content: IContent): content is SharedDataContent => {
  return !!content && content?.holiSpaceId
}

export const isSharedDataChildContent = (content: IContent): content is SpaceChildSharedDataContent => {
  return isSharedDataContent(content) && 'parentSpaceRoomId' in content
}

export const isSpaceChildEvent = (event: MatrixEvent) => event.getType() === EventType.SpaceChild

export const isIRoomEvent = (event: IRoomEvent | Partial<IEvent>): event is IRoomEvent =>
  ['event_id', 'sender', 'origin_server_ts'].every((key) => key in event)

export const isIStateEvent = (event: IRoomEvent | IStateEvent): event is IStateEvent => 'state_key' in event

export const hasRoomUpdatesType = (type: unknown): type is RoomUpdatesType => {
  return type === RoomUpdatesType.avatar || type === RoomUpdatesType.name
}

/**
 * @description A function passed on Matrix createClient to override default
 * room names.
 */
export const roomNameGenerator = (t: TFunction) => {
  return (roomId: string, state: RoomNameState): string | null => {
    switch (state.type) {
      case RoomNameType.Actual:
        return state.name
      case RoomNameType.EmptyRoom:
        if (state.oldName) {
          return `${t('chat.emptyRoom')} (${t('chat.emptyRoom.was')} ${state.oldName})`
        } else {
          return t('chat.emptyRoom')
        }
      case RoomNameType.Generated:
        return (
          (state.subtype === 'Inviting' ? t('chat.inviting') + ' ' : '') + filterMatrixIds(t, state.names).join(', ')
        )
      default:
        return null
    }
  }
}

export const filterMatrixIds = (t: TFunction, names: string[]): string[] => {
  return names.map((name) => getChatMemberName(t, name))
}

/**
 *
 * @name addRoomEventListener
 * @description A partial function application that helps set/add listeners in a room
 * event and return the listener for later unsetting (unsubscribing) the
 * listener. It's useful when collecting listeners for later unsetting them in a
 * bulk manner.
 */
export const addRoomEventListener =
  (roomEvent: RoomEvent, roomListener: (room: Room) => RoomListener) => (room: Room) => {
    const listener = roomListener(room)
    room.on(roomEvent, listener)

    return listener
  }

interface CreateListenersArgs {
  client: MatrixClient
  roomEvent: RoomEvent
  rooms: Room[]
  createListener: (room: Room) => RoomListener
}

/**
 *
 * @name setRoomsListeners
 * @description collects and sets a pre-defined listener to every existing room.
 * It also listens to any rooms coming in settting the listeners for these
 * rooms. The final return result is an unsubscribe function that removes all
 * the already set listeners.
 */
export const setRoomsListeners = ({ client, roomEvent, rooms, createListener }: CreateListenersArgs) => {
  const setRoomLevelEventListener = (room: Room) => {
    const handler = createListener(room)
    return () => room.off(roomEvent, handler)
  }

  // set listeners for initial existing rooms
  const unsubscribers = rooms.map(setRoomLevelEventListener)

  // set client level listeners on new rooms comming
  const setClientLevelRoomListener = (room: Room) => {
    const hasRoom = rooms.some((r) => r.roomId === room.roomId)
    if (hasRoom) return

    const unsubscribe = setRoomLevelEventListener(room)

    unsubscribers.push(unsubscribe)
  }

  client.on(ClientEvent.Room, setClientLevelRoomListener)

  // return function to unsubscribe from all rooms and client
  return () => {
    client.off(ClientEvent.Room, setClientLevelRoomListener)
    unsubscribers.forEach((func) => func())
  }
}

/**
 * @description It returns one of the 3 (internal) chat rooms based
 * on the type of the RoomWithSharedData.
 * Types: `PrivateChatRoom`, `SpaceChatRoom`, `SpaceChildChatRoom`
 */
export const createChatRoom = (
  roomWithSharedData: RoomWithSharedData,
  homeserverUrl: string,
  hasInvitation = false
): ChatRoom => {
  const baseChatRoom = createBaseChatRoom(
    roomWithSharedData.room,
    roomWithSharedData.type,
    homeserverUrl,
    hasInvitation
  )

  switch (roomWithSharedData.type) {
    case 'private':
      return createPrivateChatRoom(baseChatRoom)
    case 'space':
      return createSpaceChatRoom(baseChatRoom, roomWithSharedData)
    case 'space.child':
      return createSpaceChildChatRoom(baseChatRoom, roomWithSharedData)
    case 'space.task':
      return createSpaceTaskChatRoom(baseChatRoom, roomWithSharedData)
    default:
      throw new HoliError('Unexpected ChatRoom: private, space, space.child and space.task supported')
  }
}

export function createPrivateChatRoom(baseChatRoom: BaseChatRoom): PrivateChatRoom {
  return {
    type: 'private',
    ...baseChatRoom,
  }
}

export function createSpaceChatRoom(baseChatRoom: BaseChatRoom, spaceRoom: SpaceRoom): SpaceChatRoom {
  return {
    type: 'space',
    content: {
      roomId: spaceRoom.content.roomId,
      holiSpaceId: spaceRoom.content.holiSpaceId,
    },
    ...baseChatRoom,
  }
}

export function createSpaceChildChatRoom(
  baseChatRoom: BaseChatRoom,
  spaceChildRoom: SpaceChildRoom
): SpaceChildChatRoom {
  return {
    type: 'space.child',
    content: {
      roomId: spaceChildRoom.content.roomId,
      holiSpaceId: spaceChildRoom.content.holiSpaceId,
      spaceName: spaceChildRoom.content.spaceName,
      avatarDefaultColor: spaceChildRoom.content.avatarDefaultColor,
      parentSpaceRoomId: spaceChildRoom.content.parentSpaceRoomId,
    },
    ...baseChatRoom,
  }
}

export function createSpaceTaskChatRoom(baseChatRoom: BaseChatRoom, spaceTaskRoom: SpaceTaskRoom): SpaceTaskChatRoom {
  return {
    type: spaceTaskRoom.type,
    content: { ...spaceTaskRoom.content },
    ...baseChatRoom,
  }
}

/**
 * @description It creates the base for all 3 (internal) types of chats rooms
 * `PrivateChatRoom`, `SpaceChatRoom`, `SpaceChildChatRoom`, `SpaceTaskChatRoom`
 */
export function createBaseChatRoom(
  room: Room,
  roomType: ChatRoomType,
  homeserverUrl: string,
  hasInvitation = false
): BaseChatRoom {
  const lastMessageEvent = getLastMessageEvent(room, roomType)
  const lastMessage = lastMessageEvent && createChatMessage(room.roomId, lastMessageEvent)

  const roomMxCreatorId = room.getCreator()
  const roomMxCreator = roomMxCreatorId ? room.getMember(roomMxCreatorId) : null

  const avatar = room.getMxcAvatarUrl() ?? undefined

  return {
    id: room.roomId,
    name: room.name,
    avatar,
    notificationCount: room.getUnreadNotificationCount() + (hasInvitation ? 1 : 0),
    hasInvitation,
    lastMessage,
    creator:
      roomMxCreator &&
      createChatMember(roomMxCreator, roomMxCreator.getAvatarUrl(homeserverUrl, 500, 500, 'scale', true, true)),
    members: room
      .getMembers()
      .map((member) => createChatMember(member, member.getAvatarUrl(homeserverUrl, 500, 500, 'scale', true, true))),
    // Do not use `room.getLastActiveTimestamp()` because it can return Membership 'm.room.member' events
    // where only content (user avatar or displayname) was updated, but membership remains the same.
    // instead use the last message timestamp directly
    timestamp: lastMessage?.timestamp,
  }
}

/**
 * Membership
 */

export const isMembershipEvent = (event: MatrixEvent): boolean => event.getType() === EventType.RoomMember

export const isJoinOrLeaveEvent = (event: MatrixEvent) =>
  ['join', 'leave'].some((m) => m === event.getContent().membership)

export const isAdminChangeToMembership = (event: MatrixEvent, userId: string, loggedInUserId: string | null) => {
  return isMembershipEvent(event) && userId === loggedInUserId && event.getSender() === chatAdminUserId
}

export const isRoomMemberEvent = (event: IRoomEvent | Partial<IEvent> | undefined): event is IRoomEvent => {
  return event?.type === EventType.RoomMember && ['join', 'leave'].some((m) => m === event.content?.membership)
}

export const isMemberEventWithState = (event: IRoomEvent): event is IStateEvent => {
  return event?.type === EventType.RoomMember && 'prev_content' in event
}

export const isMembershipAvatarUpdate = (event: MatrixEvent): boolean => {
  if (!isMembershipEvent(event)) return false

  const currentContent = event.getContent()
  const previousContent = event.getPrevContent()

  return (
    currentContent.membership === previousContent?.membership && // membership did not change
    currentContent.avatar_url !== previousContent?.avatar_url // avatar did change
  )
}

export const isMembershipDisplaynameUpdate = (event: MatrixEvent): boolean => {
  const currentContent = event.getContent()
  const previousContent = event.getPrevContent()

  return (
    currentContent.membership === previousContent?.membership && // membership did not change
    currentContent.displayname !== previousContent?.displayname // displayname did change
  )
}

/**
 * @description Whenever a room member changes their avatar or other member
 * information, we receive timeline events for the message thread
 * (`subscribeToRoomMessages`). We use these to show the chat messages and if a
 * user joined or left a room. Here, we confirm that it is not a duplicate
 * event. We consider a duplicate if it has the same membership as the current
 * one. `"join" === "join" || "leave" === "leave"` .
 */
export const hasDuplicateMembershipEvent = (room: Room, event: MatrixEvent): boolean => {
  if (!isMembershipEvent(event)) return false

  // The state_key in a membership event is the id of the user that changed the state
  const { state_key } = event.getEffectiveEvent()
  const content = event.getContent()
  const membership = room.getMember(state_key ?? '')?.membership

  return content.membership === membership
}

export const createChatMember = (member: RoomMember, avatarUrl: string | null): ChatRoomMember => {
  return {
    id: member.userId as MatrixId,
    name: member.name,
    avatar: avatarUrl ?? member.user?.avatarUrl,
    membership: MembershipStatus[member.membership as keyof typeof MembershipStatus],
  }
}

/**
 * Messages
 */
const createMsgTextContent = (body: string): ChatMsgTextContent => ({
  body,
  msgtype: 'm.text',
})

export const isMsgTextContent = (content: MsgContent): content is ChatMsgTextContent => 'msgtype' in content

const createMsgMemberContent = (
  membership: string,
  options: { displayname?: string; avatar_url?: string } = {}
): ChatMsgMemberContent => ({
  ...(membership?.length > 0 ? { membership } : {}),
  ...(options.displayname ? { name: options.displayname } : {}),
  ...(options.avatar_url ? { avatar: options.avatar_url } : {}),
})

export const isMsgMemberContent = (content: MsgContent): content is ChatMsgMemberContent => 'membership' in content

export const createChatMessage = (roomId: string, event: IEvent | IRoomEvent): ChatRoomMessage => {
  const base = {
    id: event.event_id,
    timestamp: event.origin_server_ts,
    roomId,
  }

  switch (event.type) {
    case EventType.RoomMessage:
      return {
        ...base,
        type: 'message',
        sender: event.sender,
        content: createMsgTextContent(event.content.body),
      }
    case EventType.RoomMember:
      return {
        ...base,
        type: 'membership',
        content: createMsgMemberContent(event.content.membership ?? '', { displayname: event.content.displayname }),
        sender: isIStateEvent(event) ? event.state_key : event.sender,
      }
    default:
      throw new HoliError('Unexpected RoomEvent: only EventType.RoomMessage and EventType.RoomMember are supported')
  }
}

export const isTextChatMsg = (msg: ChatRoomMessage): boolean => msg.type === 'message'
export const isMemberChatMsg = (msg: ChatRoomMessage): boolean => msg.type === 'membership'

/**
 * @description return an optional IRoomEvent for last supported message of the room.
 * for rooms of type:
 * - 'space' returns undefined, because we do not show rooms of this type
 * - 'space.child' supports 'm.room.message' and 'm.room.membership' events
 * - 'private' supports only 'm.room.message' events
 */
export const getLastMessageEvent = (room: Room, roomType: ChatRoomType): IRoomEvent | undefined => {
  if (roomType === 'space') return undefined

  const timelineEvents = room.getLiveTimeline().getEvents()
  const event = timelineEvents.findLast((event) => {
    return (
      isMessageEvent(event) ||
      (isMembershipEvent(event) &&
        isJoinOrLeaveEvent(event) &&
        // when user updates 'avatar' or 'displayname' a new 'm.room.member' event is triggered for all rooms
        // where only 'content' changes, but 'membership' remains the same
        // we don't want to show these events
        !isMembershipAvatarUpdate(event) &&
        !isMembershipDisplaynameUpdate(event))
    )
  })?.event

  return event && isIRoomEvent(event) ? event : undefined
}

export const isMessageEvent = (event: MatrixEvent) => event.getType() === EventType.RoomMessage

export const isRoomMessageEvent = (event: IRoomEvent | Partial<IEvent> | undefined): event is IRoomEvent => {
  return event?.type === EventType.RoomMessage
}

/**
 * @description It filters message events and member events messages. It also
 * removes member event message duplication. For example, when a user changes
 * their avatar or name, we don't want to provide a new member event to the
 * message timeline
 */
export const filterMessagesChunk = (chunk: IRoomEvent[]): IRoomEvent[] => {
  return chunk.reduce((events: IRoomEvent[], event: IRoomEvent) => {
    if (isRoomMemberEvent(event) && !isMemberEventWithState(event)) return [...events, event]
    if (isRoomMemberEvent(event)) {
      const prevMembership = event.prev_content?.membership
      const { membership } = event.content

      if (membership === prevMembership) return events

      return [...events, event]
    }

    if (isRoomMessageEvent(event)) return [...events, event]

    return events
  }, [])
}
